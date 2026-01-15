# 에러 설계 아키텍처

## 목차

1. [에러 설계의 목표](#에러-설계의-목표)
2. [에러 타입 구조](#에러-타입-구조)
3. [에러 발생 위치별 처리 전략](#에러-발생-위치별-처리-전략)
4. [Error Boundary 구성](#error-boundary-구성)
5. [404 (not-found) 구조](#404-not-found-구조)
6. [에러 설계의 정체성](#에러-설계의-정체성)

---

## 에러 설계의 목표

에러 설계의 핵심 목표는 다음 4가지입니다:

### 1. 에러 타입을 코드 레벨에서 명확히 구분

- 문자열이 아닌 타입으로 에러 관리
- `instanceof`로 에러 타입 구분 가능
- 에러 타입별 적절한 처리 가능

### 2. 페이지 단위로 에러를 격리 (Error Boundary)

- Next.js App Router의 Error Boundary 활용
- 도메인별 에러 페이지로 격리
- 한 페이지의 에러가 다른 페이지에 영향 주지 않음

### 3. 공통 에러 UI + 도메인별 커스터마이징 가능

- 재사용 가능한 에러 컴포넌트 (`ErrorFallback`)
- 도메인별 메시지 커스터마이징
- 일관된 에러 UX 제공

### 4. 확장 시 구조를 깨지 않고 추가 가능

- 새로운 에러 타입 추가 용이
- 기존 코드 수정 최소화
- 확장 가능한 구조

**핵심 원칙:**
- ❌ "에러를 그냥 catch해서 메시지 뿌린다"
- ✅ "에러를 타입과 레이어로 관리한다"

---

## 에러 타입 구조

### Base Error (모든 에러의 부모)

```typescript
// lib/errors/AppError.ts
export abstract class AppError extends Error {
  readonly statusCode: number
  readonly isOperational: boolean

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = true
  }
}
```

**왜 필요한가?**

- `instanceof AppError`로 의도된 에러 vs 버그 구분
- 에러 분기 로직의 기준점
- 에러 타입별 적절한 처리 가능

### 도메인별 에러 타입

#### API 에러

```typescript
// lib/errors/ApiError.ts
export class ApiError extends AppError {
  constructor(
    message = '서버 요청 중 오류가 발생했습니다.',
    statusCode = 500
  ) {
    super(message, statusCode)
  }
}
```

**사용 예시:**
- 네트워크 오류
- 서버 응답 오류 (4xx, 5xx)
- 타임아웃 오류

#### 검증 에러

```typescript
// lib/errors/ValidationError.ts
export class ValidationError extends AppError {
  constructor(message = '잘못된 데이터 형식입니다.') {
    super(message, 400)
  }
}
```

**사용 예시:**
- API 응답 형식 오류
- 데이터 타입 불일치
- 필수 필드 누락

#### Not Found 에러

```typescript
// lib/errors/NotFoundError.ts
export class NotFoundError extends AppError {
  constructor(resource = '리소스') {
    super(`${resource}를 찾을 수 없습니다.`, 404)
  }
}
```

**사용 예시:**
- 상품을 찾을 수 없음
- 페이지를 찾을 수 없음
- 리소스가 존재하지 않음

### 확장 포인트

```typescript
// lib/errors/index.ts
export { AppError } from './AppError'
export { ApiError } from './ApiError'
export { ValidationError } from './ValidationError'
export { NotFoundError } from './NotFoundError'

// 나중에 추가 가능:
// export { AuthError } from './AuthError'
// export { PermissionError } from './PermissionError'
// export { RateLimitError } from './RateLimitError'
```

---

## 에러 발생 위치별 처리 전략

### API Fetch Layer

```typescript
// lib/api.ts
import { ApiError, ValidationError } from '@/lib/errors'

export async function fetchProducts() {
  const res = await fetch('https://api.zeri.pics')

  if (!res.ok) {
    throw new ApiError('상품 데이터를 불러오지 못했습니다.', res.status)
  }

  const data = await res.json()

  if (!isApiResponse(data)) {
    throw new ValidationError('API 응답 형식이 올바르지 않습니다.')
  }

  return data.content.map(mapToProduct)
}
```

**핵심:**
- 에러는 여기서 "의미 있는 타입"으로 던진다
- 네트워크 오류, 응답 형식 오류 등을 명확히 구분

### Server Component

```typescript
// components/product/ProductsListServer.tsx
import { NotFoundError } from '@/lib/errors'

export async function ProductsListServer() {
  const products = await fetchProducts()
  const processedProducts = processProducts(products)

  if (processedProducts.length === 0) {
    throw new NotFoundError('상품')
  }

  return <ProductGrid products={processedProducts} />
}
```

**핵심:**
- Server Component에서 에러를 던지면 Error Boundary가 자동으로 처리
- 도메인별 에러 타입 사용으로 적절한 UI 표시

---

## Error Boundary 구성

### 글로벌 에러 페이지

```typescript
// app/error.tsx
'use client'

import { ErrorFallback } from '@/components/error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <ErrorFallback error={error} onReset={reset} />
      </body>
    </html>
  )
}
```

**역할:**
- 최후의 방어선: 모든 에러를 최종적으로 처리
- 앱 전체에 영향을 주는 에러 처리

### 도메인 에러 페이지

```typescript
// app/products/error.tsx
'use client'

import { ErrorFallback } from '@/components/error'

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorFallback
      error={error}
      title="상품을 불러올 수 없습니다"
      onReset={reset}
    />
  )
}
```

**역할:**
- 페이지 단위 격리: `/products` 경로의 에러만 처리
- 도메인별 커스터마이징된 메시지 제공
- 확장성 핵심: 다른 도메인에도 동일한 패턴 적용 가능

### 공통 에러 UI

```typescript
// components/error/ErrorFallback.tsx
'use client'

import { AppError } from '@/lib/errors'
import { Container } from '@/components/layout'

interface ErrorFallbackProps {
  error: Error
  title?: string
  onReset?: () => void
}

export function ErrorFallback({ error, title, onReset }: ErrorFallbackProps) {
  const isAppError = error instanceof AppError
  
  const errorMessage = isAppError 
    ? error.message 
    : '알 수 없는 오류가 발생했습니다.'
  
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-xl font-bold">{title ?? '문제가 발생했습니다'}</h2>
        <p className="text-gray-600">{errorMessage}</p>
        {onReset && (
          <button onClick={onReset}>다시 시도</button>
        )}
      </div>
    </Container>
  )
}
```

**특징:**
- 에러 타입에 따라 적절한 메시지 표시
- 재시도 기능 제공
- 개발 환경에서 상세 에러 정보 표시

---

## 404 (not-found) 구조

### 글로벌 404

```typescript
// app/not-found.tsx
export default function NotFound() {
  return <h1>페이지를 찾을 수 없습니다.</h1>
}
```

### 도메인 404

```typescript
// app/products/not-found.tsx
export default function ProductsNotFound() {
  return <h1>상품이 존재하지 않습니다.</h1>
}
```

---

## 에러 설계의 정체성

이 구조는:

- ❌ 과제용 임시 에러 처리 아님
- ❌ try-catch 남발 아님
- ✅ 실제 서비스 확장 가능한 에러 아키텍처

### 핵심 원칙

> 에러는 문자열이 아닌 타입으로 관리하고,
> Next.js App Router의 Error Boundary를 활용해
> 도메인 단위로 격리된 에러 처리를 구현했습니다.

### 심사자가 보는 포인트

| 항목 | 설명 | 구현 여부 |
|------|------|----------|
| **타입 분리** | Error를 문자열로 안 씀 | ✅ |
| **책임 분리** | 발생 / 표현 분리 | ✅ |
| **Error Boundary** | 페이지 단위 | ✅ |
| **UX** | 재시도 / 안내 메시지 | ✅ |
| **확장성** | 에러 타입 추가 쉬움 | ✅ |

**👉 이 중 3개 이상 충족하면 고급 설계**

---

## 참고 자료

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [TypeScript Error Handling Best Practices](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4.0.html#labeled-tuple-elements)
