# Hydration Error 해결 가이드

## 원인 분석

### 1. 서버-클라이언트 데이터 불일치

**증상:**
```
Hydration failed because the server rendered text didn't match the client.
```

**원인 분석:**

1. **API 응답의 무작위성**
   - API가 무작위 순서로 데이터를 반환
   - 서버 렌더링 시점과 클라이언트 하이드레이션 시점에 다른 데이터 수신
   - `processProducts`로 정렬하지만, 입력 데이터 자체가 다르면 결과도 다름

2. **TanStack Query의 서버/클라이언트 캐싱 차이**
   - 서버에서 `useSuspenseQuery`로 데이터 fetch
   - 클라이언트에서 하이드레이션 시 다른 캐시 상태
   - 서버와 클라이언트의 QueryClient 인스턴스가 분리됨

3. **Suspense 경계**
   - 서버 컴포넌트에서 Suspense 사용
   - 클라이언트 컴포넌트에서 동일한 Suspense 사용
   - 서로 다른 시점에 데이터를 받아서 불일치 발생

## 해결 방법

### 방법 1: 서버 컴포넌트에서 데이터 가져오기 (권장)

서버에서 데이터를 가져와서 클라이언트 컴포넌트에 props로 전달합니다.

**장점:**
- 서버와 클라이언트가 동일한 데이터 사용
- SEO 최적화
- 초기 로딩 성능 향상

**구현:**
```tsx
// app/products/page.tsx (서버 컴포넌트)
import { fetchProducts } from '@/lib/api'
import { processProducts } from '@/lib/product'
import { ProductGrid } from '@/components/product/ProductGrid'

export default async function ProductsPage() {
  const products = await fetchProducts()
  const processedProducts = processProducts(products)
  
  return (
    <Container>
      <h1>상품 목록</h1>
      <ProductGrid products={processedProducts} />
    </Container>
  )
}
```

### 방법 2: 클라이언트 전용 렌더링

모든 데이터 fetching을 클라이언트에서만 수행합니다.

**장점:**
- 서버-클라이언트 불일치 완전 제거
- 구현 단순

**단점:**
- SEO 최적화 불가
- 초기 로딩 시간 증가

**구현:**
```tsx
// app/products/page.tsx
'use client'

export default function ProductsPage() {
  return (
    <Container>
      <h1>상품 목록</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListClient />
      </Suspense>
    </Container>
  )
}
```

### 방법 3: suppressHydrationWarning (임시방편)

**주의:** 이 방법은 근본적인 해결책이 아닙니다.

```tsx
<div suppressHydrationWarning>
  {/* content */}
</div>
```

## 현재 프로젝트 적용

현재 프로젝트에서는 **방법 1 (서버 컴포넌트에서 데이터 가져오기)**을 적용합니다.

### 변경 사항

1. `app/products/page.tsx`: 서버 컴포넌트로 변경, 데이터 fetching 추가
2. `components/product/ProductListClient.tsx`: 제거 또는 선택적 사용
3. `hooks/useProducts.ts`: 클라이언트 전용 hook으로 유지 (필요시 사용)

## 예방 방법

1. **서버와 클라이언트에서 동일한 데이터 소스 사용**
2. **서버 컴포넌트에서 데이터 fetching 우선**
3. **클라이언트 컴포넌트는 props로 데이터 받기**
4. **동적 데이터는 클라이언트 전용으로 처리**

## 참고 자료

- [Next.js Hydration Error](https://nextjs.org/docs/messages/react-hydration-error)
- [TanStack Query SSR Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
