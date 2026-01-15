/**
 * 상품 데이터 정규화
 */

import type { Product } from '../types'
import { PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX } from '../constants'
import { clamp, safeTrim } from '../utils'

/**
 * 상품 데이터 정규화
 * 
 * 입력 데이터를 안전한 범위로 제한하고 기본값을 적용
 */
export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    index: clamp(product.index, PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX),
    name: safeTrim(product.name, '상품명 없음'),
    price: Math.max(0, product.price),
    current: Math.max(0, product.current),
    limit: Math.max(1, product.limit),
    image: product.image === null ? null : String(product.image),
  }
}

/**
 * 상품 배열 정규화
 */
export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct)
}
