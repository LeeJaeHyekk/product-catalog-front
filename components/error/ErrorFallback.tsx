'use client'

import { DynamicErrorPage } from './DynamicErrorPage'

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  title?: string
  onReset?: () => void
}

/**
 * 공통 에러 Fallback 컴포넌트
 * 
 * Error Boundary에서 사용되는 공통 에러 UI입니다.
 * 동적 에러 페이지를 사용하여 에러 타입별로 다른 UI를 표시합니다.
 */
export function ErrorFallback({ error, title, onReset }: ErrorFallbackProps) {
  return (
    <DynamicErrorPage
      error={error}
      onReset={onReset}
      customTitle={title}
    />
  )
}
