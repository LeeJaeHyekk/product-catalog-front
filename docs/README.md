# 프로젝트 문서

본 디렉토리는 프로젝트의 모든 문서를 체계적으로 정리한 것입니다.

## 문서 구조

### [Architecture (아키텍처)](./architecture/README.md)
프로젝트의 구조, 모듈화, 설계 원칙에 대한 문서입니다.

- **모듈화**: 기능별 모듈 구조 및 중복 제거 전략
- **모듈 구조**: 모듈별 책임 및 사용 가이드

### [Design (디자인)](./design/README.md)
디자인 시스템, 브랜드 정체성, UI/UX 가이드입니다.

- **브랜드 정체성**: 브랜드 이미지 및 디자인 방향
- **디자인 토큰**: 색상, 타이포그래피, 간격 등 디자인 시스템
- **UI 상태**: 로딩, 에러, 빈 상태 등 UI 상태별 디자인 규칙
- **접근성**: 접근성 원칙 및 가이드라인
- **성능 UX**: 대용량 데이터 대응 및 성능 개선 전략

### [Development (개발)](./development/README.md)
기능 구현, 최적화, 코드 분석 문서입니다.

#### Features (기능)
- **타입 가드**: 런타임 타입 검증 시스템
- **에러 페이지**: 동적 에러 페이지 시스템
- **로딩 스피너**: 로딩 상태 시각화 컴포넌트
- **안정성 향상**: 안정성을 높이는 알고리즘 및 방식
- **이미지 매칭**: 상품명과 이미지 파일명 자동 매칭
- **카테고리 분류 및 검색/필터**: 카테고리 기반 분류 및 검색 기능

#### Optimization (최적화)
- **렌더링 성능**: API 지연 상황에서 체감 렌더링 시간 개선
- **이미지 최적화**: Next.js Image 최적화 전략

#### Analysis (분석)
- **코드 리뷰**: 최종 코드 리뷰 및 개선 사항
- **ESM & 함수형**: ESM 문법 및 함수형 프로그래밍 패러다임 준수 분석

### [Troubleshooting (문제 해결)](./troubleshooting/README.md)
에러 해결, 원인 분석, 개발 히스토리입니다.

- **Hydration Error**: 서버-클라이언트 불일치 해결
- **에러 아키텍처**: 타입 기반 에러 처리 및 Error Boundary 구조
- **Chunk Load Error**: 모듈 로딩 오류 해결

## 빠른 링크

### 시작하기
- [프로젝트 개요](../README.md)
- [아키텍처 개요](./architecture/README.md)
- [디자인 시스템](./design/README.md)
- [과제 요구사항 준수 분석](./assignment-compliance-analysis.md)

### 개발 가이드
- [기능 구현 가이드](./development/README.md)
- [최적화 전략](./development/optimization/README.md)
- [에러 처리 가이드](./troubleshooting/README.md)

### 문제 해결
- [Hydration Error 해결](./troubleshooting/hydration-error.md)
- [에러 아키텍처](./troubleshooting/error-architecture.md)
- [Chunk Load Error 해결](./troubleshooting/chunk-load-error-solution.md)

## 문서 작성 가이드

### 문서 구조
1. **개요**: 문서의 목적과 범위
2. **내용**: 주요 내용 설명
3. **예시**: 코드 예시 및 사용법
4. **참고**: 관련 문서 및 자료

### 히스토리 섹션 (에러/개발 문서)
에러 해결이나 주요 개발 결정 문서에는 히스토리 섹션을 추가합니다:

```markdown
## 히스토리

### YYYY-MM-DD: 이벤트 제목
- 원인 분석 및 해결 과정
- 해결 과정
- 추가 개선 사항
```

## 문서 업데이트

문서를 업데이트할 때:
1. 해당 섹션의 README에 목록 추가
2. 변경 사항을 히스토리에 기록 (에러/개발 문서)
3. 관련 문서 간 링크 확인
4. [변경 이력](./CHANGELOG.md)에 주요 변경사항 기록

## 변경 이력

프로젝트의 주요 변경사항은 [CHANGELOG.md](./CHANGELOG.md)에서 확인할 수 있습니다.
