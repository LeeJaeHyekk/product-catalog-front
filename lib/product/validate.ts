/**
 * 상품 데이터 검증
 */

import type { Product } from '../types'
import { PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX } from '../constants/product'
import { isNotNull } from '../validation'

/**
 * 상품이 유효한지 검증
 * 
 * 과제 요구사항: index는 0~49 범위
 */
export function isValidProduct(product: unknown): product is Product {
  if (typeof product !== 'object' || product === null) {
    return false
  }

  const p = product as Record<string, unknown>

  return (
    typeof p.index === 'number' &&
    p.index >= PRODUCT_INDEX_MIN &&
    p.index <= PRODUCT_INDEX_MAX &&
    typeof p.name === 'string' &&
    p.name.length > 0 &&
    typeof p.price === 'number' &&
    p.price >= 0 &&
    typeof p.current === 'number' &&
    p.current >= 0 &&
    typeof p.limit === 'number' &&
    p.limit > 0 &&
    (p.image === null || typeof p.image === 'string')
  )
}

/**
 * 유효한 상품만 필터링
 */
export function filterValidProducts(products: (Product | null | undefined)[]): Product[] {
  return products.filter(isNotNull).filter(isValidProduct)
}
