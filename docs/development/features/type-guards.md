# 타입 가드 (Type Guards) 기능

## 구현 내용

런타임 타입 검증을 위한 타입 가드 함수들을 구현했습니다.

## 위치

`lib/guards.ts`

## 제공되는 타입 가드

### 1. `isNotNull<T>(value)`
- null/undefined 체크
- TypeScript 타입 좁히기 지원

### 2. `isArray<T>(value)`
- 배열 타입 체크
- 제네릭으로 요소 타입 지정 가능

### 3. `isProduct(value)`
- Product 타입 검증
- 모든 필드의 타입 및 범위 검증
- index: 0~49 범위
- price, current: 0 이상
- limit: 1 이상
- name: 비어있지 않은 문자열

### 4. `isProductArray(value)`
- Product 배열 검증
- 모든 요소가 Product 타입인지 확인

### 5. `isApiResponse(value)`
- API 응답 형식 검증
- content 배열 및 status 필드 확인

## 사용 예시

```ts
import { isProduct, isProductArray } from '@/lib/guards'

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
```

## 장점

1. **타입 안전성**: 런타임 검증 + 컴파일 타임 타입 체크
2. **에러 방지**: 잘못된 데이터로 인한 런타임 에러 방지
3. **디버깅 용이**: 명확한 검증 실패 메시지
4. **코드 가독성**: 의도가 명확한 타입 가드 함수
