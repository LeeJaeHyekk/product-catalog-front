import { Container, BackgroundImage } from '@/components/layout'
import { Button, TrustCard } from '@/components/ui'

export default function Home() {
  return (
    <BackgroundImage
      imagePath="/HeroImage.png"
      overlayType="dark"
      brandOverlayOpacity={10}
      fixed={false}
    >
      <div className="min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center px-4 py-16">
            {/* 메인 타이틀 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              신선한 식자재
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 drop-shadow-lg">
              공동구매로 더 합리적으로
            </h2>

            {/* 서브 타이틀 */}
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md">
              실제 매장에서 바로 가져온 신선한 농산물과 식자재를
              <br className="hidden md:block" />
              공동구매로 더 저렴하게 만나보세요
            </p>

            {/* CTA 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button href="/products" asLink variant="primary" size="lg">
                공동구매 상품 보기
              </Button>
              <Button href="/products" asLink variant="secondary" size="lg">
                오늘의 특가
              </Button>
            </div>

            {/* 신뢰 요소 */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <TrustCard title="100%" description="실제 매장 물량" />
              <TrustCard title="당일" description="근거리 공급" />
              <TrustCard title="신선" description="농산물 보장" />
            </div>
          </div>
        </Container>
      </div>
    </BackgroundImage>
  )
}
