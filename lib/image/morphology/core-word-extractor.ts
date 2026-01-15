/**
 * 핵심 단어 추출 모듈
 */

import { analyzeMorphology } from './analyzer'

/**
 * 형태소 분석 결과를 영어로 변환하기 위한 단어 목록 추출
 */
export function extractCoreWords(text: string): string[] {
  const result = analyzeMorphology(text)
  return result.coreWords
}
