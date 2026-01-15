'use client'

/**
 * 동적 레이아웃 계산 훅
 * 
 * 여러 요소의 크기를 측정하고 동적으로 레이아웃을 계산하는 훅
 */

import { useState, useEffect, RefObject } from 'react'
import { calculateSearchBarLayout, type SearchBarLayout } from '../utils/layout'
import { getElementWidth } from '../utils/layout'
import { SEARCH_BAR } from '../constants/ui'

/**
 * 검색 바 동적 레이아웃 훅 옵션
 */
export interface UseSearchBarLayoutOptions {
  /** 오른쪽 요소의 ref */
  rightElementRef: RefObject<HTMLElement | null> | { current: HTMLElement | null }
  /** 지우기 버튼의 ref */
  clearButtonRef: RefObject<HTMLElement | null> | { current: HTMLElement | null }
  /** 지우기 버튼이 표시되는지 여부 */
  hasClearButton: boolean
  /** 오른쪽 요소가 있는지 여부 */
  hasRightElement: boolean
  /** 버튼 간 간격 (px), 기본값: SEARCH_BAR.gap */
  gap?: number
}

/**
 * 검색 바의 동적 레이아웃을 계산하는 훅
 * 
 * @param options 레이아웃 계산 옵션
 * @returns 계산된 레이아웃 값
 * 
 * @example
 * ```tsx
 * const rightElementRef = useRef<HTMLDivElement>(null)
 * const clearButtonRef = useRef<HTMLButtonElement>(null)
 * 
 * const layout = useSearchBarLayout({
 *   rightElementRef,
 *   clearButtonRef,
 *   hasClearButton: !!query,
 *   hasRightElement: !!rightElement,
 * })
 * 
 * <input style={{ paddingRight: `${layout.inputPaddingRight}px` }} />
 * ```
 */
export function useSearchBarLayout(
  options: UseSearchBarLayoutOptions
): SearchBarLayout {
  const {
    rightElementRef,
    clearButtonRef,
    hasClearButton,
    hasRightElement,
    gap = SEARCH_BAR.gap,
  } = options

  const [layout, setLayout] = useState<SearchBarLayout>({
    inputPaddingRight: SEARCH_BAR.defaultPadding,
    clearButtonRight: SEARCH_BAR.defaultRightPadding,
  })

  useEffect(() => {
    let isMounted = true
    let rafId: number | null = null

    const updateLayout = () => {
      // requestAnimationFrame으로 DOM 업데이트 후 측정
      rafId = requestAnimationFrame(() => {
        // 컴포넌트가 언마운트된 경우 상태 업데이트 방지
        if (!isMounted) return

        const rightElementWidth = getElementWidth(rightElementRef.current)
        const clearButtonWidth = getElementWidth(clearButtonRef.current)

        const newLayout = calculateSearchBarLayout({
          rightElementWidth,
          clearButtonWidth,
          gap,
          hasClearButton,
          hasRightElement,
        })

        setLayout(newLayout)
      })
    }

    // 초기 계산 (약간의 지연을 두어 DOM이 완전히 렌더링된 후 측정)
    const timeoutId = setTimeout(updateLayout, 0)

    // ResizeObserver로 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      if (isMounted) {
        updateLayout()
      }
    })

    // DOM 요소가 준비되면 관찰 시작
    const observeElements = () => {
      if (!isMounted) return
      if (rightElementRef.current) {
        resizeObserver.observe(rightElementRef.current)
      }
      if (clearButtonRef.current) {
        resizeObserver.observe(clearButtonRef.current)
      }
    }

    // 약간의 지연 후 관찰 시작
    const observeTimeoutId = setTimeout(observeElements, 100)

    // window resize 이벤트도 감지
    const handleResize = () => {
      if (isMounted) {
        updateLayout()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      clearTimeout(observeTimeoutId)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [rightElementRef, clearButtonRef, hasClearButton, hasRightElement, gap])

  return layout
}
