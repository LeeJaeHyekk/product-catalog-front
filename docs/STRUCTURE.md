# 문서 구조 가이드

## 전체 구조

```
docs/
├── README.md                    # 메인 문서 인덱스
├── STRUCTURE.md                 # 이 파일 (구조 가이드)
├── CHANGELOG.md                 # 변경 이력
│
├── architecture/                # 아키텍처
│   ├── README.md
│   ├── modularization.md        # 모듈화 가이드
│   └── module-structure.md      # 모듈 구조 가이드
│
├── design/                      # 디자인
│   ├── README.md
│   ├── brand-identity.md        # 브랜드 정체성
│   ├── design-tokens.ts         # 디자인 토큰
│   ├── design-structure.md      # 상품 목록 UI 설계서
│   ├── ui-states.md             # UI 상태 디자인 규칙
│   ├── accessibility.md          # 접근성 원칙
│   ├── performance-ux.md        # 대용량 UX 전략
│   ├── background-design-options.md  # 배경 디자인 옵션
│   └── gif-background-prompt.md      # GIF 배경 프롬프트
│
├── development/                 # 개발
│   ├── README.md
│   │
│   ├── features/                # 기능
│   │   ├── README.md
│   │   ├── type-guards.md       # 타입 가드 (통합)
│   │   ├── error-pages.md       # 에러 페이지 (통합)
│   │   ├── loading-spinner.md
│   │   ├── stability-improvements.md
│   │   ├── image-matching.md
│   │   ├── category-filter-search.md
│   │   ├── category-implementation-guide.md
│   │   ├── data-processing-architecture.md
│   │   ├── search-bar-modularization.md
│   │   ├── search-filter-improvements.md
│   │   └── test-images.md
│   │
│   ├── optimization/            # 최적화
│   │   ├── README.md
│   │   ├── rendering-performance.md
│   │   ├── performance-analysis.md
│   │   └── image-optimization-strategy.md
│   │
│   └── analysis/                # 분석
│       ├── README.md
│       ├── code-review.md       # 코드 리뷰 (통합)
│       └── esm-functional-analysis.md
│
└── troubleshooting/             # 문제 해결 및 원인 분석
    ├── README.md
    ├── hydration-error.md
    ├── error-architecture.md
    └── chunk-load-error-solution.md
```

## 대분류 설명

### Architecture (아키텍처)
프로젝트의 구조, 모듈화, 설계 원칙

### Design (디자인)
디자인 시스템, 브랜드 정체성, UI/UX 가이드

### Development (개발)
기능 구현, 최적화, 코드 분석

### Troubleshooting (문제 해결)
에러 해결, 원인 분석, 개발 히스토리

## 소분류 설명

### Development 하위 분류

#### Features (기능)
구현된 기능별 상세 문서

#### Optimization (최적화)
성능 및 UX 최적화 전략

#### Analysis (분석)
코드 품질 및 패러다임 준수 분석

## 문서 통합 내역

### 통합된 문서

1. **타입 가드 관련 문서 통합**
   - `type-guards.md` + `type-guard-safety-analysis.md`
   - → `features/type-guards.md` (통합)

2. **에러 페이지 관련 문서 통합**
   - `error-pages-overview.md` + `dynamic-error-pages.md`
   - → `features/error-pages.md` (통합)

3. **코드 리뷰 관련 문서 통합**
   - `final-code-review.md` + `final-code-review-summary.md`
   - → `analysis/code-review.md` (통합)

### 삭제된 문서

- `development/features/type-guard-safety-analysis.md` (중복)
- `development/features/dynamic-error-pages.md` (중복)
- `development/features/error-pages-overview.md` (중복)
- `development/analysis/final-code-review.md` (중복)
- `development/analysis/final-code-review-summary.md` (중복)

## 히스토리 섹션

에러 해결 및 주요 개발 결정 문서에는 히스토리 섹션이 포함됩니다:

- `troubleshooting/hydration-error.md`
- `troubleshooting/error-architecture.md`
- `development/analysis/esm-functional-analysis.md`
- `architecture/modularization.md`
- `development/optimization/rendering-performance.md`

## 문서 작성 가이드

### 기본 구조

```markdown
# 문서 제목

## 개요
문서의 목적과 범위

## 내용
주요 내용 설명

## 예시
코드 예시 및 사용법

## 히스토리 (에러/개발 문서)
개발 과정 및 결정 사항 기록

## 참고
관련 문서 및 자료
```

### 히스토리 섹션 형식

```markdown
## 히스토리

### YYYY-MM-DD: 이벤트 제목
- **목표/고려사항**: 무엇을 해결하려 했는가
- **구현/해결**: 어떻게 해결했는가
- **효과**: 어떤 결과가 있었는가
```

## 문서 찾기 가이드

### 아키텍처 관련
→ `docs/architecture/`

### 디자인 관련
→ `docs/design/`

### 기능 구현 관련
→ `docs/development/features/`

### 성능 최적화 관련
→ `docs/development/optimization/`

### 코드 분석 관련
→ `docs/development/analysis/`

### 에러 해결 관련
→ `docs/troubleshooting/`
