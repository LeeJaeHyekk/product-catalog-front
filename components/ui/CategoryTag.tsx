'use client'

/**
 * 카테고리 태그 컴포넌트
 * 
 * 상품 카드에 표시되는 카테고리 해시태그
 */

import { memo } from 'react'
import { COLORS } from '@/lib/constants'
import { useMemoClassName } from '@/lib/hooks'

interface CategoryTagProps {
  /** 카테고리 이름 */
  categoryName: string
  /** 기본 카테고리 이름 (표시하지 않을 카테고리) */
  defaultCategoryName?: string
}

/**
 * 카테고리 태그 컴포넌트
 * 
 * 해시태그 형태로 카테고리를 표시
 */
function CategoryTagComponent({
  categoryName,
  defaultCategoryName = '기타',
}: CategoryTagProps) {
  // 기본 카테고리는 표시하지 않음
  if (categoryName === defaultCategoryName) {
    return null
  }

  const className = useMemoClassName(
    'inline-block px-2 py-1 rounded-md text-xs font-medium border',
    {
      [COLORS.primary.bgWithOpacity(10)]: true,
      [COLORS.primary.text]: true,
      'border-[#1E7F4F]/20': true,
    }
  )

  return (
    <div className="mb-2">
      <span className={className}>
        #{categoryName}
      </span>
    </div>
  )
}

CategoryTagComponent.displayName = 'CategoryTag'

export const CategoryTag = memo(CategoryTagComponent)
