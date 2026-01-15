/**
 * 형태소 분석 (Fallback 포함)
 * 
 * 1차: 현재 로직으로 분석
 * 2차: 라이브러리로 분석 (실패 시)
 */

import { analyzeMorphology } from './analyzer'
import { analyzeWithKiwi } from './library/kiwi-wrapper'
import type { MorphologyResult } from './types'

/**
 * 형태소 분석 (2중 점검)
 * 
 * @param text 분석할 텍스트
 * @param knownWords 의미 사전에 있는 단어 목록
 * @returns 형태소 분석 결과
 */
export async function analyzeMorphologyWithFallback(
  text: string,
  knownWords?: Set<string>
): Promise<MorphologyResult> {
  // 1차: 현재 로직으로 분석
  const primaryResult = analyzeMorphology(text, knownWords)
  
  // 핵심 단어가 추출되었는지 확인
  if (primaryResult.coreWords.length > 0 && primaryResult.tokens.length > 0) {
    // 명사 토큰이 있는지 확인
    const hasNoun = primaryResult.tokens.some(t => t.type === 'noun')
    if (hasNoun) {
      return primaryResult
    }
  }
  
  // 2차: 라이브러리로 분석 시도
  try {
    const libraryResult = await analyzeWithKiwi(text)
    if (libraryResult && libraryResult.coreWords.length > 0) {
      // 라이브러리 결과에 명사가 있는지 확인
      const hasNoun = libraryResult.tokens.some(t => t.type === 'noun')
      if (hasNoun) {
        console.debug(`[Morphology] Fallback to library for: "${text}"`)
        return libraryResult
      }
    }
  } catch (error) {
    console.warn('[Morphology] Library fallback failed:', error)
  }
  
  // 둘 다 실패하면 1차 결과 반환 (최소한의 결과라도 제공)
  return primaryResult
}
