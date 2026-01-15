export function SoldOutBadge() {
  return (
    <div 
      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
      aria-label="품절"
      role="status"
    >
      품절
    </div>
  )
}
