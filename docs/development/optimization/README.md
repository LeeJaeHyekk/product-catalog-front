# 최적화 문서

프로젝트의 성능 및 UX 최적화 전략을 문서화한 것입니다. 성능 개선을 위해 시도한 방법들과 고려 사항을 정리했습니다.

## 최적화 전략 목록

### 1. 렌더링 성능 최적화
- **파일**: [rendering-performance.md](./rendering-performance.md)
- **설명**: Streaming + Suspense 전략 및 컴포넌트 렌더링 최적화, 성능 분석 포함
- **주요 내용**:
  - API 지연 상황에서 체감 렌더링 시간 최소화
  - 서버 렌더링 시간 분석
  - 체감 렌더링 시간 평가
  - React.memo를 활용한 리렌더링 방지
  - useMemo를 활용한 계산 최적화
  - 최적화 전략 적용 상태

### 3. 이미지 최적화 전략
- **파일**: [image-optimization-strategy.md](./image-optimization-strategy.md)
- **설명**: Next.js Image 최적화 전략
- **주요 내용**:
  - 이미지 최적화 설정
  - 이미지 로딩 전략
  - 성능 개선 효과

## 핵심 원칙

### 실제 vs 체감 시간

**실제 서버 렌더 시간:**
- API 지연: 네트워크 상황에 따라 변동
- 서버 렌더: 실제 측정값 기준
- **이것은 문제가 아님** - 네트워크 지연에 따른 정상 동작

**체감 렌더링 시간:**
- Skeleton 즉시 표시: 0.1초
- 사용자는 즉시 "뭔가 로딩 중"임을 인지
- **이것이 최적화의 목표**

### 최적화 전략

1. **Streaming + Suspense 분리**
   - 요청 즉시 HTML 스트리밍 시작
   - Skeleton 즉시 렌더
   - 실제 데이터는 나중에 채움

2. **Skeleton을 페이지 레벨로 끌어올리기**
   - Skeleton이 클수록 체감 속도 향상

3. **Server ↔ Client 경계 최소화**
   - Server Component에서 fetch
   - Client는 렌더 전용

## 최적화 시도 사항

프로젝트에서 다음과 같은 최적화 방법들을 시도했습니다:

- API 지연 상황 고려: Streaming과 Suspense를 활용한 체감 렌더링 시간 개선
- Skeleton 즉시 표시: 로딩 중에도 화면 구조 유지
- Streaming: Next.js의 Streaming 기능 활용
- Suspense boundary 명확화: 로딩 상태 관리
- 서버 fetch: Server Component에서 데이터 fetching
- React.memo 적용: 불필요한 리렌더링 방지 시도
- useMemo 최적화: 계산 비용이 큰 작업 최적화 시도

## 빠른 링크

- [렌더링 성능 최적화](./rendering-performance.md)
- [이미지 최적화 전략](./image-optimization-strategy.md)
