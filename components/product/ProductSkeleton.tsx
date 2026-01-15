import { STYLES } from '@/lib/styles'

/**
 * 상품 카드 Skeleton 컴포넌트
 * 
 * 실제 카드와 동일한 레이아웃을 유지하여 CLS 방지
 */
export function ProductSkeleton() {
  return (
    <div className={STYLES.skeletonCard}>
      {/* 이미지 영역 - 고정 비율 */}
      <div className={STYLES.skeletonImage} />
      
      {/* 상품 정보 영역 */}
      <div className="p-4 space-y-2">
        {/* 상품명 */}
        <div className={STYLES.skeletonText} />
        
        {/* 가격 */}
        <div className="h-6 bg-gray-200 animate-pulse rounded w-24" />
        
        {/* 진행률 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse mb-2" />
        
        {/* 수량 정보 */}
        <div className="h-3 bg-gray-200 animate-pulse rounded w-32" />
        
        {/* 버튼 */}
        <div className="h-10 bg-gray-200 animate-pulse rounded mt-2" />
      </div>
    </div>
  )
}
