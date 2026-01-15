import { COLORS } from '@/lib/constants'

interface EmptyStateProps {
  title?: string
  message: string
  subMessage?: string
}

export function EmptyState({ title, message, subMessage }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-12">
      {title && (
        <h3 className={`text-lg md:text-xl font-semibold mb-2 ${COLORS.text.primaryClass}`}>
          {title}
        </h3>
      )}
      <p className={`text-base ${COLORS.text.secondaryClass}`}>{message}</p>
      {subMessage && (
        <p className={`text-sm ${COLORS.text.tertiaryClass} mt-2`}>{subMessage}</p>
      )}
    </div>
  )
}
