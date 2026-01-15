'use client'

import type { EnrichedProduct } from '@/lib/product'
import { COLORS } from '@/lib/constants'
import { useCategorySelection } from '@/lib/hooks'
import { CategoryButton } from './CategoryButton'

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
  // 카테고리 선택 로직 (모듈화된 훅 사용)
  const { availableCategories } = useCategorySelection({
    products,
    selectedSubCategoryId,
  })

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
        <CategoryButton
          id="전체"
          name="전체"
          count={products.length}
          isSelected={selectedSubCategoryId === '전체'}
          onClick={() => onCategoryChange('전체')}
          variant="chip"
        />

        {/* 카테고리 버튼들 */}
        {availableCategories.map(({ id, name, count }) => (
          <CategoryButton
            key={id}
            id={id}
            name={name}
            count={count}
            isSelected={selectedSubCategoryId === id}
            onClick={() => onCategoryChange(id)}
            variant="chip"
          />
        ))}
      </div>
    </div>
  )
}
