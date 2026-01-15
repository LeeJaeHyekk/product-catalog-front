# 대용량 상품 UX 전략

## 목차

1. [대용량 데이터의 도전 과제](#대용량-데이터의-도전-과제)
2. [초기 로드 전략](#초기-로드-전략)
3. [스크롤 전략](#스크롤-전략)
4. [리스트 안정성](#리스트-안정성)
5. [성능 우선 원칙](#성능-우선-원칙)
6. [가상화 (Virtualization)](#가상화-virtualization)
7. [캐싱 전략](#캐싱-전략)

---

## 대용량 데이터의 도전 과제

### 문제 상황

"대용량 상품 데이터(수천 개 이상)가 들어와도 이 구조가 맞나요?"

### 핵심 도전 과제

1. **초기 로드 시간**: 모든 상품을 한 번에 로드하면 느림
2. **메모리 사용량**: 수천 개의 DOM 노드 렌더링 부담
3. **스크롤 성능**: 많은 요소가 있을 때 스크롤 지연
4. **레이아웃 안정성**: 동적 로딩 시 레이아웃 시프트 발생

### 디자인 원칙

> **"사용자는 빠른 초기 로딩과 부드러운 스크롤을 기대한다"**

---

## 초기 로드 전략

### 기본 노출 제한

- **초기 로드**: N개 상품만 노출 (예: 20개)
- **나머지**: 지연 로딩 (Lazy Loading)
- **사용자 경험**: 즉시 화면 표시, 나머지는 백그라운드 로드

### 구현 예시

```tsx
// 초기 로드: 20개만 표시
const INITIAL_LOAD_COUNT = 20

export function ProductGrid({ products }: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD_COUNT)
  const displayedProducts = products.slice(0, displayCount)
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedProducts.map((product, idx) => (
          <ProductCard key={createProductKey(product, idx)} product={product} />
        ))}
      </div>
      
      {/* 더 보기 버튼 또는 Infinite Scroll */}
      {displayCount < products.length && (
        <LoadMoreButton
          onClick={() => setDisplayCount(prev => prev + INITIAL_LOAD_COUNT)}
        />
      )}
    </>
  )
}
```

### 페이지네이션 vs Infinite Scroll

| 방식 | 장점 | 단점 | 추천 상황 |
|------|------|------|----------|
| **페이지네이션** | 명확한 위치, SEO 친화적 | 클릭 필요, 페이지 전환 | 검색 결과, 필터링 결과 |
| **Infinite Scroll** | 자연스러운 탐색, 빠른 로딩 | 스크롤 위치 복구 어려움 | 피드, 상품 목록 |

### 추천: 하이브리드 방식

```tsx
// 초기: 페이지네이션
// 이후: Infinite Scroll
export function ProductGrid({ products }: ProductGridProps) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 20
  
  const displayedProducts = products.slice(0, page * itemsPerPage)
  const hasMore = displayedProducts.length < products.length
  
  // Infinite Scroll 트리거
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000
        && hasMore
      ) {
        setPage(prev => prev + 1)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore])
  
  return (
    <>
      <div className="grid ...">
        {displayedProducts.map((product, idx) => (
          <ProductCard key={createProductKey(product, idx)} product={product} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </>
  )
}
```

---

## 스크롤 전략

### Infinite Scroll 구현

#### 장점
- 자연스러운 탐색 경험
- 빠른 연속 로딩
- 모바일 친화적

#### 단점
- 스크롤 위치 복구 어려움
- Footer 접근 어려움
- 메모리 누수 가능성

#### 구현 예시

```tsx
import { useEffect, useRef, useState } from 'react'

export function InfiniteScrollProductGrid({ products }: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(20)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Intersection Observer로 감지
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount(prev => Math.min(prev + 20, products.length))
        }
      },
      { threshold: 0.1 }
    )
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [products.length])
  
  const displayedProducts = products.slice(0, displayCount)
  const hasMore = displayCount < products.length
  
  return (
    <>
      <div className="grid ...">
        {displayedProducts.map((product, idx) => (
          <ProductCard key={createProductKey(product, idx)} product={product} />
        ))}
      </div>
      
      {/* 트리거 요소 */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  )
}
```

### Load More 버튼

#### 장점
- 사용자 제어
- 명확한 로딩 상태
- Footer 접근 용이

#### 단점
- 클릭 필요
- 페이지네이션과 유사한 UX

#### 구현 예시

```tsx
export function LoadMoreProductGrid({ products }: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleLoadMore = async () => {
    setIsLoading(true)
    // 시뮬레이션: 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 500))
    setDisplayCount(prev => Math.min(prev + 20, products.length))
    setIsLoading(false)
  }
  
  const displayedProducts = products.slice(0, displayCount)
  const hasMore = displayCount < products.length
  
  return (
    <>
      <div className="grid ...">
        {displayedProducts.map((product, idx) => (
          <ProductCard key={createProductKey(product, idx)} product={product} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </>
  )
}
```

---

## 리스트 안정성

### 레이아웃 시프트 방지 (CLS)

#### 원칙
- **Skeleton 높이 고정**: 실제 콘텐츠와 동일한 높이
- **이미지 영역 고정 비율**: aspect-ratio 유지
- **텍스트 영역 높이 예약**: 최대 높이 고정

#### 구현 예시

```tsx
// 고정 높이 Skeleton 예시
export function ProductSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 이미지: 고정 비율 */}
      <div className="aspect-square bg-gray-200 animate-pulse" />
      
      {/* 텍스트: 고정 높이 */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded" />
        <div className="h-6 bg-gray-200 animate-pulse rounded w-24" />
        <div className="h-2 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  )
}

// ❌ 나쁜 예: 가변 높이
export function BadProductSkeleton() {
  return (
    <div>
      <div className="h-32 bg-gray-200" /> {/* 가변 높이 */}
      <div className="p-4">
        <div className="bg-gray-200" /> {/* 높이 없음 */}
      </div>
    </div>
  )
}
```

### 이미지 로딩 전략

```tsx
// Lazy Loading + Placeholder 예시
<img
  src={image}
  alt={name}
  loading="lazy"
  className="w-full h-full object-cover"
  onLoad={(e) => {
    // 로딩 완료 시 페이드 인
    e.currentTarget.classList.add('opacity-100')
  }}
  onError={(e) => {
    // 에러 시 placeholder 표시
    e.currentTarget.style.display = 'none'
  }}
/>

// Placeholder
<div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
  <span className="text-gray-400 text-sm">이미지 준비중</span>
</div>
```

---

## 성능 우선 원칙

### 렌더링 최적화

#### 중요 정보 우선 렌더링

```tsx
// ✅ 좋은 예: 중요 정보 우선
export function ProductCard({ product }: ProductCardProps) {
  const { name, price, isSoldOut } = product
  
  return (
    <article>
      {/* 가격 (가장 중요) */}
      <p className="text-lg font-semibold">{formatPrice(price)}</p>
      
      {/* 진행률 */}
      {!isSoldOut && <ProgressBar current={current} limit={limit} />}
      
      {/* 상품명 */}
      <h3 className="text-sm">{name}</h3>
      
      {/* 이미지 (Lazy Load) */}
      <img src={image} alt={name} loading="lazy" />
    </article>
  )
}
```

### 메모이제이션

```tsx
import { memo } from 'react'

// 메모이제이션으로 불필요한 리렌더링 방지 예시
export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  // ...
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수
  return (
    prevProps.product.index === nextProps.product.index &&
    prevProps.product.current === nextProps.product.current &&
    prevProps.product.isSoldOut === nextProps.product.isSoldOut
  )
})
```

### 이미지 최적화

```tsx
// ✅ 좋은 예: 적절한 이미지 크기
<img
  src={image}
  srcSet={`
    ${image}?w=400 400w,
    ${image}?w=800 800w,
    ${image}?w=1200 1200w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  alt={name}
  loading="lazy"
/>

// WebP 포맷 사용 예시
<picture>
  <source srcSet={`${image}.webp`} type="image/webp" />
  <img src={image} alt={name} loading="lazy" />
</picture>
```

---

## 가상화 (Virtualization)

### 언제 사용하는가?

- **수천 개 이상의 아이템**: DOM 노드가 너무 많을 때
- **복잡한 렌더링**: 각 아이템이 무거운 컴포넌트일 때
- **스크롤 성능 저하**: 스크롤이 느릴 때

### 라이브러리 추천

- **@tanstack/react-virtual**: 가볍고 유연함
- **react-window**: 성숙한 라이브러리
- **react-virtualized**: 기능이 많지만 무거움

### 구현 예시

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualizedProductGrid({ products }: ProductGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // 각 아이템의 예상 높이
    overscan: 5, // 화면 밖 렌더링 개수
  })
  
  return (
    <div
      ref={parentRef}
      className="h-screen overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const product = products[virtualItem.index]
          
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ProductCard product={product} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### 가상화 사용 시 주의사항

- ✅ **고정 높이**: 각 아이템의 높이가 일정해야 함
- ✅ **그리드 레이아웃**: 가상화와 그리드 조합 시 복잡함
- ⚠️ **SEO**: 가상화된 콘텐츠는 검색 엔진이 인덱싱하기 어려움

---

## 캐싱 전략

### TanStack Query 캐싱

```tsx
// 적절한 캐싱 설정 예시
export function useProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    gcTime: 1000 * 60 * 30,   // 30분간 캐시 유지
  })
}
```

### 페이지네이션 캐싱

```tsx
// ✅ 좋은 예: 페이지별 캐싱
export function useProductsPage(page: number) {
  return useQuery({
    queryKey: ['products', 'page', page],
    queryFn: () => fetchProductsPage(page),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true, // 이전 페이지 데이터 유지
  })
}
```

---

## 성능 측정

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 측정 도구

```tsx
// 성능 측정 예시
import { getCLS, getFID, getLCP } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  // 분석 도구로 전송
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getLCP(sendToAnalytics)
```

---

## 결론

### 대용량 데이터 대응 체크리스트

- [ ] 초기 로드 제한 (20개)
- [ ] Infinite Scroll 또는 Load More 구현
- [ ] Skeleton 높이 고정 (CLS 방지)
- [ ] 이미지 Lazy Loading
- [ ] 중요 정보 우선 렌더링
- [ ] 메모이제이션 적용
- [ ] 가상화 고려 (수천 개 이상 시)
- [ ] 캐싱 전략 수립

### 구현 단계

1. **초기 로드 제한**: 가장 큰 성능 개선
2. **Lazy Loading**: 이미지 로딩 최적화
3. **Skeleton 고정 높이**: CLS 개선
4. **Infinite Scroll**: 사용자 경험 개선
5. **가상화**: 수천 개 이상일 때만 고려

---

## 참고 자료

- [Web.dev 성능 가이드](https://web.dev/performance/)
- [@tanstack/react-virtual](https://tanstack.com/virtual/latest)
- [React 성능 최적화](https://react.dev/learn/render-and-commit)
