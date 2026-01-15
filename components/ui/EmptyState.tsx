interface EmptyStateProps {
  title?: string
  message: string
  subMessage?: string
}

export function EmptyState({ title, message, subMessage }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-12">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <p className="text-gray-500">{message}</p>
      {subMessage && (
        <p className="text-gray-400 text-sm mt-2">{subMessage}</p>
      )}
    </div>
  )
}
