/**
 * API 응답 검증
 */

import type { ApiResponse, ApiResponseItem } from '../types/api'
import { isArray } from './guards'

/**
 * 타입 가드: API 응답 형식인지 확인
 */
export function isApiResponse(value: unknown): value is ApiResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    isArray(obj.content) &&
    typeof obj.status === 'number'
  )
}

/**
 * 타입 가드: API 응답 아이템 형식인지 확인
 */
export function isApiResponseItem(value: unknown): value is ApiResponseItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    typeof obj.index === 'number' &&
    (typeof obj.name === 'string' || obj.name === null) &&
    (typeof obj.price === 'number' || typeof obj.price === 'string') &&
    typeof obj.current === 'number' &&
    typeof obj.limit === 'number' &&
    (obj.image === null || typeof obj.image === 'string')
  )
}
