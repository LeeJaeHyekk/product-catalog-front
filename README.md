# Product Catalog Front

Next.js + TypeScript 기반의 상품 목록 UI 구현 프로젝트입니다.

## 주요 기능

- ✅ 무작위 순서 데이터를 index 기준으로 정렬
- ✅ 품절 상품 자동 분리 및 하단 배치
- ✅ Skeleton UI 기반 로딩 경험 최적화
- ✅ 반응형 디자인 (Mobile/Tablet/PC)
- ✅ TanStack Query 기반 서버 상태 관리
- ✅ ESM 모듈 시스템 및 함수형 설계

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: TanStack Query (React Query)
- **모듈 시스템**: ESM (ECMAScript Modules)

## 프로젝트 구조

```
app/
 └─ products/
    ├─ page.tsx            # 상품 목록 페이지
    ├─ loading.tsx         # Suspense 로딩 UI
    └─ error.tsx           # 에러 처리

components/
 ├─ product/
 │   ├─ ProductGrid.tsx
 │   ├─ ProductCard.tsx
 │   ├─ ProductSkeleton.tsx
 │   ├─ ProductGridSkeleton.tsx
 │   ├─ ProductListClient.tsx
 │   └─ SoldOutBadge.tsx
 └─ layout/
     └─ Container.tsx

hooks/
 └─ useProducts.ts         # TanStack Query 기반 데이터 fetching

lib/
 ├─ api.ts                 # API 호출
 ├─ product.ts             # 정렬/품절 처리 로직
 └─ types.ts               # 타입 정의
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

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 설계 원칙

- **ESM 모듈 시스템**: 모든 파일에서 `import`/`export` 사용
- **함수형 설계**: 클래스 대신 함수형 컴포넌트 및 순수 함수 사용
- **책임 분리**: 비즈니스 로직(`lib/product.ts`)과 UI(`components/`) 완전 분리
- **순수 함수**: `processProducts`는 동일 입력에 대해 동일 출력 보장
- **메모이제이션 가능**: 순수 함수 설계로 최적화 용이

## 주요 설계 특징

### 데이터 가공 로직

- `processProducts` 함수로 정렬 및 품절 분리
- Stable Sort 보장으로 index 순서 유지
- 순수 함수로 설계되어 메모이제이션 가능

### 성능 최적화

- Virtualization 지원 (대용량 데이터 대응)
- 메모이제이션을 통한 불필요한 재계산 방지
- Skeleton UI로 체감 성능 개선

### UX 최적화

- **Streaming + Suspense 전략**: API 응답 지연 상황을 고려하여 Next.js의 Streaming과 Suspense를 활용해 사용자 체감 렌더링 시간을 최소화
- Skeleton UI로 로딩 경험 개선
- 레이아웃 시프트 방지 (CLS 개선)
- 품절 상품 명확한 시각적 구분
- 접근성(A11y) 고려

### 렌더링 최적화 전략

**핵심 원칙:**
> 실제 서버 렌더 시간은 유지하면서, Streaming과 Suspense로 체감 렌더링 시간을 최소화

**구현 방식:**
- 페이지 레벨에서 즉시 Skeleton 표시
- Suspense boundary로 상품 목록만 스트리밍
- Container와 제목은 즉시 렌더링하여 화면 구조 즉시 인지

**효과:**
- 실제 시간: 3~5초 (API 지연 유지)
- 체감 시간: 0.1초 (즉시 Skeleton 표시)

## API

- **엔드포인트**: `https://api.zeri.pics`
- **응답 형식**: `Product[]` 배열

자세한 설계 내용은 `design structure.md`를 참고하세요.
