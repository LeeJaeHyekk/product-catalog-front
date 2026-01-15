import { Suspense } from 'react'
import { Container } from '@/components/layout'
import { ProductGridSkeleton, ProductsListServer } from '@/components/product'

/**
 * 상품 목록 페이지
 * 
 * Streaming + Suspense 전략:
 * - Container와 제목은 즉시 렌더링 (체감 속도 향상)
 * - 상품 목록만 Suspense로 감싸서 스트리밍
 * - Skeleton을 페이지 레벨로 끌어올려 즉시 표시
 * 
 * 효과:
 * - 실제 서버 렌더 시간은 유지 (API 지연 1~5초)
 * - 체감 렌더링 시간 최소화 (즉시 Skeleton 표시)
 */
export default function ProductsPage() {
  return (
    <Container>
      {/* 즉시 렌더링되는 부분 - 사용자가 즉시 화면 구조를 인지 */}
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      
      {/* Suspense boundary - 상품 목록만 스트리밍 */}
      <section aria-labelledby="products-heading">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsListServer />
        </Suspense>
      </section>
    </Container>
  )
}
