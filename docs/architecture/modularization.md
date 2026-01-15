# 모듈화 및 경로 최적화

## 개선 목표

1. 기능별 모듈화로 중복 및 재설정 최소화
2. 페이지별 index 파일로 경로 최적화
3. 공통 코드 추출 및 재사용성 향상

## 구조 개선

### 1. Index 파일 구조

각 폴더에 `index.ts` 파일을 추가하여 경로를 최적화했습니다.

```
lib/
  ├─ index.ts          # 모든 lib export 통합
  ├─ types.ts
  ├─ guards.ts
  ├─ api.ts
  ├─ product.ts
  ├─ constants.ts      # 공통 상수
  ├─ utils.ts          # 공통 유틸리티
  └─ styles.ts         # 공통 스타일

components/
  ├─ product/
  │   └─ index.ts      # 상품 컴포넌트 export
  ├─ ui/
  │   └─ index.ts      # UI 컴포넌트 export
  └─ layout/
      └─ index.ts      # 레이아웃 컴포넌트 export

hooks/
  └─ index.ts          # hooks export
```

### 2. 경로 최적화 예시

**Before:**
```ts
import { ProductGrid } from '@/components/product/ProductGrid'
import { Container } from '@/components/layout/Container'
import { fetchProducts } from '@/lib/api'
import { processProducts } from '@/lib/product'
import { formatPrice } from '@/lib/utils'
```

**After:**
```ts
import { ProductGrid } from '@/components/product'
import { Container } from '@/components/layout'
import { fetchProducts, processProducts, formatPrice } from '@/lib'
```

## 공통 코드 추출

### 1. 상수 분리 (`lib/constants.ts`)

**추출된 상수:**
- API 설정 (URL, 타임아웃, 재시도)
- 캐시 설정 (staleTime, gcTime)
- 상품 인덱스 범위
- Skeleton 개수
- Grid 컬럼 설정

**효과:**
- 중앙 집중식 관리
- 변경 시 한 곳만 수정
- 타입 안전성 보장

### 2. 유틸리티 함수 분리 (`lib/utils.ts`)

**추출된 함수:**
- `parsePrice`: price 값 변환
- `formatPrice`: 원화 포맷팅
- `createProductKey`: 상품 key 생성
- `clamp`: 범위 제한
- `safeTrim`: 안전한 문자열 trim

**효과:**
- 재사용성 향상
- 테스트 용이성
- 일관된 동작 보장

### 3. 공통 스타일 분리 (`lib/styles.ts`)

**추출된 스타일:**
- 상품 카드 스타일
- 이미지 스타일
- 버튼 스타일
- 그리드 스타일
- Skeleton 스타일

**효과:**
- 스타일 일관성 유지
- 변경 시 한 곳만 수정
- Tailwind 클래스 재사용

### 4. 공통 컴포넌트 추출

**추출된 컴포넌트:**
- `EmptyState`: 빈 상태 표시
- `ErrorState`: 에러 상태 표시

**효과:**
- 중복 코드 제거
- 일관된 UI/UX
- 유지보수 용이

## 모듈화 원칙

### 1. 단일 책임 원칙
- 각 모듈은 하나의 책임만 가짐
- 관련 기능끼리 그룹화

### 2. 의존성 최소화
- 순환 참조 방지
- 명확한 의존성 방향

### 3. 재사용성
- 공통 코드는 별도 모듈로 분리
- 컴포넌트는 props로 커스터마이징 가능

### 4. 확장성
- 새로운 기능 추가 시 기존 코드 영향 최소화
- 모듈 간 결합도 낮음

## 사용 예시

### Import 최적화

```ts
// Before
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductSkeleton } from '@/components/product/ProductSkeleton'

// After
import { ProductGrid, ProductCard, ProductSkeleton } from '@/components/product'
```

### 상수 사용

```ts
// Before
const timeout = 10000
const maxRetries = 3

// After
import { API_TIMEOUT, MAX_RETRIES } from '@/lib'
```

### 유틸리티 사용

```ts
// Before
const price = parseInt(item.price.replace(/[^0-9]/g, ''), 10)

// After
import { parsePrice } from '@/lib'
const price = parsePrice(item.price)
```

## 장점 요약

| 항목 | 효과 |
|------|------|
| **경로 단순화** | import 경로가 짧아지고 명확해짐 |
| **중복 제거** | 공통 코드 재사용으로 중복 최소화 |
| **유지보수성** | 변경 시 한 곳만 수정 |
| **타입 안전성** | 상수와 유틸리티로 타입 보장 |
| **테스트 용이성** | 모듈별 독립적 테스트 가능 |
| **확장성** | 새로운 기능 추가 용이 |
