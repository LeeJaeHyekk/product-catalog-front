import type { ReactNode } from 'react'
import { COLORS } from '@/lib/constants'

interface BackgroundImageProps {
  /** 배경 이미지 경로 */
  imagePath: string
  /** 오버레이 타입: 'dark' (어두운 오버레이) 또는 'light' (밝은 오버레이) */
  overlayType: 'dark' | 'light'
  /** 브랜드 컬러 오버레이 투명도 (기본값: 10) */
  brandOverlayOpacity?: number
  /** 배경 고정 여부 (기본값: false) */
  fixed?: boolean
  /** 자식 요소 */
  children: ReactNode
}

/**
 * 배경 이미지 컴포넌트
 * 
 * 페이지 배경 이미지와 오버레이를 통합 관리
 * - 메인 페이지: 어두운 오버레이 (텍스트 가독성)
 * - 프로덕트 페이지: 밝은 오버레이 (상품 카드 가독성)
 */
export function BackgroundImage({
  imagePath,
  overlayType,
  brandOverlayOpacity = 10,
  fixed = false,
  children,
}: BackgroundImageProps) {
  const overlayClasses = overlayType === 'dark'
    ? 'bg-gradient-to-b from-black/60 via-black/40 to-black/70'
    : 'bg-gradient-to-b from-white/50 via-white/55 to-white/50'

  return (
    <div className="relative min-h-screen">
      {/* 배경 이미지 */}
      <div
        className={`${fixed ? 'fixed' : 'absolute'} inset-0 z-0`}
        style={{
          backgroundImage: `url(${imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          ...(fixed && { backgroundAttachment: 'fixed' }),
        }}
      >
        {/* 그라데이션 오버레이 */}
        <div className={`absolute inset-0 ${overlayClasses}`} />
        {/* 브랜드 컬러 오버레이 */}
        <div className={`absolute inset-0 ${COLORS.primary.bgWithOpacity(brandOverlayOpacity)}`} />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}
