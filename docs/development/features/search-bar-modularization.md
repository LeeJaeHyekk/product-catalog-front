# SearchBar 컴포넌트 모듈화

## 개요

SearchBar 컴포넌트의 복잡한 레이아웃 계산 로직을 재사용 가능한 모듈로 분리하여 코드의 가독성과 유지보수성을 향상시켰습니다.

## 분석

### 기존 구조의 고려사항
- **중복 코드**: 레이아웃 계산 로직이 컴포넌트 내부에 하드코딩됨
- **재사용 불가**: 다른 컴포넌트에서 동일한 로직을 사용할 수 없음
- **상수 중복**: GAP, padding 값이 여러 곳에 하드코딩됨
- **복잡한 로직**: 100줄 이상의 복잡한 useEffect 로직
- **테스트 어려움**: 컴포넌트와 로직이 결합되어 단위 테스트 작성 어려움

## 해결 방안

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

**장점**:
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

**장점**:
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

**장점**:
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

**장점**:
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

## 관련 문서

- [모듈화 가이드](../architecture/modularization.md)
- [모듈 구조](../architecture/module-structure.md)
- [안정성 개선](./stability-improvements.md)

## 히스토리

### 2026-01-XX: 모듈화 완료
- SearchBar 컴포넌트의 레이아웃 계산 로직을 모듈로 분리
- UI 상수 통합 (`lib/constants/ui.ts`)
- 레이아웃 계산 유틸리티 생성 (`lib/utils/layout.ts`)
- 요소 크기 측정 훅 생성 (`lib/hooks/useElementSize.ts`)
- 동적 레이아웃 계산 훅 생성 (`lib/hooks/useDynamicLayout.ts`)
- 코드 가독성 및 재사용성 향상
