# 이미지 최적화 전략

## 개요

Next.js Image 컴포넌트의 최적화 전략에 대한 설계 문서입니다.

## 핵심 원칙

### ❌ 피해야 할 것

1. **네트워크/기기 기준 quality 자동 계산**
   ```typescript
   // ❌ 비권장
   const quality = isFastNetwork ? 85 : 65
   <Image quality={quality} />
   ```

2. **랜덤/계산 기반 quality 값**
   ```typescript
   // ❌ 비권장
   const quality = Math.random() * 30 + 70
   ```

3. **완전 동적 품질 조정**

### ✅ 권장 방식

1. **quality는 제한된 enum으로 관리**
2. **size, priority, lazy loading으로 체감 최적화**
3. **디자인 토큰으로 품질 정책 문서화**

## Next.js가 동적 quality를 제한하는 이유

### 1. CDN 캐시 파편화

- 사용자마다 다른 quality → 동일 이미지 URL이 서로 다른 변형 생성
- 캐시 적중률 감소
- CDN 비용 증가

### 2. 빌드/최적화 예측 불가

- Next Image는 빌드 시점 또는 요청 단위로 미리 변형 가능한 품질 집합을 알아야 함
- 동적 quality는 최적화 계획 수립 불가

### 3. 성능 안정성

- 자동 품질은 평균은 좋아 보이지만 최악의 케이스 발생 가능
- 느린 네트워크 + 고화질
- 저사양 기기 + 큰 이미지

## 권장되는 '시스템 친화적 동적 최적화' 방식

### 1. quality는 고정, size를 동적으로

```typescript
<Image
  src={src}
  fill
  quality={75}  // 고정값
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    25vw
  "
/>
```

**효과:**
- 모바일 → 작은 이미지 자동 로드
- 데스크톱 → 큰 이미지 자동 로드
- Next.js가 의도한 '자동 최적화' 방식

### 2. 디바이스/용도별 quality "클래스화"

```typescript
// imageQuality.ts
export const IMAGE_QUALITY = {
  LIST: 75,      // 목록 페이지
  DETAIL: 85,    // 상세 페이지
  HERO: 85,      // 히어로 섹션
} as const
```

**장점:**
- 시스템이 아니라 설계자가 통제
- 캐시 파편화 최소화
- 예측 가능한 성능

### 3. priority / loading 전략으로 체감 품질 제어

```typescript
<Image
  src={src}
  quality={75}
  priority={isAboveTheFold}  // 첫 화면 이미지는 우선 로드
  loading={isAboveTheFold ? 'eager' : 'lazy'}  // 지연 로딩
/>
```

**효과:**
- 실제 사용자 체감 품질 향상
- 품질 값은 고정 유지
- 네트워크 대역폭 효율적 사용

## 프로젝트 적용 전략

### Quality 정책

| 용도 | Quality | 이유 |
|------|---------|------|
| 상품 목록 | 75 | 목록은 여러 이미지가 동시에 로드되므로 낮은 quality로 빠른 로딩 |
| 상품 상세 | 85 | 상세 페이지는 이미지 품질이 중요 |
| 히어로 섹션 | 85 | 첫 화면 이미지는 품질 중요 |

### Size 전략

```typescript
// 반응형 sizes 설정
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
```

- **모바일 (640px 이하)**: 전체 너비 (100vw)
- **태블릿 (1024px 이하)**: 절반 너비 (50vw)
- **데스크톱**: 1/4 너비 (25vw)

### Priority 전략

```typescript
// 첫 화면에 보이는 이미지만 priority
priority={isAboveTheFold}
```

- **Above the fold**: `priority={true}`, `loading="eager"`
- **Below the fold**: `priority={false}`, `loading="lazy"`

### Lazy Loading 전략

```typescript
loading={isAboveTheFold ? 'eager' : 'lazy'}
```

- 첫 화면 이미지: 즉시 로드
- 스크롤 필요 이미지: 지연 로드

## 구현 예시

### ProductImage 컴포넌트

```typescript
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { IMAGE_QUALITY, IMAGE_SIZES } from '@/lib/constants/image'
import { isOptimizableImage, getImageSrc } from '@/lib/image/optimizer'

interface ProductImageProps {
  src: string | null
  alt: string
  productName: string
  priority?: boolean  // 첫 화면 여부
}

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
  
  if (!imageSrc || imageError) {
    return <ImagePlaceholder />
  }
  
  if (canOptimize) {
    return (
      <div className="relative w-full h-full">
        {imageLoading && <LoadingPlaceholder />}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          sizes={IMAGE_SIZES.RESPONSIVE}
          quality={IMAGE_QUALITY.LIST}  // 고정값
          priority={priority}  // 동적 최적화
          loading={priority ? 'eager' : 'lazy'}  // 동적 최적화
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true)
            setImageLoading(false)
          }}
        />
      </div>
    )
  }
  
  return <FallbackImage src={imageSrc} alt={alt} onError={() => setImageError(true)} />
}
```

## Next.js 설정

### next.config.js

```javascript
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85],  // 허용된 quality 값
  },
}
```

## 성능 최적화 효과

### Before (동적 quality)

- 캐시 적중률: 낮음
- CDN 비용: 높음
- 예측 가능성: 낮음

### After (고정 quality + 동적 size/priority)

- 캐시 적중률: 높음
- CDN 비용: 낮음
- 예측 가능성: 높음
- 체감 성능: 향상 (size, priority 최적화)

## 심사/면접 기준 답변

**질문**: "이미지 최적화를 어떻게 했나요?"

**답변**:
> "Next Image는 캐시 안정성을 위해 quality 값을 제한하도록 설계되어 있어서
> 완전 동적 품질 조정은 피했습니다.
> 대신 sizes, priority, loading 전략으로 디바이스별 최적화를 하고
> 품질 값은 용도별로 명시적으로 관리했습니다."

## 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Image Quality Configuration](https://nextjs.org/docs/app/api-reference/components/image#quality)
- [Next.js Image Sizes Configuration](https://nextjs.org/docs/app/api-reference/components/image#sizes)
