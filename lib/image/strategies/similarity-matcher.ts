/**
 * 유사도 기반 매칭 전략
 */

import { normalizeString, splitIntoWords } from '../utils/string-utils'
import { koreanToRoman } from '../converters/korean-converter'
import { calculateSimilarity } from '../scoring/score-calculator'
import type { ImageFile, MatchResult } from '../types'

/**
 * 유사도 기반 매칭 시도
 */
export function trySimilarityMatch(
  productName: string,
  imageFile: ImageFile,
  normalizedProduct: string,
  productRoman: string
): MatchResult | null {
  const normalizedImage = normalizeString(imageFile.nameWithoutExt, true)
  const imageRoman = koreanToRoman(normalizedImage)
  
  // 문자열 길이 차이가 너무 크면 제외 (완전히 다른 단어 방지)
  const productLength = Math.max(productRoman.length, normalizedProduct.length)
  const imageLength = Math.max(imageRoman.length, normalizedImage.length)
  const lengthDiff = Math.abs(productLength - imageLength)
  const maxLength = Math.max(productLength, imageLength)
  
  // 길이 차이가 50% 이상이면 유사도 매칭 제외
  if (lengthDiff > maxLength * 0.5) {
    return null
  }
  
  // 단어 단위로 비교하여 완전히 다른 단어는 제외
  const productWords = splitIntoWords(productRoman)
  const imageWords = splitIntoWords(imageRoman)
  
  // 단어가 하나라도 공통 부분이 있으면 유사도 매칭 허용
  let hasCommonWord = false
  let commonWordCount = 0
  
  if (productWords.length > 0 && imageWords.length > 0) {
    for (const pWord of productWords) {
      if (pWord.length < 3) continue
      
      for (const iWord of imageWords) {
        if (iWord.length < 3) continue
        
        // 단어 길이 차이 체크
        const lengthDiff = Math.abs(pWord.length - iWord.length)
        const maxLength = Math.max(pWord.length, iWord.length)
        if (lengthDiff > maxLength * 0.5) continue
        
        // 실제 공통 부분 확인 (연속된 공통 부분)
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
          hasCommonWord = true
          commonWordCount++
          break
        }
      }
    }
    
    // 최소 50% 이상의 단어가 공통 부분이 있어야 함
    const minCommonWords = Math.ceil(productWords.length * 0.5)
    if (commonWordCount < minCommonWords) {
      hasCommonWord = false
    }
  } else {
    // 단어가 없으면 전체 문자열로 비교
    hasCommonWord = true
  }
  
  // 공통 단어가 없으면 유사도 매칭 제외
  if (!hasCommonWord) {
    return null
  }
  
  const similarity1 = calculateSimilarity(normalizedProduct, normalizedImage)
  const similarity2 = calculateSimilarity(productRoman, imageRoman)
  const similarity3 = calculateSimilarity(normalizedProduct, imageRoman)
  const similarity4 = calculateSimilarity(productRoman, normalizedImage)
  
  const maxSimilarity = Math.max(similarity1, similarity2, similarity3, similarity4)
  
  // 유사도 임계값을 높임 (0.5 -> 0.6) - 더 정확한 매칭만 허용
  if (maxSimilarity > 0.6) {
    return {
      filename: imageFile.fullPath,
      score: maxSimilarity * 0.8,
      method: 'similarity',
    }
  }
  
  return null
}
