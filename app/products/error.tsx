'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/Container'

export default function Error({
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
    <Container>
      <div className="error-state text-center py-12">
        <h2 className="text-xl font-bold mb-4">문제가 발생했습니다</h2>
        <p className="text-gray-500 mb-4">
          상품 목록을 불러오는 중 오류가 발생했습니다.
        </p>
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    </Container>
  )
}
