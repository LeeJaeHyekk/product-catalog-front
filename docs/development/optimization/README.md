# 최적화 문서

이 디렉토리는 프로젝트의 성능 및 UX 최적화 전략을 문서화합니다.

## 최적화 전략 목록

### 1. 렌더링 성능 최적화
- **파일**: `rendering-performance.md`
- **설명**: Streaming + Suspense 전략 및 컴포넌트 렌더링 최적화
- **주요 내용**:
  - API 지연 상황에서 체감 렌더링 시간 최소화
  - React.memo를 활용한 리렌더링 방지
  - useMemo를 활용한 계산 최적화

### 2. 이미지 최적화 전략
- **파일**: `image-optimization-strategy.md`
- **설명**: Next.js Image 최적화 전략

## 핵심 원칙

### 실제 vs 체감 시간

**실제 서버 렌더 시간:**
- API 지연: 1~5초 (의도적)
- 서버 렌더: 3.6s ~ 4.9s
- **이것은 문제가 아님** - 요구사항에 의한 정상 동작

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

## 최적화 체크리스트

| 항목 | 상태 |
|------|------|
| API 지연 고려 | 구현됨 |
| Skeleton 즉시 표시 | 구현됨 |
| Streaming | 구현됨 |
| Suspense boundary 명확 | 구현됨 |
| 서버 fetch | 구현됨 |
| UX 설명 가능 | 구현됨 |
| React.memo 적용 | 구현됨 |
| useMemo 최적화 | 구현됨 |
| 불필요한 리렌더링 방지 | 구현됨 |
