# 변경 이력 (Changelog)

이 문서는 프로젝트의 주요 변경사항을 기록합니다.

## [Unreleased]

### 추가됨
- SearchBar 컴포넌트 모듈화 문서 (`docs/development/features/search-bar-modularization.md`)
- 검색 및 필터 기능 개선 문서 (`docs/development/features/search-filter-improvements.md`)
- 테스트 이미지 가이드 (`docs/development/features/test-images.md`)
- 상품 목록 UI 설계서 (`docs/design/design-structure.md`)
- UI 상수 통합 (`lib/constants/ui.ts`) - LAYOUT_GAPS, SEARCH_BAR 상수
- 레이아웃 계산 유틸리티 (`lib/utils/layout.ts`)
- 요소 크기 측정 훅 (`lib/hooks/useElementSize.ts`)
- 동적 레이아웃 계산 훅 (`lib/hooks/useDynamicLayout.ts`)

### 변경됨
- SearchBar 컴포넌트 리팩토링: 복잡한 레이아웃 계산 로직을 모듈로 분리
- 검색 필터링 로직 개선: 문자 단위 부분 문자열 검색 제거, 정확한 문자열 매칭만 사용
- 검색 상태 동기화 개선: `ProductGridWithFilters`에서 `filters.searchQuery`를 `SearchBar`에 전달
- 안정성 개선: 메모리 누수 방지 (requestAnimationFrame 취소, 언마운트 후 상태 업데이트 방지)
- 타입 안전성 강화: initialQuery 검증, 필터 검증 로직 개선
- CategoryPanel: 선택된 항목의 체크 아이콘 제거 (녹색 배경으로만 표시)

### 개선됨
- 코드 가독성: SearchBar 컴포넌트 코드 100줄 이상 감소
- 재사용성: 레이아웃 계산 로직을 다른 컴포넌트에서도 사용 가능
- 유지보수성: 상수값 변경 시 한 곳만 수정하면 됨
- 테스트 용이성: 순수 함수로 분리되어 단위 테스트 작성 용이
- 검색 정확도: "감귤" 검색 시 "제주 감귤"만 표시되도록 개선
- 문서 정리: 모든 문서를 docs 폴더로 이동 및 통합
- 문서 어법: 겸손한 어법으로 수정 및 평가 표현 제거

## [2026-01-XX] - 모듈화 및 안정성 개선

### 추가됨
- 모듈화 가이드 문서 (`docs/architecture/modularization.md`)
- 안정성 향상 문서 (`docs/development/features/stability-improvements.md`)

### 변경됨
- 기능별 모듈 구조 설계 및 구현
- 중복 코드 제거 (정렬, 검증, 정규화 로직 통합)
- 컬러 상수 모듈화 (`lib/constants/colors.ts`)
- 컴포넌트 모듈화 (BackgroundImage, PageHeader, ProductBadge 등)

## [2026-01-XX] - 초기 구조

### 추가됨
- 프로젝트 기본 구조
- Next.js App Router 설정
- 상품 목록 페이지
- 기본 컴포넌트 구조

---

## 문서 작성 가이드

변경사항을 기록할 때는 다음 형식을 따르세요:

```markdown
## [YYYY-MM-DD] - 버전 또는 주요 기능명

### 추가됨
- 새로운 기능 또는 파일

### 변경됨
- 기존 기능의 변경사항

### 개선됨
- 성능, 안정성, 사용성 개선

### 수정됨
- 버그 수정

### 제거됨
- 삭제된 기능 또는 파일
```
