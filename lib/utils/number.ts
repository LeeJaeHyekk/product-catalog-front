/**
 * 숫자 유틸리티 함수
 */

/**
 * 안전한 범위로 제한
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

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
