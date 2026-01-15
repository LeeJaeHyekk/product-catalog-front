import { AppError } from '@/lib/errors'

interface ErrorMessageProps {
  error: Error
  defaultMessage?: string
}

/**
 * 에러 메시지 컴포넌트
 * 
 * 에러 타입에 따라 적절한 메시지를 표시합니다.
 */
export function ErrorMessage({ error, defaultMessage = '오류가 발생했습니다.' }: ErrorMessageProps) {
  if (error instanceof AppError) {
    return <p className="text-gray-600">{error.message}</p>
  }

  return <p className="text-gray-600">{defaultMessage}</p>
}
