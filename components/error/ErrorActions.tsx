interface ErrorActionsProps {
  onRetry?: () => void
  onReload?: () => void
}

/**
 * 에러 액션 컴포넌트
 * 
 * 에러 발생 시 사용자가 취할 수 있는 액션을 제공합니다.
 */
export function ErrorActions({ onRetry, onReload }: ErrorActionsProps) {
  return (
    <div className="flex gap-3 justify-center">
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      )}
      
      {onReload && (
        <button
          onClick={onReload}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          페이지 새로고침
        </button>
      )}
      
      {!onRetry && !onReload && (
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          페이지 새로고침
        </button>
      )}
    </div>
  )
}
