/**
 * 상품 관련 유틸리티 함수
 */

/**
 * 상품 key 생성 (고유성 보장)
 */
export function createProductKey(product: { index: number; name: string }, idx: number): string {
  return `${product.index}-${product.name}-${idx}`
}

/**
 * 상품 진행률 계산 (0~100%)
 */
export function calculateProgressPercentage(current: number, limit: number): number {
  return Math.min((current / limit) * 100, 100)
}

/**
 * 상품 상태 타입
 */
export type ProductStatus = 'complete' | 'urgent' | 'popular' | 'default'

/**
 * 상품 상태 계산
 * 
 * @param current 현재 수량
 * @param limit 목표 수량
 * @param isSoldOut 품절 여부
 * @returns 상품 상태
 */
export function calculateProductStatus(
  current: number,
  limit: number,
  isSoldOut: boolean
): ProductStatus {
  const progressPercentage = calculateProgressPercentage(current, limit)
  const isComplete = current >= limit

  if (isComplete) {
    return 'complete'
  }
  if (progressPercentage >= 75) {
    return 'urgent'
  }
  if (!isSoldOut && progressPercentage >= 50 && progressPercentage < 75) {
    return 'popular'
  }
  return 'default'
}
