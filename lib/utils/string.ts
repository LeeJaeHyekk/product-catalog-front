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

/**
 * 텍스트 정규화 함수
 * 
 * 카테고리 매칭 및 검색을 위해 텍스트를 정규화합니다.
 * - 소문자 변환
 * - 앞뒤 공백 제거
 * - 연속된 공백을 하나로 통합
 * - 모든 공백 제거 (띄어쓰기 차이 무시)
 * - 특수문자 제거 (한글, 영문, 숫자만 유지)
 * 
 * 예시:
 * - "냉동 만두" → "냉동만두"
 * - "냉동만두" → "냉동만두"
 * - "Frozen  Dumpling" → "frozendumpling"
 * 
 * @param text 정규화할 텍스트
 * @returns 정규화된 텍스트
 */
export function normalizeTextForMatching(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로 통합
    .replace(/\s/g, '') // 모든 공백 제거 (띄어쓰기 차이 무시)
    .replace(/[^\w가-힣]/g, '') // 특수문자 제거 (한글, 영문, 숫자만 유지)
}
