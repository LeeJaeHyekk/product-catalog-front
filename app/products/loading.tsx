import { Container } from '@/components/layout/Container'
import { ProductGridSkeleton } from '@/components/product/ProductGridSkeleton'

/**
 * 상품 목록 페이지 로딩 상태
 * 
 * Next.js의 loading.tsx는 페이지 레벨 로딩 상태를 처리합니다.
 * Streaming 전략으로 즉시 표시되어 체감 속도를 향상시킵니다.
 */
export default function Loading() {
  return (
    <Container>
      {/* 즉시 렌더링되는 부분 - 사용자가 즉시 화면 구조를 인지 */}
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      
      {/* 페이지 레벨 Skeleton - 체감 속도 향상 */}
      <ProductGridSkeleton />
    </Container>
  )
}

