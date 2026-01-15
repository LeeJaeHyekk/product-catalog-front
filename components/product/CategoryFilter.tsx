'use client'

import { useMemo } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { getAvailableSubCategories } from '@/lib/product'
import { COLORS } from '@/lib/constants'

interface CategoryFilterProps {
  /** 상품 목록 (카테고리 정보 포함) */
  products: EnrichedProduct[]
  /** 선택된 서브 카테고리 ID */
  selectedSubCategoryId: string | '전체'
  /** 카테고리 변경 핸들러 */
  onCategoryChange: (subCategoryId: string | '전체') => void
}

/**
 * 카테고리 필터 컴포넌트
 * 
 * 실제 상품에 존재하는 카테고리만 표시
 * 현대적인 칩 형태 디자인 적용
 */
export function CategoryFilter({
  products,
  selectedSubCategoryId,
  onCategoryChange,
}: CategoryFilterProps) {
  // 사용 가능한 카테고리 목록 (실제 상품에 존재하는 것만)
  const availableCategories = useMemo(
    () => getAvailableSubCategories(products),
    [products]
  )

  return (
    <div className="flex flex-col gap-4">
      {/* 필터 라벨 */}
      <div className="flex items-center gap-2">
        <svg
          className={`w-5 h-5 ${COLORS.primary.text} opacity-70`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className={`text-sm font-semibold ${COLORS.primary.text}`}>
          카테고리 필터
        </span>
      </div>

      {/* 카테고리 칩들 */}
      <div className="flex gap-2.5 flex-wrap">
        {/* 전체 버튼 */}
        <button
          onClick={() => onCategoryChange('전체')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            selectedSubCategoryId === '전체'
              ? `${COLORS.primary.bg} text-white shadow-lg shadow-[#1E7F4F]/25`
              : `${COLORS.background.bgMain} ${COLORS.text.primaryClass} hover:${COLORS.primary.bgWithOpacity(10)} border border-gray-200/60 hover:border-[#1E7F4F]/40 shadow-sm hover:shadow`
          }`}
        >
          전체
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            selectedSubCategoryId === '전체'
              ? 'bg-white/25 text-white'
              : `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`
          }`}>
            {products.length}
          </span>
        </button>

        {/* 카테고리 버튼들 */}
        {availableCategories.map(({ id, name, count }) => (
          <button
            key={id}
            onClick={() => onCategoryChange(id)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              selectedSubCategoryId === id
                ? `${COLORS.primary.bg} text-white shadow-lg shadow-[#1E7F4F]/25`
                : `${COLORS.background.bgMain} ${COLORS.text.primaryClass} hover:${COLORS.primary.bgWithOpacity(10)} border border-gray-200/60 hover:border-[#1E7F4F]/40 shadow-sm hover:shadow`
            }`}
          >
            {name}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              selectedSubCategoryId === id
                ? 'bg-white/25 text-white'
                : `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
