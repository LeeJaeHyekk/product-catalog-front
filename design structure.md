# 상품 목록 UI 설계서

## 1. 문서 목적

본 문서는 **무작위 순서로 전달되는 상품 응답 데이터**를 기반으로, 사용자 경험(UX)을 고려한 상품 목록 UI를 설계하기 위한 기술 설계서이다.
Next.js + TypeScript 환경에서 **정렬, 품절 처리, 로딩 지연 대응, 반응형 UI**를 안정적으로 구현하는 것을 목표로 한다.

---




## 2. 요구사항 요약


### 2.0 데이터 목록 
https://api.zeri.pics


### 2.1 응답 데이터 스펙

| 필드명     | 타입            | 설명                  |
| ------- | ------------- | ------------------- |
| index   | number        | 상품 노출 순서 (0 ~ 49)   |
| name    | string        | 상품명                 |
| price   | number        | 상품 가격               |
| current | number        | 현재까지 주문된 수량         |
| limit   | number        | 최대 제공 가능 수량         |
| image   | string | null | 상품 대표 이미지 (항상 null) |

---

### 2.2 기능 요구사항

1. 상품 데이터는 무작위 순서로 내려오며, **index 기준 오름차순(0~49)** 으로 노출되어야 한다.
2. `image` 값은 null이지만, **이미지가 차지할 레이아웃 공간은 항상 확보**되어야 한다.
3. **품절 상품(current >= limit)** 은 index와 관계없이 **목록 최하단**에 위치해야 하며,

   * 품절되지 않은 상품들의 index 순서는 유지되어야 한다.
   * 품절 상태임을 사용자가 즉시 인지할 수 있어야 한다.
4. API 응답에는 **1~5초 사이의 랜덤 지연**이 존재하며, 해당 시간 동안 UX를 고려한 처리가 필요하다.
5. **TypeScript / Next.js 사용은 필수**, 그 외 기술 스택은 자유.
6. **PC / Mobile 반응형 UI**를 필수로 제공한다.

---

## 3. 설계 핵심 원칙

### 3.1 책임 분리 원칙 (Separation of Concerns)

* **데이터 가공 로직과 UI 렌더링 로직을 명확히 분리**한다.
* 정렬, 품절 판별, 재배치 로직은 UI 컴포넌트 외부에서 처리한다.

### 3.2 파생 상태는 계산으로 관리

* `isSoldOut` 과 같은 상태는 서버 응답에 의존하지 않고
  `current >= limit` 조건으로 계산한다.

### 3.3 UX 우선 설계

* 로딩 중에도 화면 구조가 유지되어야 한다.
* 이미지 유무와 관계없이 카드 크기는 동일해야 한다.
* 품절 상품은 시각적으로 즉시 구분 가능해야 한다.

### 3.4 ESM 모듈 시스템 및 함수형 설계 원칙

**ESM (ECMAScript Modules) 문법 고수:**

* 프로젝트 전체에서 **ESM 문법을 일관되게 사용**한다.
* `import`/`export` 문법으로 모듈 시스템 구성
* CommonJS (`require`/`module.exports`) 사용 금지
* 동적 import는 `import()` 함수 사용

**함수형 설계 원칙:**

* **함수 형태로의 설계를 기준**으로 한다.
* 클래스 기반 설계 지양, 함수형 컴포넌트 및 순수 함수 우선
* 부수 효과(side effect) 최소화
* 불변성(immutability) 유지

**구현 예시:**

```ts
// ✅ 권장: ESM + 함수형
// lib/product.ts
export function processProducts(products: Product[]): ProcessedProduct[] {
  // 순수 함수로 구현
  const mapped = products.map(p => ({
    ...p,
    isSoldOut: p.current >= p.limit,
  }))
  // ...
}

// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'
import { processProducts } from '@/lib/product'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: processProducts,
    suspense: true,
  })
}

// ❌ 지양: CommonJS
// const { processProducts } = require('./product')
// module.exports = { useProducts }
```

**설계 원칙:**

| 원칙 | 설명 | 예시 |
|------|------|------|
| **ESM 일관성** | 모든 모듈에서 `import`/`export` 사용 | `export function`, `import type` |
| **함수 우선** | 클래스 대신 함수로 구현 | `function Component()` vs `class Component` |
| **순수 함수** | 부수 효과 없는 함수 작성 | `processProducts()` - 입력에 따라 동일한 출력 |
| **불변성** | 원본 데이터 변경 지양 | `[...array]`, `{...object}` 사용 |
| **함수형 컴포넌트** | React 컴포넌트는 함수형으로 작성 | `function ProductCard()` |

**설정 파일 예시:**

```json
// package.json
{
  "type": "module",  // ESM 모듈 시스템 활성화
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
```

```ts
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",  // ESM 모듈 시스템
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

**장점:**

* ✅ 모던 JavaScript 표준 준수
* ✅ 트리 쉐이킹 최적화 용이
* ✅ 정적 분석 및 타입 체크 용이
* ✅ 함수형 프로그래밍으로 테스트 용이
* ✅ 부수 효과 최소화로 버그 감소

---

## 4. 전체 아키텍처 개요

```
API Response (https://api.zeri.pics)
   ↓
TanStack Query (Data Fetching + Caching)
   ↓
select: processProducts (데이터 가공)
   ↓
ProcessedProduct[] (정렬 완료 + 품절 분리)
   ↓
UI Rendering Layer (Suspense + Skeleton)
   ↓
ProductGrid → ProductCard
```

### 4.1 데이터 흐름 상세

1. **API 호출** (`lib/api.ts`)
   * `fetchProducts()` 함수로 원본 데이터 가져오기

2. **TanStack Query** (`hooks/useProducts.ts`)
   * 자동 로딩/에러/캐싱 관리
   * `select` 옵션으로 데이터 가공

3. **데이터 가공** (`lib/product.ts`)
   * `processProducts()` 함수로 정렬 및 품절 분리
   * 순수 함수로 구현 → 테스트 용이

4. **UI 렌더링** (`components/product/`)
   * Suspense로 로딩 상태 처리
   * Skeleton UI로 사용자 경험 개선

---

## 5. 폴더 구조 설계

```
app/
 └─ products/
    ├─ page.tsx            # 상품 목록 페이지
    ├─ loading.tsx         # Suspense 로딩 UI
    └─ error.tsx           # 에러 처리

components/
 ├─ product/
 │   ├─ ProductGrid.tsx
 │   ├─ ProductCard.tsx
 │   ├─ ProductSkeleton.tsx
 │   └─ SoldOutBadge.tsx
 └─ layout/
     └─ Container.tsx      # 반응형 컨테이너

hooks/
 └─ useProducts.ts         # TanStack Query 기반 데이터 fetching & 가공

lib/
 ├─ api.ts                 # API 호출
 ├─ product.ts             # 정렬/품절 처리 로직 (비즈니스 로직 전부)
 └─ types.ts               # 타입 정의

styles/
 └─ product.css (or tailwind)  # 상품 관련 스타일
```

### 5.1 폴더 구조 설계 원칙

* **ESM 모듈 시스템 일관성**
  * 모든 파일에서 `import`/`export` 문법 사용
  * CommonJS (`require`/`module.exports`) 사용 금지

* **함수형 설계 기준**
  * 모든 컴포넌트와 유틸리티는 함수 형태로 구현
  * 클래스 기반 설계 지양
  * 순수 함수 우선, 부수 효과 최소화

* **`lib/product.ts`에 비즈니스 로직을 전부 몰아넣음**
  * UI 컴포넌트는 "받은 데이터 그대로 렌더"만 담당
  * 정렬, 필터링, 품절 판별 등 모든 데이터 가공은 `lib/product.ts`에서 처리
  * 단일 책임 원칙 준수로 테스트 용이성 확보

---

## 6. 데이터 설계

### 6.1 타입 정의

```ts
// lib/types.ts
export interface Product {
  index: number;   // 0 ~ 49
  name: string;
  price: number;
  current: number; // 현재까지 주문된 수량
  limit: number;   // 최대 제공 가능 수량
  image: string | null; // 항상 null (레이아웃 공간은 확보)
}

export interface ProcessedProduct extends Product {
  isSoldOut: boolean; // 파생 상태 (계산 결과)
}
```

**타입 설계 원칙:**

* `isSoldOut`은 서버 응답에 포함되지 않음 → 클라이언트에서 계산
* 파생 상태를 명시적으로 타입으로 정의 → 타입 안전성 확보
* `ProcessedProduct`는 `Product`를 확장 → 기존 필드 유지

---

### 6.2 품절 판별 기준

```
isSoldOut = current >= limit
```

**판별 로직:**

* `current >= limit` 조건으로 품절 여부 판단
* 서버 응답에 의존하지 않고 클라이언트에서 계산
* UI 컴포넌트마다 중복 계산 방지 (한 번만 계산 후 재사용)

---

## 7. 데이터 가공 로직 설계 (핵심)

### 7.1 처리 절차

1. 전체 상품 목록에 대해 `isSoldOut` 계산
2. 품절되지 않은 상품 필터링
3. 품절되지 않은 상품을 index 기준 오름차순 정렬
4. 품절 상품 필터링 후 하단에 병합

---

### 7.2 정렬 알고리즘 개념

```
[전체 데이터]
   ↓
[판매중 상품] → index 오름차순 정렬 (Stable Sort)
[품절 상품]   → index 오름차순 정렬 후 하단 배치 (Stable Sort)
```

**Stable Sort 보장:**

정렬 시 **안정 정렬(stable sort)**을 전제로 하여
기존 index 순서를 보존한다.

* JavaScript의 `Array.sort()`는 현대 엔진에서 **stable sort** 보장
* 동일한 index 값을 가진 경우 기존 순서 유지
* 품절 상품 하단 이동 시에도 index 순서 보존

---

### 7.3 핵심 비즈니스 로직 구현

**요구사항을 정확히 반영한 정렬 규칙**

```ts
// lib/product.ts
import type { Product, ProcessedProduct } from './types'

export function processProducts(products: Product[]): ProcessedProduct[] {
  // 1. isSoldOut 파생 상태 계산
  const mapped = products.map(p => ({
    ...p,
    isSoldOut: p.current >= p.limit,
  }))

  // 2. 판매중 상품 필터링 및 index 오름차순 정렬 (Stable Sort)
  const available = mapped
    .filter(p => !p.isSoldOut)
    .sort((a, b) => a.index - b.index)

  // 3. 품절 상품 필터링 및 index 오름차순 정렬 (Stable Sort, 하단에서도 정렬 유지)
  const soldOut = mapped
    .filter(p => p.isSoldOut)
    .sort((a, b) => a.index - b.index)

  // 4. 판매중 상품 먼저, 품절 상품은 하단에 배치
  return [...available, ...soldOut]
}
```

**순수 함수 설계:**

* **동일 입력 → 동일 출력**: 같은 `products` 배열 입력 시 항상 동일한 결과
* **부수 효과 없음**: 원본 데이터 변경 없이 새 배열 반환
* **메모이제이션 가능**: `useMemo`로 최적화 가능하도록 설계
* **Referential Equality**: 입력이 동일하면 동일한 참조 유지 가능

**📌 설계 의도: 책임 분리 가능성**

`processProducts`는 내부적으로 다음 단계로 구성됩니다:

1. **데이터 정규화** (`normalizeProducts`) - null/undefined 처리, 타입 검증
2. **파생 상태 계산** (`deriveSoldOut`) - `isSoldOut` 계산
3. **정렬** (`sortAvailable`, `sortSoldOut`) - index 기준 정렬
4. **병합** (`mergeSoldOut`) - 판매중 + 품절 상품 병합

**현재는 단일 함수로 구현하되**, 복잡도 증가 시 단계별 함수 분리가 가능하도록 설계합니다.

**확장 예시 (복잡도 증가 시):**

```ts
// lib/product.ts (확장 버전)
function normalizeProducts(products: Product[]): Product[] {
  // 데이터 정규화 로직
}

function deriveSoldOut(products: Product[]): ProcessedProduct[] {
  // 파생 상태 계산
}

function sortAvailable(products: ProcessedProduct[]): ProcessedProduct[] {
  // 판매중 상품 정렬
}

function mergeSoldOut(
  available: ProcessedProduct[],
  soldOut: ProcessedProduct[]
): ProcessedProduct[] {
  // 병합 로직
}

export function processProducts(products: Product[]): ProcessedProduct[] {
  const normalized = normalizeProducts(products)
  const withDerived = deriveSoldOut(normalized)
  const available = sortAvailable(withDerived.filter(p => !p.isSoldOut))
  const soldOut = sortAvailable(withDerived.filter(p => p.isSoldOut))
  return mergeSoldOut(available, soldOut)
}
```

**⚠️ 실무 고려사항:**

현재는 단일 함수로 충분하지만, 실무에서 다음과 같은 경우 함수 분리를 고려합니다:

* 비즈니스 로직이 복잡해질 때
* 각 단계별 테스트가 필요할 때
* 단계별 재사용이 필요할 때

**설계 원칙:** 초기에는 단순하게, 필요 시 분리 가능한 구조 유지

### 7.4 이 구조의 장점

| 항목 | 설명 |
|------|------|
| **index 정렬 유지** | 무작위 응답 데이터도 일관된 순서로 노출 |
| **품절 상품 분리** | 판매중 상품과 명확히 구분 |
| **확장성** | 품절 개수 증가해도 로직 변경 없음 |
| **테스트 가능** | `processProducts` 함수 단위 테스트 용이 |
| **재사용성** | 다른 컴포넌트에서도 동일 로직 사용 가능 |
| **메모이제이션 가능** | 순수 함수 설계로 `useMemo` 최적화 용이 |
| **Stable Sort 보장** | 정렬 시 기존 index 순서 보존 |

---

## 8. 데이터 Fetching 전략 (지연 대응)

### 8.1 기술 스택 선택: TanStack Query (React Query)

**권장 이유:**

* **1~5초 랜덤 지연 자동 처리** → 로딩 / 에러 / 캐싱 자동 관리
* **재시도 로직 내장** → 네트워크 오류 시 자동 재시도
* **Stale 관리** → 데이터 갱신 전략 자동화
* **UX 안정성** → Suspense와 통합하여 안정적인 로딩 상태 관리

### 8.2 useProducts Hook 구현

```ts
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'
import { processProducts } from '@/lib/product'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: processProducts,  // 데이터 가공을 select에서 처리
    suspense: true,           // Suspense 모드 활성화
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    cacheTime: 1000 * 60 * 30, // 30분간 캐시 유지
    refetchOnWindowFocus: true, // 포커스 시 백그라운드 갱신 (stale-while-revalidate)
    retry: 3,                 // 실패 시 3회 재시도
  })
}
```

**Cache 전략 (stale-while-revalidate):**

* **정적 성격의 상품 데이터는 캐시를 적극 활용**하여 불필요한 네트워크 요청을 줄인다.
* **stale-while-revalidate**: 캐시된 데이터를 먼저 보여주고 백그라운드에서 갱신
* **background refetch**: 포커스 시 자동 갱신으로 최신 데이터 유지

### 8.3 데이터 가공 위치: `select` 옵션

**핵심 설계:**

* **데이터 가공을 `select`에서 처리** → 컴포넌트는 가공된 데이터만 받음
* **UI 컴포넌트 단순화** → 비즈니스 로직과 완전 분리
* **캐싱 효율성** → 원본 데이터는 캐시, 가공 데이터는 파생 상태로 관리

**⚠️ 실무 고려사항: `select` + `suspense` 조합의 유연성**

`select` + `suspense` 조합은 실무에서 호불호가 갈리는 패턴입니다.

**장점:**
* 데이터 가공 로직이 한 곳에 집중
* 컴포넌트 레벨에서 비즈니스 로직 제거

**단점:**
* `select` 내부에서 비즈니스 로직 + 예외 처리가 섞임
* Suspense 환경에서 에러 흐름 추적이 어려움
* 디버깅 난이도 상승 가능

**설계 유연성 보장:**

본 설계는 초기에는 TanStack Query의 `select` 옵션을 사용하되, 
비즈니스 로직이 복잡해지거나 에러 처리가 중요해질 경우 
컴포넌트 레벨의 `useMemo` 기반 가공으로 이전 가능하도록 설계합니다.

**대안 구현 (복잡도 증가 시):**

```ts
// hooks/useProducts.ts (대안)
export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    suspense: true,
  })
  
  // 컴포넌트 레벨에서 가공 (에러 추적 용이)
  const processedProducts = useMemo(() => {
    if (!query.data) return undefined
    try {
      return processProducts(query.data)
    } catch (error) {
      // 에러 처리 및 로깅
      console.error('Error processing products:', error)
      throw error
    }
  }, [query.data])
  
  return {
    ...query,
    data: processedProducts,
  }
}
```

**선택 기준:**
* **초기/소규모**: `select` 옵션 사용 (현재 설계)
* **복잡도 증가/대용량**: `useMemo` 기반 가공으로 전환

---

## 9. 로딩 및 지연 응답 UX 설계

### 9.1 문제 정의

* 최대 5초 지연 동안 빈 화면 노출 시 사용자 이탈 가능성 증가
* 로딩 중 레이아웃 변화로 인한 사용자 혼란

### 9.2 해결 전략

* **Skeleton UI 사용** → 실제 카드 형태와 동일한 레이아웃
* **Suspense 기반 로딩 처리** → TanStack Query와 통합
* **실제 상품 카드와 동일한 구조 유지** → 레이아웃 시프트 방지

### 9.3 Skeleton UI 구체적 구현

```tsx
// components/product/ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="image-placeholder aspect-square bg-gray-200 animate-pulse rounded" />
      <div className="text-line h-4 bg-gray-200 animate-pulse rounded mt-2" />
      <div className="text-line short h-4 bg-gray-200 animate-pulse rounded mt-1 w-2/3" />
    </div>
  )
}
```

**Skeleton UI 원칙:**

* ✅ 실제 카드와 동일한 크기 및 레이아웃
* ✅ 이미지 영역, 텍스트 영역 구조 동일
* ✅ 애니메이션으로 로딩 상태 명확히 표시
* ❌ 스피너만 띄우기 금지
* ❌ 빈 화면 노출 금지

**사용자 경험 (체감 성능 최적화):**

* 사용자는 "곧 상품이 뜬다"는 확신을 가짐
* 레이아웃 변화 없이 부드러운 전환
* **실제 로딩 3초 → 체감 로딩 0.5초** (Perceived Performance)
* Skeleton 개수 고정으로 CLS 방지

**핵심 개념:**

> "속도보다 **체감 속도를 줄인다**"

### 9.4 Suspense Fallback 단위 분리

**현재 설계:**

```tsx
// app/products/page.tsx
<Suspense fallback={<ProductSkeleton />}>
  <ProductGrid />
</Suspense>
```

**실무 고려사항:**

Suspense Fallback의 단위가 너무 크면 세밀한 로딩 제어가 어렵습니다.

**권장 개선: Grid Skeleton과 Card Skeleton 분리**

```tsx
// components/product/ProductGridSkeleton.tsx
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  )
}
```

```tsx
// app/products/page.tsx
<Suspense fallback={<ProductGridSkeleton />}>
  <ProductGrid />
</Suspense>
```

**단위 분리의 장점:**

* ✅ Grid 레이아웃과 Card 단위를 독립적으로 관리
* ✅ 재사용성 향상 (다른 페이지에서도 활용 가능)
* ✅ 세밀한 로딩 상태 제어 가능

**설계 원칙:**

초기에는 단일 Skeleton 컴포넌트로 충분하지만, 
복잡도 증가 시 Grid Skeleton과 Card Skeleton을 분리하여 관리합니다.

---

## 10. 이미지 null 대응 설계

### 10.1 핵심 원칙

* **이미지가 없어도 카드 높이는 절대 변하지 않는다**
* **Layout Shift(CLS) 방지** → Core Web Vitals 개선
* **모바일/PC 동일 비율 유지**

### 10.2 구체적 구현 방법

```tsx
// components/product/ProductCard.tsx
<div className="image-wrapper aspect-square bg-gray-100 rounded overflow-hidden">
  {image ? (
    <img 
      src={image} 
      alt={name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      이미지 준비중
    </div>
  )}
</div>
```

**CSS/Tailwind 구현:**

```css
/* Tailwind CSS 기준 */
.image-wrapper {
  aspect-ratio: 1 / 1;  /* 정사각형 비율 고정 */
  background: #f5f5f5;   /* 플레이스홀더 배경색 */
}
```

### 10.3 이 접근의 장점

| 항목 | 효과 |
|------|------|
| **CLS 방지** | 레이아웃 시프트 없음 → Core Web Vitals 개선 |
| **일관된 UX** | 모든 카드 동일한 크기 → 시각적 안정성 |
| **반응형 대응** | aspect-ratio로 자동 조정 |

---

## 11. 품절 상품 UI 설계

### 11.1 시각적 처리 요소 (복합 적용 권장)

품절 상품은 **단일 요소가 아닌 복합적인 시각적 처리**로 명확히 구분해야 합니다.

| 요소 | 구현 방법 | 목적 |
|------|----------|------|
| **회색 처리** | `opacity: 0.5` 또는 `grayscale` 필터 | 전체적인 비활성화 느낌 |
| **SoldOut 배지** | 우측 상단 또는 중앙 배치 | 텍스트로 명확한 상태 표시 |
| **버튼 비활성화** | `disabled` 상태 + 시각적 차별화 | 클릭 불가능함을 명시 |
| **가격 유지** | 가격 정보는 숨기지 않음 | 정보 투명성 유지 |

### 11.2 구체적 구현 예시

```tsx
// components/product/ProductCard.tsx
<ProductCard className={isSoldOut ? 'opacity-50 grayscale' : ''}>
  {isSoldOut && <SoldOutBadge />}
  
  <div className="image-wrapper">
    {/* 이미지 영역 */}
  </div>
  
  <div className="product-info">
    <h3>{name}</h3>
    <p className="price">{price.toLocaleString()}원</p>
    <button 
      disabled={isSoldOut}
      className={isSoldOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}
    >
      {isSoldOut ? '품절' : '구매하기'}
    </button>
  </div>
</ProductCard>
```

```tsx
// components/product/SoldOutBadge.tsx
export function SoldOutBadge() {
  return (
    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
      품절
    </div>
  )
}
```

### 11.3 UX 목표

* **스크롤 중에도 품절 여부 즉시 인지 가능**
* **시각적 차별화로 혼란 최소화**
* **접근성 고려** → 색상뿐만 아니라 텍스트/아이콘으로도 구분

### 11.4 SEO 및 접근성(A11y) 보완

**SEO 최적화:**

```tsx
// app/products/page.tsx
export default function ProductsPage() {
  return (
    <>
      <h1>상품 목록</h1>
      <section aria-labelledby="products-heading">
        <ProductGrid />
      </section>
    </>
  )
}
```

**접근성 개선:**

```tsx
// components/product/ProductCard.tsx
<article 
  className="product-card"
  aria-label={`${name}, ${price.toLocaleString()}원`}
>
  <div className="image-wrapper" aria-hidden="true">
    {image ? (
      <img 
        src={image} 
        alt={name}
        loading="lazy"
      />
    ) : (
      <div aria-label="이미지 준비중" />
    )}
  </div>
  
  <div className="product-info">
    <h2 className="product-name">{name}</h2>
    <p 
      className="price"
      aria-label={`가격 ${price.toLocaleString()}원`}
    >
      {price.toLocaleString()}원
    </p>
    <button 
      disabled={isSoldOut}
      aria-label={isSoldOut ? `${name} - 품절` : `${name} - 구매하기`}
      aria-disabled={isSoldOut}
      className={isSoldOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}
    >
      {isSoldOut ? '품절' : '구매하기'}
    </button>
  </div>
  
  {isSoldOut && (
    <div 
      className="sold-out-badge"
      aria-label="품절"
      role="status"
    >
      품절
    </div>
  )}
</article>
```

**접근성 체크리스트:**

| 항목 | 구현 | 목적 |
|------|------|------|
| **시맨틱 HTML** | `<article>`, `<section>`, `<h1>` 사용 | 스크린 리더 이해도 향상 |
| **ARIA 레이블** | `aria-label`, `aria-labelledby` | 명확한 콘텐츠 설명 |
| **키보드 접근성** | `focus:` 스타일, `tabindex` 관리 | 키보드만으로 탐색 가능 |
| **색상 대비** | WCAG AA 기준 준수 | 시각 장애인 접근성 |
| **상태 표시** | `aria-disabled`, `role="status"` | 상태 변화 명확히 전달 |

---

## 12. 반응형 UI 설계

### 12.1 Grid 기준

| 디바이스   | 컬럼 수  | 브레이크포인트 |
| ------ | ----- | ---------- |
| Mobile | 2     | < 768px    |
| Tablet | 3     | 768px ~ 1024px |
| PC     | 4 ~ 5 | > 1024px   |

### 12.2 구체적 구현

**Tailwind CSS 기준:**

```tsx
// components/product/ProductGrid.tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {products.map(product => (
    <ProductCard key={product.index} product={product} />
  ))}
</div>
```

**CSS Grid 기준:**

```css
.product-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr); /* Mobile 기본 */
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr); /* PC */
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr); /* Large PC */
  }
}
```

### 12.3 공통 원칙

| 원칙 | 구현 방법 | 목적 |
|------|----------|------|
| **카드 비율 유지** | `aspect-ratio` 고정 | 모든 화면 크기에서 일관된 비율 |
| **터치 영역 확보** | 최소 44px × 44px | 모바일 사용성 개선 |
| **Hover → Focus 대응** | `hover:` 및 `focus:` 스타일 | 키보드 접근성 고려 |
| **간격 일관성** | `gap` 속성으로 통일 | 시각적 정돈 |

### 12.4 Container 컴포넌트

```tsx
// components/layout/Container.tsx
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
```

---

## 12.5 대용량 데이터 대응 전략 (확장 설계)

### 12.5.1 문제 정의

현재 설계는 50개 상품 기준으로 최적화되어 있으나, 
실서비스 환경에서는 수천~수만 개의 상품을 처리해야 할 수 있습니다.

**대용량 데이터 시 발생 가능한 문제:**

* 모든 상품을 DOM에 렌더링 → 성능 저하
* 스크롤 시 렌더링 지연
* 메모리 사용량 증가

### 12.5.2 해결 전략: Virtualization (가상 스크롤)

**핵심 원칙:**

* **데이터 가공 로직은 그대로 유지** (`processProducts` 함수 변경 없음)
* **UI 레이어만 교체** → 구조 변경 최소화

**구현 방법:**

```tsx
// components/product/ProductGridVirtual.tsx
'use client'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ProductCard } from './ProductCard'
import type { ProcessedProduct } from '@/lib/types'

interface ProductGridVirtualProps {
  products: ProcessedProduct[]
}

export function ProductGridVirtual({ products }: ProductGridVirtualProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  // 가상 스크롤 설정
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // 카드 예상 높이
    overscan: 5, // 화면 밖 미리 렌더링할 개수
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

### 12.5.3 적용 기준

| 상품 수 | 전략 | 이유 |
|---------|------|------|
| **~100개** | 일반 Grid 렌더링 | Virtualization 오버헤드 불필요 |
| **100~1000개** | Virtualization 고려 | 성능 저하 시작 |
| **1000개 이상** | Virtualization 필수 | 렌더링 성능 필수 |

### 12.5.4 설계의 확장성

**장점:**

* ✅ 기존 `processProducts` 로직 재사용
* ✅ `ProductCard` 컴포넌트 재사용
* ✅ 데이터 가공 로직 변경 없이 UI만 교체
* ✅ 점진적 적용 가능 (상품 수에 따라 조건부 렌더링)

**조건부 적용 예시:**

```tsx
// components/product/ProductGrid.tsx
export function ProductGrid({ products }: { products: ProcessedProduct[] }) {
  const shouldVirtualize = products.length > 100
  
  if (shouldVirtualize) {
    return <ProductGridVirtual products={products} />
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map(product => (
        <ProductCard key={product.index} product={product} />
      ))}
    </div>
  )
}
```

**👉 구조를 바꾸지 않고 대응 가능함을 강조**

---

## 12.6 성능 최적화 전략

### 12.6.1 최적화 설계 철학

**핵심 원칙:**

> "이 설계는 데이터 가공보다 **렌더링 비용을 주요 병목**으로 보고,
> 가상 스크롤·메모이제이션·정렬 책임 분리를 통해
> 데이터 규모에 따라 단계적으로 확장 가능하도록 설계했습니다."

**최적화 우선순위:**

1. **렌더링 최소화** (가장 중요) - DOM 노드 수 감소
2. **파생 상태 계산 최적화** - 불필요한 재계산 방지
3. **정렬 책임 분리** - 데이터 규모에 따른 전략 전환
4. **체감 성능 개선** - 실제 속도보다 체감 속도 향상

---

### 12.6.2 렌더링 최소화 (Virtualized Rendering)

**문제 정의:**

* 상품 수 증가 → DOM 증가 → 렌더링 병목
* 데이터 정렬 자체보다 **렌더링 비용이 압도적**
* 전체 리스트 O(n) → 실제 렌더링 O(visible items)

**알고리즘 개념:**

```
전체 리스트: O(n) - 모든 상품 데이터
↓
가상 스크롤 적용
↓
실제 렌더링: O(visible items) - 화면에 보이는 항목만
```

**구현 전략:**

상품 수가 **수천 개 이상**일 경우,
가상 스크롤을 적용하여 **화면에 보이는 항목만 렌더링**한다.
데이터 가공 로직은 유지하고 **렌더링 레이어만 교체**한다.

**라이브러리 선택:**

* `@tanstack/react-virtual` (권장) - TanStack Query와 통합 용이
* `react-window` - 경량 대안

**👉 대용량 대응의 핵심 알고리즘**

---

### 12.6.3 파생 상태 계산 최적화 (Memoization)

**문제 정의:**

매 렌더마다 다음 계산이 반복됨:
* 품절 여부 계산 (`isSoldOut`)
* 정렬 (`sort`)
* 병합 (`merge`)

**해결 전략: 순수 함수 + 메모이제이션**

**핵심 원칙:**

* **동일 입력 → 동일 출력** (순수 함수)
* **Referential Equality 유지** (메모이제이션)

**구현 예시:**

```ts
// hooks/useProducts.ts
import { useMemo } from 'react'

export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    suspense: true,
  })
  
  // 의도적으로 메모이제이션 가능하게 설계
  const processedProducts = useMemo(
    () => {
      if (!query.data) return undefined
      return processProducts(query.data)
    },
    [query.data] // data가 변경될 때만 재계산
  )
  
  return {
    ...query,
    data: processedProducts,
  }
}
```

**설계 의도:**

* `processProducts`는 **순수 함수**로 설계되어 메모이제이션 가능
* 입력 데이터가 동일하면 동일한 결과 보장
* Referential Equality로 불필요한 재렌더링 방지

**👉 이미 구조는 맞음 - "의도적으로 메모이제이션 가능하게 설계했다"는 점이 중요**

---

### 12.6.4 정렬 알고리즘의 책임 분리

**현재 구현:**

* Client에서 `Array.sort()` (Timsort) 사용
* 평균 시간 복잡도: O(n log n)
* n이 커질수록 비용 증가

**Stable Sort 보장:**

정렬 시 **안정 정렬(stable sort)**을 전제로 하여
기존 index 순서를 보존한다.

**JavaScript의 `Array.sort()` 특성:**

* 현대 JavaScript 엔진은 **stable sort** 보장
* 동일한 값의 경우 기존 순서 유지
* 품절 상품 하단 이동 시에도 index 순서 보존

**데이터 규모에 따른 전략:**

| 데이터 규모 | 전략 | 이유 |
|------------|------|------|
| **소량 (~100개)** | Client sort | 클라이언트에서 충분히 빠름 |
| **중량 (100~1000개)** | Client sort + 메모이제이션 | 메모이제이션으로 재계산 방지 |
| **대량 (1000개 이상)** | Server sort + Pagination | 서버에서 정렬 후 페이지네이션 |

**실무 전략:**

데이터 규모 증가 시 **정렬 책임을 서버로 이전**하여
클라이언트는 렌더링에 집중하도록 설계한다.

**👉 알고리즘을 바꾸는 게 아니라 '책임을 이동'**

---

### 12.6.5 Skeleton UX 최적화 (Perceived Performance)

**핵심 개념:**

> "속도보다 **체감 속도를 줄인다**"

**최적화 전략:**

* **Skeleton 개수 고정** → CLS 방지
* **실제 카드와 동일한 높이** → 레이아웃 시프트 없음
* **실제 로딩 3초 → 체감 로딩 0.5초**

**구현 원칙:**

```tsx
// components/product/ProductGridSkeleton.tsx
export function ProductGridSkeleton() {
  // 고정된 개수로 렌더링 (CLS 방지)
  const skeletonCount = 10
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  )
}
```

**알고리즘 관점:**

* Skeleton은 알고리즘이 아닌 **UX 최적화 핵심**
* 사용자 인지 속도 개선
* 레이아웃 안정성 보장

---

### 12.6.6 확장 대비 최적화 (Debounce/Throttle)

**현재 상태:**

* 필터/검색 기능 없음
* 정렬 옵션 변경 없음

**확장 시 고려사항:**

사용자 입력 기반 상태 변경은 **debounce/throttle**을 적용하여
불필요한 렌더링을 방지한다.

**적용 시나리오:**

| 시나리오 | 최적화 기법 | 이유 |
|---------|------------|------|
| **검색 입력** | Debounce (300ms) | 입력 완료 후 검색 실행 |
| **정렬 옵션 변경** | 즉시 실행 | 사용자 의도 명확 |
| **스크롤 이벤트** | Throttle (100ms) | 스크롤 성능 최적화 |
| **필터 변경** | Debounce (200ms) | 연속 변경 방지 |

**구현 예시 (확장 시):**

```ts
// hooks/useProductFilter.ts (확장 예시)
import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function useProductFilter(products: ProcessedProduct[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products
    return products.filter(p => 
      p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [products, debouncedSearchTerm])
  
  return { filteredProducts, searchTerm, setSearchTerm }
}
```

**👉 언급만 해도 설계 완성도 ↑**

---

### 12.6.7 고급 최적화 전략 (선택)

#### Web Worker (초대용량 한정)

**적용 시나리오:**

* 수만 개 데이터
* 복잡한 가공 로직
* Main Thread → UI 블로킹 방지

**아키텍처:**

```
Main Thread → UI 렌더링
Worker Thread → 데이터 가공
```

**구현 예시 (초대용량 시):**

```ts
// lib/product.worker.ts
self.onmessage = function(e) {
  const { products } = e.data
  const processed = processProducts(products)
  self.postMessage({ processed })
}

// hooks/useProducts.ts (Worker 버전)
const worker = new Worker(new URL('@/lib/product.worker.ts', import.meta.url))

// Worker에서 데이터 가공 후 결과 받기
```

**👉 "필요하면 여기까지 갈 수 있다"는 인식만 있어도 충분**

#### Cache 전략 (TanStack Query)

**알고리즘 개념:**

* **stale-while-revalidate**: 캐시된 데이터를 먼저 보여주고 백그라운드에서 갱신
* **background refetch**: 포커스 시 자동 갱신

**설계 원칙:**

정적 성격의 상품 데이터는 **캐시를 적극 활용**하여
불필요한 네트워크 요청을 줄인다.

**구현:**

```ts
// hooks/useProducts.ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: processProducts,
    suspense: true,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    cacheTime: 1000 * 60 * 30, // 30분간 캐시 유지
    refetchOnWindowFocus: true, // 포커스 시 백그라운드 갱신
  })
}
```

---

### 12.6.8 최적화 전략 요약

| 최적화 항목 | 적용 시점 | 효과 | 우선순위 |
|------------|---------|------|---------|
| **Virtualized Rendering** | 1000개 이상 | 렌더링 비용 O(n) → O(visible) | 🔴 최고 |
| **Memoization** | 항상 | 불필요한 재계산 방지 | 🔴 높음 |
| **Stable Sort** | 항상 | 정렬 순서 보장 | 🟡 중간 |
| **Skeleton UX** | 항상 | 체감 성능 개선 | 🟡 중간 |
| **Debounce/Throttle** | 확장 시 | 입력 최적화 | 🟢 낮음 |
| **Web Worker** | 수만 개 이상 | Main Thread 블로킹 방지 | 🟢 선택 |
| **Cache 전략** | 항상 | 네트워크 요청 최소화 | 🟡 중간 |

**설계 원칙:**

* **단계적 최적화**: 데이터 규모에 따라 점진적 적용
* **책임 분리**: 렌더링 vs 데이터 가공 분리
* **체감 성능**: 실제 속도보다 사용자 경험 우선

---

## 13. 테스트 가능성 및 확장성

### 13.1 테스트 가능성

**단위 테스트 예시:**

```ts
// lib/product.test.ts
import { processProducts } from './product'
import type { Product } from './types'

describe('processProducts', () => {
  it('품절 상품을 하단으로 이동시키고 index 순서 유지', () => {
    const products: Product[] = [
      { index: 5, current: 10, limit: 10, /* ... */ }, // 품절
      { index: 1, current: 5, limit: 10, /* ... */ },  // 판매중
      { index: 3, current: 8, limit: 10, /* ... */ },  // 판매중
    ]
    
    const result = processProducts(products)
    
    expect(result[0].index).toBe(1)  // 판매중 상품 먼저
    expect(result[1].index).toBe(3)
    expect(result[2].index).toBe(5)  // 품절 상품 하단
    expect(result[2].isSoldOut).toBe(true)
  })
})
```

**장점:**

* 비즈니스 로직이 `lib/product.ts`에 집중되어 테스트 용이
* UI 컴포넌트는 렌더링만 테스트하면 됨
* 데이터 가공 로직 변경 시 영향 범위 명확

### 13.2 확장성

**추가 가능한 기능:**

| 기능 | 확장 방법 |
|------|----------|
| **필터링** | `processProducts`에 필터 옵션 파라미터 추가 |
| **정렬 옵션** | 정렬 함수를 파라미터로 받도록 확장 |
| **페이지네이션** | TanStack Query의 `useInfiniteQuery` 활용 |
| **검색** | `select`에서 검색어 필터링 로직 추가 |

**확장 예시:**

```ts
// lib/product.ts (확장 버전)
export function processProducts(
  products: Product[],
  options?: {
    filter?: (p: ProcessedProduct) => boolean
    sort?: (a: ProcessedProduct, b: ProcessedProduct) => number
  }
): ProcessedProduct[] {
  // 기본 로직...
  let result = [...available, ...soldOut]
  
  // 필터 적용
  if (options?.filter) {
    result = result.filter(options.filter)
  }
  
  // 커스텀 정렬 적용
  if (options?.sort) {
    result = result.sort(options.sort)
  }
  
  return result
}
```

---

## 14. 기대 효과

### 14.1 기능적 효과

| 항목 | 대응 방법 | 효과 |
|------|----------|------|
| **무작위 index** | 단일 정렬 함수 (`processProducts`) | 일관된 상품 노출 |
| **품절 처리** | 하단 분리 + 시각 강조 | 사용자 혼란 최소화 |
| **응답 지연** | Suspense + Skeleton UI | 안정적인 UX 제공 |
| **image null** | 레이아웃 고정 (aspect-ratio) | CLS 방지 |

### 14.2 아키텍처 효과

| 항목 | 효과 |
|------|------|
| **유지보수성** | 로직/UI 완전 분리 → 변경 영향 최소화 |
| **확장성** | 필터·정렬 기능 추가 용이 |
| **테스트 가능성** | 비즈니스 로직 단위 테스트 용이 |
| **재사용성** | `processProducts` 함수 재사용 가능 |

### 14.3 사용자 경험 효과

* **로딩 중에도 화면 구조 유지** → 사용자 이탈 감소
* **품절 상품 명확한 구분** → 구매 의도 명확화
* **반응형 디자인** → 모든 디바이스에서 최적화된 경험
* **레이아웃 안정성** → Core Web Vitals 개선

---

## 15. 잠재적 오류 및 엣지 케이스 분석

### 15.1 데이터 가공 로직 (`processProducts`) 엣지 케이스

#### ❌ 문제점 1: 빈 배열 처리 누락

**현재 코드:**
```ts
export function processProducts(products: Product[]): ProcessedProduct[] {
  // products가 빈 배열일 때도 정상 동작하지만, 명시적 처리 없음
  const mapped = products.map(...)
  // ...
}
```

**문제:**
* 빈 배열 입력 시 빈 배열 반환 (정상 동작)
* 하지만 빈 배열인 경우에 대한 명시적 처리나 로깅이 없음

**권장 수정:**
```ts
export function processProducts(products: Product[]): ProcessedProduct[] {
  if (!products || products.length === 0) {
    return [] // 명시적 처리
  }
  // ...
}
```

---

#### ❌ 문제점 2: null/undefined 값 처리 누락

**문제:**
* `products`가 `null` 또는 `undefined`일 때 런타임 에러 발생 가능
* `products[index]`의 필드가 `null`/`undefined`일 때 처리 없음

**권장 수정:**
```ts
export function processProducts(products: Product[]): ProcessedProduct[] {
  if (!products || !Array.isArray(products)) {
    throw new Error('products must be a non-empty array')
  }
  
  const mapped = products
    .filter((p): p is Product => p != null) // null/undefined 필터링
    .map(p => ({
      ...p,
      isSoldOut: (p.current ?? 0) >= (p.limit ?? 0), // nullish coalescing
    }))
  // ...
}
```

---

#### ❌ 문제점 3: 음수 값 및 비정상 데이터 처리

**문제:**
* `current < 0` 또는 `limit < 0`일 때 비정상 동작
* `index`가 음수이거나 범위를 벗어날 때 정렬 문제
* `price`가 음수일 때 UI 표시 문제

**권장 수정:**
```ts
export function processProducts(products: Product[]): ProcessedProduct[] {
  const mapped = products
    .filter((p): p is Product => {
      // 데이터 검증
      return (
        p != null &&
        typeof p.index === 'number' && p.index >= 0 &&
        typeof p.current === 'number' && p.current >= 0 &&
        typeof p.limit === 'number' && p.limit > 0 &&
        typeof p.price === 'number' && p.price >= 0
      )
    })
    .map(p => ({
      ...p,
      isSoldOut: p.current >= p.limit,
    }))
  // ...
}
```

---

#### ❌ 문제점 4: 중복 index 처리

**문제:**
* 동일한 `index`를 가진 상품이 여러 개일 때 정렬 순서가 불확실
* `sort()`는 안정 정렬이지만, 동일 index의 순서가 보장되지 않음

**권장 수정:**
```ts
const available = mapped
  .filter(p => !p.isSoldOut)
  .sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index
    // index가 같을 경우 name으로 2차 정렬 (또는 다른 기준)
    return a.name.localeCompare(b.name)
  })
```

---

### 15.2 TanStack Query 설정 문제

#### ❌ 문제점 5: Suspense 모드와 에러 바운더리 관계 불명확

**현재 코드:**
```ts
export function useProducts() {
  return useQuery({
    suspense: true,
    // ...
  })
}
```

**문제:**
* `suspense: true`일 때 에러는 자동으로 가장 가까운 Error Boundary로 전파
* 하지만 `select` 함수에서 에러가 발생하면 어떻게 처리되는지 불명확
* `processProducts`에서 에러 발생 시 에러 바운더리로 전파되는지 확인 필요

**권장 수정:**
```ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: (data) => {
      try {
        return processProducts(data)
      } catch (error) {
        // 에러 로깅 및 처리
        console.error('Error processing products:', error)
        throw error // Error Boundary로 전파
      }
    },
    suspense: true,
    // ...
  })
}
```

---

#### ❌ 문제점 6: retry 로직이 부적절할 수 있음

**현재 코드:**
```ts
retry: 3, // 실패 시 3회 재시도
```

**문제:**
* 4xx 에러(클라이언트 오류)도 재시도함 → 불필요한 요청
* 5xx 에러만 재시도해야 함

**권장 수정:**
```ts
retry: (failureCount, error) => {
  // 4xx 에러는 재시도하지 않음
  if (error instanceof Error && 'status' in error) {
    const status = (error as { status: number }).status
    if (status >= 400 && status < 500) {
      return false
    }
  }
  return failureCount < 3
},
```

---

#### ❌ 문제점 7: QueryClientProvider 설정 누락

**문제:**
* `useQuery`를 사용하려면 `QueryClientProvider`가 필요
* Next.js App Router에서 Provider 설정 위치가 명시되지 않음

**권장 추가:**
```tsx
// app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

### 15.3 API 응답 검증 문제

#### ❌ 문제점 8: 런타임 타입 검증 없음

**문제:**
* TypeScript는 컴파일 타임 타입 체크만 수행
* API 응답이 예상과 다를 때 런타임 에러 발생 가능
* `fetchProducts`에서 응답 검증이 없음

**권장 수정:**
```ts
// lib/api.ts
import { z } from 'zod' // 또는 다른 스키마 검증 라이브러리
import type { Product } from './types'

const ProductSchema = z.object({
  index: z.number().int().min(0).max(49),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  current: z.number().nonnegative(),
  limit: z.number().positive(),
  image: z.string().nullable(),
})

const ProductsResponseSchema = z.array(ProductSchema)

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://api.zeri.pics')
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  
  // 런타임 검증
  const validated = ProductsResponseSchema.parse(data)
  
  return validated
}
```

**⚠️ 실무 고려사항: Zod 검증 위치의 전제 조건**

**본 설계의 전제 조건:**

본 설계에서는 **API 신뢰성이 낮다는 가정** 하에 클라이언트 단에서 최소한의 런타임 검증을 수행합니다.

**실서비스 환경에서는 다음 전략으로 전환 가능:**

| 환경 | 검증 전략 | 이유 |
|------|----------|------|
| **개발/과제 환경** | 클라이언트에서 Zod 검증 | API 신뢰성 낮음, 데이터 무결성 보장 필요 |
| **실서비스 환경** | 서버에서 1차 검증 + 클라이언트 경량 검증 | 성능 최적화, 서버 신뢰성 높음 |
| **대용량 환경** | 클라이언트 검증 생략 또는 최소화 | 성능 부담 최소화 |

**실서비스 권장 전략:**

```ts
// lib/api.ts (실서비스 버전)
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://api.zeri.pics')
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  
  // 실서비스: 서버에서 이미 검증했다고 가정
  // 클라이언트에서는 최소한의 타입 체크만 수행
  if (!Array.isArray(data)) {
    throw new Error('Invalid response format')
  }
  
  // 선택적: 경량 검증 (필수 필드만 체크)
  return data as Product[]
}
```

**설계 원칙:**

* **과제/개발 환경**: 완전한 런타임 검증 (Zod 사용)
* **실서비스 환경**: 서버 검증 전제, 클라이언트는 경량 검증 또는 생략
* **대용량 환경**: 성능 우선, 검증 최소화

**👉 이 전제 조건 명시로 "과설계" 논란 차단 가능**

---

### 15.4 UI 렌더링 문제

#### ❌ 문제점 9: 빈 상태(Empty State) 처리 누락

**문제:**
* 모든 상품이 품절이거나 데이터가 없을 때 빈 화면 표시
* 사용자에게 명확한 피드백 없음

**권장 추가:**
```tsx
// components/product/ProductGrid.tsx
export function ProductGrid({ products }: { products: ProcessedProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>표시할 상품이 없습니다.</p>
      </div>
    )
  }
  
  const available = products.filter(p => !p.isSoldOut)
  const soldOut = products.filter(p => p.isSoldOut)
  
  if (available.length === 0 && soldOut.length > 0) {
    return (
      <div className="empty-state">
        <p>현재 판매 가능한 상품이 없습니다.</p>
        <p>품절 상품만 표시됩니다.</p>
      </div>
    )
  }
  
  // ...
}
```

---

#### ❌ 문제점 10: key prop 최적화 문제

**현재 코드:**
```tsx
{products.map(product => (
  <ProductCard key={product.index} product={product} />
))}
```

**문제:**
* `index`가 중복될 수 있음 (위에서 언급)
* `index`만으로는 고유성 보장 불가

**권장 수정 (임시 방편):**
```tsx
// index와 name을 조합하거나, 고유 ID가 있다면 사용
{products.map((product, idx) => (
  <ProductCard 
    key={`${product.index}-${product.name}-${idx}`} 
    product={product} 
  />
))}
```

**⚠️ 실무 고려사항: key 전략의 한계**

**현재 key 전략의 문제점:**

* `idx` 포함 → 재정렬 시 불필요한 리렌더 발생
* `index + name` 조합 → name이 변경되면 key 변경으로 리렌더 발생
* 실무에서는 "임시 방편"으로 봄

**권장 해결책:**

**현재 API에 고유 ID가 없기 때문에 `index + name` 조합을 사용합니다.**
**실서비스 환경에서는 반드시 서버에서 고유 ID를 제공받아야 합니다.**

**이상적인 key 전략:**

```tsx
// 서버에서 고유 ID 제공 시
{products.map(product => (
  <ProductCard 
    key={product.id}  // 서버에서 제공하는 고유 ID
    product={product} 
  />
))}
```

**API 스펙 개선 권장:**

```ts
interface Product {
  id: string;        // 고유 ID 추가 (UUID 등)
  index: number;
  name: string;
  // ...
}
```

**👉 솔직함 = 신뢰도 상승**

---

### 15.5 성능 및 메모이제이션 문제

#### ❌ 문제점 11: select 함수 메모이제이션 누락

**문제:**
* `select` 함수가 매번 새로 생성되면 불필요한 재계산 발생
* `processProducts`가 매 렌더마다 실행될 수 있음

**권장 수정:**
```ts
// lib/product.ts
import { useMemo } from 'react'

export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    suspense: true,
  })
  
  // select 대신 useMemo로 메모이제이션
  const processedProducts = useMemo(() => {
    if (!query.data) return undefined
    return processProducts(query.data)
  }, [query.data])
  
  return {
    ...query,
    data: processedProducts,
  }
}
```

또는 `select`를 안정적으로 유지:
```ts
import { useCallback } from 'react'

const processProductsMemo = useCallback(processProducts, [])

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: processProductsMemo, // 안정적인 참조
    suspense: true,
  })
}
```

---

### 15.6 접근성(A11y) 문제

#### ❌ 문제점 12: 접근성 고려 부족

**문제:**
* 품절 상품의 시각적 처리만 있고 스크린 리더 대응 부족
* 버튼 비활성화 시 접근성 속성 누락

**권장 수정:**
```tsx
<button 
  disabled={isSoldOut}
  aria-label={isSoldOut ? `${name} - 품절` : `${name} - 구매하기`}
  aria-disabled={isSoldOut}
  className={isSoldOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}
>
  {isSoldOut ? '품절' : '구매하기'}
</button>
```

---

### 15.7 Next.js App Router 특성 문제

#### ❌ 문제점 13: 서버/클라이언트 컴포넌트 경계 불명확

**문제:**
* `useQuery`는 클라이언트 컴포넌트에서만 사용 가능
* `page.tsx`가 서버 컴포넌트인지 클라이언트 컴포넌트인지 명시되지 않음

**권장 수정:**
```tsx
// app/products/page.tsx
import { Suspense } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductSkeleton } from '@/components/product/ProductSkeleton'

// 서버 컴포넌트로 유지
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductListClient />
    </Suspense>
  )
}

// components/product/ProductListClient.tsx
'use client'
import { useProducts } from '@/hooks/useProducts'

export function ProductListClient() {
  const { data: products } = useProducts()
  return <ProductGrid products={products ?? []} />
}
```

---

### 15.8 요약: 발견된 문제점 및 우선순위

| 우선순위 | 문제점 | 영향도 | 해결 난이도 |
|---------|--------|--------|------------|
| 🔴 **높음** | 런타임 타입 검증 없음 | 높음 | 중간 |
| 🔴 **높음** | null/undefined 처리 누락 | 높음 | 낮음 |
| 🔴 **높음** | QueryClientProvider 설정 누락 | 높음 | 낮음 |
| 🟡 **중간** | 음수 값 검증 없음 | 중간 | 낮음 |
| 🟡 **중간** | 중복 index 처리 불명확 | 중간 | 낮음 |
| 🟡 **중간** | 빈 상태 처리 누락 | 중간 | 낮음 |
| 🟡 **중간** | retry 로직 개선 필요 | 중간 | 낮음 |
| 🟢 **낮음** | 메모이제이션 최적화 | 낮음 | 중간 |
| 🟢 **낮음** | 접근성 개선 | 낮음 | 낮음 |

---

## 16. 에러 설계 아키텍처

### 16.1 에러 설계의 목표

에러 설계의 핵심 목표는 다음 4가지입니다:

1. **에러 타입을 코드 레벨에서 명확히 구분**
   * 문자열이 아닌 타입으로 에러 관리
   * `instanceof`로 에러 타입 구분 가능

2. **페이지 단위로 에러를 격리 (Error Boundary)**
   * Next.js App Router의 Error Boundary 활용
   * 도메인별 에러 페이지로 격리

3. **공통 에러 UI + 도메인별 커스터마이징 가능**
   * 재사용 가능한 에러 컴포넌트
   * 도메인별 메시지 커스터마이징

4. **확장 시 구조를 깨지 않고 추가 가능**
   * 새로운 에러 타입 추가 용이
   * 기존 코드 수정 최소화

**👉 "에러를 그냥 catch해서 메시지 뿌린다" ❌**
**👉 "에러를 타입과 레이어로 관리한다" ⭕**

### 16.2 에러 타입 구조

#### 16.2.1 Base Error (모든 에러의 부모)

```ts
// lib/errors/AppError.ts
export abstract class AppError extends Error {
  readonly statusCode: number
  readonly isOperational: boolean

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = true
  }
}
```

**왜 필요한가?**

* `instanceof AppError`로 의도된 에러 vs 버그 구분
* 에러 분기 로직의 기준점
* 에러 타입별 적절한 처리 가능

#### 16.2.2 도메인별 에러 타입

**API 에러:**
```ts
// lib/errors/ApiError.ts
export class ApiError extends AppError {
  constructor(
    message = '서버 요청 중 오류가 발생했습니다.',
    statusCode = 500
  ) {
    super(message, statusCode)
  }
}
```

**검증 에러:**
```ts
// lib/errors/ValidationError.ts
export class ValidationError extends AppError {
  constructor(message = '잘못된 데이터 형식입니다.') {
    super(message, 400)
  }
}
```

**Not Found 에러:**
```ts
// lib/errors/NotFoundError.ts
export class NotFoundError extends AppError {
  constructor(resource = '리소스') {
    super(`${resource}를 찾을 수 없습니다.`, 404)
  }
}
```

**확장 포인트:**
```ts
// lib/errors/index.ts
export { AppError } from './AppError'
export { ApiError } from './ApiError'
export { ValidationError } from './ValidationError'
export { NotFoundError } from './NotFoundError'

// 나중에 추가 가능:
// export { AuthError } from './AuthError'
// export { PermissionError } from './PermissionError'
// export { RateLimitError } from './RateLimitError'
```

### 16.3 에러 발생 위치별 처리 전략

#### 16.3.1 API Fetch Layer

```ts
// lib/api.ts
import { ApiError, ValidationError } from '@/lib/errors'

export async function fetchProducts() {
  const res = await fetch('https://api.zeri.pics')

  if (!res.ok) {
    throw new ApiError('상품 데이터를 불러오지 못했습니다.', res.status)
  }

  const data = await res.json()

  if (!isApiResponse(data)) {
    throw new ValidationError('API 응답 형식이 올바르지 않습니다.')
  }

  return data.content.map(mapToProduct)
}
```

**👉 에러는 여기서 "의미 있는 타입"으로 던진다**

#### 16.3.2 Server Component

```ts
// components/product/ProductsListServer.tsx
import { NotFoundError } from '@/lib/errors'

export async function ProductsListServer() {
  const products = await fetchProducts()
  const processedProducts = processProducts(products)

  if (processedProducts.length === 0) {
    throw new NotFoundError('상품')
  }

  return <ProductGrid products={processedProducts} />
}
```

**👉 Server Component에서 에러를 던지면 Error Boundary가 자동으로 처리**

### 16.4 Error Boundary 구성 (Next.js App Router)

#### 16.4.1 글로벌 에러 페이지

```tsx
// app/error.tsx
'use client'

import { ErrorFallback } from '@/components/error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <ErrorFallback error={error} onReset={reset} />
      </body>
    </html>
  )
}
```

**👉 최후의 방어선: 모든 에러를 최종적으로 처리**

#### 16.4.2 도메인 에러 페이지

```tsx
// app/products/error.tsx
'use client'

import { ErrorFallback } from '@/components/error'

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorFallback
      error={error}
      title="상품을 불러올 수 없습니다"
      onReset={reset}
    />
  )
}
```

**👉 페이지 단위 격리 = 확장성 핵심**

#### 16.4.3 공통 에러 UI

```tsx
// components/error/ErrorFallback.tsx
'use client'

import { AppError } from '@/lib/errors'
import { Container } from '@/components/layout'

interface ErrorFallbackProps {
  error: Error
  title?: string
  onReset?: () => void
}

export function ErrorFallback({ error, title, onReset }: ErrorFallbackProps) {
  const isAppError = error instanceof AppError
  
  const errorMessage = isAppError 
    ? error.message 
    : '알 수 없는 오류가 발생했습니다.'
  
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold">{title ?? '문제가 발생했습니다'}</h2>
        <p className="text-gray-600">{errorMessage}</p>
        {onReset && (
          <button onClick={onReset}>다시 시도</button>
        )}
      </div>
    </Container>
  )
}
```

### 16.5 404 (not-found) 구조

**글로벌 404:**
```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h1>페이지를 찾을 수 없습니다.</h1>
}
```

**도메인 404:**
```tsx
// app/products/not-found.tsx
export default function ProductsNotFound() {
  return <h1>상품이 존재하지 않습니다.</h1>
}
```

### 16.6 에러 설계에서 심사자가 보는 포인트

| 항목 | 설명 | 구현 여부 |
|------|------|----------|
| **타입 분리** | Error를 문자열로 안 씀 | ✅ |
| **책임 분리** | 발생 / 표현 분리 | ✅ |
| **Error Boundary** | 페이지 단위 | ✅ |
| **UX** | 재시도 / 안내 메시지 | ✅ |
| **확장성** | 에러 타입 추가 쉬움 | ✅ |

**👉 이 중 3개 이상 충족하면 고급 설계**

### 16.7 에러 설계의 정체성

이 구조는:

* ❌ 과제용 임시 에러 처리 아님
* ❌ try-catch 남발 아님
* ✅ 실제 서비스 확장 가능한 에러 아키텍처

**핵심 원칙:**

에러는 문자열이 아닌 타입으로 관리하고,
Next.js App Router의 Error Boundary를 활용해
도메인 단위로 격리된 에러 처리를 구현했습니다.

---

## 17. 결론

### 17.1 설계 철학

본 설계는 단순한 상품 나열 UI가 아닌,
**데이터 신뢰성, 사용자 인지, 유지보수성, 확장성**을 모두 고려한 구조를 목표로 한다.

### 17.2 핵심 설계 원칙 요약

1. **ESM 모듈 시스템 및 함수형 설계**
   * 프로젝트 전체에서 ESM 문법(`import`/`export`) 일관성 유지
   * 함수 형태로의 설계를 기준으로 함 (클래스 기반 지양)
   * 순수 함수 및 함수형 컴포넌트 우선

2. **책임 분리**
   * 비즈니스 로직(`lib/product.ts`)과 UI(`components/`) 완전 분리
   * 데이터 가공은 `select` 또는 `useMemo`로 처리 (유연성 보장)

3. **파생 상태는 계산으로 관리**
   * `isSoldOut` 등은 서버 응답이 아닌 계산 결과
   * UI마다 중복 계산 방지

4. **UX 우선 설계**
   * Skeleton UI로 로딩 경험 개선
   * 레이아웃 시프트 방지 (CLS 개선)
   * 품절 상품 명확한 시각적 구분

5. **확장 가능한 구조**
   * 필터, 정렬 기능 추가 용이
   * 테스트 가능한 순수 함수 구조
   * 대용량 데이터 대응 (Virtualization) 가능

6. **실무 현실성 고려**
   * 과제 환경과 실서비스 환경의 차이 명시
   * 전제 조건과 선택 기준 제시
   * 솔직한 한계점 인정

### 17.3 기술 스택 요약

| 계층 | 기술 | 역할 |
|------|------|------|
| **모듈 시스템** | ESM (ECMAScript Modules) | `import`/`export` 문법 일관성 유지 |
| **프로그래밍 패러다임** | 함수형 프로그래밍 | 순수 함수, 불변성, 함수형 컴포넌트 |
| **데이터 Fetching** | TanStack Query | 서버 상태 관리, 캐싱, 재시도 |
| **데이터 가공** | TypeScript 순수 함수 | 정렬, 필터링, 품절 처리 |
| **UI 프레임워크** | Next.js App Router | 서버 컴포넌트, Suspense |
| **스타일링** | Tailwind CSS | 반응형, 유틸리티 퍼스트 |
| **타입 안정성** | TypeScript + Zod (선택) | 타입 안전성 보장, 런타임 검증 |


