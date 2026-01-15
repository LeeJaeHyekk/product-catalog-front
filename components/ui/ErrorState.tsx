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
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-gray-500 mb-4">{message}</p>
      {subMessage && (
        <p className="text-gray-400 text-sm mb-4">{subMessage}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
