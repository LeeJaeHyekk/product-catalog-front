/**
 * 상품 파생 상태 계산
 */

import type { Product, ProcessedProduct } from '../types'

/**
 * 품절 여부 계산
 */
export function calculateSoldOut(product: Product): boolean {
  return product.current >= product.limit
}

/**
 * 상품에 파생 상태 추가
 */
export function addDerivedState(product: Product): ProcessedProduct {
  return {
    ...product,
    isSoldOut: calculateSoldOut(product),
  }
}

/**
 * 상품 배열에 파생 상태 추가
 */
export function addDerivedStates(products: Product[]): ProcessedProduct[] {
  return products.map(addDerivedState)
}
