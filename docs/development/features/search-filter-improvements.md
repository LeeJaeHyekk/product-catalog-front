# 검색 및 필터 기능 개선

## 개요

검색 기능의 안정성과 정확성을 향상시키기 위한 개선 사항들을 정리합니다.

## 개선 사항

### 1. 검색 상태 동기화 개선

#### 고려사항
- `SearchBar` 컴포넌트의 내부 상태와 필터 상태가 동기화되지 않음
- 카테고리 변경 시 검색어가 유지되지 않음

#### 해결 방안
- `ProductGridWithFilters`에서 `filters.searchQuery`를 `SearchBar`의 `initialQuery`로 전달
- `SearchBar` 내부에서 `initialQuery` prop 변경 시 상태 동기화

```typescript
// ProductGridWithFilters.tsx
<SearchBar
  onSearch={(query) => updateFilter('searchQuery', query)}
  initialQuery={filters.searchQuery ?? ''}  // 상태 동기화
  rightElement={...}
/>
```

### 2. 검색 필터링 로직 개선

#### 고려사항
- 문자 단위 부분 문자열 검색으로 인한 부정확한 결과
- "감귤" 검색 시 "감자칩", "곶감", "단감" 등도 매칭됨

#### 해결 방안
- 문자 단위 부분 문자열 검색 로직 제거
- 정확한 문자열 매칭만 사용 (정확 일치, 시작 부분 일치, 포함 일치)

**Before**:
```typescript
// 문자 단위로 나누어 검색 (부정확)
const queryWords = normalizedQuery.split('').filter(Boolean)
const textWords = normalizedText.split('')
// "감귤" → ["감", "귤"] → "감자칩"에서 "감" 매칭됨
```

**After**:
```typescript
// 정확한 문자열 매칭만 사용
// 1. 정확한 일치 (100점)
if (normalizedText === normalizedQuery) return { score: 100, ... }

// 2. 시작 부분 일치 (80점)
if (normalizedText.startsWith(normalizedQuery)) return { score: 80, ... }

// 3. 포함 일치 (60점)
const index = normalizedText.indexOf(normalizedQuery)
if (index !== -1) return { score: 60, ... }

// 매칭되지 않음
return { score: 0, ... }
```

### 3. 안정성 개선

#### 메모리 누수 방지
- `requestAnimationFrame` 취소 로직 추가
- 컴포넌트 언마운트 후 상태 업데이트 방지
- ResizeObserver cleanup 보장

```typescript
useEffect(() => {
  let isMounted = true
  let rafId: number | null = null

  const updateLayout = () => {
    rafId = requestAnimationFrame(() => {
      if (!isMounted) return  // 언마운트 체크
      // ...
    })
  }

  return () => {
    isMounted = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)  // RAF 취소
    }
    resizeObserver.disconnect()
    window.removeEventListener('resize', handleResize)
  }
}, [dependencies])
```

#### 타입 안전성 강화
- `initialQuery` prop 타입 검증 추가
- `useProductFilters` 검증 로직 수정

```typescript
// SearchBar.tsx
useEffect(() => {
  const safeQuery = typeof initialQuery === 'string' ? initialQuery : ''
  setQuery(safeQuery)
}, [initialQuery])
```

## 검색 알고리즘

### 관련도 점수 계산

검색어와 상품명의 관련도를 점수로 계산합니다:

1. **정확한 일치** (100점)
   - 검색어와 상품명이 완전히 일치

2. **시작 부분 일치** (80점)
   - 상품명이 검색어로 시작

3. **포함 일치** (60점)
   - 상품명에 검색어가 포함됨

4. **유사도 검색** (30-50점, 옵션)
   - Fuzzy matching 사용 시

### 다중 키워드 검색

공백으로 구분된 여러 키워드를 검색할 수 있습니다:

- **AND 모드**: 모든 키워드가 매칭되어야 함
- **OR 모드**: 하나라도 매칭되면 됨

```typescript
// "제주 감귤" 검색 시
// AND 모드: "제주"와 "감귤" 모두 포함된 상품만
// OR 모드: "제주" 또는 "감귤" 중 하나라도 포함된 상품
```

## 사용 예시

### 검색어 필터링

```typescript
import { useProductFilters } from '@/lib/hooks'

const { filters, updateFilter, filteredProducts } = useProductFilters({
  products,
})

// 검색어 업데이트
<SearchBar
  onSearch={(query) => updateFilter('searchQuery', query)}
  initialQuery={filters.searchQuery ?? ''}
/>

// 필터링된 상품 표시
<ProductGrid products={filteredProducts} />
```

### 검색 결과 정렬

검색어가 있을 경우 관련도 점수에 따라 자동 정렬됩니다:

```typescript
// 관련도 점수가 높은 순서로 정렬
// 점수가 같으면 알파벳 순서로 정렬
```

## 관련 문서

- [카테고리 분류 및 검색/필터](./category-filter-search.md)
- [안정성 개선](./stability-improvements.md)
- [SearchBar 모듈화](./search-bar-modularization.md)

## 히스토리

### 2026-01-XX: 검색 상태 동기화 개선
- `ProductGridWithFilters`에서 `filters.searchQuery`를 `SearchBar`에 전달
- 카테고리 변경 시에도 검색어 유지

### 2026-01-XX: 검색 필터링 로직 개선
- 문자 단위 부분 문자열 검색 로직 제거
- 정확한 문자열 매칭만 사용하여 검색 정확도 향상
- "감귤" 검색 시 "제주 감귤"만 표시되도록 개선

### 2026-01-XX: 안정성 개선
- `requestAnimationFrame` 취소 로직 추가
- 컴포넌트 언마운트 후 상태 업데이트 방지
- 타입 안전성 강화
