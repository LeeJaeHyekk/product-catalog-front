/**
 * 이미지 매칭 관련 타입 정의
 */

/**
 * 이미지 파일 정보
 */
export interface ImageFile {
  filename: string
  nameWithoutExt: string
  extension: string
  fullPath: string
}

/**
 * 매칭 결과
 */
export interface MatchResult {
  filename: string
  score: number
  method: 'exact' | 'partial' | 'similarity'
}

/**
 * 매칭 전략 타입
 */
export type MatchStrategy = 'exact' | 'partial' | 'similarity'

/**
 * 단어 매칭 정보
 */
export interface WordMatchInfo {
  includedWords: number
  totalMatchScore: number
  wordMatchRatio: number
  allWordsMatched: boolean
  wordOrderMatch: boolean
  orderedMatches: number
}
