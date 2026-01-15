/**
 * 상품 데이터 검증
 */

import type { Product } from '../types'
import { isNotNull } from '../validation'

/**
 * 상품이 유효한지 검증
 */
export function isValidProduct(product: unknown): product is Product {
  if (typeof product !== 'object' || product === null) {
    return false
  }

  const p = product as Record<string, unknown>

  return (
    typeof p.index === 'number' &&
    p.index >= 0 &&
    typeof p.name === 'string' &&
    p.name.length > 0 &&
    typeof p.price === 'number' &&
    p.price >= 0 &&
    typeof p.current === 'number' &&
    p.current >= 0 &&
    typeof p.limit === 'number' &&
    p.limit > 0
  )
}

/**
 * 유효한 상품만 필터링
 */
export function filterValidProducts(products: (Product | null | undefined)[]): Product[] {
  return products.filter(isNotNull).filter(isValidProduct)
}
