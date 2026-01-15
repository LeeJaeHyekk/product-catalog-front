export function ProductSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="image-placeholder aspect-square bg-gray-200 animate-pulse rounded" />
      <div className="text-line h-4 bg-gray-200 animate-pulse rounded mt-2" />
      <div className="text-line short h-4 bg-gray-200 animate-pulse rounded mt-1 w-2/3" />
    </div>
  )
}
