# Product Catalog Front

Next.js와 TypeScript를 기반으로 구현한 상품 목록 UI 프로젝트입니다.

## 프로젝트 개요

본 프로젝트는 외부 API로부터 제공되는 상품 데이터를 사용자에게 보기 좋게 표시하고, 검색 및 필터링 기능을 제공하는 프론트엔드 애플리케이션입니다. Next.js App Router를 활용하여 서버 컴포넌트와 클라이언트 컴포넌트를 적절히 분리하고, 사용자 경험을 개선하기 위한 다양한 기능을 구현했습니다.

## 주요 기능

- **상품 정렬**: 무작위 순서로 제공되는 데이터를 index 기준으로 정렬하여 표시
- **품절 상품 처리**: 품절 상품을 자동으로 분리하여 하단에 배치
- **로딩 상태 처리**: Skeleton UI를 활용한 로딩 경험 제공
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 환경에 대응하는 반응형 레이아웃
- **카테고리 분류 및 검색**: 상품명 기반 카테고리 자동 분류 및 검색/필터 기능
- **이미지 매칭**: 상품명과 이미지 파일명을 자동으로 매칭하는 로직 구현
- **에러 처리**: 타입 기반 에러 관리 및 Error Boundary를 통한 에러 처리

## 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: TanStack Query (React Query)
- **모듈 시스템**: ESM (ECMAScript Modules)

## 프로젝트 구조

```
app/
 ├─ page.tsx                 # 메인 페이지
 ├─ layout.tsx               # 루트 레이아웃
 ├─ providers.tsx            # 프로바이더 설정
 ├─ error.tsx               # 전역 에러 처리
 ├─ not-found.tsx           # 404 페이지
 └─ products/
    ├─ page.tsx             # 상품 목록 페이지
    ├─ loading.tsx          # Suspense 로딩 UI
    ├─ error.tsx            # 상품 페이지 에러 처리
    └─ not-found.tsx        # 상품 페이지 404

components/
 ├─ product/                # 상품 관련 컴포넌트
 │   ├─ ProductGrid.tsx
 │   ├─ ProductCard.tsx
 │   ├─ ProductSkeleton.tsx
 │   ├─ ProductGridSkeleton.tsx
 │   ├─ ProductsListServer.tsx
 │   ├─ ProductGridWithFilters.tsx
 │   ├─ SearchBar.tsx
 │   ├─ CategoryFilter.tsx
 │   └─ ...
 ├─ layout/                 # 레이아웃 컴포넌트
 │   ├─ Container.tsx
 │   ├─ BackgroundImage.tsx
 │   └─ PageHeader.tsx
 ├─ ui/                     # 공통 UI 컴포넌트
 │   ├─ Button.tsx
 │   ├─ TrustCard.tsx
 │   └─ ...
 └─ error/                  # 에러 UI 컴포넌트
    ├─ ErrorFallback.tsx
    ├─ ErrorMessage.tsx
    └─ ErrorActions.tsx

hooks/
 └─ useProducts.ts          # TanStack Query 기반 데이터 fetching

lib/
 ├─ api/                    # API 호출 관련
 │   ├─ index.ts
 │   ├─ fetch.ts
 │   └─ mapper.ts
 ├─ product/                # 상품 처리 로직
 │   ├─ index.ts
 │   ├─ sort.ts
 │   ├─ process.ts
 │   ├─ category.ts
 │   ├─ filter.ts
 │   └─ ...
 ├─ image/                  # 이미지 처리 관련
 │   ├─ matcher.ts
 │   ├─ optimizer.ts
 │   └─ ...
 ├─ types/                  # 타입 정의
 ├─ validation/             # 검증 로직
 ├─ errors/                 # 에러 타입 정의
 ├─ constants/              # 상수 정의
 ├─ utils/                  # 유틸리티 함수
 └─ hooks/                  # 공통 훅

docs/                       # 프로젝트 문서
 ├─ README.md               # 문서 인덱스
 ├─ STRUCTURE.md            # 문서 구조 가이드
 ├─ CHANGELOG.md            # 변경 이력
 ├─ architecture/           # 아키텍처 문서
 ├─ design/                 # 디자인 문서
 ├─ development/            # 개발 문서
 └─ troubleshooting/        # 문제 해결 문서
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 개발 서버 주소를 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 설계 원칙

### 모듈화 및 책임 분리

- **ESM 모듈 시스템**: 모든 파일에서 `import`/`export` 문법을 일관되게 사용
- **함수형 설계**: 클래스 대신 함수형 컴포넌트 및 순수 함수를 우선 사용
- **책임 분리**: 비즈니스 로직(`lib/product/`)과 UI(`components/`)를 명확히 분리
- **순수 함수**: 동일한 입력에 대해 항상 동일한 출력을 보장하는 순수 함수 설계

### 데이터 처리

- **정렬 및 품절 처리**: `processProducts` 함수를 통해 정렬 및 품절 상품 분리
- **Stable Sort**: index 순서를 안정적으로 유지하는 정렬 알고리즘 사용
- **메모이제이션 가능**: 순수 함수 설계로 불필요한 재계산 방지

### 사용자 경험 개선

- **Streaming + Suspense 전략**: Next.js의 Streaming과 Suspense를 활용하여 API 응답 지연 상황에서도 사용자 체감 렌더링 시간을 개선
- **Skeleton UI**: 로딩 중에도 화면 구조를 유지하여 레이아웃 시프트 방지
- **품절 상품 표시**: 품절 상품을 명확하게 시각적으로 구분
- **접근성 고려**: ARIA 속성 및 시맨틱 HTML을 활용한 접근성 개선

### 에러 처리

- **타입 기반 에러 관리**: 에러를 문자열이 아닌 타입으로 관리하여 명확한 에러 처리
- **에러 타입 분리**: `AppError`, `ApiError`, `ValidationError`, `NotFoundError` 등으로 에러 타입 구분
- **Error Boundary**: Next.js App Router의 Error Boundary를 활용한 도메인 단위 에러 격리
- **공통 에러 UI**: 재사용 가능한 `ErrorFallback` 컴포넌트로 일관된 에러 UX 제공

### 렌더링 최적화

**핵심 원칙:**
> 실제 서버 렌더 시간은 유지하면서, Streaming과 Suspense로 체감 렌더링 시간을 개선

**구현 방식:**
- 페이지 레벨에서 즉시 Skeleton 표시
- Suspense boundary로 상품 목록만 스트리밍
- Container와 제목은 즉시 렌더링하여 화면 구조 즉시 인지

## 데이터 소스

- 외부 API를 통해 상품 데이터를 제공받습니다.
- 응답 형식은 상품 배열 형태입니다.

## 배포

### 배포 주소
배포 주소는 별도로 관리됩니다.

### 배포 방법

#### 클라우드 플랫폼 배포
1. GitHub 레포지토리를 클라우드 플랫폼에 연결
2. 자동으로 빌드 및 배포됩니다
3. 환경 변수가 필요한 경우 플랫폼 대시보드에서 설정

#### 수동 배포
```bash
# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 문서

프로젝트의 상세한 설계 내용과 개발 가이드는 `docs/` 디렉토리에서 확인하실 수 있습니다.

- [문서 인덱스](./docs/README.md)
- [아키텍처 문서](./docs/architecture/README.md)
- [디자인 문서](./docs/design/README.md)
- [개발 문서](./docs/development/README.md)
- [문제 해결 문서](./docs/troubleshooting/README.md)

## 개선 가능한 부분

현재 구현된 기능들이 기본적인 기능을 제공하고 있으나, 다음과 같은 부분들을 추가로 개선할 수 있습니다:

- 테스트 코드 작성 (단위 테스트, 통합 테스트)
- 성능 모니터링 및 분석 도구 도입
- 국제화(i18n) 지원
- 더 세밀한 에러 처리 및 로깅
- 이미지 최적화 전략 고도화

## 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.
