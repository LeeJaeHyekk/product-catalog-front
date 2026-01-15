/**
 * 단어 단위 매칭 모듈
 */

import { splitIntoWords } from '../../utils/string-utils'

/**
 * 단어 순서 무시 매칭
 */
export function tryWordOrderMatch(
  productRoman: string,
  imageRoman: string
): { score: number; matched: boolean } {
  const productWords = splitIntoWords(productRoman)
  const imageWords = splitIntoWords(imageRoman)
  
  if (productWords.length <= 1 || imageWords.length <= 1) {
    return { score: 0, matched: false }
  }
  
  let matchedWords = 0
  let totalMatchScore = 0
  
  for (const pWord of productWords) {
    if (pWord.length < 3) continue
    
    let bestMatch = 0
    
    for (const iWord of imageWords) {
      if (iWord.length < 3) continue
      
      // 완전히 다른 단어는 제외
      const lengthDiff = Math.abs(pWord.length - iWord.length)
      const maxLength = Math.max(pWord.length, iWord.length)
      if (lengthDiff > maxLength * 0.5) continue
      
      // 실제 공통 부분 확인
      const minLen = Math.min(pWord.length, iWord.length)
      let commonPrefix = 0
      for (let k = 0; k < minLen; k++) {
        if (pWord[k] === iWord[k]) {
          commonPrefix++
        } else {
          break
        }
      }
      
      // 포함 관계 또는 최소 3글자 이상 공통 접두어
      const hasInclusion = iWord.includes(pWord) || pWord.includes(iWord)
      const hasCommonPrefix = commonPrefix >= 3
      
      if (hasInclusion || hasCommonPrefix) {
        const matchScore = Math.min(pWord.length, iWord.length) / Math.max(pWord.length, iWord.length)
        const prefixRatio = commonPrefix > 0 ? commonPrefix / Math.max(pWord.length, iWord.length) : matchScore
        const finalScore = hasInclusion ? matchScore : matchScore * 0.8 + prefixRatio * 0.2
        
        if (finalScore > bestMatch) {
          bestMatch = finalScore
        }
      }
    }
    
    // 최소 60% 이상 매칭되어야 함
    if (bestMatch > 0.6) {
      matchedWords++
      totalMatchScore += bestMatch
    }
  }
  
  if (matchedWords > 0) {
    const wordMatchRatio = matchedWords / Math.max(productWords.length, imageWords.length)
    const avgMatchScore = totalMatchScore / matchedWords
    const combinedScore = (wordMatchRatio * 0.6 + avgMatchScore * 0.4)
    
    // 모든 단어가 매칭되어야 높은 점수 부여
    if (combinedScore >= 0.5 && matchedWords === productWords.length) {
      return {
        score: combinedScore * 0.75,
        matched: true,
      }
    }
  }
  
  return { score: 0, matched: false }
}
