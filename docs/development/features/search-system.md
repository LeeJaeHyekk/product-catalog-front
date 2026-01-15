# 검색 시스템

## 개요

검색 기능의 안정성과 정확성을 향상시키기 위한 개선 사항들을 정리한 문서입니다. SearchBar 컴포넌트의 모듈화와 검색 필터링 로직 개선을 포함합니다.

## 검색 기능 개선

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

## SearchBar 컴포넌트 모듈화

### 분석

#### 기존 구조의 고려사항
- **중복 코드**: 레이아웃 계산 로직이 컴포넌트 내부에 하드코딩됨
- **재사용 불가**: 다른 컴포넌트에서 동일한 로직을 사용할 수 없음
- **상수 중복**: GAP, padding 값이 여러 곳에 하드코딩됨
- **복잡한 로직**: 100줄 이상의 복잡한 useEffect 로직
- **테스트 어려움**: 컴포넌트와 로직이 결합되어 단위 테스트 작성 어려움

### 모듈화 구조

```
lib/
├── constants/
│   └── ui.ts                    # UI 상수 통합
├── utils/
│   └── layout.ts                # 레이아웃 계산 유틸리티
└── hooks/
    ├── useElementSize.ts        # 요소 크기 측정 훅
    └── useDynamicLayout.ts      # 동적 레이아웃 계산 훅
```

### 생성된 모듈

#### 1. UI 상수 통합 (`lib/constants/ui.ts`)

```typescript
export const LAYOUT_GAPS = {
  buttonGap: 13,
  inputPaddingDefault: 16,
  inputPaddingRightDefault: 12,
} as const

export const SEARCH_BAR = {
  gap: LAYOUT_GAPS.buttonGap,
  defaultPadding: LAYOUT_GAPS.inputPaddingDefault,
  defaultRightPadding: LAYOUT_GAPS.inputPaddingRightDefault,
} as const
```

**고려 사항**:
- 상수값을 한 곳에서 관리
- 변경 시 한 곳만 수정하면 됨
- 타입 안전성 보장

#### 2. 레이아웃 계산 유틸리티 (`lib/utils/layout.ts`)

```typescript
export function getElementWidth(element: HTMLElement | null): number {
  if (!element) return 0
  return element.offsetWidth || 0
}

export function calculateSearchBarLayout(
  options: CalculateSearchBarLayoutOptions
): SearchBarLayout {
  // 순수 함수로 레이아웃 계산 로직 구현
}
```

**고려 사항**:
- 순수 함수로 단위 테스트 작성 용이
- 재사용 가능
- 로직과 UI 분리

#### 3. 요소 크기 측정 훅 (`lib/hooks/useElementSize.ts`)

```typescript
export function useElementSize<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  enabled = true
): ElementSize

export function useElementWidth<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  enabled = true
): number
```

**고려 사항**:
- ResizeObserver 패턴 재사용
- 메모리 누수 방지 (자동 cleanup)
- 다른 컴포넌트에서도 사용 가능

#### 4. 동적 레이아웃 계산 훅 (`lib/hooks/useDynamicLayout.ts`)

```typescript
export function useSearchBarLayout(
  options: UseSearchBarLayoutOptions
): SearchBarLayout {
  // ResizeObserver + requestAnimationFrame 패턴
  // 메모리 누수 방지
  // 언마운트 후 상태 업데이트 방지
}
```

**고려 사항**:
- 복잡한 로직을 훅으로 캡슐화
- 안정성 보장 (메모리 누수 방지)
- 컴포넌트 코드 간소화

## 리팩토링 결과

### Before (기존 코드)

```typescript
export function SearchBar({ ... }) {
  const [inputPaddingRight, setInputPaddingRight] = useState<number>(48)
  const [clearButtonRight, setClearButtonRight] = useState<number>(12)
  const GAP = 13 // 하드코딩

  useEffect(() => {
    // 100줄 이상의 복잡한 레이아웃 계산 로직
    // ResizeObserver 설정
    // requestAnimationFrame 처리
    // cleanup 로직
  }, [query, rightElement, GAP])
  
  // ...
}
```

### After (리팩토링 후)

```typescript
export function SearchBar({ ... }) {
  const rightElementRef = useRef<HTMLDivElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)

  // 모듈화된 훅 사용
  const layout = useSearchBarLayout({
    rightElementRef,
    clearButtonRef,
    hasClearButton: !!query,
    hasRightElement: !!rightElement,
    gap: SEARCH_BAR.gap,
  })
  
  // 간단하고 명확한 코드
}
```

## 개선 효과

### 1. 코드 가독성 향상
- 컴포넌트 코드가 100줄 이상 감소
- 로직이 명확하게 분리됨

### 2. 재사용성 향상
- 다른 컴포넌트에서도 동일한 레이아웃 계산 로직 사용 가능
- 유틸리티 함수를 독립적으로 사용 가능

### 3. 유지보수성 향상
- 상수값 변경 시 한 곳만 수정
- 로직 변경 시 해당 모듈만 수정

### 4. 테스트 용이성
- 순수 함수로 분리되어 단위 테스트 작성 용이
- 컴포넌트와 로직을 독립적으로 테스트 가능

### 5. 타입 안전성
- TypeScript 타입 정의로 안전한 사용 보장
- 컴파일 타임에 오류 발견 가능

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

### SearchBar 컴포넌트에서 사용

```typescript
import { useSearchBarLayout } from '@/lib/hooks'
import { SEARCH_BAR } from '@/lib/constants'

const layout = useSearchBarLayout({
  rightElementRef,
  clearButtonRef,
  hasClearButton: !!query,
  hasRightElement: !!rightElement,
  gap: SEARCH_BAR.gap,
})

<input style={{ paddingRight: `${layout.inputPaddingRight}px` }} />
```

### 다른 컴포넌트에서 요소 크기 측정

```typescript
import { useElementWidth } from '@/lib/hooks'

const ref = useRef<HTMLDivElement>(null)
const width = useElementWidth(ref)

// width 값이 자동으로 업데이트됨
```

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

- [모듈화 가이드](../architecture/modularization.md)
- [모듈 구조](../architecture/module-structure.md)
- [안정성 개선](./stability-improvements.md)
- [카테고리 시스템](./category-system.md)

## 히스토리

### 2026-01-XX: 모듈화 완료
- SearchBar 컴포넌트의 레이아웃 계산 로직을 모듈로 분리
- UI 상수 통합 (`lib/constants/ui.ts`)
- 레이아웃 계산 유틸리티 생성 (`lib/utils/layout.ts`)
- 요소 크기 측정 훅 생성 (`lib/hooks/useElementSize.ts`)
- 동적 레이아웃 계산 훅 생성 (`lib/hooks/useDynamicLayout.ts`)
- 코드 가독성 및 재사용성 향상

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
