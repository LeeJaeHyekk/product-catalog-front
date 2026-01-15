/**
 * 매칭 점수 계산 로직
 */

import { koreanToRoman } from '../converters/korean-converter'
import { normalizeString, splitIntoWords } from '../utils/string-utils'
import { romanizeHangulImproved } from '../romanization'
import type { WordMatchInfo } from '../types'

/**
 * 레벤슈타인 거리 계산 (문자열 유사도)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }

  const firstRow = matrix[0]
  if (firstRow) {
    for (let j = 0; j <= len2; j++) {
      firstRow[j] = j
    }
  }

  for (let i = 1; i <= len1; i++) {
    const currentRow = matrix[i]
    if (!currentRow) continue
    
    for (let j = 1; j <= len2; j++) {
      const prevRow = matrix[i - 1]
      if (!prevRow) continue
      
      if (str1[i - 1] === str2[j - 1]) {
        currentRow[j] = prevRow[j - 1] ?? 0
      } else {
        currentRow[j] = Math.min(
          (prevRow[j] ?? 0) + 1,
          (currentRow[j - 1] ?? 0) + 1,
          (prevRow[j - 1] ?? 0) + 1
        )
      }
    }
  }

  const lastRow = matrix[len1]
  return lastRow?.[len2] ?? 0
}

/**
 * 유사도 점수 계산 (0~1)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length)
  if (maxLen === 0) return 1
  
  const distance = levenshteinDistance(str1, str2)
  return 1 - distance / maxLen
}

/**
 * 부분 문자열 매칭 점수 계산
 */
export function calculatePartialMatchScore(productName: string, imageName: string): number {
  // 정확히 포함되는 경우
  if (imageName.includes(productName) || productName.includes(imageName)) {
    const longer = Math.max(productName.length, imageName.length)
    const shorter = Math.min(productName.length, imageName.length)
    return longer > 0 ? shorter / longer : 0
  }
  
  // 공백 제거 후 다시 포함 여부 확인
  const productNoSpace = productName.replace(/\s/g, '')
  const imageNoSpace = imageName.replace(/\s/g, '')
  
  if (imageNoSpace.includes(productNoSpace) || productNoSpace.includes(imageNoSpace)) {
    const longer = Math.max(productNoSpace.length, imageNoSpace.length)
    const shorter = Math.min(productNoSpace.length, imageNoSpace.length)
    return longer > 0 ? shorter / longer : 0
  }
  
  // 한글을 영어로 변환한 버전도 확인
  const productRoman = koreanToRoman(productName)
  const imageRoman = koreanToRoman(imageName)
  
  if (imageRoman.includes(productRoman) || productRoman.includes(imageRoman)) {
    const longer = Math.max(productRoman.length, imageRoman.length)
    const shorter = Math.min(productRoman.length, imageRoman.length)
    const baseScore = longer > 0 ? shorter / longer : 0
    return baseScore * 0.9
  }
  
  // 단어 단위로 매칭 (camelCase 분리 고려)
  const productWords = splitIntoWords(productName)
    .filter(w => w.length >= 2)
    .map(w => normalizeString(w, true))
  
  const imageWords = splitIntoWords(imageName)
    .filter(w => w.length >= 2)
    .map(w => normalizeString(w, true))
  
  if (productWords.length === 0 || imageWords.length === 0) {
    return 0
  }
  
  let matchCount = 0
  let totalScore = 0
  
  for (const word of productWords) {
    let wordMatched = false
    let bestScore = 0
    
    // 1. 원본 단어로 직접 매칭 시도
    for (const imgWord of imageWords) {
      if (imgWord.includes(word) || word.includes(imgWord)) {
        const score = Math.min(word.length, imgWord.length) / Math.max(word.length, imgWord.length)
        bestScore = Math.max(bestScore, score)
        wordMatched = true
      }
    }
    
    if (wordMatched) {
      matchCount++
      totalScore += bestScore
      continue
    }
    
    // 2. 한글 단어를 영어로 변환하여 매칭 시도
    const wordRoman = koreanToRoman(word)
    if (wordRoman !== word && wordRoman.length > 0) {
      for (const imgWord of imageWords) {
        if (imgWord.includes(wordRoman) || wordRoman.includes(imgWord)) {
          const score = Math.min(wordRoman.length, imgWord.length) / Math.max(wordRoman.length, imgWord.length)
          bestScore = Math.max(bestScore, score * 0.9)
          wordMatched = true
        }
      }
    }
    
    // 3. 로마자 표기법으로 변환하여 매칭 시도
    if (!wordMatched) {
      const romanized = romanizeHangulImproved(word)
      if (romanized && romanized !== word && romanized.length > 0) {
        for (const imgWord of imageWords) {
          if (imgWord.includes(romanized) || romanized.includes(imgWord)) {
            const score = Math.min(romanized.length, imgWord.length) / Math.max(romanized.length, imgWord.length)
            bestScore = Math.max(bestScore, score * 0.8)
            wordMatched = true
          }
        }
      }
    }
    
    if (wordMatched) {
      matchCount++
      totalScore += bestScore
    }
  }
  
  // 매칭된 단어 비율과 평균 점수를 조합
  const matchRatio = matchCount / productWords.length
  const avgScore = matchCount > 0 ? totalScore / matchCount : 0
  
  return (matchRatio * 0.6 + avgScore * 0.4)
}

/**
 * 단어 매칭 정보 계산
 */
export function calculateWordMatchInfo(
  productRoman: string,
  imageRoman: string,
  coreNouns?: string[] // 핵심 명사 목록 (우선순위 높음)
): WordMatchInfo {
  const productWordList = splitIntoWords(productRoman)
  const imageWordList = splitIntoWords(imageRoman)
  
  let includedWords = 0
  let totalMatchScore = 0
  let orderedMatches = 0
  
  if (productWordList.length > 0 && imageWordList.length > 0) {
    // 핵심 명사 우선순위: 핵심 명사는 더 높은 가중치로 매칭
    const coreNounSet = coreNouns ? new Set(coreNouns.map(n => n.toLowerCase())) : new Set<string>()
    
    for (let i = 0; i < productWordList.length; i++) {
      const pWord = productWordList[i]
      if (!pWord || pWord.length < 2) {
        continue
      }
      {
        let bestMatch = 0
        let bestMatchIndex = -1
        const isCoreNoun = coreNounSet.has(pWord.toLowerCase())
        
        for (let j = 0; j < imageWordList.length; j++) {
          const iWord = imageWordList[j]
          if (!iWord) {
            continue
          }
          
          // 완전히 다른 단어는 제외 (길이 차이가 너무 크면 제외)
          const lengthDiff = Math.abs(pWord.length - iWord.length)
          const maxLength = Math.max(pWord.length, iWord.length)
          if (lengthDiff > maxLength * 0.5) continue // 길이 차이가 50% 이상이면 제외
          
          // 공통 부분이 너무 작으면 제외 (최소 3글자 이상 공통)
          const commonLength = Math.min(pWord.length, iWord.length)
          if (commonLength < 3) continue
          
          // 실제 공통 부분 계산 (연속된 공통 부분)
          let actualCommonLength = 0
          const minLen = Math.min(pWord.length, iWord.length)
          for (let k = 0; k < minLen; k++) {
            if (pWord[k] === iWord[k]) {
              actualCommonLength++
            } else {
              break
            }
          }
          
          // 연속된 공통 부분이 최소 3글자 이상이어야 함
          if (actualCommonLength < 3 && !iWord.includes(pWord) && !pWord.includes(iWord)) {
            continue
          }
          
          if (iWord.includes(pWord) || pWord.includes(iWord)) {
            const matchScore = Math.min(pWord.length, iWord.length) / Math.max(pWord.length, iWord.length)
            // 공통 부분 비율도 고려
            const commonRatio = actualCommonLength > 0 ? actualCommonLength / Math.max(pWord.length, iWord.length) : matchScore
            let finalScore = matchScore * 0.7 + commonRatio * 0.3
            
            // 핵심 명사는 가중치 증가
            if (isCoreNoun) {
              finalScore = Math.min(1.0, finalScore * 1.2)
            }
            
            if (finalScore > bestMatch) {
              bestMatch = finalScore
              bestMatchIndex = j
            }
          } else if (iWord.startsWith(pWord) || pWord.startsWith(iWord)) {
            const matchScore = Math.min(pWord.length, iWord.length) / Math.max(pWord.length, iWord.length) * 0.9
            const commonRatio = actualCommonLength > 0 ? actualCommonLength / Math.max(pWord.length, iWord.length) : matchScore
            let finalScore = matchScore * 0.7 + commonRatio * 0.3
            
            // 핵심 명사는 가중치 증가
            if (isCoreNoun) {
              finalScore = Math.min(1.0, finalScore * 1.2)
            }
            
            if (finalScore > bestMatch) {
              bestMatch = finalScore
              bestMatchIndex = j
            }
          }
        }
        
        // 핵심 명사는 더 낮은 임계값으로도 매칭 허용
        const threshold = isCoreNoun ? 0.4 : 0.5
        
        if (bestMatch > threshold) {
          includedWords++
          totalMatchScore += bestMatch
          
          // 핵심 명사 매칭은 추가 가중치
          if (isCoreNoun) {
            totalMatchScore += 0.1
          }
          
          // 단어 순서 일치 확인
          if (bestMatchIndex >= 0) {
            if (bestMatchIndex === i) {
              orderedMatches++
            } else if (i === 0) {
              orderedMatches++
            } else {
              let prevMatchIndex = -1
              for (let k = 0; k < i; k++) {
                const prevWord = productWordList[k]
                if (!prevWord) {
                  continue
                }
                for (let m = 0; m < imageWordList.length; m++) {
                  const imgWord = imageWordList[m]
                  if (!imgWord) {
                    continue
                  }
                  if (imgWord.includes(prevWord) || prevWord.includes(imgWord)) {
                    prevMatchIndex = m
                    break
                  }
                }
              }
              if (prevMatchIndex >= 0 && bestMatchIndex > prevMatchIndex) {
                orderedMatches++
              }
            }
          }
        }
      }
    }
  }
  
  const wordMatchRatio = includedWords > 0 ? includedWords / productWordList.length : 0
  const avgScore = includedWords > 0 ? totalMatchScore / includedWords : 0
  // wordInclusionScore 계산 (현재 사용되지 않음, 향후 확장 가능)
  // const wordInclusionScore = (wordMatchRatio * 0.6 + avgScore * 0.4)
  
  const allWordsMatched = includedWords === productWordList.length && wordMatchRatio >= 1.0
  const orderMatchRatio = includedWords > 0 ? orderedMatches / includedWords : 0
  const wordOrderMatch = orderMatchRatio >= 0.8 && includedWords === productWordList.length
  
  return {
    includedWords,
    totalMatchScore,
    wordMatchRatio,
    allWordsMatched,
    wordOrderMatch,
    orderedMatches,
  }
}
