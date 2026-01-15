# 타입 가드 (Type Guards) 구현

## 개요

프로젝트에서 런타임 타입 검증을 위한 타입 가드 함수들을 구현하여 타입 안전성을 확보하고 있습니다.

## 구현 위치

`lib/validation/guards.ts`, `lib/validation/api.ts`

## 제공되는 타입 가드 함수

### 1. `isNotNull<T>(value: T | null | undefined): value is T`
- **용도**: null/undefined 체크
- **사용 위치**:
  - `lib/product/validate.ts`: `filterValidProducts`에서 사용

### 2. `isArray<T>(value: unknown): value is T[]`
- **용도**: 배열 타입 체크
- **사용 위치**:
  - `lib/product/process.ts`: `processProducts`에서 사용
  - `lib/hooks/useProductFilters.ts`: `useProductFilters`에서 사용
  - `components/product/CategoryPanel.tsx`: props 검증
  - `components/product/ProductGridWithFilters.tsx`: props 검증
  - `lib/product/filter.ts`: `filterProducts`, `getAvailableSubCategories`에서 사용
  - `lib/product/category.ts`: `enrichProductsWithCategory`에서 사용
  - `lib/validation/api.ts`: `isApiResponse` 내부에서 사용

### 3. `isProduct(value: unknown): value is Product`
- **용도**: Product 타입 검증 (모든 필드 타입 및 범위 검증)
- **검증 항목**:
  - `index`: number, 0~49 범위
  - `name`: string, 비어있지 않음
  - `price`: number, 0 이상
  - `current`: number, 0 이상
  - `limit`: number, 1 이상
  - `image`: null 또는 string
- **사용 위치**:
  - `lib/product/validate.ts`: `isValidProduct`와 함께 사용
  - `lib/validation/guards.ts`: `isProductArray` 내부에서 사용

### 4. `isProductArray(value: unknown): value is Product[]`
- **용도**: Product 배열 검증
- **구현**: `isArray`로 배열 확인 후 `every(isProduct)`로 모든 요소 검증
- **사용 위치**:
  - `lib/api/index.ts`: API 응답 검증 후 사용

### 5. `isApiResponse(value: unknown): value is ApiResponse`
- **위치**: `lib/validation/api.ts`
- **용도**: API 응답 형식 검증
- **사용 위치**:
  - `lib/api/index.ts`: `fetchProducts`에서 API 응답 검증

### 6. `isApiResponseItem(value: unknown): value is ApiResponseItem`
- **위치**: `lib/validation/api.ts`
- **용도**: API 응답 아이템 검증
- **사용 위치**:
  - `lib/api/index.ts`: API 응답 아이템 검증

### 7. `isCategoryArray(value: unknown): value is readonly Category[]`
- **위치**: `lib/validation/guards.ts`
- **용도**: Category 배열 검증
- **사용 위치**:
  - `lib/data/categories.ts`: 카테고리 데이터 검증

## 사용 예시

```typescript
import { isProduct, isProductArray, isApiResponse } from '@/lib/validation'

// 단일 Product 검증
if (isProduct(data)) {
  // TypeScript가 data를 Product로 인식
  console.log(data.name)
}

// 배열 검증
if (isProductArray(products)) {
  // TypeScript가 products를 Product[]로 인식
  products.forEach(p => console.log(p.name))
}

// API 응답 검증
const data: unknown = await response.json()
if (!isApiResponse(data)) {
  throw new ValidationError('API 응답 형식이 올바르지 않습니다.')
}
```

## 타입 가드 사용 패턴

### 사용 패턴 예시

#### 1. API 응답 검증 (`lib/api/index.ts`)
```typescript
const data: unknown = await response.json()

// 타입 가드로 검증
if (!isApiResponse(data)) {
  throw new ValidationError('API 응답 형식이 올바르지 않습니다.')
}

// 타입 가드 통과 후 안전하게 사용
if (!isProductArray(data.content)) {
  // fallback 처리
}

// 타입 가드 통과 후 직접 사용
return Promise.all(data.content.map(item => mapToProduct(item, imageMap)))
```

#### 2. 배열 검증 (`lib/product/process.ts`)
```typescript
export function processProducts(products: Product[]): ProcessedProduct[] {
  if (!isArray(products)) {
    throw new Error('processProducts: products must be an array')
  }
  // 타입 가드 통과 후 안전하게 사용
}
```

#### 3. Props 검증 (`components/product/CategoryPanel.tsx`)
```typescript
export function CategoryPanel({ products, ... }: CategoryPanelProps) {
  if (!isArray(products)) {
    console.warn('CategoryPanel: products must be an array')
    return null
  }
  // 타입 가드 통과 후 안전하게 사용
}
```

#### 4. 타입 가드 체이닝 (`lib/product/validate.ts`)
```typescript
export function filterValidProducts(products: (Product | null | undefined)[]): Product[] {
  return products.filter(isNotNull).filter(isValidProduct)
}
```

## 타입 가드 안전성 검증

### 구현 안전성
- [x] 모든 타입 가드 함수가 `value is Type` 형태의 타입 단언 사용
- [x] 타입 가드 내부에서 적절한 런타임 검증 수행
- [x] 타입 가드 내부의 `as Record<string, unknown>` 사용은 안전 (이미 `typeof value !== 'object' || value === null` 체크 후)

### 사용 안전성
- [x] 타입 가드 사용 전 `unknown` 타입으로 시작
- [x] 타입 가드 통과 후 안전하게 타입이 좁혀짐
- [x] 타입 가드 실패 시 적절한 에러 처리 또는 fallback
- [x] 타입 가드 후 불필요한 타입 단언 없음

### 일관성
- [x] `Array.isArray` 직접 사용을 `isArray` 타입 가드로 통일
- [x] 모든 배열 검증에서 타입 가드 사용
- [x] 모든 API 응답 검증에서 타입 가드 사용

## 개선 사항

### 1. `Array.isArray` → `isArray` 타입 가드로 통일
- **이전**: `lib/product/filter.ts`, `lib/product/category.ts`에서 `Array.isArray` 직접 사용
- **개선**: `isArray` 타입 가드를 사용하여 일관성 확보
- **효과**: 타입 안전성 향상 및 코드 일관성 개선

## 장점

1. **타입 안전성**: 런타임 검증 + 컴파일 타임 타입 체크
2. **에러 방지**: 잘못된 데이터로 인한 런타임 에러 방지
3. **디버깅 용이**: 명확한 검증 실패 메시지
4. **코드 가독성**: 의도가 명확한 타입 가드 함수
5. **일관성**: 프로젝트 전반에 걸쳐 일관된 타입 검증 패턴

## 결론

타입 가드는 안전 장치로 동작하고 있습니다.

- 모든 타입 가드 함수가 올바르게 구현되어 있음
- 타입 가드가 적절한 위치에서 사용되고 있음
- 타입 가드 통과 후 안전하게 타입이 좁혀짐
- 타입 가드 실패 시 적절한 에러 처리
- 코드 일관성 확보
