/**
 * React 관련 유틸리티 함수
 * 
 * React 컴포넌트에서 자주 사용되는 패턴을 유틸리티로 제공
 */

import type { ReactNode } from 'react'

/**
 * className을 안전하게 병합하는 함수
 * 
 * @param classes 병합할 className 배열
 * @returns 병합된 className 문자열
 * 
 * @example
 * ```tsx
 * const className = cn('base-class', condition && 'conditional-class', undefined, 'another-class')
 * // 결과: 'base-class conditional-class another-class'
 * ```
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 조건부 className 생성 헬퍼
 * 
 * @param base 기본 className
 * @param conditionals 조건부 className 객체
 * @returns 병합된 className
 * 
 * @example
 * ```tsx
 * const className = conditionalClassName('base', {
 *   'active': isActive,
 *   'disabled': isDisabled,
 * })
 * ```
 */
export function conditionalClassName(
  base: string,
  conditionals: Record<string, boolean | undefined>
): string {
  const conditionalClasses = Object.entries(conditionals)
    .filter(([, condition]) => condition)
    .map(([className]) => className)
  
  return cn(base, ...conditionalClasses)
}

/**
 * ProductCard용 memo 비교 함수
 * 
 * product 객체의 주요 필드만 비교하여 불필요한 리렌더링 방지
 * 
 * @param prevProps 이전 props
 * @param nextProps 다음 props
 * @returns props가 같으면 true (리렌더링 방지)
 */
export function compareProductProps<T extends { product: { 
  index: number
  name: string
  price: number
  current: number
  limit: number
  isSoldOut: boolean
  image: string | null
  category?: {
    subCategoryId?: string
    subCategoryName?: string
  }
} }>(prevProps: T, nextProps: T): boolean {
  const prev = prevProps.product
  const next = nextProps.product
  
  // 안정성: prev, next가 유효한지 확인
  if (!prev || !next) {
    return false
  }
  
  return (
    prev.index === next.index &&
    prev.name === next.name &&
    prev.price === next.price &&
    prev.current === next.current &&
    prev.limit === next.limit &&
    prev.isSoldOut === next.isSoldOut &&
    prev.image === next.image &&
    // 카테고리 정보도 비교 (해시태그 표시에 영향)
    prev.category?.subCategoryId === next.category?.subCategoryId &&
    prev.category?.subCategoryName === next.category?.subCategoryName
  )
}
