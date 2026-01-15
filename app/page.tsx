import Link from 'next/link'
import { Container } from '@/components/layout'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* 배경 이미지 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/HeroImage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 그라데이션 오버레이 - 텍스트 가독성 확보 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        {/* 브랜드 컬러 오버레이 - 신선함 강조 */}
        <div className="absolute inset-0 bg-[#1E7F4F]/10" />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
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
              <Link
                href="/products"
                className="bg-[#1E7F4F] hover:bg-[#2E9F6B] text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                공동구매 상품 보기
              </Link>
              <Link
                href="/products"
                className="bg-white/90 hover:bg-white text-[#1E7F4F] font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                오늘의 특가
              </Link>
            </div>

            {/* 신뢰 요소 */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-white/90 text-sm">실제 매장 물량</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">당일</div>
                <div className="text-white/90 text-sm">근거리 공급</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">신선</div>
                <div className="text-white/90 text-sm">농산물 보장</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
