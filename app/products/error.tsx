'use client'

import { useEffect } from 'react'
import { DynamicErrorPage } from '@/components/error'

/**
 * 상품 도메인 에러 페이지
 * 
 * /products 경로에서 발생하는 에러를 처리하는 Error Boundary입니다.
 * 에러 타입에 따라 동적으로 다른 UI를 표시합니다.
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
    <DynamicErrorPage
      error={error}
      customTitle="상품을 불러올 수 없습니다"
      onReset={reset}
    />
  )
}
