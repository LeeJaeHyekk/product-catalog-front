'use client'

import { useEffect } from 'react'

interface UseEscapeKeyOptions {
  /** ESC 키 입력 시 실행할 콜백 */
  handler: () => void
  /** 활성화 여부 */
  enabled?: boolean
}

/**
 * ESC 키 감지 훅
 * 
 * ESC 키를 눌렀을 때 콜백을 실행합니다.
 * 
 * @param options 옵션
 * 
 * @example
 * ```tsx
 * useEscapeKey({
 *   handler: () => setIsOpen(false),
 *   enabled: isOpen,
 * })
 * ```
 */
export function useEscapeKey(options: UseEscapeKeyOptions) {
  const { handler, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handler()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handler, enabled])
}
