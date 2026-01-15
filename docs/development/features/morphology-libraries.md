# 형태소 분석 라이브러리 통합 가이드

## 개요

이미지 매칭 시스템은 안정성을 위해 **2중 점검 구조**를 사용합니다:

1. **1차**: 현재 로직으로 매칭 시도
2. **2차**: 라이브러리 기반 형태소 분석으로 재시도
3. **3차**: 매칭 실패

## 라이브러리 선택

### Kiwi-NLP (권장)

**장점:**
- 최신 라이브러리 (2024년 기준 활발히 유지보수)
- 높은 정확도 (웹 텍스트: ~87%, 정형 텍스트: ~94%)
- 오타 교정 지원
- 다양한 모델 크기 (small/medium/large)

**단점:**
- 네이티브 바이너리 필요 (C++ 바인딩)
- 모델 파일 크기가 큼
- 설치가 복잡할 수 있음

### 설치 방법

```bash
npm install kiwi-nlp
```

## 구조

### 모듈 구조

```
lib/image/
├── morphology/
│   ├── analyzer.ts              # 1차: 현재 로직
│   ├── analyzer-with-fallback.ts # 2차: 라이브러리 fallback
│   └── library/
│       ├── kiwi-wrapper.ts      # Kiwi 래퍼
│       └── index.ts
└── matcher-with-fallback.ts      # 2중 점검 매칭
```

### 사용 방법

#### 기본 사용 (2중 점검)

```typescript
import { matchProductImageWithFallback } from '@/lib/image'

// 자동으로 1차 → 2차 순서로 시도
const imagePath = await matchProductImageWithFallback('전통 약과')
```

#### 형태소 분석만 사용

```typescript
import { analyzeMorphologyWithFallback } from '@/lib/image/morphology'

// 1차: 현재 로직
// 2차: 라이브러리 (실패 시)
const result = await analyzeMorphologyWithFallback('전통 약과')
```

## 동작 흐름

### 1차: 현재 로직

1. 의미 사전 기반 변환
2. 규칙 기반 형태소 분석
3. 복합어 분리
4. 매칭 시도

### 2차: 라이브러리 (1차 실패 시)

1. Kiwi 형태소 분석기로 재분석
2. 라이브러리 결과로 변환 재시도
3. 매칭 재시도

### 3차: 매칭 실패

1차와 2차 모두 실패하면 `null` 반환

## 성능 고려사항

- **1차 로직**: 빠름 (메모리 기반)
- **2차 라이브러리**: 상대적으로 느림 (네이티브 바이너리)
- **최적화**: 1차에서 성공하면 2차는 건너뜀

## 에러 처리

- 라이브러리가 설치되지 않아도 동작 (선택적 의존성)
- 라이브러리 초기화 실패 시 자동으로 1차 결과 사용
- 모든 에러는 로깅되고, 시스템은 계속 동작

## 설정

### 환경 변수

```env
# 개발 모드에서 라이브러리 사용 로그 출력
NODE_ENV=development
```

### 라이브러리 사용 여부 확인

```typescript
import { isKiwiAvailable } from '@/lib/image/morphology'

if (isKiwiAvailable()) {
  console.log('Kiwi library is available')
}
```

## 마이그레이션 가이드

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

기존 `matchProductImage`는 여전히 동작하지만, `matchProductImageWithFallback`을 사용하는 것을 권장합니다.
