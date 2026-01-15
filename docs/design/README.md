# 디자인 시스템 문서

이 디렉토리는 프로젝트의 디자인 시스템과 브랜드 정체성에 대한 문서를 포함합니다.

## 문서 목록

### 1. 브랜드 정체성 및 디자인 전략
- **파일**: `brand-identity.md`
- **내용**: 브랜드 핵심 이미지, 디자인 방향, 컬러 시스템, 타이포그래피, 레이아웃 구조 등
- **용도**: 전체 디자인 시스템의 기반이 되는 문서

### 2. 디자인 토큰
- **파일**: `design-tokens.ts`
- **내용**: 컬러, 타이포그래피, 간격, 그림자, 전환 등 디자인 토큰 정의
- **용도**: 코드에서 직접 사용할 수 있는 디자인 토큰
- **원칙**: 모든 UI 값은 토큰에서 파생, 임의 px 사용 금지

### 3. UI 상태 디자인 규칙
- **파일**: `ui-states.md`
- **내용**: Loading, Sold Out, Group Buy, Error, Empty 상태별 디자인 규칙
- **용도**: 상황별 UI 대응 전략

### 4. 접근성 원칙
- **파일**: `accessibility.md`
- **내용**: 색상 대비, 텍스트 크기, 인터랙션, 스크린 리더 지원, 키보드 네비게이션
- **용도**: WCAG AA 기준 준수, 모든 사용자 접근성 보장

### 5. 대용량 상품 UX 전략
- **파일**: `performance-ux.md`
- **내용**: 초기 로드 전략, 스크롤 전략, 리스트 안정성, 성능 최적화, 가상화
- **용도**: 확장 가능한 UX 설계, 성능 최적화 전략

## 디자인 철학

> **"현장감을 살린 신뢰 중심 유통 플랫폼 UI"**

이 프로젝트의 디자인은 "예쁘게 보이는 쇼핑몰"이 아니라  
"실제 식자재 유통 현장을 웹으로 옮긴 플랫폼"처럼 만들어야 합니다.

## 핵심 원칙

1. **현장감**: 실제 매장 사진, 실제 물량 정보
2. **신뢰**: 투명한 정보, 명확한 가격
3. **실용성**: 장식보다 기능, 감성보다 정보
4. **공동구매 특화**: 진행률, 수량, 마감 시간 강조

## 디자인 키워드

1. 현장감
2. 신뢰
3. 물량
4. 정렬
5. 신선
6. 가격 투명성
7. 실용성

## 컬러 시스템

- **Primary**: Fresh Green (`#1E7F4F` ~ `#2E9F6B`)
- **Secondary**: Dark Green (`#0F3D2E`)
- **Accent**: Fresh Yellow (`#F2C94C`)
- **Background**: Off White (`#F7F8F7`)
- **Text**: Dark Gray (`#1F2933`)

## 타이포그래피

- **폰트**: Pretendard / SUIT / Noto Sans KR
- **원칙**: 가독성 = 신뢰
- **굵기**: 명확히 분리 (Regular, SemiBold, Bold)

## 사용 방법

### 디자인 토큰 사용

```typescript
import { designTokens } from '@/docs/design/design-tokens'

// 컬러 사용
const primaryColor = designTokens.colors.primary.main

// 타이포그래피 사용
const headingStyle = {
  fontFamily: designTokens.typography.fontFamily.sans,
  fontSize: designTokens.typography.fontSize['2xl'],
  fontWeight: designTokens.typography.fontWeight.bold,
}
```

### Tailwind CSS 클래스 사용

```tsx
// 컬러
<div className="bg-[#1E7F4F] text-white">Primary Green</div>

// 타이포그래피
<h1 className="font-bold text-2xl text-gray-900">제목</h1>

// 레이아웃
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* 상품 카드 */}
</div>
```

## 문서 구조

```
design/
 ├─ README.md (현재 문서)
 ├─ brand-identity.md        # 브랜드 정체성 및 디자인 전략
 ├─ design-tokens.ts         # 디자인 토큰 정의
 ├─ ui-states.md             # UI 상태 디자인 규칙
 ├─ accessibility.md         # 접근성 원칙
 └─ performance-ux.md       # 대용량 상품 UX 전략
```

## 빠른 링크

- [브랜드 정체성 문서](./brand-identity.md)
- [디자인 토큰 정의](./design-tokens.ts)
- [UI 상태 규칙](./ui-states.md)
- [접근성 가이드](./accessibility.md)
- [성능 UX 전략](./performance-ux.md)