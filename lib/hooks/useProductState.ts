'use client'

/**
 * 상품 상태 관련 커스텀 훅
 * 
 * 상품의 진행률, 상태 등을 계산하고 메모이제이션하는 훅
 */

import { useMemo } from 'react'
import {
  calculateProgressPercentage,
  calculateProductStatus,
  type ProductStatus,
} from '../utils/product'

interface UseProductStateParams {
  current: number
  limit: number
  isSoldOut: boolean
}

interface UseProductStateReturn {
  progressPercentage: number
  remaining: number
  status: ProductStatus
  isComplete: boolean
  isUrgent: boolean
  isPopular: boolean
}

/**
 * 상품 상태를 계산하고 메모이제이션하는 훅
 * 
 * @param params 상품 상태 파라미터
 * @returns 메모이제이션된 상품 상태 정보
 * 
 * @example
 * ```tsx
 * const { progressPercentage, status, isComplete } = useProductState({
 *   current: 50,
 *   limit: 100,
 *   isSoldOut: false,
 * })
 * ```
 */
export function useProductState({
  current,
  limit,
  isSoldOut,
}: UseProductStateParams): UseProductStateReturn {
  const progressPercentage = useMemo(
    () => calculateProgressPercentage(current, limit),
    [current, limit]
  )

  const remaining = useMemo(() => limit - current, [limit, current])

  const status = useMemo(
    () => calculateProductStatus(current, limit, isSoldOut),
    [current, limit, isSoldOut]
  )

  const isComplete = useMemo(() => status === 'complete', [status])
  const isUrgent = useMemo(() => status === 'urgent', [status])
  const isPopular = useMemo(() => status === 'popular', [status])

  return {
    progressPercentage,
    remaining,
    status,
    isComplete,
    isUrgent,
    isPopular,
  }
}
