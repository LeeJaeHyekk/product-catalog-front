'use client'

import { useEffect, type RefObject } from 'react'

interface UseClickOutsideOptions {
  /** 외부 클릭 시 실행할 콜백 */
  handler: () => void
  /** 활성화 여부 */
  enabled?: boolean
  /** 클릭 이벤트 타입 (기본값: 'mousedown') */
  eventType?: 'mousedown' | 'click'
}

/**
 * 외부 클릭 감지 훅
 * 
 * 지정된 요소 외부를 클릭했을 때 콜백을 실행합니다.
 * 
 * @param ref 감지할 요소의 ref
 * @param options 옵션
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * useClickOutside(ref, {
 *   handler: () => setIsOpen(false),
 *   enabled: isOpen,
 * })
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: UseClickOutsideOptions
) {
  const { handler, enabled = true, eventType = 'mousedown' } = options

  useEffect(() => {
    if (!enabled) return

    function handleClickOutside(event: MouseEvent | Event) {
      // 안전성: ref.current와 event.target이 유효한지 확인
      if (!ref.current || !event.target) {
        return
      }

      // 안전성: event.target이 Node인지 확인
      if (!(event.target instanceof Node)) {
        return
      }

      if (!ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener(eventType, handleClickOutside)

    return () => {
      document.removeEventListener(eventType, handleClickOutside)
    }
  }, [ref, handler, enabled, eventType])
}
