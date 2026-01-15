/**
 * 포함 관계 매칭 모듈
 */

import type { ImageFile, MatchResult } from '../../types'
import { koreanToRoman } from '../../converters/korean-converter'
import { normalizeString } from '../../utils/string-utils'

/**
 * 변환된 문자열 포함 여부 확인
 */
export function tryInclusionMatch(
  imageFile: ImageFile,
  productRoman: string
): MatchResult | null {
  const normalizedImage = normalizeString(imageFile.nameWithoutExt, true)
  const imageRoman = koreanToRoman(normalizedImage)
  
  if (imageRoman.includes(productRoman) && productRoman.length >= 5) {
    const inclusionScore = productRoman.length / imageRoman.length
    return {
      filename: imageFile.fullPath,
      score: Math.min(0.8, inclusionScore * 0.9),
      method: 'partial',
    }
  }
  
  if (productRoman.includes(imageRoman) && imageRoman.length >= 5) {
    const inclusionScore = imageRoman.length / productRoman.length
    return {
      filename: imageFile.fullPath,
      score: Math.min(0.8, inclusionScore * 0.9),
      method: 'partial',
    }
  }
  
  return null
}
