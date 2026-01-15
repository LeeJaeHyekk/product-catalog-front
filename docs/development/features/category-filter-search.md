# 카테고리 분류 및 검색/필터 기능 설계

## 개요

상품 데이터에 카테고리 분류와 검색/필터 기능을 추가하는 방안을 제시합니다.

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

## 접근 방법 비교

### 옵션 1: 메모리 기반 처리 (DB 없음)

**설명**: 클라이언트/서버 측에서 메모리 기반으로 카테고리 분류 및 필터링

**장점**:
- 빠른 구현 (DB 설정 불필요)
- 간단한 구조
- 외부 의존성 없음
- 실시간 필터링 가능

**단점**:
- 카테고리 정보가 코드에 하드코딩됨
- 상품명 기반 추론의 한계
- 대용량 데이터 처리 시 성능 이슈 가능

**구현 예시**:
```typescript
// lib/product/category.ts
export type Category = '과일' | '채소' | '곡물' | '기타'

const categoryKeywords: Record<Category, string[]> = {
  과일: ['사과', '배', '딸기', '포도', '오렌지', '바나나'],
  채소: ['상추', '배추', '양파', '마늘', '당근', '오이'],
  곡물: ['쌀', '보리', '밀', '옥수수'],
  기타: []
}

export function categorizeProduct(name: string): Category {
  const lowerName = name.toLowerCase()
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category as Category
    }
  }
  
  return '기타'
}

// lib/product/filter.ts
export interface FilterOptions {
  category?: Category
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  onlyAvailable?: boolean
}

export function filterProducts(
  products: ProcessedProduct[],
  options: FilterOptions
): ProcessedProduct[] {
  return products.filter(product => {
    // 카테고리 필터
    if (options.category) {
      const productCategory = categorizeProduct(product.name)
      if (productCategory !== options.category) return false
    }
    
    // 검색어 필터
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase()
      if (!product.name.toLowerCase().includes(query)) return false
    }
    
    // 가격 필터
    if (options.minPrice !== undefined && product.price < options.minPrice) {
      return false
    }
    if (options.maxPrice !== undefined && product.price > options.maxPrice) {
      return false
    }
    
    // 재고 필터
    if (options.onlyAvailable && product.isSoldOut) {
      return false
    }
    
    return true
  })
}
```

**사용 예시**:
```typescript
// components/product/ProductGrid.tsx
const filteredProducts = useMemo(() => {
  return filterProducts(products, {
    category: selectedCategory,
    searchQuery: searchTerm,
    onlyAvailable: showOnlyAvailable
  })
}, [products, selectedCategory, searchTerm, showOnlyAvailable])
```

---

### 옵션 2: 메타데이터 파일 (JSON/YAML)

**설명**: 카테고리 정보를 별도 파일로 관리

**장점**:
- 코드와 데이터 분리
- 카테고리 정보 수정 용이
- 버전 관리 가능

**단점**:
- 파일 관리 필요
- 배포 시 파일 포함 필요

**구현 예시**:
```typescript
// lib/data/categories.json
{
  "과일": ["사과", "배", "딸기"],
  "채소": ["상추", "배추"],
  "곡물": ["쌀", "보리"]
}

// lib/product/category.ts
import categoriesData from '@/lib/data/categories.json'

export function categorizeProduct(name: string): Category {
  // categoriesData 기반으로 분류
}
```

---

### 옵션 3: 데이터베이스 사용

**설명**: 카테고리 정보를 DB에 저장하고 관리

**장점**:
- 동적 카테고리 관리 가능
- 관리자 페이지로 카테고리 수정 가능
- 복잡한 쿼리 및 인덱싱 가능
- 대용량 데이터 처리 최적화

**단점**:
- DB 설정 및 관리 필요
- 인프라 비용 증가
- 복잡도 증가
- 배포 및 운영 복잡

**구현 예시**:
```typescript
// DB 스키마 예시
// products 테이블
- id
- name
- price
- category_id (FK)
- ...

// categories 테이블
- id
- name
- keywords (JSON)
- ...

// API Route: app/api/products/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  // DB 쿼리
  const products = await db.products.findMany({
    where: {
      category: category ? { name: category } : undefined,
      name: search ? { contains: search } : undefined
    }
  })
  
  return Response.json(products)
}
```

---

## 구현 방안

### 단계별 접근

#### 1단계: 메모리 기반 처리 (즉시 구현 가능)

**이유**:
- 빠른 구현
- 현재 데이터 규모(50개)에 충분
- DB 인프라 불필요

**구현 범위**:
- 카테고리 키워드 기반 분류
- 클라이언트 측 필터링
- 검색 기능

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

---

## 데이터 처리 아키텍처

### 효율적인 데이터 흐름

**추천 구조:**
```
서버 컴포넌트: API 호출 → 즉시 가공 (카테고리 포함) → 클라이언트 전달
클라이언트 컴포넌트: 필터링만 수행 (useMemo 최적화)
```

**핵심 원칙:**
- 서버에서 한 번에 가공 (카테고리 분류 포함)
- 중간 저장소 불필요
- 클라이언트는 필터링만 담당

자세한 내용은 [데이터 재가공 아키텍처](./data-processing-architecture.md) 문서를 참고하세요.

---

## 구현 계획 (옵션 1 기준)

### 1. 카테고리 분류 모듈

```typescript
// lib/product/category.ts
export type Category = '과일' | '채소' | '곡물' | '육류' | '해산물' | '기타'

export interface ProductWithCategory extends ProcessedProduct {
  category: Category
}

const categoryKeywords: Record<Category, string[]> = {
  과일: ['사과', '배', '딸기', '포도', '오렌지', '바나나', '수박', '참외'],
  채소: ['상추', '배추', '양파', '마늘', '당근', '오이', '토마토', '고추'],
  곡물: ['쌀', '보리', '밀', '옥수수', '콩'],
  육류: ['소고기', '돼지고기', '닭고기', '오리고기'],
  해산물: ['생선', '새우', '게', '오징어', '문어'],
  기타: []
}

export function categorizeProduct(name: string): Category {
  const lowerName = name.toLowerCase()
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category as Category
    }
  }
  
  return '기타'
}

export function addCategories(products: ProcessedProduct[]): ProductWithCategory[] {
  return products.map(product => ({
    ...product,
    category: categorizeProduct(product.name)
  }))
}
```

### 2. 필터 모듈

```typescript
// lib/product/filter.ts
import type { ProcessedProduct } from '../types'
import type { Category } from './category'
import { ProductWithCategory, addCategories } from './category'

export interface FilterOptions {
  category?: Category | '전체'
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  onlyAvailable?: boolean
  sortBy?: 'price' | 'name' | 'progress'
  sortOrder?: 'asc' | 'desc'
}

export function filterProducts(
  products: ProcessedProduct[],
  options: FilterOptions
): ProcessedProduct[] {
  let filtered = addCategories(products)
  
  // 카테고리 필터
  if (options.category && options.category !== '전체') {
    filtered = filtered.filter(p => p.category === options.category)
  }
  
  // 검색어 필터
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase().trim()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query)
    )
  }
  
  // 가격 필터
  if (options.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= options.minPrice!)
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= options.maxPrice!)
  }
  
  // 재고 필터
  if (options.onlyAvailable) {
    filtered = filtered.filter(p => !p.isSoldOut)
  }
  
  // 정렬
  if (options.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (options.sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ko')
          break
        case 'progress':
          const aProgress = (a.current / a.limit) * 100
          const bProgress = (b.current / b.limit) * 100
          comparison = aProgress - bProgress
          break
      }
      
      return options.sortOrder === 'desc' ? -comparison : comparison
    })
  }
  
  // 카테고리 제거 (원래 타입으로 반환)
  return filtered.map(({ category, ...product }) => product)
}
```

### 3. UI 컴포넌트

```typescript
// components/product/CategoryFilter.tsx
'use client'

import { Category } from '@/lib/product/category'

interface CategoryFilterProps {
  selectedCategory: Category | '전체'
  onCategoryChange: (category: Category | '전체') => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: (Category | '전체')[] = ['전체', '과일', '채소', '곡물', '육류', '해산물', '기타']
  
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === category
              ? 'bg-[#1E7F4F] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

// components/product/SearchBar.tsx
'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="상품명 검색..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E7F4F]"
      />
    </form>
  )
}
```

### 4. 페이지 통합

```typescript
// app/products/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CategoryFilter } from '@/components/product/CategoryFilter'
import { SearchBar } from '@/components/product/SearchBar'
import { filterProducts, type FilterOptions } from '@/lib/product/filter'
import type { ProcessedProduct } from '@/lib'
import type { Category } from '@/lib/product/category'

export default function ProductsPage() {
  const [products] = useState<ProcessedProduct[]>([]) // 실제로는 서버에서 가져옴
  const [filters, setFilters] = useState<FilterOptions>({
    category: '전체',
    searchQuery: '',
    onlyAvailable: false
  })
  
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

## DB가 필요한 경우

다음 상황에서는 DB 사용을 고려하세요:

1. **상품 수가 수천 개 이상**
   - 메모리 기반 필터링이 느려질 때
   - 인덱싱이 필요할 때

2. **관리자 페이지 필요**
   - 카테고리를 동적으로 추가/수정해야 할 때
   - 상품 정보를 직접 관리해야 할 때

3. **복잡한 쿼리 필요**
   - 다중 조건 검색
   - 통계 및 분석
   - 권한 기반 필터링

4. **데이터 영구 저장 필요**
   - 사용자 검색 히스토리
   - 즐겨찾기
   - 주문 내역

---

## 결론

### 현재 단계: 메모리 기반 처리 방식 채택

**이유**:
- 현재 상품 수(50개)에 충분
- 빠른 구현 가능
- DB 인프라 불필요
- 유지보수 간단

### 향후 확장 계획

1. **단기**: 메모리 기반 필터링 구현
2. **중기**: 메타데이터 파일로 카테고리 관리
3. **장기**: 필요 시 DB 도입

---

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

---

## 참고

- [모듈화 가이드](../architecture/modularization.md)
- [렌더링 성능 최적화](../optimization/rendering-performance.md)
