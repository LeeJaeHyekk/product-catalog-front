# 에러 페이지 시스템

## 개요

프로젝트에서는 각 에러 타입에 대해 동적으로 다른 UI를 표시하는 에러 페이지 시스템을 구현했습니다. Next.js App Router의 Error Boundary를 활용하여 도메인 단위로 격리된 에러 처리를 제공합니다.

## 에러 페이지 파일 구조

### 1. Error Boundary 페이지 (런타임 에러 처리)

#### `app/error.tsx` - 글로벌 에러 페이지
- **위치**: `app/error.tsx`
- **역할**: Next.js App Router의 최상위 Error Boundary
- **처리 범위**: 모든 에러를 최종적으로 처리하는 최후의 방어선
- **특징**: 
  - `<html>`, `<body>` 태그 포함 (최상위 에러이므로)
  - `DynamicErrorPage` 컴포넌트 사용
  - 에러 타입에 따라 동적 UI 표시

#### `app/products/error.tsx` - 상품 도메인 에러 페이지
- **위치**: `app/products/error.tsx`
- **역할**: `/products` 경로에서 발생하는 에러만 처리
- **처리 범위**: 상품 관련 에러만 격리 처리
- **특징**:
  - 도메인별 커스텀 제목: "상품을 불러올 수 없습니다"
  - 개발 환경에서 에러 로깅
  - `DynamicErrorPage` 컴포넌트 사용

### 2. Not Found 페이지 (404 에러)

#### `app/not-found.tsx` - 글로벌 404 페이지
- **위치**: `app/not-found.tsx`
- **역할**: 존재하지 않는 경로로 접근했을 때 표시
- **처리 범위**: 전체 앱의 404 에러
- **특징**:
  - `NotFoundError` 인스턴스 생성하여 `DynamicErrorPage`에 전달
  - 커스텀 제목: "페이지를 찾을 수 없습니다"
  - 이미지 기반 시각적 표현

#### `app/products/not-found.tsx` - 상품 도메인 404 페이지
- **위치**: `app/products/not-found.tsx`
- **역할**: 상품 관련 리소스를 찾을 수 없을 때 표시
- **처리 범위**: 상품 도메인의 404 에러
- **특징**:
  - `NotFoundError` 인스턴스 생성하여 `DynamicErrorPage`에 전달
  - 커스텀 제목: "상품을 찾을 수 없습니다"
  - 이미지 기반 시각적 표현

## 에러 타입 구조

### 에러 클래스 계층 구조

```
AppError (기본 에러 클래스)
├── ApiError (서버 연결 오류)
├── ValidationError (데이터 검증 오류)
└── NotFoundError (리소스를 찾을 수 없음)
```

### 에러 타입별 특징

#### ApiError (서버 연결 오류)
- **용도**: 네트워크 오류, 서버 오류 등
- **statusCode**: HTTP 상태 코드 (400, 404, 500 등)
- **이미지**: statusCode에 따라 동적 선택 (`/400Error.gif`, `/404Error.gif`, `/500Error.gif`)

#### ValidationError (데이터 검증 오류)
- **용도**: 데이터 형식 오류, 유효성 검증 실패
- **이미지**: `/400Error.gif`

#### NotFoundError (리소스를 찾을 수 없음)
- **용도**: 404 에러, 존재하지 않는 리소스
- **이미지**: `/404Error.gif`

## 동적 에러 페이지 시스템

### 에러 타입별 동적 UI

각 에러 타입에 따라 다음이 동적으로 변경됩니다:
- **이미지**: 에러 타입 및 상태 코드에 따른 GIF 이미지
- **색상**: 에러 타입별 색상 테마
- **제목 및 설명**: 에러 타입에 맞는 사용자 친화적 메시지
- **액션 버튼**: 에러 타입별 액션

### 지원하는 에러 타입별 설정

#### ApiError (서버 연결 오류)
- **제목**: "일시적인 연결 문제"
- **설명**: "서버와의 통신 중 잠깐 이슈가 생겼어요. 잠시 후 다시 시도해주시면 정상적으로 작동할 거예요."
- **이미지**: statusCode에 따라 동적 선택
- **색상**: Primary Green (#1E7F4F)
- **액션**: 다시 시도, 홈으로 이동, 새로고침

#### ValidationError (데이터 검증 오류)
- **제목**: "입력 정보 확인이 필요해요"
- **설명**: "입력하신 내용을 다시 한 번 확인해주세요. 형식이 맞지 않아 처리할 수 없어요."
- **이미지**: `/400Error.gif`
- **색상**: Accent Yellow (#F2C94C) - 경고/주의
- **액션**: 홈으로 이동

#### NotFoundError (페이지를 찾을 수 없음)
- **제목**: "길을 잃으셨어요"
- **설명**: "찾으시는 페이지가 사라졌거나 주소가 잘못되었어요. 하지만 괜찮아요, 돌아갈 곳은 있어요."
- **이미지**: `/404Error.gif`
- **색상**: Primary Green (#1E7F4F)
- **액션**: 홈으로 이동, 이전 페이지

#### 기타 에러 (알 수 없는 오류)
- **제목**: "예상치 못한 상황이 발생했어요"
- **설명**: "일시적인 문제가 생긴 것 같아요. 잠시 후 다시 시도해주시면 정상적으로 작동할 거예요."
- **이미지**: `/defaultError.png`
- **색상**: Primary Green (#1E7F4F)
- **액션**: 다시 시도, 홈으로 이동, 새로고침

## 구조

### 1. 에러 설정 유틸리티 (`lib/utils/error-config.ts`)

에러 타입별 설정을 정의합니다:

```typescript
export interface ErrorConfig {
  title: string
  description: string
  icon: string
  image?: string
  color: {
    bg: string
    text: string
    button: string
    buttonHover: string
  }
  actions: {
    canRetry: boolean
    canGoHome: boolean
    canGoBack?: boolean
    canSearch?: boolean
    canReload: boolean
  }
}
```

**주요 함수:**
- `getErrorConfig(error: Error): ErrorConfig`: 에러 타입에 따른 설정 반환
- `getErrorTypeName(error: Error): string`: 에러 타입 이름 반환

### 2. 동적 에러 페이지 컴포넌트 (`components/error/DynamicErrorPage.tsx`)

에러 타입에 따라 동적으로 UI를 렌더링합니다:

```typescript
export function DynamicErrorPage({
  error,
  onReset,
  customTitle,
}: DynamicErrorPageProps)
```

**특징:**
- 에러 타입별 이미지, 색상, 메시지 표시
- 에러 타입별 액션 버튼 제공
- 개발 환경에서 상세 에러 정보 표시 (선택적)

### 3. 에러 컴포넌트 구조

```
components/error/
├── DynamicErrorPage.tsx    # 동적 에러 페이지 메인 컴포넌트
├── ErrorFallback.tsx       # 에러 폴백 UI
├── ErrorMessage.tsx        # 에러 메시지 표시
├── ErrorActions.tsx        # 에러 액션 버튼
└── index.ts                # 통합 export
```

## 디자인 시스템 통합

에러 페이지는 프로젝트의 브랜드 디자인 시스템을 따릅니다:

- **컬러**: Primary Green (#1E7F4F), Accent Yellow (#F2C94C)
- **배경**: Off White (#F7F8F7)
- **텍스트**: Dark Gray (#1F2933)
- **타이포그래피**: Pretendard 폰트, 명확한 굵기 분리
- **디자인 철학**: 실용성 중심, 신뢰감 있는 디자인
- **UX 원칙**: 404 페이지는 "막다른 길"이 아니라 "회복 지점"으로 설계

## 사용 예시

### 기본 사용
```typescript
import { DynamicErrorPage } from '@/components/error'

export default function ErrorPage({ error, reset }) {
  return <DynamicErrorPage error={error} onReset={reset} />
}
```

### 커스텀 제목 사용
```typescript
<DynamicErrorPage
  error={error}
  customTitle="커스텀 에러 제목"
  onReset={reset}
/>
```

## 확장 방법

### 새로운 에러 타입 추가

1. **에러 클래스 생성** (`lib/errors/NewError.ts`):
```typescript
import { AppError } from './AppError'

export class NewError extends AppError {
  constructor(message = '새로운 에러가 발생했습니다.') {
    super(message, 500)
  }
}
```

2. **에러 설정 추가** (`lib/utils/error-config.ts`):
```typescript
import { NewError } from '../errors/NewError'

errorConfigMap.set(NewError, {
  title: '새로운 에러',
  description: '새로운 에러가 발생했습니다.',
  icon: '🆕',
  image: '/newError.gif',
  color: {
    bg: '#F7F8F7',
    text: '#1F2933',
    button: '#1E7F4F',
    buttonHover: '#2E9F6B',
  },
  actions: {
    canRetry: true,
    canGoHome: true,
    canReload: false,
  },
})
```

3. **에러 타입 이름 추가** (`getErrorTypeName` 함수):
```typescript
if (error instanceof NewError) return 'NewError'
```

## 장점

1. **사용자 경험 향상**
   - 에러 타입별 적절한 메시지와 액션 제공
   - 프로젝트 브랜드 디자인과 일관된 UI
   - 신뢰감 있는 디자인으로 사용자 안심

2. **브랜드 일관성**
   - 프로젝트 디자인 시스템 통합
   - 브랜드 컬러 및 타이포그래피 사용
   - 실용성 중심의 깔끔한 디자인

3. **유지보수성**
   - 에러 타입별 설정이 한 곳에 집중
   - 새로운 에러 타입 추가가 용이
   - 디자인 토큰 기반으로 일관성 유지

4. **개발자 경험**
   - 개발 환경에서 상세 에러 정보 제공
   - 에러 타입별 디버깅 정보 표시

## 참고

- [에러 아키텍처 문서](../../troubleshooting/error-architecture.md)
- [에러 타입 정의](../../../lib/errors/)
