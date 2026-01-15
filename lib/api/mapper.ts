/**
 * API 응답을 도메인 모델로 변환
 */

import type { Product } from '../types'
import type { ApiResponseItem } from '../types/api'
import { PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX } from '../constants'
import { clamp, safeTrim } from '../utils'
import { parsePrice } from '../utils/number'

/**
 * API 응답 아이템을 Product로 변환
 * 
 * 이미지 매칭:
 * 1. API에서 제공된 이미지가 있으면 사용
 * 2. 없으면 상품명과 파일명 매칭 시도
 * 3. 매칭 실패 시 null (이미지 준비중 표시)
 */
export async function mapToProduct(
  item: ApiResponseItem,
  imageMap?: Map<string, string | null>
): Promise<Product> {
  let image: string | null = item.image === null ? null : String(item.image)
  
  // API에서 이미지가 제공되지 않은 경우, 이미지 매칭 시도
  if (image === null) {
    const productName = safeTrim(item.name, '상품명 없음')
    
    // 이미 매칭된 이미지 맵이 있으면 사용
    if (imageMap && imageMap.has(productName)) {
      image = imageMap.get(productName) || null
    }
  }
  
  return {
    index: clamp(item.index, PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX),
    name: safeTrim(item.name, '상품명 없음'),
    price: parsePrice(item.price),
    current: Math.max(0, item.current),
    limit: Math.max(1, item.limit), // 최소 1
    image,
  }
}
