/**
 * 공통 유틸리티 함수
 */

/**
 * price 값을 숫자로 변환
 */
export function parsePrice(price: string | number): number {
  if (typeof price === 'number') {
    return price >= 0 ? price : 0
  }
  
  if (typeof price === 'string') {
    const parsed = parseInt(price.replace(/[^0-9]/g, ''), 10)
    return isNaN(parsed) ? 0 : parsed
  }
  
  return 0
}

/**
 * 숫자를 원화 형식으로 포맷팅
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`
}

/**
 * 상품 key 생성 (고유성 보장)
 */
export function createProductKey(product: { index: number; name: string }, idx: number): string {
  return `${product.index}-${product.name}-${idx}`
}

/**
 * 안전한 범위로 제한
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * 안전한 문자열 trim
 */
export function safeTrim(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') {
    return fallback
  }
  return value.trim() || fallback
}
