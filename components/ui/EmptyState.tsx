interface EmptyStateProps {
  title?: string
  message: string
  subMessage?: string
}

export function EmptyState({ title, message, subMessage }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-12">
      {title && (
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#1F2933]">
          {title}
        </h3>
      )}
      <p className="text-base text-[#6B7280]">{message}</p>
      {subMessage && (
        <p className="text-sm text-[#9CA3AF] mt-2">{subMessage}</p>
      )}
    </div>
  )
}
