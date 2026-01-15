/**
 * 문자열 유틸리티 함수
 */

/**
 * 안전한 문자열 trim
 */
export function safeTrim(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') {
    return fallback
  }
  return value.trim() || fallback
}
