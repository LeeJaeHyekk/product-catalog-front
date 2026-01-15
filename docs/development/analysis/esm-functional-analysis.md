# ESM 문법 및 함수형 설계 분석 보고서

## 분석 일시
2026년

## 분석 범위
- 전체 프로젝트 파일 (`.ts`, `.tsx`)
- 설정 파일 (`package.json`, `tsconfig.json`)

---

## 1. ESM 문법 준수 분석

### 1.1 설정 파일 확인

#### package.json
```json
{
  "type": "module",  // ✅ ESM 모듈 시스템 명시
  ...
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "module": "ESNext",  // ✅ ESM 모듈 시스템
    "moduleResolution": "bundler",  // ✅ 최신 모듈 해석
    ...
  }
}
```

### 1.2 코드 파일 분석

#### Import 문법 사용
- **확인된 파일 수**: 전체 파일
- **사용 패턴**: `import ... from '...'`
- **예시**:
  ```typescript
  // lib/api.ts
  import type { Product } from './types'
  import { isApiResponse, isProductArray } from './guards'
  import { ApiError, ValidationError } from './errors'
  
  // components/product/ProductGrid.tsx
  import type { ProcessedProduct } from '@/lib'
  import { ProductCard } from './ProductCard'
  ```

#### ✅ Export 문법 사용
- **확인된 파일 수**: 전체 파일
- **사용 패턴**: `export function`, `export const`, `export type`, `export { ... }`
- **예시**:
  ```typescript
  // lib/product.ts
  export function processProducts(products: Product[]): ProcessedProduct[] {
    // ...
  }
  
  // lib/index.ts
  export type { Product, ProcessedProduct } from './types'
  export { fetchProducts } from './api'
  export { processProducts } from './product'
  ```

#### ✅ CommonJS 사용 여부
- **검색 결과**: `require()`, `module.exports`, `exports.` 사용 없음
- **예외**: `design structure.md` 문서에 예시로만 언급됨 (실제 코드 아님)

### 1.3 ESM 준수 확인

| 항목 | 상태 | 비고 |
|------|------|------|
| `package.json` 설정 | 준수 | `"type": "module"` 설정됨 |
| `tsconfig.json` 설정 | 준수 | `"module": "ESNext"` 설정됨 |
| Import 문법 | 준수 | 모든 파일에서 `import` 사용 |
| Export 문법 | 준수 | 모든 파일에서 `export` 사용 |
| CommonJS 사용 | 준수 | `require`/`module.exports` 사용 없음 |

**ESM 준수: 준수됨**

---

## 2. 함수형 설계 원칙 준수 분석

### 2.1 컴포넌트 분석

#### 함수형 컴포넌트 사용
- **확인된 컴포넌트 수**: 15개
- **클래스 컴포넌트**: 0개
- **함수형 컴포넌트**: 15개

**예시:**
```typescript
// 함수형 컴포넌트
export function ProductCard({ product }: ProductCardProps) {
  // ...
}

export function ProductGrid({ products }: ProductGridProps) {
  // ...
}

export function ErrorFallback({ error, title, onReset }: ErrorFallbackProps) {
  // ...
}
```

### 2.2 유틸리티 함수 분석

#### 순수 함수 사용
- **확인된 함수 수**: 10개 이상
- **순수 함수**: 대부분
- **부수 효과**: 없음 (API 호출 함수 제외)

**예시:**
```typescript
// 순수 함수
export function processProducts(products: Product[]): ProcessedProduct[] {
  // 동일 입력에 대해 동일 출력 보장
  // 부수 효과 없음
}

export function parsePrice(price: string | number): number {
  // 순수 함수
}

export function formatPrice(price: number): string {
  // 순수 함수
}

export function clamp(value: number, min: number, max: number): number {
  // 순수 함수
}
```

### 2.3 타입 가드 함수 분석

#### 함수형 타입 가드
- **확인된 타입 가드**: 5개
- **모두 함수 형태**: 모두 함수 형태로 구현됨

**예시:**
```typescript
// 함수형 타입 가드
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isProduct(value: unknown): value is Product {
  // ...
}

export function isProductArray(value: unknown): value is Product[] {
  // ...
}
```

### 2.4 클래스 사용 분석

#### 예외적 클래스 사용: 에러 타입

**사용 위치**: `lib/errors/` 폴더
- `AppError` (추상 클래스)
- `ApiError` (클래스)
- `ValidationError` (클래스)
- `NotFoundError` (클래스)

**사용 이유:**
1. **에러 타입 구분**: `instanceof` 연산자로 에러 타입 구분 필요
2. **TypeScript 표준**: TypeScript/JavaScript에서 에러 타입 구분을 위한 표준 방법
3. **Error Boundary 호환**: Next.js Error Boundary와의 호환성

**함수형 대안 검토:**
```typescript
// 함수형 대안은 비효율적
type ErrorType = 'api' | 'validation' | 'notFound'
function createError(type: ErrorType, message: string) {
  return { type, message, statusCode: ... }
}
// 문제: instanceof로 타입 구분 불가능
```

**결론**: 에러 타입 구분을 위해서는 클래스 사용이 필수적이며, 이는 함수형 설계 원칙의 예외적 허용 사항입니다.

### 2.5 함수형 설계 확인

| 항목 | 상태 | 비고 |
|------|------|------|
| 함수형 컴포넌트 | 준수 | 클래스 컴포넌트 없음 |
| 순수 함수 | 준수 | 부수 효과 최소화 |
| 함수형 타입 가드 | 준수 | 모두 함수 형태 |
| 클래스 사용 | 예외적 | 에러 타입만 사용 (필수) |

**함수형 설계 준수: 대부분 준수** (에러 클래스는 예외)

---

## 3. 종합 분석

### 3.1 ESM 문법 준수

**결과: ✅ 완료**

- 모든 파일에서 ESM `import`/`export` 문법 사용
- CommonJS 문법 전혀 사용하지 않음
- 설정 파일에서 ESM 모듈 시스템 명시

### 3.2 함수형 설계 준수

**결과: 대부분 준수**

**준수 사항:**
- 모든 컴포넌트가 함수형 컴포넌트
- 모든 유틸리티 함수가 순수 함수
- 타입 가드가 함수 형태
- 부수 효과 최소화

**예외 사항:**
- 에러 타입만 클래스 사용 (타입 구분을 위한 필수 사항)

### 3.3 설계 원칙 확인

| 설계 원칙 | 상태 |
|-----------|------|
| ESM 모듈 시스템 | 준수됨 |
| 함수형 컴포넌트 | 준수됨 |
| 순수 함수 | 준수됨 |
| 클래스 지양 | 에러 타입 예외 |

---

## 4. 권장 사항

### 4.1 현재 상태

**주요 특징:**
1. ESM 문법을 준수
2. 함수형 설계 원칙을 대부분 준수
3. 에러 클래스 사용은 타입 구분을 위한 필수 사항으로 정당화됨

### 4.2 개선 가능 사항

**현재 상태로도 충분하지만, 추가 개선을 원한다면:**

1. **에러 타입을 함수형으로 전환 (선택적)**
   - 현재: 클래스 기반 (`class ApiError extends AppError`)
   - 대안: 타입 기반 + 팩토리 함수
   ```typescript
   type ErrorType = 'api' | 'validation' | 'notFound'
   interface AppError {
     type: ErrorType
     message: string
     statusCode: number
   }
   function createApiError(message: string, statusCode: number): AppError {
     return { type: 'api', message, statusCode }
   }
   ```
   - **단점**: `instanceof` 사용 불가, 타입 구분이 덜 명확함
   - **결론**: 현재 클래스 방식이 더 나음

2. **현재 구조 유지**
   - 에러 클래스는 TypeScript/JavaScript 표준
   - Error Boundary와의 호환성 유지
   - 타입 구분이 명확함

---

## 5. 결론

### 5.1 ESM 문법 준수
**준수됨**

프로젝트 전체가 ESM 문법을 준수하고 있습니다.

### 5.2 함수형 설계 준수
**대부분 준수됨**

함수형 설계 원칙을 대부분 준수하고 있으며, 에러 타입만 예외적으로 클래스를 사용합니다. 이는 타입 구분을 위한 필수 사항으로 정당화됩니다.

### 5.3 종합

- ESM 문법: 준수
- 함수형 설계: 대부분 준수 (에러 타입 예외는 정당화됨)
- 코드 품질: 양호
- 설계 일치도: 높음

**결론**: 프로젝트는 ESM 문법과 함수형 설계 원칙을 잘 준수하고 있습니다.

## 히스토리

### 2026-01-XX: ESM 문법 적용
- **목표**: 모던 JavaScript 표준 준수
- **구현**: `package.json`에 `"type": "module"` 설정, 모든 파일에서 ESM 문법 사용
- **효과**: 트리 쉐이킹 최적화, 정적 분석 용이

### 2026-01-XX: 함수형 프로그래밍 패러다임 적용
- **목표**: 순수 함수, 불변성, 함수형 컴포넌트 사용
- **구현**: 클래스 대신 함수 사용, 순수 함수 설계, 불변성 유지
- **효과**: 테스트 용이성 향상, 부수 효과 최소화, 버그 감소

### 2026-01-XX: 분석 및 검증
- **분석**: 전체 코드베이스 ESM 및 함수형 패러다임 준수 여부 확인
- **결과**: ESM 준수, 함수형 대부분 준수 (에러 클래스는 예외)