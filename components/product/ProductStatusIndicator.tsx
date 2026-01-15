import { memo, useMemo } from 'react'
import { COLORS } from '@/lib/constants'
import { useMemoClassNameArray } from '@/lib/hooks'

type StatusType = 'complete' | 'urgent' | 'popular' | 'default'

interface ProductStatusIndicatorProps {
  /** 상태 타입 */
  status: StatusType
}

/**
 * 상태별 색상 클래스 가져오기
 */
function getStatusColorClass(status: StatusType): string {
  switch (status) {
    case 'complete':
      return COLORS.primary.bg
    case 'urgent':
      return COLORS.accent.bg
    case 'popular':
      return COLORS.primary.bgWithOpacity(30)
    default:
      return 'bg-transparent'
  }
}

/**
 * 상품 상태 인디케이터 (카드 하단 컬러 바)
 * 
 * 상품 카드 하단에 얇은 컬러 바로 상태 표시
 */
function ProductStatusIndicatorComponent({ status }: ProductStatusIndicatorProps) {
  const colorClass = useMemo(() => getStatusColorClass(status), [status])
  const className = useMemoClassNameArray([
    'absolute bottom-0 left-0 right-0 h-1',
    colorClass,
  ])

  return (
    <div
      className={className}
      aria-hidden="true"
    />
  )
}

ProductStatusIndicatorComponent.displayName = 'ProductStatusIndicator'

export const ProductStatusIndicator = memo(ProductStatusIndicatorComponent)
