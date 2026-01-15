/**
 * 상품 정렬 유틸리티
 */

import type { ProcessedProduct } from '../types'

/**
 * Stable Sort 비교 함수
 * 
 * index 기준 오름차순 정렬, 동일한 index는 name으로 2차 정렬
 */
export function compareProducts(a: ProcessedProduct, b: ProcessedProduct): number {
  // index가 같을 경우 name으로 2차 정렬 (안정성 보장)
  if (a.index !== b.index) {
    return a.index - b.index
  }
  return a.name.localeCompare(b.name, 'ko')
}

/**
 * 상품 배열을 안정적으로 정렬
 */
export function sortProducts(products: ProcessedProduct[]): ProcessedProduct[] {
  return [...products].sort(compareProducts)
}
