/**
 * 타입 가드 함수
 * 
 * 런타임 타입 검증을 위한 타입 가드 함수들
 */

import type { Product } from '../types/product'

/**
 * 타입 가드: 값이 null이 아닌지 확인
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * 타입 가드: 값이 배열인지 확인
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/**
 * 타입 가드: Product 타입인지 확인
 */
export function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    typeof obj.index === 'number' &&
    obj.index >= 0 &&
    obj.index <= 49 &&
    typeof obj.name === 'string' &&
    obj.name.length > 0 &&
    typeof obj.price === 'number' &&
    obj.price >= 0 &&
    typeof obj.current === 'number' &&
    obj.current >= 0 &&
    typeof obj.limit === 'number' &&
    obj.limit > 0 &&
    (obj.image === null || typeof obj.image === 'string')
  )
}

/**
 * 타입 가드: Product 배열인지 확인
 */
export function isProductArray(value: unknown): value is Product[] {
  if (!isArray(value)) {
    return false
  }

  return value.every(isProduct)
}
