'use client'

import { useEffect } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { COLORS } from '@/lib/constants'
import { useProductFilters } from '@/lib/hooks'
import { isArray } from '@/lib/validation'
import { ProductGrid } from './ProductGrid'
import { CategoryPanel } from './CategoryPanel'
import { SearchBar } from './SearchBar'
import { EmptyState } from '@/components/ui'

interface ProductGridWithFiltersProps {
  /** 카테고리 정보가 포함된 상품 목록 */
  products: EnrichedProduct[]
}

/**
 * 필터링 기능이 포함된 상품 그리드 컴포넌트
 * 
 * 카테고리 필터, 검색, 가격 필터 등을 제공
 * 검색/필터 섹션과 상품 리스트가 분리된 구조
 */
export function ProductGridWithFilters({ products }: ProductGridWithFiltersProps) {
  // 안전성: products prop 검증
  if (!isArray(products)) {
    console.warn('ProductGridWithFilters: products must be an array')
    return (
      <div className="space-y-6">
        <div className={`${COLORS.background.bgWhiteWithOpacity(95)} backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#1E7F4F]/10`}>
          <p className={`text-sm ${COLORS.text.secondaryClass}`}>
            상품 데이터를 불러올 수 없습니다.
          </p>
        </div>
      </div>
    )
  }

  // 필터링 상태 관리 (커스텀 훅 사용)
  const { filters, updateFilter, filteredProducts } = useProductFilters({
    products,
  })

  // 에러 페이지에서 전달된 검색어 처리
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const errorPageSearchQuery = sessionStorage.getItem('errorPageSearchQuery')
      if (errorPageSearchQuery && !filters.searchQuery) {
        updateFilter('searchQuery', errorPageSearchQuery)
        sessionStorage.removeItem('errorPageSearchQuery')
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 섹션 - 별도 카드로 분리 */}
      <div className={`relative z-40 ${COLORS.background.bgWhiteWithOpacity(95)} backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-[#1E7F4F]/10 overflow-visible`}>
        {/* 검색 바 (카테고리 버튼 포함) */}
        <SearchBar
          onSearch={(query) => updateFilter('searchQuery', query)}
          initialQuery={filters.searchQuery ?? ''}
          rightElement={
            <CategoryPanel
              products={products}
              selectedSubCategoryId={filters.subCategoryId ?? '전체'}
              onCategoryChange={(subCategoryId) => {
                try {
                  updateFilter('subCategoryId', subCategoryId)
                } catch (error) {
                  console.error('ProductGridWithFilters: Error updating category filter', error)
                }
              }}
            />
          }
        />
      </div>

      {/* 상품 그리드 섹션 - 별도로 분리 */}
      <div>
        {/* 결과 개수 표시 */}
        {filteredProducts.length > 0 && (
          <div className="mb-4 px-2">
            <p className={`text-sm ${COLORS.text.secondaryClass}`}>
              총 <span className={`font-semibold ${COLORS.primary.text}`}>{filteredProducts.length}</span>개의 상품이 있습니다
            </p>
          </div>
        )}

        {/* 검색 결과 없음 처리 */}
        {filteredProducts.length === 0 && (
          <>
            {filters.searchQuery ? (
              <EmptyState
                title="검색 결과가 없습니다"
                message={`"${filters.searchQuery}"에 대한 검색 결과를 찾을 수 없습니다.`}
                subMessage="다른 검색어를 시도하거나 필터를 조정해보세요."
              />
            ) : filters.subCategoryId && filters.subCategoryId !== '전체' ? (
              <EmptyState
                title="해당 카테고리에 상품이 없습니다"
                message="선택한 카테고리에 등록된 상품이 없습니다."
                subMessage="다른 카테고리를 선택하거나 전체 카테고리를 확인해보세요."
              />
            ) : null}
          </>
        )}

        {/* 필터링된 상품 그리드 */}
        {filteredProducts.length > 0 && <ProductGrid products={filteredProducts} />}
      </div>
    </div>
  )
}
