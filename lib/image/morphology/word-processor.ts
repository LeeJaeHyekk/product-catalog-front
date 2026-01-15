/**
 * 단어 처리 모듈
 */

import type { SemanticToken } from './types'
import { extractAdjective } from './adjective-extractor'
import { extractPrefix, checkPrefixInSpaceSeparated } from './prefix-extractor'
import { splitCompoundWord } from './compound-splitter'

/**
 * 단어를 토큰으로 변환
 */
export function processWord(
  word: string,
  knownWords?: Set<string>
): SemanticToken[] {
  const tokens: SemanticToken[] = []
  
  // 형용사 어미 제거 및 형용사 확인
  const { base: wordWithoutAdj, isAdjective } = extractAdjective(word)
  
  // 접두어 분리 시도
  const { prefix, base } = extractPrefix(wordWithoutAdj)
  
  if (prefix) {
    // 접두어 토큰 추가
    tokens.push({
      word: prefix,
      type: 'prefix',
      confidence: 0.9,
    })
    
    // 기본 단어 처리
    if (base.length > 0) {
      // 복합어 분리 시도
      if (knownWords && knownWords.size > 0) {
        const split = splitCompoundWord(base, knownWords)
        for (const part of split) {
          tokens.push({
            word: part,
            type: 'noun',
            confidence: 0.8,
          })
        }
      } else {
        tokens.push({
          word: base,
          type: 'noun',
          confidence: 0.8,
        })
      }
    }
  } else {
    // 형용사인 경우 형용사로 처리
    if (isAdjective) {
      tokens.push({
        word: wordWithoutAdj,
        type: 'adjective',
        confidence: 0.8,
      })
    } else {
      // 일반 단어 - 복합어 분리 시도
      if (knownWords && knownWords.size > 0) {
        const split = splitCompoundWord(wordWithoutAdj, knownWords)
        if (split.length > 1) {
          // 분리 성공
          for (const part of split) {
            tokens.push({
              word: part,
              type: 'noun',
              confidence: 0.8,
            })
          }
        } else {
          // 분리 실패 - 원본 그대로
          tokens.push({
            word: wordWithoutAdj,
            type: 'noun',
            confidence: 0.7,
          })
        }
      } else {
        // 의미 사전 정보 없으면 원본 그대로
        tokens.push({
          word: wordWithoutAdj,
          type: 'noun',
          confidence: 0.7,
        })
      }
    }
  }
  
  return tokens
}

/**
 * 공백으로 구분된 접두어 처리
 */
export function processSpaceSeparatedPrefix(
  word: string,
  nextWord: string | undefined,
  knownWords?: Set<string>
): { tokens: SemanticToken[]; processed: boolean } {
  const { isPrefix, prefixValue } = checkPrefixInSpaceSeparated(word, 0, nextWord ? 2 : 1)
  
  if (isPrefix && prefixValue && nextWord) {
    const tokens: SemanticToken[] = [
      {
        word: prefixValue,
        type: 'prefix',
        confidence: 0.9,
      },
    ]
    
    const { base: nextWordWithoutAdj } = extractAdjective(nextWord)
    
    // 복합어 분리 시도
    if (knownWords && knownWords.size > 0) {
      const split = splitCompoundWord(nextWordWithoutAdj, knownWords)
      if (split.length > 0) {
        for (const part of split) {
          tokens.push({
            word: part,
            type: 'noun',
            confidence: 0.8,
          })
        }
      } else {
        tokens.push({
          word: nextWordWithoutAdj,
          type: 'noun',
          confidence: 0.8,
        })
      }
    } else {
      tokens.push({
        word: nextWordWithoutAdj,
        type: 'noun',
        confidence: 0.8,
      })
    }
    
    return { tokens, processed: true }
  }
  
  return { tokens: [], processed: false }
}
