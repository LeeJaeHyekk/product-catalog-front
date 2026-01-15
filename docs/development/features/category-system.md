# 카테고리 시스템

## 개요

상품 데이터에 카테고리 분류와 검색/필터 기능을 제공하는 시스템입니다. 타입 안전한 카테고리 분류 시스템으로 한글 및 영어 키워드를 지원하며, `category.json` 파일을 기반으로 동작합니다.

## 현재 상황 분석

### 현재 데이터 구조

```typescript
interface Product {
  index: number
  name: string
  price: number
  current: number
  limit: number
  image: string | null
}
```

### 제약사항

- API 응답에 카테고리 정보가 없음
- 상품명만으로 카테고리를 추론해야 함
- 외부 API를 사용 중 (제어 불가)

## 접근 방법

### 메모리 기반 처리 (현재 구현)

**설명**: 클라이언트/서버 측에서 메모리 기반으로 카테고리 분류 및 필터링

**고려 사항**:
- 빠른 구현 (DB 설정 불필요)
- 간단한 구조
- 외부 의존성 없음
- 실시간 필터링 가능

**제약사항**:
- 카테고리 정보가 코드에 하드코딩됨
- 상품명 기반 추론의 한계
- 대용량 데이터 처리 시 성능 이슈 가능

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

## category.json 구조

`category.json` 파일은 다음과 같은 구조를 가집니다:

```json
{
  "categoryRoot": "식품",
  "categories": [
    {
      "id": "fresh_agriculture",
      "name": "신선 농산물",
      "description": "...",
      "subCategories": [
        {
          "id": "fruit",
          "name": "과일",
          "items": ["사과", "배", "딸기"],
          "englishItems": ["apple", "pear", "strawberry"],
          "features": ["계절성 강함"]
        }
      ]
    }
  ]
}
```

## 영어 키워드 추가 방법

### 방법 1: category.json에 직접 추가 (권장)

각 서브 카테고리의 `englishItems` 배열에 영어 키워드를 추가합니다:

```json
{
  "id": "fruit",
  "name": "과일",
  "items": ["사과", "배", "딸기"],
  "englishItems": ["apple", "apples", "pear", "pears", "strawberry", "strawberries"]
}
```

### 방법 2: 자동 매핑 사용

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

## 데이터 처리 아키텍처

### 효율적인 데이터 흐름

**구조 예시:**
```
서버 컴포넌트: API 호출 → 즉시 가공 (카테고리 포함) → 클라이언트 전달
클라이언트 컴포넌트: 필터링만 수행 (useMemo 최적화)
```

**핵심 원칙:**
- 서버에서 한 번에 가공 (카테고리 분류 포함)
- 중간 저장소 불필요
- 클라이언트는 필터링만 담당

자세한 내용은 [데이터 재가공 아키텍처](./data-processing-architecture.md) 문서를 참고하세요.

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

## 향후 확장 계획

### 단계별 접근

#### 1단계: 메모리 기반 처리 (현재 구현)

**이유**:
- 빠른 구현
- 현재 데이터 규모(50개)에 충분
- DB 인프라 불필요

#### 2단계: 메타데이터 파일 (확장 시)

**이유**:
- 카테고리 정보가 많아질 때
- 관리가 필요할 때

**구현 범위**:
- JSON/YAML 파일로 카테고리 관리
- 빌드 타임에 로드

#### 3단계: 데이터베이스 (대규모 확장 시)

**이유**:
- 상품 수가 수천 개 이상일 때
- 관리자 페이지가 필요할 때
- 복잡한 쿼리가 필요할 때

**구현 범위**:
- PostgreSQL/MySQL 등 관계형 DB
- Prisma/TypeORM 등 ORM 사용
- 관리자 페이지 구축

## 히스토리

### 2026-01-XX: 검색 상태 동기화 개선
- `ProductGridWithFilters`에서 `filters.searchQuery`를 `SearchBar`의 `initialQuery`로 전달
- 카테고리 변경 시에도 검색어가 유지되도록 개선

### 2026-01-XX: 검색 필터링 로직 개선
- 문자 단위 부분 문자열 검색 로직 제거
- 정확한 문자열 매칭만 사용하여 검색 정확도 향상
- "감귤" 검색 시 "제주 감귤"만 표시되도록 개선

### 2026-01-XX: 초기 구현
- 카테고리 분류 및 검색/필터 기능 설계 및 구현
- 메모리 기반 처리 방식 채택
- 다중 키워드 검색 지원 (AND/OR 모드)

## 참고

- [데이터 재가공 아키텍처](./data-processing-architecture.md)
- [검색 및 필터 기능](./search-filter-improvements.md)
- [lib/data/README.md](../../../lib/data/README.md)
