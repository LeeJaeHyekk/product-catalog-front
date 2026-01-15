import { Spinner } from './Spinner'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">상품을 불러오는 중...</p>
      </div>
    </div>
  )
}
