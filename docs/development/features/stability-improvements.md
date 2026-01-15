# 안정성 향상 기능

## 구현 내용

앱의 안정성을 높이기 위한 다양한 알고리즘과 방식을 도입했습니다.

## 1. API 호출 안정성

### 타임아웃 처리
- **위치**: `lib/api.ts` - `fetchWithTimeout`
- **기능**: 10초 타임아웃으로 무한 대기 방지
- **장점**: 사용자 경험 개선, 리소스 절약

### 재시도 로직
- **위치**: `lib/api.ts` - `fetchWithRetry`
- **기능**: 
  - 최대 3회 재시도
  - 지수 백오프 (exponential backoff)
  - 4xx 에러는 재시도하지 않음 (클라이언트 오류)
  - 5xx 에러만 재시도 (서버 오류)
- **장점**: 일시적인 네트워크 오류 자동 복구

### 에러 처리
- 사용자 친화적인 에러 메시지
- 에러 로깅 (디버깅 용이)
- 명확한 에러 타입 구분

## 2. 데이터 검증 및 정규화

### 입력 검증
- **위치**: `lib/product.ts` - `processProducts`
- **기능**:
  - null/undefined 필터링
  - 타입 검증
  - 범위 검증 (index: 0~49, price >= 0, limit >= 1)
- **장점**: 잘못된 데이터로 인한 오류 방지

### 데이터 정규화
- **기능**:
  - index 범위 제한 (0~49)
  - name 빈 문자열 처리 ("상품명 없음")
  - price, current, limit 음수 방지
  - 문자열 trim 처리
- **장점**: 일관된 데이터 형식 보장

## 3. 정렬 안정성

### Stable Sort 보장
- **기능**: index가 같을 경우 name으로 2차 정렬
- **구현**:
  ```ts
  .sort((a, b) => {
    if (a.index !== b.index) {
      return a.index - b.index
    }
    return a.name.localeCompare(b.name, 'ko')
  })
  ```
- **장점**: 동일한 입력에 대해 항상 동일한 순서 보장

## 4. 에러 복구 메커니즘

### 타입 가드 실패 시 대체 처리
- **위치**: `lib/api.ts`
- **기능**: 타입 가드 실패 시 수동 변환 시도
- **장점**: 부분적인 데이터 손실 방지

### 에러 UI
- **위치**: `components/product/ProductsListServer.tsx`
- **기능**: 에러 발생 시 사용자 친화적인 메시지 표시
- **장점**: 사용자 경험 개선

## 5. 안정성 향상 알고리즘

### 1. 입력 검증 알고리즘
```
입력 데이터
  ↓
null/undefined 필터링
  ↓
타입 검증
  ↓
범위 검증
  ↓
정규화
  ↓
안전한 데이터
```

### 2. 에러 복구 알고리즘
```
API 호출 시도
  ↓
타임아웃 체크 (10초)
  ↓
응답 확인
  ↓
4xx 에러? → 즉시 실패
5xx 에러? → 재시도 (최대 3회)
  ↓
성공 또는 최종 실패
```

### 3. 데이터 처리 파이프라인
```
원본 데이터
  ↓
타입 가드 검증
  ↓
데이터 변환
  ↓
정규화
  ↓
검증
  ↓
정렬 (Stable Sort)
  ↓
안전한 출력
```

## 성능 최적화

1. **조기 반환**: 빈 배열 즉시 반환
2. **효율적인 필터링**: 한 번의 순회로 처리
3. **메모이제이션 가능**: 순수 함수 설계

## 테스트 가능성

모든 함수가 순수 함수로 설계되어 단위 테스트 용이:
- `processProducts`: 입력 → 출력 테스트
- `fetchWithTimeout`: 타임아웃 시뮬레이션
- `fetchWithRetry`: 재시도 로직 테스트
- 타입 가드: 다양한 입력 케이스 테스트

## 6. React 컴포넌트 안정성

### 메모리 누수 방지
- **위치**: `components/product/SearchBar.tsx`, `lib/hooks/useDynamicLayout.ts`
- **기능**:
  - `requestAnimationFrame` 취소 로직 추가
  - 컴포넌트 언마운트 후 상태 업데이트 방지
  - ResizeObserver cleanup 보장
  - window 이벤트 리스너 정리
- **장점**: 메모리 누수 방지, 성능 향상

### 타입 안전성 강화
- **위치**: `components/product/SearchBar.tsx`, `lib/hooks/useProductFilters.ts`
- **기능**:
  - `initialQuery` prop 타입 검증
  - 필터 검증 로직 개선
  - null/undefined 안전 처리
- **장점**: 런타임 에러 방지, 타입 안전성 보장

## 히스토리

### 2026-01-XX: React 컴포넌트 안정성 개선
- SearchBar 컴포넌트의 메모리 누수 방지 로직 추가
- `requestAnimationFrame` 취소 로직 구현
- 컴포넌트 언마운트 후 상태 업데이트 방지
- ResizeObserver 및 이벤트 리스너 cleanup 보장
- 타입 안전성 강화 (initialQuery 검증, 필터 검증 로직 개선)
