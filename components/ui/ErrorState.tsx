import { COLORS } from '@/lib/constants'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message: string
  subMessage?: string
  onRetry?: () => void
}

export function ErrorState({ 
  title = '문제가 발생했습니다', 
  message, 
  subMessage,
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="error-state text-center py-12">
      <h2 className={`text-xl md:text-2xl font-bold mb-4 ${COLORS.text.primaryClass}`}>
        {title}
      </h2>
      <p className={`text-base ${COLORS.text.secondaryClass} mb-4`}>{message}</p>
      {subMessage && (
        <p className={`text-sm ${COLORS.text.tertiaryClass} mb-4`}>{subMessage}</p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="md">
          다시 시도
        </Button>
      )}
    </div>
  )
}
