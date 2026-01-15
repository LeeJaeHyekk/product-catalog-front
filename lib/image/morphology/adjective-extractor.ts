/**
 * 형용사 추출 모듈
 */

import { ADJECTIVE_SUFFIXES } from './constants'

/**
 * 형용사 어미 제거 및 형용사 추출
 * 
 * 예: "매콤한" → { base: "매콤", isAdjective: true }
 * 예: "육즙가득" → { base: "육즙가득", isAdjective: false }
 */
export function extractAdjective(word: string): { base: string; isAdjective: boolean } {
  // 형용사 어미 제거 (뒤에서부터 긴 것부터)
  const sortedSuffixes = [...ADJECTIVE_SUFFIXES].sort((a, b) => b.length - a.length)
  
  for (const suffix of sortedSuffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length) {
      const base = word.slice(0, -suffix.length)
      // 의미 사전에 형용사 형태가 있는지 확인 (예: "매콤한" → "매콤")
      return { base, isAdjective: true }
    }
  }
  
  // 형용사 어미가 없으면 원본 반환
  return { base: word, isAdjective: false }
}
