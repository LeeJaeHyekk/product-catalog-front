# ChunkLoadError 근본 해결 가이드

## 원인 분석

ChunkLoadError는 Next.js에서 모듈 청크를 로드하는 중 발생하는 에러입니다. 주요 원인:

1. **Barrel Export**: `lib/index.ts`에서 `export *`를 사용하면 모든 모듈이 번들에 포함될 수 있음
2. **서버/클라이언트 모듈 혼용**: 서버 전용 모듈이 클라이언트 번들에 포함될 수 있음
3. **모듈 해석**: TypeScript 경로 별칭(`@/`)이 제대로 해석되지 않을 수 있음
4. **빌드 캐시**: `.next` 폴더의 캐시가 손상되었을 수 있음

## 근본 해결 방법

### 1. 직접 Import 사용

**개선 전:**
```typescript
import { STALE_TIME, MAX_RETRIES } from '@/lib'
```

**개선 후:**
```typescript
import { STALE_TIME } from '@/lib/constants/cache'
import { MAX_RETRIES } from '@/lib/constants/api'
```

**이유:**
- 필요한 모듈만 번들에 포함
- 트리 쉐이킹 최적화
- 모듈 해석 명확

### 2. Next.js 설정 최적화

`next.config.js`에 다음 설정 추가:

```javascript
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 서버와 클라이언트 번들 분리 명확화
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // 모듈 해석 최적화
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }
    
    return config
  },
  
  experimental: {
    // 패키지 import 최적화
    optimizePackageImports: ['@tanstack/react-query'],
  },
}
```

### 3. 서버/클라이언트 모듈 분리

**서버 전용 모듈:**
```typescript
// lib/api/index.ts
import 'server-only'  // 클라이언트 번들에서 제외

export async function fetchProducts() {
  // 서버 전용 코드
}
```

**클라이언트 전용 모듈:**
```typescript
// hooks/useProducts.ts
'use client'  // 클라이언트 컴포넌트 표시

export function useProducts() {
  // 클라이언트 전용 코드
}
```

### 4. Barrel Export 최소화

`lib/index.ts`에서 필요한 것만 export:

```typescript
// 개선 전: 모든 것을 export
export * from './constants'
export * from './utils'
export * from './product'

// 개선 후: 필요한 것만 명시적으로 export
export { STALE_TIME } from './constants/cache'
export { MAX_RETRIES } from './constants/api'
export type { Product } from './types'
```

### 5. 빌드 캐시 정리

에러 발생 시 다음 명령어 실행:

```bash
# Next.js 캐시 삭제
rm -rf .next

# node_modules 캐시 삭제 (필요시)
rm -rf node_modules/.cache

# 개발 서버 재시작
npm run dev
```

## 적용된 해결책

### 1. `app/providers.tsx` 수정
- `@/lib`에서 직접 import → 구체적인 경로로 변경
- 필요한 상수만 import

### 2. `next.config.js` 최적화
- webpack 설정 추가
- 모듈 해석 경로 명확화
- 서버/클라이언트 번들 분리

### 3. 실험적 기능 활성화
- `optimizePackageImports`로 패키지 import 최적화

## 예방 방법

1. **직접 import 사용**: `@/lib` 대신 구체적인 경로 사용
2. **서버/클라이언트 분리**: `'use client'`와 `'server-only'` 명확히 사용
3. **Barrel export 최소화**: 필요한 것만 export
4. **정기적인 캐시 정리**: 개발 중 주기적으로 `.next` 폴더 삭제

## 참고

- [Next.js Webpack Configuration](https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config)
- [Next.js Module Resolution](https://nextjs.org/docs/api-reference/next.config.js/module-resolution)
- [Tree Shaking in Next.js](https://nextjs.org/docs/advanced-features/compiler#tree-shaking)
