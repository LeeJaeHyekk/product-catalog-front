/**
 * 품절 배지 컴포넌트
 * 
 * 디자인 시스템에 맞춘 품절 표시
 * 현재는 ProductCard 내부에서 오버레이로 처리되므로 사용되지 않을 수 있음
 */
export function SoldOutBadge() {
  return (
    <div 
      className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-semibold z-20"
      aria-label="품절"
      role="status"
    >
      품절
    </div>
  )
}
