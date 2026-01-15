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
    <div className="relative min-h-screen">
      {/* 배경 이미지 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/ProductPageImage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* 그라데이션 오버레이 - 상품 카드 가독성 확보 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/90 to-white/85" />
        {/* 브랜드 컬러 미묘한 틴트 */}
        <div className="absolute inset-0 bg-[#1E7F4F]/5" />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-10 min-h-screen">
        <Container>
          {/* 헤더 섹션 */}
          <div className="pt-8 pb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-[#1F2933]">
              상품 목록
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280]">
              신선한 식자재를 공동구매로 더 합리적으로
            </p>
          </div>

          {/* Suspense boundary - 상품 목록만 스트리밍 */}
          <section aria-labelledby="products-heading" className="pb-12">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsListServer />
            </Suspense>
          </section>
        </Container>
      </div>
    </div>
  )
}
