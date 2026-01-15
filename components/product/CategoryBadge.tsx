'use client'

import { memo } from 'react'
import { COLORS } from '@/lib/constants'

interface CategoryBadgeProps {
  /** 배지에 표시할 숫자 */
  count: number
  /** 활성화 상태 (버튼이 선택되었거나 열려있는 경우) */
  isActive: boolean
  /** 추가 클래스명 */
  className?: string
}

/**
 * 카테고리 배지 공통 컴포넌트
 * 
 * 카테고리 버튼에 표시되는 상품 개수 배지
 */
export const CategoryBadge = memo(function CategoryBadge({
  count,
  isActive,
  className = '',
}: CategoryBadgeProps) {
  const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium'
  
  const activeClasses = 'bg-white/25 text-white'
  const inactiveClasses = `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`

  const badgeClassName = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  } ${className}`

  return (
    <span className={badgeClassName}>
      {count}
    </span>
  )
})
