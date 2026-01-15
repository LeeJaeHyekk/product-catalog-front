# 기능 구현 문서

프로젝트에서 구현을 시도한 주요 기능들에 대한 상세 문서입니다. 각 기능의 구현 배경과 고려 사항을 정리했습니다.

## 주요 기능

### 1. 타입 가드 (Type Guards)
- **문서**: [type-guards.md](./type-guards.md)
- **설명**: 런타임 타입 검증을 위한 타입 가드 함수들
- **위치**: `lib/validation/guards.ts`, `lib/validation/api.ts`

### 2. 에러 페이지 시스템
- **문서**: [error-pages.md](./error-pages.md)
- **설명**: 각 에러 타입에 대해 동적으로 다른 UI를 표시하는 에러 페이지 시스템
- **위치**: `components/error/`, `lib/utils/error-config.ts`

### 3. 로딩 스피너
- **문서**: [loading-spinner.md](./loading-spinner.md)
- **설명**: 로딩 상태 시각화 컴포넌트
- **위치**: `components/ui/LoadingSpinner.tsx`

### 4. 안정성 향상
- **문서**: [stability-improvements.md](./stability-improvements.md)
- **설명**: 안정성을 높이는 알고리즘 및 방식
- **위치**: 전역

### 5. 이미지 매칭
- **문서**: [image-matching.md](./image-matching.md)
- **설명**: 상품명과 이미지 파일명 자동 매칭 알고리즘
- **위치**: `lib/image/matcher.ts`

### 5-1. 형태소 분석 라이브러리 가이드
- **문서**: [morphology-library-guide.md](./morphology-library-guide.md)
- **설명**: 형태소 분석 라이브러리 통합 및 사용 가이드
- **위치**: `lib/image/morphology/`

### 6. 카테고리 시스템
- **문서**: [category-system.md](./category-system.md)
- **설명**: 카테고리 기반 분류 및 검색 기능
- **위치**: `lib/product/category.ts`, `lib/product/filter.ts`

### 7. 검색 시스템
- **문서**: [search-system.md](./search-system.md)
- **설명**: 검색 기능 및 SearchBar 컴포넌트 모듈화
- **위치**: `components/product/SearchBar.tsx`, `lib/hooks/useProductFilters.ts`

### 8. 데이터 처리 아키텍처
- **문서**: [data-processing-architecture.md](./data-processing-architecture.md)
- **설명**: 데이터 처리 흐름 및 구조
- **위치**: `lib/product/`

## 빠른 링크

- [타입 가드](./type-guards.md)
- [에러 페이지](./error-pages.md)
- [카테고리 시스템](./category-system.md)
- [검색 시스템](./search-system.md)
- [이미지 매칭](./image-matching.md)
- [형태소 분석 라이브러리 가이드](./morphology-library-guide.md)
