# 데이터 재가공 아키텍처 설계

## 문제 분석

### 제안된 방식의 문제점

**제안된 구조:**
```
API 호출 → raw 데이터 저장소 → 분석 → 카테고리 분류 → 뿌려주기
```

**문제점:**

1. **불필요한 중간 저장소**
   - raw 데이터를 별도로 저장할 필요 없음
   - 메모리 낭비
   - 데이터 흐름이 복잡해짐

2. **중복 처리**
   - 매번 API 호출 시 카테고리 분류를 다시 수행
   - 서버에서 이미 데이터를 가공할 수 있는데 중간 단계 추가

3. **비효율적인 데이터 흐름**
   - 서버 → 저장소 → 분석 → 클라이언트 (4단계)
   - 서버 → 가공 → 클라이언트 (2단계)로 충분

4. **타이밍 이슈**
   - 저장소에 저장 → 분석 → 분류 → 뿌려주기
   - 각 단계마다 지연 발생 가능

---

## 효율적인 구조

### 구현 방식: 서버에서 한 번에 가공

**구조:**
```
서버 컴포넌트: API 호출 → 즉시 가공 (카테고리 포함) → 클라이언트 전달
클라이언트 컴포넌트: 필터링만 수행 (useMemo 최적화)
```

**장점:**

1. **단일 책임 원칙**
   - 서버: 데이터 가공 (카테고리 분류 포함)
   - 클라이언트: UI 필터링

2. **효율적인 데이터 흐름**
   - 서버에서 한 번에 처리
   - 클라이언트로 전달되는 데이터는 이미 완성된 형태

3. **성능 최적화**
   - 서버에서 가공 (한 번만 수행)
   - 클라이언트에서 필터링 (useMemo로 최적화)

4. **타입 안전성**
   - 서버에서 카테고리 정보 포함한 타입 정의
   - 클라이언트는 타입 안전하게 사용

---

## 구현 구조

### 1. 타입 정의 확장

```typescript
// lib/types/product.ts
import type { ProcessedProduct } from './product'
import type { Category } from '../product/category'

export interface ProcessedProductWithCategory extends ProcessedProduct {
  category: Category
}
```

### 2. 서버에서 카테고리 포함 가공

```typescript
// lib/product/enrich.ts
import type { ProcessedProduct } from '../types'
import type { Category } from './category'
import { categorizeProduct } from './category'

export interface EnrichedProduct extends ProcessedProduct {
  category: Category
}

/**
 * 상품에 카테고리 정보 추가
 * 
 * 서버에서 한 번만 수행하여 클라이언트로 전달
 */
export function enrichProducts(products: ProcessedProduct[]): EnrichedProduct[] {
  return products.map(product => ({
    ...product,
    category: categorizeProduct(product.name)
  }))
}
```

### 3. 통합 처리 함수

```typescript
// lib/product/index.ts
export function processAndEnrichProducts(products: Product[]): EnrichedProduct[] {
  // 1. 기본 가공 (정렬, 품절 처리 등)
  const processed = processProducts(products)
  
  // 2. 카테고리 정보 추가
  const enriched = enrichProducts(processed)
  
  return enriched
}
```

### 4. 서버 컴포넌트에서 사용

```typescript
// components/product/ProductsListServer.tsx
import { fetchProducts } from '@/lib/api'
import { processAndEnrichProducts } from '@/lib/product'
import { ProductGridWithFilters } from './ProductGridWithFilters'

export async function ProductsListServer() {
  // 1. API 호출
  const rawProducts = await fetchProducts()
  
  // 2. 한 번에 가공 (카테고리 포함)
  const enrichedProducts = processAndEnrichProducts(rawProducts)
  
  // 3. 클라이언트로 전달 (이미 완성된 데이터)
  return <ProductGridWithFilters products={enrichedProducts} />
}
```

### 5. 클라이언트에서 필터링

```typescript
// components/product/ProductGridWithFilters.tsx
'use client'

import { useState, useMemo } from 'react'
import { filterProducts, type FilterOptions } from '@/lib/product/filter'
import type { EnrichedProduct } from '@/lib/types/product'
import { ProductGrid } from './ProductGrid'
import { CategoryFilter } from './CategoryFilter'
import { SearchBar } from './SearchBar'

interface ProductGridWithFiltersProps {
  products: EnrichedProduct[]
}

export function ProductGridWithFilters({ products }: ProductGridWithFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '전체',
    searchQuery: '',
    onlyAvailable: false
  })
  
  // 필터링만 수행 (useMemo로 최적화)
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  )
  
  return (
    <div>
      <CategoryFilter
        selectedCategory={filters.category || '전체'}
        onCategoryChange={(category) => setFilters({ ...filters, category })}
      />
      <SearchBar
        onSearch={(query) => setFilters({ ...filters, searchQuery: query })}
      />
      <ProductGrid products={filteredProducts} />
    </div>
  )
}
```

---

## 데이터 흐름 비교

### 비효율적인 방식 (제안된 구조)

```
1. API 호출
2. raw 데이터 저장소에 저장
3. 저장소에서 데이터 읽기
4. 분석 및 카테고리 분류
5. 분류된 데이터 저장
6. 클라이언트로 전달
7. 클라이언트에서 필터링
```

**문제점:**
- 7단계로 복잡
- 중간 저장소 필요
- 데이터 복사 발생
- 지연 시간 증가

### 효율적인 방식 (추천 구조)

```
서버:
1. API 호출
2. 즉시 가공 (카테고리 포함)
3. 클라이언트로 전달

클라이언트:
4. 필터링만 수행 (useMemo 최적화)
```

**장점:**
- 4단계로 단순
- 중간 저장소 불필요
- 데이터 복사 최소화
- 지연 시간 최소화

---

## 성능 최적화

### 서버 측 최적화

```typescript
// lib/product/enrich.ts
export function enrichProducts(products: ProcessedProduct[]): EnrichedProduct[] {
  // 한 번의 map으로 모든 처리 완료
  return products.map(product => ({
    ...product,
    category: categorizeProduct(product.name) // 빠른 키워드 매칭
  }))
}
```

**특징:**
- O(n) 시간 복잡도
- 메모리 효율적 (새 배열 하나만 생성)
- 서버에서 한 번만 수행

### 클라이언트 측 최적화

```typescript
// useMemo로 필터링 최적화
const filteredProducts = useMemo(
  () => filterProducts(products, filters),
  [products, filters] // products나 filters 변경 시에만 재계산
)
```

**특징:**
- 불필요한 재계산 방지
- React 렌더링 최적화
- 사용자 입력에 즉각 반응

---

## 대안 구조 (필요 시)

### 옵션 1: 서버 액션 사용

```typescript
// app/actions/products.ts
'use server'

import { fetchProducts } from '@/lib/api'
import { processAndEnrichProducts } from '@/lib/product'

export async function getEnrichedProducts() {
  const rawProducts = await fetchProducts()
  return processAndEnrichProducts(rawProducts)
}
```

**사용:**
```typescript
// components/product/ProductsListServer.tsx
import { getEnrichedProducts } from '@/app/actions/products'

export async function ProductsListServer() {
  const products = await getEnrichedProducts()
  return <ProductGridWithFilters products={products} />
}
```

### 옵션 2: API Route 사용 (캐싱 필요 시)

```typescript
// app/api/products/enriched/route.ts
import { fetchProducts } from '@/lib/api'
import { processAndEnrichProducts } from '@/lib/product'

export async function GET() {
  const rawProducts = await fetchProducts()
  const enrichedProducts = processAndEnrichProducts(rawProducts)
  
  return Response.json(enrichedProducts, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

**사용:**
```typescript
// 클라이언트에서 사용
const response = await fetch('/api/products/enriched')
const products = await response.json()
```

---

## 결론

### 구현 구조

**서버에서 한 번에 가공:**
- API 호출 → 즉시 가공 (카테고리 포함) → 클라이언트 전달
- 중간 저장소 불필요
- 효율적인 데이터 흐름

**클라이언트에서 필터링:**
- useMemo로 최적화
- 사용자 입력에 즉각 반응
- 불필요한 재계산 방지

### 핵심 원칙

1. **서버에서 가공, 클라이언트에서 필터링**
   - 서버: 데이터 변환 및 가공
   - 클라이언트: UI 상호작용 및 필터링

2. **단일 패스 처리**
   - 한 번의 순회로 모든 가공 완료
   - 중간 저장소 없이 직접 전달

3. **타입 안전성**
   - 서버에서 완성된 타입으로 전달
   - 클라이언트는 타입 안전하게 사용

---

## 참고

- [모듈화 가이드](../architecture/modularization.md)
- [카테고리 분류 및 검색/필터](./category-filter-search.md)
- [렌더링 성능 최적화](../optimization/rendering-performance.md)
