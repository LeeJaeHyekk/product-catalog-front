'use client'

/**
 * className 메모이제이션 훅
 * 
 * className 생성 로직을 메모이제이션하는 재사용 가능한 훅
 */

import { useMemo } from 'react'
import { cn, conditionalClassName } from '../utils/react'

/**
 * className을 메모이제이션하는 훅
 * 
 * @param base 기본 className
 * @param conditionals 조건부 className 객체
 * @returns 메모이제이션된 className
 * 
 * @example
 * ```tsx
 * const className = useMemoClassName('base-class', {
 *   'active': isActive,
 *   'disabled': isDisabled,
 * })
 * ```
 */
export function useMemoClassName(
  base: string,
  conditionals?: Record<string, boolean | undefined>
): string {
  return useMemo(() => {
    if (!conditionals) {
      return base
    }
    return conditionalClassName(base, conditionals)
  }, [base, conditionals])
}

/**
 * className 배열을 메모이제이션하는 훅
 * 
 * @param classes 병합할 className 배열
 * @returns 메모이제이션된 className
 * 
 * @example
 * ```tsx
 * const className = useMemoClassNameArray([
 *   'base-class',
 *   condition && 'conditional-class',
 *   undefined,
 *   'another-class'
 * ])
 * ```
 */
export function useMemoClassNameArray(
  classes: Array<string | undefined | null | false>
): string {
  return useMemo(() => cn(...classes), [classes])
}
