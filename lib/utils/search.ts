/**
 * 검색 알고리즘 유틸리티
 * 
 * 고급 검색 기능을 제공하는 알고리즘 모듈
 * - 관련도 점수 계산
 * - 다중 키워드 검색
 * - 유사도 검색 (Fuzzy Matching)
 * - 검색 결과 정렬
 */

import { normalizeTextForMatching } from './string'

/**
 * 검색 결과 관련도 점수
 */
export interface SearchRelevance {
  /** 관련도 점수 (0-100) */
  score: number
  /** 매칭된 위치 정보 */
  matchPositions: number[]
  /** 매칭 타입 */
  matchType: 'exact' | 'starts-with' | 'contains' | 'fuzzy'
}

/**
 * 단어 간 Levenshtein 거리 계산
 * 
 * 두 문자열 간의 편집 거리를 계산합니다.
 * 
 * @param str1 첫 번째 문자열
 * @param str2 두 번째 문자열
 * @returns 편집 거리 (0 = 완전 일치, 숫자가 클수록 다름)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length

  // 빈 문자열 처리
  if (len1 === 0) return len2
  if (len2 === 0) return len1

  // 동적 프로그래밍 테이블 생성
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0))

  // 초기값 설정
  for (let i = 0; i <= len1; i++) {
    const row = matrix[i]
    if (row) {
      row[0] = i
    }
  }
  const firstRow = matrix[0]
  if (firstRow) {
    for (let j = 0; j <= len2; j++) {
      firstRow[j] = j
    }
  }

  // 거리 계산
  for (let i = 1; i <= len1; i++) {
    const currentRow = matrix[i]
    if (!currentRow) continue
    
    const prevRow = matrix[i - 1]
    if (!prevRow) continue
    
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      const prevCol = prevRow[j] ?? 0
      const currentCol = currentRow[j - 1] ?? 0
      const prevDiag = prevRow[j - 1] ?? 0
      
      currentRow[j] = Math.min(
        prevCol + 1, // 삭제
        currentCol + 1, // 삽입
        prevDiag + cost // 교체
      )
    }
  }

  const lastRow = matrix[len1]
  return lastRow?.[len2] ?? 0
}

/**
 * 두 문자열 간의 유사도 계산 (0-1)
 * 
 * @param str1 첫 번째 문자열
 * @param str2 두 번째 문자열
 * @returns 유사도 (1 = 완전 일치, 0 = 완전 다름)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0
  if (str1.length === 0 || str2.length === 0) return 0.0

  const maxLen = Math.max(str1.length, str2.length)
  const distance = levenshteinDistance(str1, str2)
  
  return 1 - distance / maxLen
}

/**
 * 검색어와 텍스트 간의 관련도 점수 계산
 * 
 * @param text 검색 대상 텍스트
 * @param query 검색어
 * @param options 검색 옵션
 * @returns 관련도 점수 및 매칭 정보
 */
export function calculateRelevance(
  text: string,
  query: string,
  options?: {
    /** 유사도 검색 허용 여부 */
    fuzzy?: boolean
    /** 유사도 임계값 (0-1) */
    similarityThreshold?: number
  }
): SearchRelevance {
  const normalizedText = normalizeTextForMatching(text)
  const normalizedQuery = normalizeTextForMatching(query)

  if (!normalizedText || !normalizedQuery) {
    return {
      score: 0,
      matchPositions: [],
      matchType: 'contains',
    }
  }

  // 1. 정확한 일치 (100점)
  if (normalizedText === normalizedQuery) {
    return {
      score: 100,
      matchPositions: [0],
      matchType: 'exact',
    }
  }

  // 2. 시작 부분 일치 (80점)
  if (normalizedText.startsWith(normalizedQuery)) {
    return {
      score: 80,
      matchPositions: [0],
      matchType: 'starts-with',
    }
  }

  // 3. 포함 일치 (60점)
  const index = normalizedText.indexOf(normalizedQuery)
  if (index !== -1) {
    return {
      score: 60,
      matchPositions: [index],
      matchType: 'contains',
    }
  }

  // 4. 유사도 검색 (옵션)
  if (options?.fuzzy) {
    const similarity = calculateSimilarity(normalizedText, normalizedQuery)
    const threshold = options.similarityThreshold ?? 0.7

    if (similarity >= threshold) {
      // 유사도에 따라 점수 계산 (30-50점)
      const fuzzyScore = Math.round(30 + similarity * 20)
      return {
        score: fuzzyScore,
        matchPositions: [],
        matchType: 'fuzzy',
      }
    }
  }

  // 매칭되지 않음
  return {
    score: 0,
    matchPositions: [],
    matchType: 'contains',
  }
}

/**
 * 다중 키워드 검색
 * 
 * 공백으로 구분된 여러 키워드를 검색합니다.
 * 
 * @param text 검색 대상 텍스트
 * @param query 검색어 (공백으로 구분된 키워드)
 * @param mode 검색 모드 ('AND' | 'OR')
 * @returns 매칭 여부 및 관련도 점수
 */
export function multiKeywordSearch(
  text: string,
  query: string,
  mode: 'AND' | 'OR' = 'AND'
): { matched: boolean; score: number } {
  const normalizedText = normalizeTextForMatching(text)
  const keywords = query
    .split(/\s+/)
    .map(k => normalizeTextForMatching(k))
    .filter(Boolean)

  if (keywords.length === 0) {
    return { matched: false, score: 0 }
  }

  if (keywords.length === 1) {
    const keyword = keywords[0]
    if (!keyword) {
      return { matched: false, score: 0 }
    }
    const relevance = calculateRelevance(normalizedText, keyword)
    return {
      matched: relevance.score > 0,
      score: relevance.score,
    }
  }

  // 다중 키워드 처리
  const keywordScores = keywords.map(keyword => {
    const relevance = calculateRelevance(normalizedText, keyword)
    return relevance.score
  })

  if (mode === 'AND') {
    // 모든 키워드가 매칭되어야 함
    const allMatched = keywordScores.every(score => score > 0)
    const avgScore = keywordScores.reduce((sum, score) => sum + score, 0) / keywordScores.length
    return {
      matched: allMatched,
      score: allMatched ? avgScore : 0,
    }
  } else {
    // OR 모드: 하나라도 매칭되면 됨
    const anyMatched = keywordScores.some(score => score > 0)
    // 안전성: 빈 배열 체크 (이미 위에서 keywords.length === 0 체크했지만 추가 보호)
    const maxScore = keywordScores.length > 0 ? Math.max(...keywordScores) : 0
    return {
      matched: anyMatched,
      score: anyMatched ? maxScore : 0,
    }
  }
}

/**
 * 검색 결과 정렬 함수
 * 
 * 관련도 점수에 따라 정렬합니다.
 * 
 * @param _a 첫 번째 상품 (현재 사용되지 않음)
 * @param _b 두 번째 상품 (현재 사용되지 않음)
 * @param aScore 첫 번째 상품의 관련도 점수
 * @param bScore 두 번째 상품의 관련도 점수
 * @returns 정렬 순서 (-1, 0, 1)
 */
export function sortByRelevance<T>(
  _a: T,
  _b: T,
  aScore: number,
  bScore: number
): number {
  // 관련도 점수로 먼저 정렬 (내림차순)
  if (aScore !== bScore) {
    return bScore - aScore
  }
  
  // 점수가 같으면 동일 순위로 처리
  return 0
}
