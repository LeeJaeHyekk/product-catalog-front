# 카테고리 시스템 구현 가이드

## 개요

타입 안전한 카테고리 분류 시스템이 구현되었습니다. 한글 및 영어 키워드를 지원하며, `category.json` 파일을 기반으로 동작합니다.

## 구조

### 1. 타입 정의 (`lib/types/category.ts`)

엄격한 타입 정의:
- `CategoryRoot`: 루트 구조
- `Category`: 메인 카테고리
- `SubCategory`: 서브 카테고리 (items, englishItems 포함)
- `FlatCategoryInfo`: 플랫 카테고리 정보
- `CategoryMatch`: 매칭 결과

### 2. 데이터 로더 (`lib/data/categories.ts`)

- `category.json` 파일을 타입 안전하게 로드
- 플랫 카테고리 정보 생성
- 영어 키워드 자동 매핑

### 3. 카테고리 분류 (`lib/product/category.ts`)

- `categorizeProduct()`: 상품명으로 카테고리 분류
- `enrichProductsWithCategory()`: 상품 배열에 카테고리 정보 추가
- 한글/영어 키워드 모두 지원

### 4. 필터링 (`lib/product/filter.ts`)

- `filterProducts()`: 다양한 조건으로 필터링
- `getAvailableSubCategories()`: 실제 상품에 존재하는 카테고리만 반환

## category.json에 영어 키워드 추가

### 방법 1: 직접 추가

각 서브 카테고리의 `englishItems` 배열에 영어 키워드를 추가합니다:

```json
{
  "id": "fruit",
  "name": "과일",
  "items": ["사과", "배", "딸기"],
  "englishItems": ["apple", "apples", "pear", "pears", "strawberry", "strawberries"]
}
```

### 방법 2: 자동 매핑

`lib/data/english-keywords.ts`의 `ENGLISH_KEYWORD_MAP`에 매핑을 추가하면 자동으로 적용됩니다:

```typescript
export const ENGLISH_KEYWORD_MAP: Record<string, string[]> = {
  사과: ['apple', 'apples'],
  배: ['pear', 'pears'],
  // ...
}
```

**우선순위:**
1. `category.json`의 `englishItems` (있으면 우선 사용)
2. `english-keywords.ts`의 매핑 테이블 (자동 적용)

## 사용 예시

### 서버 컴포넌트

```typescript
// components/product/ProductsListServer.tsx
import { processAndEnrichProducts } from '@/lib/product'

export async function ProductsListServer() {
  const rawProducts = await fetchProducts()
  const enrichedProducts = processAndEnrichProducts(rawProducts)
  return <ProductGridWithFilters products={enrichedProducts} />
}
```

### 클라이언트 컴포넌트

```typescript
// components/product/ProductGridWithFilters.tsx
'use client'

import { filterProducts } from '@/lib/product'

export function ProductGridWithFilters({ products }) {
  const [filters, setFilters] = useState({
    subCategoryId: '전체',
    searchQuery: '',
  })
  
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  )
  
  return <ProductGrid products={filteredProducts} />
}
```

## 카테고리 분류 로직

### 한글 키워드 우선

```typescript
// "사과" → 과일 카테고리
categorizeProduct('사과')
// { subCategoryId: 'fruit', subCategoryName: '과일', ... }
```

### 영어 키워드 지원

```typescript
// "apple" → 과일 카테고리 (동일한 결과)
categorizeProduct('apple')
// { subCategoryId: 'fruit', subCategoryName: '과일', ... }
```

### 매칭 실패 시

```typescript
// 매칭 실패 시 "기타" 카테고리 반환
categorizeProduct('알 수 없는 상품')
// { subCategoryId: 'other', subCategoryName: '기타', ... }
```

## 필터링 옵션

```typescript
interface FilterOptions {
  subCategoryId?: string | '전체'  // 서브 카테고리 ID
  categoryId?: string              // 메인 카테고리 ID
  searchQuery?: string             // 검색어 (한글/영어 지원)
  minPrice?: number                // 최소 가격
  maxPrice?: number                // 최대 가격
  onlyAvailable?: boolean           // 재고 있는 상품만
  sortBy?: 'price' | 'name' | 'progress' | 'index'
  sortOrder?: 'asc' | 'desc'
}
```

## 타입 안전성

모든 타입은 엄격하게 정의되어 있습니다:

```typescript
// EnrichedProduct: ProcessedProduct + category 정보
interface EnrichedProduct extends ProcessedProduct {
  category: ProductCategoryInfo
}

// ProductCategoryInfo: 카테고리 분류 결과
interface ProductCategoryInfo {
  subCategoryId: string
  subCategoryName: string
  categoryId: string
  categoryName: string
  matchedKeyword: string | null
  matchType: 'korean' | 'english' | null
}
```

## 성능 최적화

1. **서버에서 한 번에 가공**
   - API 호출 → 즉시 가공 (카테고리 포함) → 클라이언트 전달
   - 중간 저장소 불필요

2. **클라이언트에서 필터링 최적화**
   - `useMemo`로 불필요한 재계산 방지
   - 실제 상품에 존재하는 카테고리만 표시

3. **플랫 카테고리 정보 캐싱**
   - 빌드 타임에 생성
   - 런타임에 재사용

## 참고

- [카테고리 분류 및 검색/필터 기능 설계](./category-filter-search.md)
- [데이터 재가공 아키텍처](./data-processing-architecture.md)
- [lib/data/README.md](../../../lib/data/README.md)
