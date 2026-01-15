# 형태소 분석 라이브러리 통합 가이드

## 개요

이미지 매칭 시스템의 안정성을 높이기 위해 2중 점검 구조를 시도했습니다:

1. **1차**: 현재 로직으로 매칭 시도
2. **2차**: 라이브러리 기반 형태소 분석으로 재시도 (1차 실패 시)
3. **3차**: 매칭 실패 (둘 다 실패 시)

## 라이브러리 선택: Kiwi-NLP

### 설치 (선택사항)

```bash
npm install kiwi-nlp
```

**참고**: 라이브러리가 설치되지 않아도 시스템은 정상 동작합니다. 1차 로직만 사용됩니다.

### 고려한 사항

- 최신 라이브러리 (2024년 기준 활발히 유지보수 중)
- 정확도 (웹 텍스트: 약 87%, 정형 텍스트: 약 94%)
- 오타 교정 지원
- 다양한 모델 크기 (small/medium/large)

### 제약사항

- 네이티브 바이너리 필요 (C++ 바인딩)
- 모델 파일 크기가 큼
- 설치가 복잡할 수 있음

## 사용 방법

### 자동 사용 (권장)

시스템이 자동으로 1차 → 2차 순서로 시도합니다:

```typescript
import { matchProductImageWithFallback } from '@/lib/image'

const imagePath = await matchProductImageWithFallback('전통 약과')
```

### 라이브러리 사용 여부 확인

```typescript
import { isKiwiAvailable } from '@/lib/image/morphology'

if (isKiwiAvailable()) {
  console.log('Kiwi library is available')
}
```

## 동작 흐름

### 1차: 현재 로직

1. 의미 사전 기반 변환
2. 규칙 기반 형태소 분석
3. 복합어 분리
4. 매칭 시도
5. **성공 시 즉시 반환**

### 2차: 라이브러리 (1차 실패 시만)

1. Kiwi 형태소 분석기로 재분석
2. 라이브러리 결과로 변환 재시도
3. 매칭 재시도
4. **성공 시 반환**

### 3차: 매칭 실패

1차와 2차 모두 실패하면 `null` 반환

## 성능 고려사항

- **1차 로직**: 빠름 (메모리 기반, 즉시 실행)
- **2차 라이브러리**: 상대적으로 느림 (네이티브 바이너리, 비동기)
- **최적화 시도**: 1차에서 성공하면 2차는 건너뜀

## 에러 처리

- 라이브러리가 설치되지 않아도 동작 (선택적 의존성)
- 라이브러리 초기화 실패 시 자동으로 1차 결과 사용
- 모든 에러는 로깅되고, 시스템은 계속 동작

## 마이그레이션

### 기존 코드

```typescript
import { matchProductImage } from '@/lib/image'
const image = await matchProductImage('전통 약과')
```

### 새로운 코드 (권장)

```typescript
import { matchProductImageWithFallback } from '@/lib/image'
const image = await matchProductImageWithFallback('전통 약과')
```

**참고**: 기존 `matchProductImage`는 여전히 동작하지만, `matchProductImageWithFallback`을 사용하는 것을 권장합니다.
