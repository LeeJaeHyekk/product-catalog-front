/**
 * 상품 관련 유틸리티 함수
 */

/**
 * 상품 key 생성 (고유성 보장)
 */
export function createProductKey(product: { index: number; name: string }, idx: number): string {
  return `${product.index}-${product.name}-${idx}`
}
