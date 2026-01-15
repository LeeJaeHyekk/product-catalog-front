# 로딩 스피너 기능

## 구현 내용

로딩 상태를 시각적으로 표시하기 위한 스피너 컴포넌트를 추가했습니다.

## 컴포넌트

### 1. Spinner
- 위치: `components/ui/Spinner.tsx`
- 크기 옵션: `sm`, `md`, `lg`
- 접근성: `aria-label` 및 스크린 리더 텍스트 포함

### 2. LoadingSpinner
- 위치: `components/ui/LoadingSpinner.tsx`
- 스피너 + 텍스트 조합
- 중앙 정렬 레이아웃

## 사용 위치

1. **`app/products/loading.tsx`**
   - 페이지 레벨 로딩 상태
   - 스피너 + Skeleton UI 조합

2. **Suspense Fallback**
   - `ProductGridSkeleton`과 함께 사용 가능

## 접근성

- `role="status"` 속성으로 스크린 리더 지원
- `aria-label`로 로딩 상태 명시
- 애니메이션 최적화 (`motion-reduce` 지원)
