'use client'

import { DynamicErrorPage } from '@/components/error'

/**
 * 글로벌 에러 페이지
 * 
 * Next.js App Router의 최상위 Error Boundary입니다.
 * 모든 에러를 최종적으로 처리하는 최후의 방어선입니다.
 * 에러 타입에 따라 동적으로 다른 UI를 표시합니다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <DynamicErrorPage error={error} onReset={reset} />
      </body>
    </html>
  )
}
