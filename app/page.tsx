import { Container, BackgroundImage } from '@/components/layout'
import { Button, TrustCard } from '@/components/ui'

export default function Home() {
  return (
    <BackgroundImage
      imagePath="/mainPage/HeroImage.png"
      overlayType="dark"
      brandOverlayOpacity={10}
      fixed={false}
    >
      <div className="min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center px-4 py-12 md:py-16 lg:py-20">
            {/* 메인 타이틀 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 md:mb-10 lg:mb-12 drop-shadow-lg leading-tight">
              매장에서 시작되는<br className="md:hidden" />
              <span className="block md:inline"> </span>오늘의 밥상
            </h1>

            {/* 서브 카피 */}
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-10 md:mb-14 lg:mb-16 max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4">
              척척밥상 매장에서 직접 선별한 신선한 식자재를<br className="hidden sm:block" />
              공동구매로 합리적으로 담아보세요.
            </p>

            {/* CTA 버튼 */}
            <div className="flex justify-center items-center mb-16 md:mb-20 lg:mb-24">
              <Button href="/products" asLink variant="primary" size="lg">
                공동구매 참여하기
              </Button>
            </div>

            {/* 신뢰 요소 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              <TrustCard title="신선함 척척" description="산지 신선 과일 & 먹거리" />
              <TrustCard title="24시간" description="언제나 열려 있는 쇼핑" />
              <TrustCard title="함께 성장" description="지속 성장 & 신뢰 시스템" />
            </div>
          </div>
        </Container>
      </div>
    </BackgroundImage>
  )
}
