'use client'

import { useMemo } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { getAvailableSubCategories } from '@/lib/product'
import { isArray } from '@/lib/validation'

interface UseCategorySelectionParams {
  /** 상품 목록 (카테고리 정보 포함) */
  products: EnrichedProduct[]
  /** 선택된 서브 카테고리 ID */
  selectedSubCategoryId: string | '전체'
}

interface UseCategorySelectionReturn {
  /** 사용 가능한 카테고리 목록 */
  availableCategories: Array<{ id: string; name: string; count: number }>
  /** 선택된 카테고리 이름 */
  selectedCategoryName: string
  /** 선택된 카테고리의 상품 개수 */
  selectedCategoryCount: number
}

/**
 * 카테고리 선택 관련 로직을 관리하는 훅
 * 
 * @param params 파라미터
 * @returns 카테고리 선택 관련 데이터
 * 
 * @example
 * ```tsx
 * const { availableCategories, selectedCategoryName } = useCategorySelection({
 *   products,
 *   selectedSubCategoryId: '전체',
 * })
 * ```
 */
export function useCategorySelection({
  products,
  selectedSubCategoryId,
}: UseCategorySelectionParams): UseCategorySelectionReturn {
  // 안전성: products prop 검증
  const safeProducts = isArray(products) ? products : []

  // 사용 가능한 카테고리 목록 (실제 상품에 존재하는 것만)
  const availableCategories = useMemo(() => {
    try {
      return getAvailableSubCategories(safeProducts)
    } catch (error) {
      console.error('useCategorySelection: Failed to get available categories', error)
      return []
    }
  }, [safeProducts])

  // 선택된 카테고리 이름 찾기
  const selectedCategoryName = useMemo(() => {
    if (selectedSubCategoryId === '전체') {
      return '전체'
    }
    const category = availableCategories.find(cat => cat.id === selectedSubCategoryId)
    return category?.name || '전체'
  }, [selectedSubCategoryId, availableCategories])

  // 선택된 카테고리의 상품 개수
  const selectedCategoryCount = useMemo(() => {
    if (selectedSubCategoryId === '전체') {
      return safeProducts.length
    }
    const category = availableCategories.find(cat => cat.id === selectedSubCategoryId)
    return category?.count || 0
  }, [selectedSubCategoryId, availableCategories, safeProducts.length])

  return {
    availableCategories,
    selectedCategoryName,
    selectedCategoryCount,
  }
}
