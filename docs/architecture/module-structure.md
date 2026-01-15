# 모듈 구조 가이드

## 전체 구조

```
lib/
├── api/                    # API 관련 (서버 전용)
│   ├── fetch.ts           # Fetch 유틸리티
│   ├── mapper.ts          # 데이터 변환
│   └── index.ts           # 통합 export
│
├── image/                  # 이미지 관련
│   ├── matcher.ts         # 이미지 매칭 (서버 전용)
│   ├── optimizer.ts       # 이미지 최적화
│   ├── test-images.ts     # 테스트 이미지
│   └── index.ts           # 통합 export
│
├── product/                # 상품 처리
│   ├── process.ts         # 메인 처리
│   ├── normalize.ts       # 정규화
│   ├── validate.ts        # 검증
│   ├── derive.ts          # 파생 상태
│   ├── sort.ts            # 정렬
│   └── index.ts           # 통합 export
│
├── validation/             # 검증 로직
│   ├── guards.ts          # 타입 가드
│   ├── api.ts             # API 검증
│   └── index.ts           # 통합 export
│
├── utils/                  # 유틸리티
│   ├── string.ts          # 문자열
│   ├── number.ts          # 숫자
│   ├── product.ts         # 상품 관련
│   └── index.ts           # 통합 export
│
├── constants/              # 상수
│   ├── api.ts             # API 설정
│   ├── product.ts         # 상품 설정
│   ├── cache.ts           # 캐시 설정
│   ├── ui.ts              # UI 설정
│   └── index.ts           # 통합 export
│
├── types/                  # 타입 정의
│   ├── product.ts         # 상품 타입
│   ├── api.ts             # API 타입
│   └── index.ts           # 통합 export
│
├── errors/                 # 에러 타입
│   └── ...
│
├── styles.ts               # 스타일 정의
└── index.ts                # 라이브러리 통합 export
```

## 모듈별 책임

### API 모듈 (`lib/api/`)
- **책임**: 서버에서 API 호출 및 데이터 변환
- **서버 전용**: `server-only` 보호
- **주요 함수**:
  - `fetchProducts()`: 상품 목록 가져오기
  - `fetchWithRetry()`: 재시도 로직 포함 fetch
  - `fetchWithTimeout()`: 타임아웃 포함 fetch
  - `mapToProduct()`: API 응답 → 도메인 모델 변환

### 이미지 모듈 (`lib/image/`)
- **책임**: 이미지 매칭, 최적화, 테스트
- **서버/클라이언트**: 모듈별로 다름
- **주요 함수**:
  - `matchProductImage()`: 상품명과 이미지 매칭 (서버)
  - `isOptimizableImage()`: 최적화 가능 여부 (공통)
  - `getImageSrc()`: 이미지 경로 처리 (공통)

### 상품 처리 모듈 (`lib/product/`)
- **책임**: 상품 데이터 처리, 정렬, 검증
- **서버/클라이언트**: 공통 사용 가능
- **주요 함수**:
  - `processProducts()`: 메인 처리 함수
  - `normalizeProducts()`: 데이터 정규화
  - `filterValidProducts()`: 유효한 상품만 필터링
  - `sortProducts()`: 안정적 정렬
  - `addDerivedStates()`: 파생 상태 계산

### 검증 모듈 (`lib/validation/`)
- **책임**: 런타임 타입 검증
- **서버/클라이언트**: 공통 사용 가능
- **주요 함수**:
  - `isProduct()`: Product 타입 검증
  - `isProductArray()`: Product 배열 검증
  - `isApiResponse()`: API 응답 검증
  - `isNotNull()`: null 체크

### 유틸리티 모듈 (`lib/utils/`)
- **책임**: 범용 유틸리티 함수
- **서버/클라이언트**: 공통 사용 가능
- **주요 함수**:
  - `formatPrice()`: 가격 포맷팅
  - `parsePrice()`: 가격 파싱
  - `clamp()`: 범위 제한
  - `safeTrim()`: 안전한 문자열 trim
  - `createProductKey()`: 상품 key 생성

### 상수 모듈 (`lib/constants/`)
- **책임**: 애플리케이션 상수 정의
- **서버/클라이언트**: 공통 사용 가능
- **주요 상수**:
  - API 설정 (URL, 타임아웃, 재시도)
  - 상품 설정 (인덱스 범위)
  - 캐시 설정 (staleTime, gcTime)
  - UI 설정 (Skeleton 개수, Grid 컬럼)

### 타입 모듈 (`lib/types/`)
- **책임**: 타입 정의
- **서버/클라이언트**: 공통 사용 가능
- **주요 타입**:
  - `Product`: 상품 기본 타입
  - `ProcessedProduct`: 처리된 상품 타입
  - `ApiResponse`: API 응답 타입
  - `ApiResponseItem`: API 응답 아이템 타입

## Import 가이드

### 통합 Import (권장)
```typescript
import { 
  Product, 
  ProcessedProduct,
  processProducts,
  formatPrice,
  STYLES,
  SKELETON_COUNT
} from '@/lib'
```

### 모듈별 Import (필요시)
```typescript
// 서버 전용
import { fetchProducts } from '@/lib/api'

// 특정 기능만 필요할 때
import { sortProducts } from '@/lib/product/sort'
import { normalizeProduct } from '@/lib/product/normalize'
```

## 중복 제거 결과

### Before (중복)
- 정렬 로직이 `processProducts` 내부에 2번 반복
- 검증 로직이 여러 곳에 분산
- 정규화 로직이 `processProducts` 내부에 포함

### After (모듈화)
- 정렬: `lib/product/sort.ts` - 재사용 가능
- 검증: `lib/product/validate.ts` - 전용 모듈
- 정규화: `lib/product/normalize.ts` - 전용 모듈
- 파생 상태: `lib/product/derive.ts` - 전용 모듈

## 확장 가이드

### 새로운 기능 추가 시

1. **새로운 도메인 추가** (예: 주문)
   ```
   lib/
   └── order/
       ├── process.ts
       ├── validate.ts
       └── index.ts
   ```

2. **새로운 유틸리티 추가**
   ```
   lib/utils/
   └── date.ts  # 날짜 관련 유틸리티
   ```

3. **새로운 상수 추가**
   ```
   lib/constants/
   └── order.ts  # 주문 관련 상수
   ```

## 테스트 전략

각 모듈은 독립적으로 테스트 가능:

```typescript
// lib/product/sort.test.ts
import { sortProducts } from './sort'

describe('sortProducts', () => {
  it('should sort by index', () => {
    // 테스트 코드
  })
})
```

## 성능 고려사항

- 각 함수는 순수 함수로 설계되어 메모이제이션 가능
- 작은 단위로 분리되어 트리 쉐이킹 최적화 용이
- 모듈별 lazy loading 가능
