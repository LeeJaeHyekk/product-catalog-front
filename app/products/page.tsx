import { Suspense } from 'react'
import { Container, BackgroundImage, PageHeader } from '@/components/layout'
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
    <BackgroundImage
      imagePath="/mainPage/HeroImage.png"
      overlayType="light"
      brandOverlayOpacity={8}
      fixed={true}
    >
      <Container>
        {/* 헤더 섹션 */}
        <PageHeader
          title="상품 목록"
          description="신선한 식자재를 공동구매로 더 합리적으로"
          showBrandLine={true}
          textColor="dark"
        />

        {/* 검색 및 필터 섹션과 상품 리스트가 분리된 구조 */}
        <div className="space-y-6">
          {/* 상품 리스트 섹션 - 반투명 레이어로 분리 */}
          <section 
            aria-labelledby="products-heading" 
            className="bg-white/35 md:bg-white/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border border-white/20 md:border-white/15"
          >
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductsListServer />
            </Suspense>
          </section>
        </div>
      </Container>
    </BackgroundImage>
  )
}
