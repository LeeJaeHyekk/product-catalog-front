'use client'

/**
 * 요소 크기 측정 훅
 * 
 * DOM 요소의 크기를 측정하고 변경을 감지하는 훅
 */

import { useState, useEffect, useRef, RefObject } from 'react'
import { getElementWidth } from '../utils/layout'

/**
 * 요소 크기 측정 결과
 */
export interface ElementSize {
  /** 요소의 너비 (px) */
  width: number
  /** 요소의 높이 (px) */
  height: number
}

/**
 * 요소 크기를 측정하는 훅
 * 
 * @param ref 측정할 요소의 ref
 * @param enabled 측정 활성화 여부 (기본값: true)
 * @returns 요소의 크기 정보
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const size = useElementSize(ref)
 * 
 * return <div ref={ref}>Width: {size.width}px</div>
 * ```
 */
export function useElementSize<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  enabled = true
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    if (!enabled || !ref.current) {
      return
    }

    const element = ref.current

    const updateSize = () => {
      if (!element) return

      setSize({
        width: element.offsetWidth || 0,
        height: element.offsetHeight || 0,
      })
    }

    // 초기 크기 측정
    updateSize()

    // ResizeObserver로 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      updateSize()
    })

    resizeObserver.observe(element)

    // window resize 이벤트도 감지
    window.addEventListener('resize', updateSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [ref, enabled])

  return size
}

/**
 * 요소의 너비만 측정하는 훅 (최적화된 버전)
 * 
 * @param ref 측정할 요소의 ref
 * @param enabled 측정 활성화 여부 (기본값: true)
 * @returns 요소의 너비 (px)
 */
export function useElementWidth<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  enabled = true
): number {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!enabled || !ref.current) {
      return
    }

    const element = ref.current

    const updateWidth = () => {
      if (!element) return
      setWidth(getElementWidth(element))
    }

    // 초기 크기 측정
    updateWidth()

    // ResizeObserver로 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      updateWidth()
    })

    resizeObserver.observe(element)

    // window resize 이벤트도 감지
    window.addEventListener('resize', updateWidth)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [ref, enabled])

  return width
}
