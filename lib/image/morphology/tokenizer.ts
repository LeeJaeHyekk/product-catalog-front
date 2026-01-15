/**
 * 한글 토큰화 모듈
 */

import { PARTICLES } from './constants'

/**
 * 한글 단어 분리 (규칙 기반)
 * 
 * 공백으로 분리하고, 조사를 제거
 */
export function tokenizeKorean(text: string): string[] {
  // 공백으로 분리
  const words = text
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0)
  
  // 조사 제거
  return words.map(word => {
    let cleaned = word
    
    // 조사 제거 (뒤에서부터)
    for (const particle of PARTICLES) {
      if (cleaned.endsWith(particle) && cleaned.length > particle.length) {
        cleaned = cleaned.slice(0, -particle.length)
        break
      }
    }
    
    return cleaned
  }).filter(w => w.length > 0)
}
