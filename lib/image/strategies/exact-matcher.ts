/**
 * 정확한 매칭 전략
 */

import { normalizeString } from '../utils/string-utils'
import { koreanToRoman, romanToKorean } from '../converters/korean-converter'
import type { ImageFile, MatchResult } from '../types'

/**
 * 정확한 매칭 시도
 */
export function tryExactMatch(
  productName: string,
  imageFile: ImageFile,
  normalizedProduct: string,
  productRoman: string
): MatchResult | null {
  const normalizedImage = normalizeString(imageFile.nameWithoutExt, true)
  const imageRoman = koreanToRoman(normalizedImage)
  
  // 1. 정확한 매칭 (한글, 공백 제거)
  if (normalizedImage === normalizedProduct) {
    return {
      filename: imageFile.fullPath,
      score: 1.0,
      method: 'exact',
    }
  }
  
  // 2. 정확한 매칭 (로마자 변환 후)
  if (imageRoman === productRoman && productRoman !== normalizedProduct) {
    return {
      filename: imageFile.fullPath,
      score: 0.95,
      method: 'exact',
    }
  }
  
  // 3. 역방향 매칭 (영어 파일명 <-> 한글 상품명)
  const imageKorean = romanToKorean(normalizedImage)
  if (imageKorean === normalizedProduct && imageKorean !== normalizedImage) {
    return {
      filename: imageFile.fullPath,
      score: 0.9,
      method: 'exact',
    }
  }
  
  // 4. 교차 매칭 (한글 파일명 <-> 영어 상품명, 또는 그 반대)
  if (normalizedImage === productRoman || imageRoman === normalizedProduct) {
    return {
      filename: imageFile.fullPath,
      score: 0.85,
      method: 'exact',
    }
  }
  
  return null
}
