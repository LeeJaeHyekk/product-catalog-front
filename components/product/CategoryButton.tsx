'use client'

import { memo } from 'react'
import { COLORS } from '@/lib/constants'

interface CategoryButtonProps {
  /** 카테고리 ID */
  id: string | '전체'
  /** 카테고리 이름 */
  name: string
  /** 상품 개수 */
  count: number
  /** 선택 여부 */
  isSelected: boolean
  /** 클릭 핸들러 */
  onClick: () => void
  /** 버튼 스타일 변형 (기본값: 'default') */
  variant?: 'default' | 'chip' | 'grid'
  /** 추가 클래스명 */
  className?: string
}

/**
 * 카테고리 버튼 공통 컴포넌트
 * 
 * 다양한 스타일 변형을 지원하는 재사용 가능한 카테고리 버튼
 */
export const CategoryButton = memo(function CategoryButton({
  id: _id, // id는 타입 정의에 필요하지만 실제로는 사용하지 않음 (향후 확장 가능성)
  name,
  count,
  isSelected,
  onClick,
  variant = 'default',
  className = '',
}: CategoryButtonProps) {
  // 기본 스타일 클래스
  const baseClasses = 'font-medium text-sm transition-all duration-300 ease-out transform hover:scale-105 active:scale-95'

  // 선택된 상태 스타일
  const selectedClasses = `${COLORS.primary.bg} text-white border-[#1E7F4F] shadow-lg shadow-[#1E7F4F]/25`
  
  // 선택되지 않은 상태 스타일
  const unselectedClasses = `${COLORS.background.bgMain} ${COLORS.text.primaryClass} border-gray-200/60 hover:border-[#1E7F4F]/40 hover:${COLORS.primary.bgWithOpacity(10)} shadow-sm hover:shadow-md`

  // 배지 스타일
  const badgeSelectedClasses = 'bg-white/30 text-white'
  const badgeUnselectedClasses = `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`

  // 변형별 스타일
  const variantClasses = {
    default: `px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between`,
    chip: `px-5 py-2.5 rounded-full border border-gray-200/60 flex items-center gap-2`,
    grid: `px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between`,
  }

  const buttonClassName = `${baseClasses} ${variantClasses[variant]} ${
    isSelected ? selectedClasses : unselectedClasses
  } ${className}`

  const badgeClassName = `px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
    isSelected ? badgeSelectedClasses : badgeUnselectedClasses
  }`

  // chip 변형에서는 배지가 버튼 내부에 있어야 함
  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={buttonClassName}
        aria-label={`${name} 카테고리 선택`}
        aria-pressed={isSelected}
      >
        <span className="text-sm">
          {name}
        </span>
        <span className={badgeClassName}>
          {count}
        </span>
      </button>
    )
  }

  // grid 변형은 원래 구조 유지 (Hydration 에러 방지)
  if (variant === 'grid') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={buttonClassName}
        aria-label={`${name} 카테고리 선택`}
        aria-pressed={isSelected}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`font-bold text-xs sm:text-sm truncate`}>
            {name}
          </span>
          <span className={badgeClassName}>
            {count}
          </span>
        </div>
      </button>
    )
  }

  // default 변형
  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClassName}
      aria-label={`${name} 카테고리 선택`}
      aria-pressed={isSelected}
    >
      <span className="font-bold text-sm">
        {name}
      </span>
      <span className={badgeClassName}>
        {count}
      </span>
    </button>
  )
})
