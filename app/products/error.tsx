'use client'

import { useEffect } from 'react'
import { ErrorFallback } from '@/components/error'

/**
 * 상품 도메인 에러 페이지
 * 
 * /products 경로에서 발생하는 에러를 처리하는 Error Boundary입니다.
 * 도메인별로 커스터마이징된 에러 메시지를 제공합니다.
 */
export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Product page error:', error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      title="상품을 불러올 수 없습니다"
      onReset={reset}
    />
  )
}
