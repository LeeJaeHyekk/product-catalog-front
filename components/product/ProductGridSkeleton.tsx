import { SKELETON_COUNT, STYLES } from '@/lib'
import { ProductSkeleton } from './ProductSkeleton'

/**
 * 상품 그리드 Skeleton 컴포넌트
 * 
 * 페이지 레벨에서 사용하여 체감 렌더링 시간을 최소화합니다.
 * 실제 상품 카드와 동일한 레이아웃을 유지하여 CLS를 방지합니다.
 */
export function ProductGridSkeleton() {
  // 실제 상품 개수(50개)와 유사하게 표시하여 체감 속도 향상
  
  return (
    <div className={STYLES.grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  )
}
