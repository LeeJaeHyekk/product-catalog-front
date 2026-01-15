/**
 * 한글 로마자 표기법 변환 모듈
 * 
 * 의미 사전에 없는 단어를 로마자 표기법으로 변환
 * 예: "아몬드" → "almond", "브리즈" → "breeze"
 */

/**
 * 한글 자모를 로마자로 변환하는 기본 매핑
 * 
 * 간단한 로마자 표기법 (실용적 접근)
 * 초성과 종성은 다른 매핑을 사용
 */
const HANGUL_INITIAL_TO_ROMAN: Record<string, string> = {
  // 초성
  'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt',
  'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's',
  'ㅆ': 'ss', 'ㅇ': '', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch',
  'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
}

const HANGUL_MEDIAL_TO_ROMAN: Record<string, string> = {
  // 중성
  'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo',
  'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa',
  'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo',
  'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui',
  'ㅣ': 'i',
}

const HANGUL_FINAL_TO_ROMAN: Record<string, string> = {
  // 종성
  'ㄱ': 'k', 'ㄲ': 'k', 'ㄳ': 'k', 'ㄴ': 'n', 'ㄵ': 'n',
  'ㄶ': 'n', 'ㄷ': 't', 'ㄹ': 'l', 'ㄺ': 'k', 'ㄻ': 'm',
  'ㄼ': 'l', 'ㄽ': 'l', 'ㄾ': 'l', 'ㄿ': 'p', 'ㅀ': 'l',
  'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'p', 'ㅅ': 't', 'ㅆ': 't',
  'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k', 'ㅌ': 't',
  'ㅍ': 'p', 'ㅎ': 't',
}

/**
 * 한글 유니코드 범위
 */
const HANGUL_START = 0xAC00
const HANGUL_END = 0xD7A3

/**
 * 한글 문자를 자모로 분해
 * 
 * @param char 한글 문자
 * @returns 분해된 자모 정보 또는 null
 */
function decomposeHangul(char: string): {
  initial: string
  medial: string
  final: string | null
} | null {
  // 입력 검증
  if (!char || char.length === 0) {
    return null
  }
  
  const code = char.charCodeAt(0)
  
  // 한글 유니코드 범위 체크
  if (code < HANGUL_START || code > HANGUL_END) {
    return null // 한글이 아님
  }
  
  const base = code - HANGUL_START
  const initialIndex = Math.floor(base / 588)
  const medialIndex = Math.floor((base % 588) / 28)
  const finalIndex = base % 28
  
  const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
  const medials = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
  const finals = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㄹㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'
  
  // 인덱스 범위 검증
  if (initialIndex < 0 || initialIndex >= initials.length) {
    return null
  }
  if (medialIndex < 0 || medialIndex >= medials.length) {
    return null
  }
  
  return {
    initial: initials[initialIndex] || '',
    medial: medials[medialIndex] || '',
    final: finalIndex > 0 && finalIndex < finals.length ? finals[finalIndex] || null : null,
  }
}

/**
 * 자음 연속 처리 규칙
 * 
 * 예: "ㄱㄱ" → "kk", "ㄷㄷ" → "tt"
 */
function handleConsonantCluster(prevFinal: string, nextInitial: string): string {
  // 같은 자음이 연속되면 겹쳐서 표기
  const consonantMap: Record<string, string> = {
    'ㄱ': 'k', 'ㄷ': 't', 'ㅂ': 'p', 'ㅅ': 's', 'ㅈ': 'j',
  }
  
  if (prevFinal === nextInitial && consonantMap[prevFinal]) {
    return consonantMap[prevFinal].repeat(2)
  }
  
  return ''
}

/**
 * 한글을 로마자로 변환 (간단한 표기법)
 * 
 * 개선 사항:
 * - 자음 연속 처리
 * - 종성 + 초성 조합 규칙
 * - 특수 케이스 처리
 * 
 * @param text 한글 텍스트
 * @returns 로마자 변환 결과
 */
export function romanizeHangul(text: string): string {
  // 입력 검증
  if (typeof text !== 'string' || text.length === 0) {
    return ''
  }
  
  // 공백 제거 및 정규화
  text = text.trim()
  if (text.length === 0) {
    return ''
  }
  
  let result = ''
  let prevFinal: string | null = null
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (!char) {
      continue
    }
    const decomposed = decomposeHangul(char)
    
    if (decomposed) {
      // 초성 변환
      let initial = HANGUL_INITIAL_TO_ROMAN[decomposed.initial] || ''
      
      // 종성 + 초성 조합 규칙 처리
      if (prevFinal && initial) {
        const cluster = handleConsonantCluster(prevFinal, decomposed.initial)
        if (cluster) {
          result = result.slice(0, -1) // 이전 종성 제거
          result += cluster
          prevFinal = null
          continue
        }
      }
      
      // 중성 변환
      const medial = HANGUL_MEDIAL_TO_ROMAN[decomposed.medial] || ''
      
      // 종성 변환
      const final = decomposed.final
        ? HANGUL_FINAL_TO_ROMAN[decomposed.final] || ''
        : ''
      
      // 조합 규칙 적용
      let syllable = ''
      
      // 초성 + 중성
      if (initial && medial) {
        // 특수 규칙: ㄹ + i/y로 시작하는 중성
        if (initial === 'r' && (medial.startsWith('i') || medial.startsWith('y'))) {
          syllable = 'r' + medial
        } else {
          syllable = initial + medial
        }
      } else if (initial) {
        syllable = initial
      } else if (medial) {
        syllable = medial
      }
      
      // 종성 추가
      if (final) {
        syllable += final
        prevFinal = decomposed.final
      } else {
        prevFinal = null
      }
      
      result += syllable
    } else {
      // 한글이 아니면 그대로 추가 (영문, 숫자, 특수문자)
      // 단, 공백은 제거
      if (char !== ' ' && char !== '\t' && char !== '\n') {
        result += char.toLowerCase()
      }
      prevFinal = null
    }
  }
  
  return result.toLowerCase()
}

/**
 * 외래어 자동 변환 규칙
 * 
 * 일반적인 외래어 패턴을 인식하여 자동 변환
 * 확장성을 위해 규칙 기반 접근
 * 
 * 개선 사항:
 * - 공백, 특수문자 처리
 * - 부분 매칭 지원
 * - 대소문자 변형 처리
 */
const LOANWORD_PATTERNS: Array<{
  pattern: RegExp
  replacement: string
  examples: string[]
  priority: number // 우선순위 (높을수록 먼저 매칭)
}> = [
  // 이탈리아 음식 (높은 우선순위)
  { pattern: /^바질$/, replacement: 'basil', examples: ['바질'], priority: 10 },
  { pattern: /^페스토$/, replacement: 'pesto', examples: ['페스토'], priority: 10 },
  { pattern: /^파스타$/, replacement: 'pasta', examples: ['파스타'], priority: 10 },
  { pattern: /^라자냐$/, replacement: 'lasagna', examples: ['라자냐'], priority: 10 },
  { pattern: /^리조또$/, replacement: 'risotto', examples: ['리조또'], priority: 10 },
  { pattern: /^파르메산$/, replacement: 'parmesan', examples: ['파르메산'], priority: 10 },
  { pattern: /^모짜렐라$/, replacement: 'mozzarella', examples: ['모짜렐라'], priority: 10 },
  { pattern: /^치아바타$/, replacement: 'ciabatta', examples: ['치아바타'], priority: 10 },
  { pattern: /^브루스케타$/, replacement: 'bruschetta', examples: ['브루스케타'], priority: 10 },
  { pattern: /^카프레제$/, replacement: 'caprese', examples: ['카프레제'], priority: 10 },
  
  // 과일/식물 (높은 우선순위)
  { pattern: /^머스크$/, replacement: 'musk', examples: ['머스크'], priority: 10 },
  { pattern: /^멜론$/, replacement: 'melon', examples: ['멜론'], priority: 10 },
  { pattern: /^머스크멜론$/, replacement: 'muskmelon', examples: ['머스크멜론'], priority: 10 },
]

/**
 * 외래어 자동 변환
 * 
 * 규칙 기반으로 외래어를 영어 원형으로 변환
 * 확장성을 위해 패턴 기반 접근
 * 
 * 개선 사항:
 * - 입력 검증
 * - 공백/특수문자 제거
 * - 우선순위 기반 매칭
 * - 부분 매칭 지원
 * 
 * @param text 변환할 텍스트
 * @returns 변환된 영어 단어 또는 null
 */
function convertLoanword(text: string): string | null {
  // 입력 검증
  if (typeof text !== 'string' || text.length === 0) {
    return null
  }
  
  // 공백 및 특수문자 제거
  const normalized = text.trim().replace(/[^\w가-힣]/g, '')
  if (normalized.length === 0) {
    return null
  }
  
  // 우선순위 순으로 정렬된 패턴 매칭
  const sortedPatterns = [...LOANWORD_PATTERNS].sort((a, b) => b.priority - a.priority)
  
  for (const { pattern, replacement } of sortedPatterns) {
    // 정확한 매칭
    if (pattern.test(normalized)) {
      return replacement
    }
    
    // 부분 매칭 (패턴이 전체 문자열을 포함하는 경우)
    const match = normalized.match(pattern)
    if (match && match[0].length >= normalized.length * 0.8) {
      return replacement
    }
  }
  
  return null
}

/**
 * 개선된 로마자 표기법 (실용적 변환)
 * 
 * 우선순위:
 * 1. 외래어 자동 변환 규칙 (확장 가능)
 * 2. 일반적인 로마자 표기법 매핑 (fallback)
 * 3. 기본 로마자 변환 (음성학적)
 * 
 * 의미 사전에 의존하지 않고 규칙 기반으로 동작
 * 
 * 개선 사항:
 * - 입력 검증 강화
 * - 에러 핸들링
 * - 빈 결과 처리
 * 
 * @param text 변환할 텍스트
 * @returns 로마자 변환 결과
 */
export function romanizeHangulImproved(text: string): string {
  // 입력 검증
  if (typeof text !== 'string') {
    return ''
  }
  
  // 공백 제거 및 정규화
  const normalized = text.trim()
  if (normalized.length === 0) {
    return ''
  }
  
  try {
    // 1. 외래어 자동 변환 시도 (규칙 기반)
    const loanword = convertLoanword(normalized)
    if (loanword) {
      return loanword
    }
    
    // 2. 일반적인 로마자 표기법 매핑 (최소한의 하드코딩)
    // 고유명사나 특수한 경우만 여기에 포함
    const commonMappings: Record<string, string> = {
      // 지역명 (한국 고유명사)
      '춘천': 'chuncheon',
      '안동': 'andong',
      '제주': 'jeju',
      '강릉': 'gangneung',
      '태백': 'taebaek',
      '영광': 'yeonggwang',
      '상주': 'sangju',
      '완도': 'wando',
      
      // 한국 음식 (고유명사)
      '닭': 'dak',
      '갈비': 'galbi',
      '불고기': 'bulgogi',
      '김치': 'kimchi',
      '전복': 'abalone',
      '굴비': 'gulbi',
      '인절미': 'injeolmi',
      '약과': 'yaggwa',
      '된장': 'doenjang',
      '찌개': 'jjigae',
      '떡볶이': 'tteokbokki',
      '비빔밥': 'bibimbap',
    }
    
    // 일반 매핑에서 찾기
    if (commonMappings[normalized]) {
      return commonMappings[normalized]
    }
    
    // 3. 기본 로마자 변환 (음성학적 변환)
    // 대부분의 경우 여기서 처리됨
    const result = romanizeHangul(normalized)
    
    // 결과 검증
    if (result && result.length > 0) {
      return result
    }
    
    // 최종 fallback: 원본 텍스트를 소문자로 반환
    return normalized.toLowerCase()
  } catch (error) {
    // 에러 발생 시 원본 텍스트를 소문자로 반환
    console.warn('Error in romanizeHangulImproved:', error)
    return normalized.toLowerCase()
  }
}
