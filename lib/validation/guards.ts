/**
 * 타입 가드 함수
 * 
 * 런타임 타입 검증을 위한 타입 가드 함수들
 */

import type { Product } from '../types/product'
import type { Category, SubCategory } from '../types/category'
import type { MatchResult, ImageFile } from '../image/types'
import type { CategoryMatch } from '../types/category'

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

/**
 * 타입 가드: Category 배열인지 확인
 */
export function isCategoryArray(value: unknown): value is readonly Category[] {
  if (!isArray(value)) {
    return false
  }

  return value.every((item): item is Category => {
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const obj = item as Record<string, unknown>

    return (
      typeof obj.id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.description === 'string' &&
      Array.isArray(obj.subCategories) &&
      obj.subCategories.every((sub: unknown): sub is SubCategory => {
        if (typeof sub !== 'object' || sub === null) {
          return false
        }
        const subObj = sub as Record<string, unknown>
        return (
          typeof subObj.id === 'string' &&
          typeof subObj.name === 'string' &&
          Array.isArray(subObj.items) &&
          subObj.items.every((item: unknown) => typeof item === 'string')
        )
      })
    )
  })
}

/**
 * 타입 가드: MatchResult 타입인지 확인
 */
export function isMatchResult(value: unknown): value is MatchResult {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    typeof obj.filename === 'string' &&
    obj.filename.length > 0 &&
    typeof obj.score === 'number' &&
    isFinite(obj.score) &&
    obj.score >= 0 &&
    obj.score <= 1 &&
    typeof obj.method === 'string' &&
    (obj.method === 'exact' || obj.method === 'partial' || obj.method === 'similarity')
  )
}

/**
 * 타입 가드: MatchResult 배열인지 확인
 */
export function isMatchResultArray(value: unknown): value is MatchResult[] {
  if (!isArray(value)) {
    return false
  }

  return value.every(isMatchResult)
}

/**
 * 타입 가드: ImageFile 타입인지 확인
 */
export function isImageFile(value: unknown): value is ImageFile {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    typeof obj.filename === 'string' &&
    typeof obj.nameWithoutExt === 'string' &&
    typeof obj.extension === 'string' &&
    typeof obj.fullPath === 'string' &&
    obj.fullPath.length > 0
  )
}

/**
 * 타입 가드: ImageFile 배열인지 확인
 */
export function isImageFileArray(value: unknown): value is ImageFile[] {
  if (!isArray(value)) {
    return false
  }

  return value.every(isImageFile)
}

/**
 * 타입 가드: CategoryMatch 타입인지 확인
 */
export function isCategoryMatch(value: unknown): value is CategoryMatch {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    typeof obj.subCategoryId === 'string' &&
    obj.subCategoryId.length > 0 &&
    typeof obj.subCategoryName === 'string' &&
    obj.subCategoryName.length > 0 &&
    typeof obj.categoryId === 'string' &&
    obj.categoryId.length > 0 &&
    typeof obj.categoryName === 'string' &&
    obj.categoryName.length > 0 &&
    typeof obj.matchedKeyword === 'string' &&
    typeof obj.matchType === 'string' &&
    (obj.matchType === 'korean' || obj.matchType === 'english')
  )
}

/**
 * 타입 가드: 유효한 문자열인지 확인
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * 타입 가드: 유효한 숫자인지 확인 (유한한 숫자, 0 이상)
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value >= 0
}

/**
 * 타입 가드: 유효한 양수인지 확인 (유한한 숫자, 0보다 큼)
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value > 0
}
