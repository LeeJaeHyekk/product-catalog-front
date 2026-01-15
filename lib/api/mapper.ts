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
    // 안전성: has 체크 후 get 사용하여 타입 안전성 보장
    if (imageMap && typeof imageMap.has === 'function' && imageMap.has(productName)) {
      const matchedImage = imageMap.get(productName)
      // 안전성: get 결과가 유효한 문자열인지 확인
      if (matchedImage !== null && matchedImage !== undefined && typeof matchedImage === 'string') {
        image = matchedImage
      }
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
