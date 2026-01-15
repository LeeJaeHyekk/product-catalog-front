# UI 상태 디자인 규칙

## 목차

1. [상태 디자인 원칙](#상태-디자인-원칙)
2. [Loading State](#loading-state)
3. [Sold Out State](#sold-out-state)
4. [Group Buy States](#group-buy-states)
5. [Error State](#error-state)
6. [Empty State](#empty-state)
7. [상태 전환 애니메이션](#상태-전환-애니메이션)

---

## 상태 디자인 원칙

### 핵심 원칙

이 서비스는 **상태가 UX의 핵심**입니다. 공동구매 플랫폼의 특성상 다양한 상태를 명확히 구분해야 합니다.

### 상태 분류

| 상태 | 중요도 | 시각적 구분 | 사용자 액션 |
|------|--------|------------|------------|
| **Loading** | 높음 | Skeleton UI | 대기 |
| **Normal** | 높음 | 기본 스타일 | 구매 가능 |
| **Sold Out** | 높음 | 채도 감소, 오버레이 | 구매 불가 |
| **Group Buy Incomplete** | 높음 | 회색 진행률 | 대기 또는 공유 |
| **Group Buy Success** | 높음 | 초록색 진행률 | 구매 진행 |
| **Error** | 중간 | 에러 메시지 | 재시도 |
| **Empty** | 낮음 | 빈 상태 메시지 | 탐색 |

---

## Loading State

### 디자인 규칙

- **Skeleton UI 사용**: 실제 콘텐츠와 동일한 레이아웃
- **카드 레이아웃 유지**: 레이아웃 시프트(CLS) 방지
- **진행률 영역**: 회색 플레이스홀더로 표시
- **애니메이션**: 펄스(pulse) 효과

### 구현 예시

```tsx
// 상품 카드 Skeleton
<div className="border border-gray-200 rounded-lg overflow-hidden">
  {/* 이미지 영역 - 고정 비율 유지 */}
  <div className="aspect-square bg-gray-200 animate-pulse" />
  
  <div className="p-4">
    {/* 상품명 */}
    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
    
    {/* 가격 */}
    <div className="h-6 bg-gray-200 animate-pulse rounded mb-3 w-24" />
    
    {/* 진행률 바 */}
    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse mb-2" />
    
    {/* 수량 정보 */}
    <div className="h-3 bg-gray-200 animate-pulse rounded w-32" />
  </div>
</div>
```

### 그리드 Skeleton

```tsx
// ProductGridSkeleton
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {Array.from({ length: 8 }).map((_, idx) => (
    <ProductSkeleton key={idx} />
  ))}
</div>
```

### 원칙

- ✅ 실제 카드와 동일한 크기
- ✅ 이미지 영역 비율 고정 (aspect-square)
- ✅ 텍스트 영역 높이 고정
- ❌ 랜덤 크기, 가변 레이아웃 금지

---

## Sold Out State

### 디자인 규칙

- **카드 전체 채도 감소**: `opacity: 0.5`
- **그레이스케일 적용**: `grayscale`
- **이미지 영역 SOLD OUT 오버레이**: 반투명 배경 + 텍스트
- **CTA 비활성화**: 버튼 disabled 상태
- **리스트 최하단 고정 배치**: UX 요구사항 반영

### 구현 예시

```tsx
// 품절 상품 카드
<div className={`
  border border-gray-200 rounded-lg overflow-hidden
  opacity-50 grayscale
  relative
`}>
  {/* SOLD OUT 오버레이 */}
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
    <span className="bg-white px-4 py-2 rounded font-semibold text-gray-900">
      SOLD OUT
    </span>
  </div>
  
  {/* 이미지 영역 */}
  <div className="aspect-square bg-gray-100">
    {/* 이미지 또는 placeholder */}
  </div>
  
  <div className="p-4">
    <h3 className="font-semibold text-sm text-gray-600">상품명</h3>
    <p className="font-semibold text-lg text-gray-500">12,900원</p>
    
    {/* 비활성화된 버튼 */}
    <button
      disabled
      className="mt-2 w-full py-2 px-4 rounded bg-gray-300 text-gray-500 cursor-not-allowed"
      aria-label="품절된 상품"
    >
      품절
    </button>
  </div>
</div>
```

### 접근성

```tsx
<article
  aria-label={`${name} - 품절`}
  aria-disabled="true"
>
  {/* ... */}
</article>
```

### 원칙

- ✅ 시각적으로 명확한 품절 표시
- ✅ 클릭 불가능한 상태 명확히 전달
- ✅ 하단 고정 배치로 정상 상품과 분리
- ❌ 품절 상품이 정상 상품과 혼동되지 않도록

---

## Group Buy States

### Group Buy Incomplete (목표 미달)

#### 디자인 규칙

- **진행률 색상**: 회색 (`#9CA3AF`)
- **진행률 바**: 목표 미달 상태 명확히 표시
- **텍스트**: "목표 미달" 또는 "진행 중" 표시
- **CTA**: 공유하기 또는 알림 받기

#### 구현 예시

```tsx
<div className="mt-2">
  {/* 진행률 바 - 회색 */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-gray-400 h-2 rounded-full"
      style={{ width: `${(current / target) * 100}%` }}
      aria-label={`진행률 ${(current / target) * 100}%`}
    />
  </div>
  
  {/* 상태 텍스트 */}
  <p className="text-xs text-gray-600 mt-1">
    목표 미달 · 잔여 {target - current} / {target}
  </p>
  
  {/* CTA */}
  <button className="mt-2 w-full py-2 px-4 rounded bg-gray-500 text-white">
    공유하기
  </button>
</div>
```

### Group Buy Success (목표 달성)

#### 디자인 규칙

- **진행률 색상**: Primary Green (`#1E7F4F`)
- **강조 배지**: "목표 달성" 또는 "구매 가능" 배지
- **CTA**: 구매하기 버튼 활성화
- **시각적 강조**: 성공 상태 명확히 표시

#### 구현 예시

```tsx
<div className="mt-2">
  {/* 성공 배지 */}
  <div className="mb-2">
    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
      목표 달성 ✓
    </span>
  </div>
  
  {/* 진행률 바 - 초록색 */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-green-600 h-2 rounded-full"
      style={{ width: '100%' }}
      aria-label="목표 달성"
    />
  </div>
  
  {/* 상태 텍스트 */}
  <p className="text-xs text-green-700 mt-1 font-semibold">
    구매 가능 · {current} / {target}
  </p>
  
  {/* CTA */}
  <button className="mt-2 w-full py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700">
    구매하기
  </button>
</div>
```

### Group Buy Urgent (마감 임박)

#### 디자인 규칙

- **진행률 색상**: 노란색 또는 주황색 (`#F2C94C` 또는 `#F59E0B`)
- **카운트다운 표시**: 남은 시간 강조
- **시각적 경고**: 긴급성 전달

#### 구현 예시

```tsx
<div className="mt-2">
  {/* 마감 임박 배지 */}
  <div className="mb-2 flex items-center gap-2">
    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
      마감 임박
    </span>
    <span className="text-xs text-yellow-700 font-semibold">
      {remainingTime} 남음
    </span>
  </div>
  
  {/* 진행률 바 - 노란색 */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-yellow-500 h-2 rounded-full animate-pulse"
      style={{ width: `${(current / target) * 100}%` }}
    />
  </div>
</div>
```

---

## Error State

### 디자인 규칙

- **리스트 영역 단위 에러 처리**: 전체 페이지 에러 금지
- **명확한 에러 메시지**: 사용자 친화적 메시지
- **재시도 버튼**: 명확한 액션 제공
- **시각적 구분**: 에러 상태 명확히 표시

### 구현 예시

```tsx
// 상품 리스트 에러
<div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
  <div className="text-red-600 mb-2">
    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* 에러 아이콘 */}
    </svg>
  </div>
  
  <h3 className="font-semibold text-gray-900 mb-1">
    상품을 불러올 수 없습니다
  </h3>
  
  <p className="text-sm text-gray-600 mb-4">
    네트워크 연결을 확인하고 다시 시도해주세요.
  </p>
  
  <button
    onClick={onRetry}
    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
  >
    다시 시도
  </button>
</div>
```

### 원칙

- ✅ 부분적 에러 처리 (전체 페이지 에러 금지)
- ✅ 명확한 에러 메시지
- ✅ 재시도 액션 제공
- ❌ 기술적 에러 메시지 노출 금지

---

## Empty State

### 디자인 규칙

- **명확한 메시지**: 왜 비어있는지 설명
- **액션 제안**: 다음 단계 제시
- **시각적 요소**: 아이콘 또는 일러스트

### 구현 예시

```tsx
// 빈 상품 리스트
<div className="text-center py-12">
  <div className="text-gray-400 mb-4">
    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* 빈 상태 아이콘 */}
    </svg>
  </div>
  
  <h3 className="font-semibold text-gray-900 mb-2">
    표시할 상품이 없습니다
  </h3>
  
  <p className="text-sm text-gray-600 mb-4">
    현재 판매 가능한 상품이 없습니다.
  </p>
  
  <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
    전체 상품 보기
  </button>
</div>
```

### 품절만 있는 경우

```tsx
<div className="text-center py-12">
  <h3 className="font-semibold text-gray-900 mb-2">
    현재 판매 가능한 상품이 없습니다
  </h3>
  
  <p className="text-sm text-gray-600">
    품절 상품만 표시됩니다.
  </p>
</div>
```

---

## 상태 전환 애니메이션

### 전환 원칙

- **부드러운 전환**: 200-300ms transition
- **레이아웃 안정성**: 높이 변화 최소화
- **명확한 피드백**: 상태 변화 즉시 인지 가능

### 구현 예시

```tsx
// 상태 전환 애니메이션
<div className="transition-all duration-300 ease-in-out">
  {/* 상태에 따라 클래스 변경 */}
  {isSoldOut && (
    <div className="animate-fade-in">
      {/* SOLD OUT 오버레이 */}
    </div>
  )}
</div>
```

### CSS 애니메이션

```css
/* Fade in */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Pulse (로딩) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Slide up (새 상품 추가) */
@keyframes slide-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## 상태별 색상 매핑

| 상태 | 배경색 | 텍스트 색 | 진행률 색 | CTA 색 |
|------|--------|----------|----------|--------|
| **Loading** | Gray-200 | Gray-400 | Gray-200 | - |
| **Normal** | White | Gray-900 | Gray-200 | Green-600 |
| **Sold Out** | Gray-100 (50% opacity) | Gray-500 | - | Gray-300 |
| **Incomplete** | White | Gray-700 | Gray-400 | Gray-500 |
| **Success** | White | Gray-900 | Green-600 | Green-600 |
| **Urgent** | White | Gray-900 | Yellow-500 | Yellow-500 |
| **Error** | Red-50 | Gray-900 | - | Red-600 |
| **Empty** | White | Gray-600 | - | Green-600 |

---

## 결론

### 상태 디자인 체크리스트

- ✅ 모든 상태에 대한 시각적 규칙 정의
- ✅ 상태별 색상 매핑 명확히
- ✅ 상태 전환 애니메이션 정의
- ✅ 접근성 고려 (aria-label, disabled 상태)
- ✅ 레이아웃 안정성 유지 (CLS 방지)

### 구현 단계

1. **Loading State**: Skeleton UI
2. **Sold Out State**: 품절 처리 (UX 요구사항)
3. **Group Buy States**: 진행률 표시 (핵심 기능)
4. **Error State**: 에러 처리 (안정성)
5. **Empty State**: 빈 상태 (완성도)
