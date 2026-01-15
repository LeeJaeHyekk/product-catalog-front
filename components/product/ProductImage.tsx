'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { STYLES, isOptimizableImage, getImageSrc, IMAGE_QUALITY, IMAGE_SIZES } from '@/lib'

interface ProductImageProps {
  src: string | null
  alt: string
  productName: string
  /**
   * 첫 화면에 보이는 이미지 여부
   * true인 경우 priority 로딩 및 eager loading 적용
   */
  priority?: boolean
}

/**
 * 최적화된 상품 이미지 컴포넌트
 * 
 * Next.js Image 최적화 전략:
 * - quality는 고정값 사용 (캐시 안정성)
 * - size는 반응형으로 자동 조절 (디바이스별 최적화)
 * - priority와 loading으로 체감 성능 최적화
 * 
 * @see docs/optimization/image-optimization-strategy.md
 */
export function ProductImage({ 
  src, 
  alt, 
  productName,
  priority = false 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const imageSrc = getImageSrc(src)
  const canOptimize = imageSrc && isOptimizableImage(imageSrc)

  // src가 변경되면 state 리셋
  useEffect(() => {
    setImageError(false)
    setImageLoading(true)
  }, [src])
  
  // 이미지가 없거나 에러 발생 시 placeholder 표시
  if (!imageSrc || imageError) {
    return (
      <div 
        className={STYLES.imagePlaceholder}
        aria-label="이미지 준비중"
      >
        이미지 준비중
      </div>
    )
  }
  
  // Next.js Image 컴포넌트 사용 (최적화)
  if (canOptimize) {
    return (
      <div className="relative w-full h-full">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          sizes={IMAGE_SIZES.RESPONSIVE}
          quality={IMAGE_QUALITY.LIST}  // 고정값: 목록용 quality
          priority={priority}  // 첫 화면 이미지는 우선 로드
          loading={priority ? 'eager' : 'lazy'}  // 동적 loading 전략
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true)
            setImageLoading(false)
          }}
        />
      </div>
    )
  }
  
  // 최적화 불가능한 이미지는 일반 img 태그 사용
  return (
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-cover"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setImageError(true)}
    />
  )
}
