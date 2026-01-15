/**
 * 형태소 분석 메인 모듈
 */

import type { MorphologyResult, SemanticToken } from './types'
import { tokenizeKorean } from './tokenizer'
import { processWord, processSpaceSeparatedPrefix } from './word-processor'

/**
 * 형태소 분석 (규칙 기반 + 의미 사전 기반 복합어 분리)
 * 
 * @param text 분석할 텍스트
 * @param knownWords 의미 사전에 있는 단어 목록 (복합어 분리용)
 * @returns 형태소 분석 결과
 */
export function analyzeMorphology(
  text: string,
  knownWords?: Set<string>
): MorphologyResult {
  if (typeof text !== 'string' || text.length === 0) {
    return { tokens: [], coreWords: [] }
  }
  
  // 1. 토큰화
  const words = tokenizeKorean(text)
  
  // 2. 각 단어 분석
  const tokens: SemanticToken[] = []
  const coreWords: string[] = []
  
  let i = 0
  while (i < words.length) {
    const word = words[i]
    
    // 공백으로 구분된 경우: 첫 번째 단어가 접두어 패턴에 매칭되는지 확인
    if (i === 0 && words.length > 1) {
      const nextWord = words[i + 1]
      const { tokens: prefixTokens, processed } = processSpaceSeparatedPrefix(word, nextWord, knownWords)
      
      if (processed) {
        tokens.push(...prefixTokens)
        coreWords.push(...prefixTokens.filter(t => t.type === 'noun').map(t => t.word))
        i += 2 // 두 단어 모두 처리했으므로 인덱스 증가
        continue
      }
    }
    
    // 일반 단어 처리
    const wordTokens = processWord(word, knownWords)
    tokens.push(...wordTokens)
    coreWords.push(...wordTokens.filter(t => t.type === 'noun' || t.type === 'adjective').map(t => t.word))
    
    i++
  }
  
  return { tokens, coreWords }
}
