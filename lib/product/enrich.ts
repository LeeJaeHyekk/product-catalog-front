/**
 * 상품 데이터 보강 모듈
 * 
 * 카테고리 정보를 포함하여 상품 데이터를 보강
 */

import type { ProcessedProduct } from '../types'
import { enrichProductsWithCategory, type EnrichedProduct } from './category'

/**
 * 상품 데이터 보강 (카테고리 포함)
 * 
 * 서버에서 한 번에 처리하여 클라이언트로 전달
 */
export function enrichProducts(products: ProcessedProduct[]): EnrichedProduct[] {
  return enrichProductsWithCategory(products)
}

/**
 * 통합 처리 함수
 * 
 * processProducts와 enrichProducts를 순차적으로 실행
 */
import { processProducts } from './process'

export function processAndEnrichProducts(
  rawProducts: Parameters<typeof processProducts>[0]
): EnrichedProduct[] {
  // 1. 기본 가공 (정렬, 품절 처리 등)
  const processed = processProducts(rawProducts)

  // 2. 카테고리 정보 추가
  const enriched = enrichProducts(processed)

  return enriched
}
