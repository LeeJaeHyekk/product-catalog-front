/**
 * 접두어 추출 모듈
 */

import { PREFIXES } from './constants'

/**
 * 접두어 분리
 * 
 * 예: "고당도" → { prefix: "고", base: "당도" }
 */
export function extractPrefix(word: string): { prefix: string | null; base: string } {
  for (const { pattern, prefix } of PREFIXES) {
    const match = word.match(pattern)
    if (match && match[1]) {
      return { prefix, base: match[1] }
    }
  }
  return { prefix: null, base: word }
}

/**
 * 공백으로 구분된 단어에서 접두어 확인
 * 
 * 예: "전통 약과"에서 "전통"이 접두어인지 확인
 */
export function checkPrefixInSpaceSeparated(
  word: string,
  wordIndex: number,
  totalWords: number
): { isPrefix: boolean; prefixValue: string | null } {
  // 첫 번째 단어이고, 다음 단어가 있는 경우만 확인
  if (wordIndex === 0 && totalWords > 1) {
    for (const { prefix: prefixValue } of PREFIXES) {
      if (word === prefixValue) {
        return { isPrefix: true, prefixValue }
      }
    }
  }
  return { isPrefix: false, prefixValue: null }
}
