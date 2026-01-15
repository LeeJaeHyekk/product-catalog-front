'use client'

import { AppError } from '@/lib/errors'
import { Container } from '@/components/layout'

interface ErrorFallbackProps {
  error: Error
  title?: string
  onReset?: () => void
}

/**
 * 공통 에러 Fallback 컴포넌트
 * 
 * Error Boundary에서 사용되는 공통 에러 UI입니다.
 * 에러 타입에 따라 적절한 메시지를 표시합니다.
 */
export function ErrorFallback({ error, title, onReset }: ErrorFallbackProps) {
  const isAppError = error instanceof AppError
  
  // 에러 타입에 따른 메시지 결정
  const errorMessage = isAppError 
    ? error.message 
    : '알 수 없는 오류가 발생했습니다.'
  
  const defaultTitle = isAppError
    ? '문제가 발생했습니다'
    : '예기치 않은 오류가 발생했습니다'

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          {title ?? defaultTitle}
        </h2>

        <p className="text-gray-600 text-center max-w-md">
          {errorMessage}
        </p>

        {onReset && (
          <button
            onClick={onReset}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        )}

        {!onReset && (
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            페이지 새로고침
          </button>
        )}

        {/* 개발 환경에서만 상세 에러 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 p-4 bg-gray-100 rounded text-left max-w-2xl w-full">
            <summary className="cursor-pointer text-sm text-gray-600 mb-2">
              에러 상세 정보 (개발 환경)
            </summary>
            <pre className="text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </Container>
  )
}
