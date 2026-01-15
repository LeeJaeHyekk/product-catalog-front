/**
 * 변형 매칭 모듈
 */

import type { ImageFile, MatchResult } from '../../types'
import { koreanToRoman } from '../../converters/korean-converter'
import { normalizeString } from '../../utils/string-utils'

/**
 * 여러 변환 후보 시도
 */
export function tryVariantMatch(
  imageFile: ImageFile,
  productRoman: string,
  productRomanVariants: string[]
): MatchResult | null {
  const normalizedImage = normalizeString(imageFile.nameWithoutExt, true)
  const imageRoman = koreanToRoman(normalizedImage)
  
  for (const variant of productRomanVariants) {
    if (variant === productRoman) continue
    
    // 정확한 매칭
    if (imageRoman === variant || normalizedImage === variant) {
      return {
        filename: imageFile.fullPath,
        score: 0.92,
        method: 'exact',
      }
    }
    
    // 부분 포함 매칭
    if (imageRoman.includes(variant) && variant.length >= 5) {
      const inclusionScore = variant.length / imageRoman.length
      return {
        filename: imageFile.fullPath,
        score: Math.min(0.75, inclusionScore * 0.85),
        method: 'partial',
      }
    }
  }
  
  return null
}
