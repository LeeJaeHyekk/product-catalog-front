'use client'

/**
 * 상품 필터링 관련 커스텀 훅
 * 
 * 필터 상태 관리 및 필터링된 상품 목록을 제공하는 훅
 */

import { useState, useMemo } from 'react'
import type { EnrichedProduct, FilterOptions } from '../product'
import { filterProducts } from '../product'
import { isArray } from '../validation'

interface UseProductFiltersParams {
  products: EnrichedProduct[]
  initialFilters?: Partial<FilterOptions>
}

interface UseProductFiltersReturn {
  filters: FilterOptions
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>
  updateFilter: <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => void
  filteredProducts: EnrichedProduct[]
  resetFilters: () => void
}

/**
 * 상품 필터링 상태를 관리하는 훅
 * 
 * @param params 필터링 파라미터
 * @returns 필터 상태 및 필터링된 상품 목록
 * 
 * @example
 * ```tsx
 * const { filters, updateFilter, filteredProducts } = useProductFilters({
 *   products: allProducts,
 *   initialFilters: { subCategoryId: '전체' },
 * })
 * 
 * // 필터 업데이트
 * updateFilter('searchQuery', '검색어')
 * ```
 */
export function useProductFilters({
  products,
  initialFilters = {},
}: UseProductFiltersParams): UseProductFiltersReturn {
  // 안전성: products prop 검증
  let safeProducts = products
  if (!isArray(products)) {
    console.warn('useProductFilters: products must be an array')
    safeProducts = []
  }

  // 안전성: initialFilters 검증
  const validatedInitialFilters: Partial<FilterOptions> = {}
  if (initialFilters && typeof initialFilters === 'object') {
    if (initialFilters.subCategoryId !== undefined && 
        initialFilters.subCategoryId !== null && 
        (typeof initialFilters.subCategoryId === 'string' || initialFilters.subCategoryId === '전체')) {
      validatedInitialFilters.subCategoryId = initialFilters.subCategoryId as string | '전체'
    }
    if (initialFilters.searchQuery !== undefined && 
        initialFilters.searchQuery !== null && 
        typeof initialFilters.searchQuery === 'string') {
      validatedInitialFilters.searchQuery = initialFilters.searchQuery
    }
    if (typeof initialFilters.onlyAvailable === 'boolean') {
      validatedInitialFilters.onlyAvailable = initialFilters.onlyAvailable
    }
  }

  const [filters, setFilters] = useState<FilterOptions>({
    subCategoryId: '전체',
    searchQuery: '',
    onlyAvailable: false,
    ...validatedInitialFilters,
  })

  // 필터링된 상품 목록 (useMemo로 최적화)
  const filteredProducts = useMemo(() => {
    try {
      return filterProducts(safeProducts, filters)
    } catch (error) {
      console.error('useProductFilters: Error filtering products', error)
      return []
    }
  }, [safeProducts, filters])

  // 특정 필터만 업데이트하는 헬퍼 함수
  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    try {
      // 안전성: key가 유효한 FilterOptions의 키인지 확인
      if (!key || typeof key !== 'string') {
        console.warn('useProductFilters: Invalid filter key', key)
        return
      }
      
      setFilters((prev) => {
        // 안전성: prev가 유효한 객체인지 확인
        if (!prev || typeof prev !== 'object') {
          console.warn('useProductFilters: Invalid filters state')
          return {
            subCategoryId: '전체',
            searchQuery: '',
            onlyAvailable: false,
            ...validatedInitialFilters,
          }
        }
        
        return { ...prev, [key]: value }
      })
    } catch (error) {
      console.error('useProductFilters: Error updating filter', error)
    }
  }

  // 필터 초기화 함수
  const resetFilters = () => {
    setFilters({
      subCategoryId: '전체',
      searchQuery: '',
      onlyAvailable: false,
      ...validatedInitialFilters,
    })
  }

  return {
    filters,
    setFilters,
    updateFilter,
    filteredProducts,
    resetFilters,
  }
}
