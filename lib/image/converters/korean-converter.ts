/**
 * 한글-영어 변환 로직
 */

import { normalizeString } from '../utils/string-utils'
import { analyzeMorphology, splitCompoundWord } from '../morphology'
import { getSemanticCandidates, translateToEnglish, getKnownKoreanWords } from '../semantic-dict'
import { romanizeHangulImproved } from '../romanization'

/**
 * 토큰을 영어로 변환하는 공통 로직
 * 
 * 우선순위:
 * 1. 의미 사전 (고유명사, 특수한 경우)
 * 2. 외래어 자동 변환 규칙 (확장 가능)
 * 3. 복합어 분리 후 변환
 * 4. 로마자 표기법 (음성학적 변환)
 * 
 * 개선 사항:
 * - 입력 검증 강화
 * - 빈 결과 처리
 * - 에러 핸들링
 * - 변환 결과 검증
 * 
 * @param token 변환할 토큰
 * @param knownWords 의미 사전 단어 목록
 * @returns 영어 변환 결과 배열
 */
function convertTokenToEnglish(
  token: { word: string; type: string },
  knownWords: Set<string>
): string[] {
  const englishParts: string[] = []
  
  // 입력 검증
  if (!token || typeof token.word !== 'string' || token.word.length === 0) {
    return []
  }
  
  const word = token.word.trim()
  if (word.length === 0) {
    return []
  }
  
  // knownWords 검증
  if (!knownWords || !(knownWords instanceof Set)) {
    knownWords = new Set()
  }
  
  try {
    // 1. 의미 사전 확인 (복합어 우선, 단일 토큰 다음)
    // 복합어가 의미 사전에 있는지 먼저 확인
    const compoundEnglish = translateToEnglish(word)
    if (compoundEnglish && typeof compoundEnglish === 'string' && compoundEnglish.length > 0) {
      const noSpace = compoundEnglish.replace(/\s+/g, '')
      // 공백이 있는 경우와 없는 경우 모두 추가 (붙여쓰기는 confidence -0.05)
      if (noSpace !== compoundEnglish) {
        englishParts.push(compoundEnglish) // 공백 있는 버전 우선
        englishParts.push(noSpace) // 붙여쓰기 버전
      } else {
        englishParts.push(compoundEnglish)
      }
      
      // 결과 검증
      if (englishParts.length > 0 && englishParts.every(p => p && p.length > 0)) {
        return englishParts
      }
    }
    
    // 2. 외래어 자동 변환 규칙 시도 (romanizeHangulImproved 내부에서 처리)
    // 3. 복합어 분리 후 각 부분 변환
    const subWords = splitCompoundWord(word, knownWords)
    
    // 분리 결과 검증
    if (subWords && subWords.length > 1 && subWords.every(w => w && w.length > 0)) {
      // 분리 성공 - 각 부분을 변환
      const subEnglishParts: string[] = []
      
      for (const subWord of subWords) {
        if (!subWord || subWord.length === 0) {
          continue
        }
        
        // 의미 사전 확인 (단일 토큰)
        const subEnglish = translateToEnglish(subWord)
        if (subEnglish && typeof subEnglish === 'string' && subEnglish.length > 0) {
          // 공백이 있는 경우 공백 버전 우선, 붙여쓰기 버전 추가
          const noSpace = subEnglish.replace(/\s+/g, '')
          if (noSpace !== subEnglish) {
            subEnglishParts.push(subEnglish) // 공백 있는 버전 우선
            subEnglishParts.push(noSpace) // 붙여쓰기 버전
          } else {
            subEnglishParts.push(subEnglish)
          }
        } else {
          // 로마자 표기법으로 변환 시도 (외래어 규칙 포함)
          try {
            const romanized = romanizeHangulImproved(subWord)
            if (romanized && typeof romanized === 'string' && romanized.length > 0 && romanized !== subWord.toLowerCase()) {
              subEnglishParts.push(romanized)
            }
          } catch (error) {
            console.warn('Error in romanizeHangulImproved:', error)
            // 에러 발생 시 계속 진행
          }
        }
      }
      
      // 분리된 단어들을 조합
      if (subEnglishParts.length > 0) {
        // 모든 조합 생성 (공백 있는 버전과 붙여쓰기 버전)
        const combined = subEnglishParts.join('')
        englishParts.push(combined)
        
        // 공백이 포함된 버전이 있으면 그것도 추가
        const withSpaces = subWords
          .map(w => translateToEnglish(w) || romanizeHangulImproved(w))
          .filter(e => e && e.length > 0)
          .join(' ')
        if (withSpaces && withSpaces !== combined) {
          englishParts.push(withSpaces)
        }
      }
    } else {
      // 분리 실패 또는 단일 단어 - 로마자 표기법으로 변환 시도 (외래어 규칙 포함)
      try {
        const romanized = romanizeHangulImproved(word)
        if (romanized && typeof romanized === 'string' && romanized.length > 0 && romanized !== word.toLowerCase()) {
          englishParts.push(romanized)
        } else {
          // 최종 fallback
          const fallback = fallbackKoreanToRoman(word)
          if (fallback && typeof fallback === 'string' && fallback.length > 0 && fallback !== word.toLowerCase()) {
            englishParts.push(fallback)
          }
        }
      } catch (error) {
        console.warn('Error in romanizeHangulImproved:', error)
        // 최종 fallback
        try {
          const fallback = fallbackKoreanToRoman(word)
          if (fallback && typeof fallback === 'string' && fallback.length > 0 && fallback !== word.toLowerCase()) {
            englishParts.push(fallback)
          }
        } catch (fallbackError) {
          console.warn('Error in fallbackKoreanToRoman:', fallbackError)
        }
      }
    }
    
    // 결과 검증 및 정리
    const validParts = englishParts.filter(p => p && typeof p === 'string' && p.length > 0)
    
    // 중복 제거 (순서 유지)
    const uniqueParts: string[] = []
    const seen = new Set<string>()
    for (const part of validParts) {
      if (!seen.has(part)) {
        seen.add(part)
        uniqueParts.push(part)
      }
    }
    
    return uniqueParts.length > 0 ? uniqueParts : []
  } catch (error) {
    // 전체 에러 처리
    console.warn('Error in convertTokenToEnglish:', error)
    return []
  }
}

/**
 * 한글을 로마자로 변환 (형태소 분석 + 의미 사전 기반)
 */
export function koreanToRoman(str: string, morphology?: ReturnType<typeof analyzeMorphology>): string {
  const normalized = normalizeString(str, false) // 공백 유지 (형태소 분석용)
  const knownWords = getKnownKoreanWords()
  
  // 형태소 분석 결과가 제공되지 않으면 새로 분석
  const morph = morphology || analyzeMorphology(normalized, knownWords)
  
  const englishParts: string[] = []
  
  // 1. 공백이 있는 원본 버전 확인 (예: "전통 약과")
  const textWithoutSpaces = normalizeString(str, true)
  if (textWithoutSpaces !== normalized) {
    const originalEnglish = translateToEnglish(normalized)
    if (originalEnglish) {
      const noSpace = originalEnglish.replace(/\s+/g, '')
      englishParts.push(noSpace !== originalEnglish ? noSpace : originalEnglish)
    }
  }
  
  // 2. 공백 제거 버전으로 복합어 확인 (예: "전통약과")
  if (textWithoutSpaces !== normalized) {
    const compoundEnglish = translateToEnglish(textWithoutSpaces)
    if (compoundEnglish) {
      const noSpace = compoundEnglish.replace(/\s+/g, '')
      englishParts.push(noSpace !== compoundEnglish ? noSpace : compoundEnglish)
    }
  }
  
  for (const token of morph.tokens) {
    if (token.type === 'prefix') {
      const prefixEnglish = translateToEnglish(token.word)
      if (prefixEnglish) {
        const noSpace = prefixEnglish.replace(/\s+/g, '')
        englishParts.push(noSpace !== prefixEnglish ? noSpace : prefixEnglish)
      }
    } else if (token.type === 'adjective' || token.type === 'noun') {
      const parts = convertTokenToEnglish(token, knownWords)
      englishParts.push(...parts)
    }
  }
  
  const result = englishParts.join('')
  
  // 결과가 비어있으면 기존 방식으로 fallback
  if (result.length === 0) {
    return fallbackKoreanToRoman(normalizeString(str, true))
  }
  
  return result
}

/**
 * 기존 하드코딩된 매핑 (fallback용)
 */
function fallbackKoreanToRoman(str: string): string {
  const mapping: Record<string, string> = {
    '샤인': 'shine',
    '머스캣': 'muscat',
    '머스캐트': 'muscat',
    '초코': 'choco',
    '초콜릿': 'chocolate',
    '파이': 'pie',
    '과자': 'cookie',
    '인절미': 'injeolmi',
    '고소한': 'crispy',
    '과일': 'fruit',
    '채소': 'vegetable',
    '식자재': 'ingredient',
    '크로와상': 'croissant',
    '생지': 'dough',
    '양파': 'onion',
    '링': 'ring',
    '명품': 'luxury',
    '한우': 'koreanbeef',
    '세트': 'set',
    '히말라야': 'himalayan',
    '핑크': 'pink',
    '솔트': 'salt',
    '소금': 'salt',
    '머스크': 'musk',
    '멜론': 'melon',
  }
  
  let result = normalizeString(str, true)
  const sortedKeys = Object.keys(mapping).sort((a, b) => b.length - a.length)
  
  for (const korean of sortedKeys) {
    const roman = mapping[korean]
    if (roman) {
      result = result.replace(new RegExp(korean, 'gi'), roman)
    }
  }
  
  return result
}

/**
 * 여러 변환 후보 생성 (의미 사전의 동의어 활용)
 */
export function generateRomanVariants(
  text: string,
  morphology: ReturnType<typeof analyzeMorphology>
): string[] {
  const variants: string[] = []
  const base = koreanToRoman(text)
  variants.push(base)
  
  // 공백 제거 버전으로 복합어 확인 (예: "전통 약과" → "전통약과")
  const textWithoutSpaces = normalizeString(text, true)
  const textWithSpaces = normalizeString(text, false)
  
  // 1. 공백이 있는 원본 버전 확인 (예: "전통 약과")
  if (textWithSpaces !== textWithoutSpaces) {
    const originalCandidates = getSemanticCandidates(textWithSpaces)
    if (originalCandidates.length > 0) {
      for (const candidate of originalCandidates.slice(0, 3)) {
        const noSpace = candidate.english.replace(/\s+/g, '')
        if (noSpace !== candidate.english) {
          variants.push(noSpace) // 붙여쓰기 버전 (traditionalyaggwa)
          variants.push(candidate.english) // 공백 있는 버전 (traditional yaggwa)
        } else {
          variants.push(candidate.english)
        }
      }
    }
  }
  
  // 2. 공백 제거 버전 확인 (예: "전통약과")
  if (textWithoutSpaces !== textWithSpaces) {
    const compoundCandidates = getSemanticCandidates(textWithoutSpaces)
    if (compoundCandidates.length > 0) {
      // 복합어가 의미 사전에 있으면 우선 추가
      for (const candidate of compoundCandidates.slice(0, 3)) {
        const noSpace = candidate.english.replace(/\s+/g, '')
        if (noSpace !== candidate.english) {
          variants.push(noSpace) // 붙여쓰기 버전
          variants.push(candidate.english) // 공백 있는 버전
        } else {
          variants.push(candidate.english)
        }
      }
    }
  }
  
  const englishParts: string[][] = []
  
  for (const token of morphology.tokens) {
    if (token.type === 'prefix' || token.type === 'noun' || token.type === 'adjective') {
      const candidates = getSemanticCandidates(token.word)
      if (candidates.length > 0) {
        const topCandidates = candidates
          .slice(0, 3)
          .map(c => {
            // 안전성: c와 c.english가 유효한지 확인
            if (!c || typeof c !== 'object' || !c.english || typeof c.english !== 'string') {
              return []
            }
            
            const noSpace = c.english.replace(/\s+/g, '')
            const candidatesList: string[] = []
            
            if (noSpace !== c.english) {
              candidatesList.push(noSpace)
              const words = c.english.split(/\s+/).filter(w => w && typeof w === 'string' && w.length > 0)
              if (words.length > 1) {
                candidatesList.push(...words)
              }
            } else {
              candidatesList.push(c.english)
            }
            
            return candidatesList
          })
          .flat()
        englishParts.push(topCandidates)
      } else {
        const fallback = fallbackKoreanToRoman(token.word)
        if (fallback) {
          englishParts.push([fallback])
        } else {
          const romanized = romanizeHangulImproved(token.word)
          if (romanized && romanized !== token.word.toLowerCase()) {
            englishParts.push([romanized])
          }
        }
      }
    }
  }
  
  // 조합 생성 (최대 8개)
  if (englishParts.length > 0 && Array.isArray(englishParts)) {
    try {
      const combinations = generateCombinations(englishParts)
      // 안전성: combinations가 유효한 배열인지 확인
      if (Array.isArray(combinations)) {
        for (const combo of combinations.slice(0, 7)) {
          // 안전성: combo가 유효한 배열인지 확인
          if (!Array.isArray(combo)) {
            continue
          }
          
          const variantNoSpace = combo.join('')
          if (variantNoSpace !== base && variantNoSpace.length > 0 && !variants.includes(variantNoSpace)) {
            variants.push(variantNoSpace)
          }
          
          if (combo.length > 1) {
            const variantWithSpace = combo.join(' ')
            const variantWithSpaceNoSpace = variantWithSpace.replace(/\s+/g, '')
            if (variantWithSpaceNoSpace !== base && variantWithSpaceNoSpace.length > 0 && !variants.includes(variantWithSpaceNoSpace)) {
              variants.push(variantWithSpaceNoSpace)
            }
          }
        }
      }
    } catch (error) {
      // 조합 생성 실패해도 계속 진행
      console.warn('[Roman Variants] Failed to generate combinations:', error)
    }
  }
  
  return variants
}

/**
 * 배열 조합 생성 (카르테시안 곱)
 */
function generateCombinations<T>(arrays: T[][]): T[][] {
  // 안전성: arrays가 유효한 배열인지 확인
  if (!Array.isArray(arrays) || arrays.length === 0) {
    return []
  }
  
  if (arrays.length === 1) {
    const firstArray = arrays[0]
    // 안전성: firstArray가 유효한 배열인지 확인
    if (!Array.isArray(firstArray) || firstArray.length === 0) {
      return []
    }
    return firstArray.map(item => [item]).filter(combo => Array.isArray(combo) && combo.length > 0)
  }
  
  const first = arrays[0]
  const rest = arrays.slice(1)
  
  // 안전성: first가 유효한 배열인지 확인
  if (!Array.isArray(first) || first.length === 0) {
    return generateCombinations(rest)
  }
  
  const restCombinations = generateCombinations(rest)
  
  // 안전성: restCombinations가 유효한 배열인지 확인
  if (!Array.isArray(restCombinations)) {
    return []
  }
  
  const result: T[][] = []
  for (const item of first) {
    // 안전성: item이 유효한지 확인
    if (item === null || item === undefined) {
      continue
    }
    for (const combo of restCombinations) {
      // 안전성: combo가 유효한 배열인지 확인
      if (Array.isArray(combo)) {
        result.push([item, ...combo])
      }
    }
  }
  
  return result
}

/**
 * 영어를 한글로 역변환 (간단한 매핑)
 */
export function romanToKorean(str: string): string {
  const mapping: Record<string, string> = {
    'choco': '초코',
    'chocolate': '초콜릿',
    'pie': '파이',
    'cookie': '과자',
  }
  
  let result = normalizeString(str, true)
  
  for (const [roman, korean] of Object.entries(mapping)) {
    result = result.replace(new RegExp(roman, 'gi'), korean)
  }
  
  return result
}
