# 모듈화 가이드

## 개요

프로젝트를 기능별로 모듈화하여 중복을 제거하고 유지보수성을 향상시켰습니다.

## 새로운 구조

```
lib/
├── api/                    # API 관련 (서버 전용)
│   ├── fetch.ts           # Fetch 유틸리티 (타임아웃, 재시도)
│   ├── mapper.ts          # API 응답 → 도메인 모델 변환
│   └── index.ts           # API 모듈 통합 export
│
├── image/                  # 이미지 관련
│   ├── matcher.ts         # 이미지 매칭 알고리즘 (서버 전용)
│   ├── optimizer.ts       # 이미지 최적화 (클라이언트/서버 공통)
│   ├── test-images.ts     # 테스트 이미지 (개발 환경)
│   └── index.ts           # 이미지 모듈 통합 export
│
├── product/                # 상품 처리
│   ├── process.ts         # 메인 처리 함수
│   ├── normalize.ts       # 데이터 정규화
│   ├── validate.ts        # 데이터 검증
│   ├── derive.ts          # 파생 상태 계산
│   ├── sort.ts            # 정렬 로직 (중복 제거)
│   └── index.ts           # 상품 모듈 통합 export
│
├── validation/             # 검증 로직
│   ├── guards.ts          # 타입 가드
│   ├── api.ts             # API 응답 검증
│   └── index.ts           # 검증 모듈 통합 export
│
├── utils/                  # 유틸리티 함수
│   ├── string.ts          # 문자열 유틸리티
│   ├── number.ts          # 숫자 유틸리티
│   ├── product.ts          # 상품 관련 유틸리티
│   └── index.ts           # 유틸리티 통합 export
│
├── constants/              # 상수 정의
│   ├── api.ts             # API 관련 상수
│   ├── product.ts         # 상품 관련 상수
│   ├── cache.ts           # 캐시 관련 상수
│   ├── ui.ts              # UI 관련 상수
│   └── index.ts           # 상수 통합 export
│
├── types/                  # 타입 정의
│   ├── product.ts         # 상품 타입
│   ├── api.ts             # API 타입
│   └── index.ts           # 타입 통합 export
│
├── errors/                 # 에러 타입 (기존 구조 유지)
│   ├── AppError.ts
│   ├── ApiError.ts
│   ├── ValidationError.ts
│   ├── NotFoundError.ts
│   └── index.ts
│
├── styles.ts               # 스타일 정의 (기존 구조 유지)
└── index.ts                # 라이브러리 통합 export
```

## 주요 개선 사항

### 1. 중복 제거

#### 정렬 로직 통합
**Before:**
```typescript
// processProducts 내부에 중복된 정렬 로직
const available = mapped.filter(...).sort((a, b) => { /* 중복 코드 */ })
const soldOut = mapped.filter(...).sort((a, b) => { /* 중복 코드 */ })
```

**After:**
```typescript
// lib/product/sort.ts - 공통 정렬 함수
export function sortProducts(products: ProcessedProduct[]): ProcessedProduct[] {
  return [...products].sort(compareProducts)
}

// processProducts에서 재사용
const available = sortProducts(mapped.filter(p => !p.isSoldOut))
const soldOut = sortProducts(mapped.filter(p => p.isSoldOut))
```

#### 검증 로직 통합
**Before:**
- `lib/product.ts`에 검증 로직 포함
- `lib/guards.ts`에 타입 가드 포함
- 중복된 검증 로직

**After:**
- `lib/product/validate.ts` - 상품 검증 전용
- `lib/validation/guards.ts` - 범용 타입 가드
- `lib/validation/api.ts` - API 응답 검증

#### 데이터 정규화 분리
**Before:**
- `processProducts` 내부에 정규화 로직 포함

**After:**
- `lib/product/normalize.ts` - 정규화 전용 모듈
- 재사용 가능한 `normalizeProduct`, `normalizeProducts` 함수

#### 파생 상태 계산 분리
**Before:**
- `processProducts` 내부에 직접 계산

**After:**
- `lib/product/derive.ts` - 파생 상태 계산 전용
- 재사용 가능한 `addDerivedState`, `addDerivedStates` 함수

### 2. 기능별 모듈화

#### API 모듈 (`lib/api/`)
- `fetch.ts`: Fetch 유틸리티 (타임아웃, 재시도)
- `mapper.ts`: API 응답 → 도메인 모델 변환
- `index.ts`: 통합 export

#### 이미지 모듈 (`lib/image/`)
- `matcher.ts`: 이미지 매칭 알고리즘 (서버 전용)
- `optimizer.ts`: 이미지 최적화 (클라이언트/서버 공통)
- `test-images.ts`: 테스트 이미지
- `index.ts`: 통합 export

#### 상품 처리 모듈 (`lib/product/`)
- `process.ts`: 메인 처리 함수
- `normalize.ts`: 데이터 정규화
- `validate.ts`: 데이터 검증
- `derive.ts`: 파생 상태 계산
- `sort.ts`: 정렬 로직
- `index.ts`: 통합 export

### 3. 타입 정의 통합

#### 도메인별 분리
- `lib/types/product.ts`: 상품 관련 타입
- `lib/types/api.ts`: API 관련 타입
- `lib/types/index.ts`: 통합 export

### 4. 상수 정의 기능별 분리

- `lib/constants/api.ts`: API 설정
- `lib/constants/product.ts`: 상품 설정
- `lib/constants/cache.ts`: 캐시 설정
- `lib/constants/ui.ts`: UI 설정
- `lib/constants/index.ts`: 통합 export

### 5. 유틸리티 함수 카테고리별 분리

- `lib/utils/string.ts`: 문자열 유틸리티
- `lib/utils/number.ts`: 숫자 유틸리티
- `lib/utils/product.ts`: 상품 관련 유틸리티
- `lib/utils/index.ts`: 통합 export

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

## 사용 방법

### 통합 Import (권장)

```typescript
// 클라이언트/서버 공통
import { 
  Product, 
  ProcessedProduct,
  processProducts,
  formatPrice,
  STYLES,
  SKELETON_COUNT
} from '@/lib'

// 서버 전용 (직접 import)
import { fetchProducts } from '@/lib/api'
```

### 세부 모듈 Import (필요시)

```typescript
// 특정 모듈만 필요할 때
import { sortProducts } from '@/lib/product/sort'
import { normalizeProduct } from '@/lib/product/normalize'
import { isValidProduct } from '@/lib/product/validate'
```

## 장점

1. **중복 제거**: 정렬, 검증, 정규화 로직이 재사용 가능한 함수로 분리
2. **명확한 책임**: 각 모듈이 단일 책임을 가짐
3. **유지보수성**: 변경 시 해당 모듈만 수정하면 됨
4. **테스트 용이성**: 작은 단위 함수로 테스트 가능
5. **확장성**: 새로운 기능 추가 시 해당 모듈에만 추가
6. **타입 안전성**: 타입 정의가 도메인별로 명확히 분리

## 마이그레이션 가이드

기존 코드는 `@/lib`에서 통합 export를 통해 자동으로 호환됩니다.

**변경 불필요:**
```typescript
import { formatPrice, STYLES } from '@/lib' // ✅ 그대로 작동
```

**변경 필요:**
```typescript
// Before
import { fetchProducts } from '@/lib/api' // ❌ 이제는 직접 import

// After
import { fetchProducts } from '@/lib/api' // ✅ 서버 전용 직접 import
```

## 히스토리

### 2024-01-XX: 초기 모듈화
- 기능별 모듈 구조 설계
- 중복 코드 제거 시작
- 경로 최적화 (index.ts 파일 추가)

### 2024-01-XX: 완전 모듈화
- 모든 기능별 모듈 분리 완료
- 정렬, 검증, 정규화 로직 통합
- 타입 및 상수 정의 통합
- 모듈별 책임 명확화
