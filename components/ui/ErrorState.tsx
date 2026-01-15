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
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#1F2933]">
        {title}
      </h2>
      <p className="text-base text-[#6B7280] mb-4">{message}</p>
      {subMessage && (
        <p className="text-sm text-[#9CA3AF] mb-4">{subMessage}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[#1E7F4F] text-white px-6 py-2 rounded font-semibold hover:bg-[#2E9F6B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E7F4F] focus:ring-offset-2 min-h-[44px]"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
