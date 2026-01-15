/**
 * 상품 데이터 처리 로직
 */

import type { Product, ProcessedProduct } from '../types'
import { isArray } from '../validation'
import { normalizeProducts } from './normalize'
import { filterValidProducts } from './validate'
import { addDerivedStates } from './derive'
import { sortProducts } from './sort'

/**
 * 안전한 processProducts 함수
 * 입력 검증 및 에러 처리 포함
 */
export function processProducts(products: Product[]): ProcessedProduct[] {
  // 입력 검증
  if (!isArray(products)) {
    throw new Error('processProducts: products must be an array')
  }

  if (products.length === 0) {
    return []
  }

  // null/undefined 필터링 및 데이터 정규화
  const validProducts = normalizeProducts(filterValidProducts(products))

  // 1. 파생 상태 계산
  const mapped = addDerivedStates(validProducts)

  // 2. 판매중 상품 필터링 및 정렬 (Stable Sort)
  const available = sortProducts(mapped.filter(p => !p.isSoldOut))

  // 3. 품절 상품 필터링 및 정렬 (Stable Sort, 하단에서도 정렬 유지)
  const soldOut = sortProducts(mapped.filter(p => p.isSoldOut))

  // 4. 판매중 상품 먼저, 품절 상품은 하단에 배치
  return [...available, ...soldOut]
}
