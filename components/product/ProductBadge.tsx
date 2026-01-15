import { memo, useMemo } from 'react'
import { COLORS } from '@/lib/constants'
import { useMemoClassNameArray } from '@/lib/hooks'

type BadgeType = 'popular' | 'urgent' | 'complete'

interface ProductBadgeProps {
  /** 배지 타입 */
  type: BadgeType
}

/**
 * 배지 설정을 가져오는 함수
 */
function getBadgeConfig(type: BadgeType) {
  switch (type) {
    case 'popular':
      return {
        label: '인기',
        bgClass: COLORS.primary.bgWithOpacity(90),
        textClass: 'text-white',
      }
    case 'urgent':
      return {
        label: '마감임박',
        bgClass: COLORS.accent.bgWithOpacity(90),
        textClass: COLORS.text.primaryClass,
      }
    case 'complete':
      return {
        label: '목표달성',
        bgClass: COLORS.primary.bgWithOpacity(90),
        textClass: 'text-white',
      }
  }
}

/**
 * 상품 상태 배지 컴포넌트
 * 
 * 상품의 상태를 시각적으로 표시하는 배지
 * - 인기: 진행률 50-75%
 * - 마감임박: 진행률 75% 이상
 * - 목표달성: 진행률 100%
 */
function ProductBadgeComponent({ type }: ProductBadgeProps) {
  const config = useMemo(() => getBadgeConfig(type), [type])
  const className = useMemoClassNameArray([
    'absolute top-2 right-2 z-20',
    config.bgClass,
    config.textClass,
    'text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm',
  ])

  return (
    <div
      className={className}
      aria-label={config.label}
    >
      {config.label}
    </div>
  )
}

ProductBadgeComponent.displayName = 'ProductBadge'

export const ProductBadge = memo(ProductBadgeComponent)
