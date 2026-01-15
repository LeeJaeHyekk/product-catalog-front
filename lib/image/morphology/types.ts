/**
 * 형태소 분석 타입 정의
 */

/**
 * 의미 단어 타입
 */
export interface SemanticToken {
  /** 원본 단어 */
  word: string
  /** 단어 타입 (명사, 형용사, 접두어 등) */
  type: 'noun' | 'adjective' | 'prefix' | 'suffix' | 'unknown'
  /** 신뢰도 (0-1) */
  confidence: number
}

/**
 * 형태소 분석 결과
 */
export interface MorphologyResult {
  /** 추출된 의미 단어들 */
  tokens: SemanticToken[]
  /** 조사/접미어 제거된 핵심 단어들 */
  coreWords: string[]
}
