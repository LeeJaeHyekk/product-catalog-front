/**
 * API 응답 검증
 */

import { isArray } from './guards'

/**
 * 타입 가드: API 응답 형식인지 확인
 */
export function isApiResponse(value: unknown): value is {
  content: unknown[]
  status: number
} {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    isArray(obj.content) &&
    typeof obj.status === 'number'
  )
}
