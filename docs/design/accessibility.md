# 접근성 원칙 (Accessibility)

## 목차

1. [접근성의 중요성](#접근성의-중요성)
2. [색상 대비](#색상-대비)
3. [텍스트 크기](#텍스트-크기)
4. [인터랙션](#인터랙션)
5. [스크린 리더 지원](#스크린-리더-지원)
6. [키보드 네비게이션](#키보드-네비게이션)
7. [접근성 체크리스트](#접근성-체크리스트)

---

## 접근성의 중요성

### 왜 중요한가?

이 서비스는 **공공성 서비스**이며, **식자재 유통**과 **공동구매**를 다룹니다.

- **중장년 사용자 비중이 높음**: 공동구매 특성상 다양한 연령대 사용
- **정보 접근성 필수**: 가격, 수량, 마감 시간 등 핵심 정보
- **법적 요구사항**: WCAG 2.1 AA 기준 준수

### 핵심 원칙

> **"모든 사용자가 동등하게 정보에 접근할 수 있어야 한다"**

---

## 색상 대비

### WCAG AA 기준

- **일반 텍스트**: 최소 4.5:1 대비율
- **큰 텍스트 (18px 이상)**: 최소 3:1 대비율
- **UI 컴포넌트**: 최소 3:1 대비율

### 컬러 시스템 대비 검증

| 조합 | 대비율 | WCAG 등급 | 상태 |
|------|--------|-----------|------|
| Primary Green (`#1E7F4F`) on White | 4.8:1 | AA | 준수 |
| Dark Gray (`#1F2933`) on White | 16.8:1 | AAA | 준수 |
| Accent Yellow (`#F2C94C`) on White | 1.9:1 | 미준수 | 주의 필요 |
| Accent Yellow on Dark Green | 4.2:1 | AA | 준수 |

### 구현 가이드

```tsx
// 충분한 대비 예시
<p className="text-gray-900">일반 텍스트</p>
<p className="text-[#1E7F4F]">Primary Green 텍스트</p>

// 대비 부족 예시
<p className="text-yellow-400">노란색 텍스트 (대비 부족)</p>

// 개선 예시: 배경색 추가
<p className="bg-yellow-100 text-yellow-900">노란색 텍스트 (개선)</p>
```

### 색상만으로 상태 구분 금지

```tsx
// 개선 전: 색상만으로 상태 구분
<div className="bg-green-500">성공</div>
<div className="bg-red-500">실패</div>

// 개선 후: 텍스트 + 아이콘 추가
<div className="bg-green-100 text-green-900 flex items-center gap-2">
  <CheckIcon className="w-4 h-4" />
  <span>성공</span>
</div>
```

---

## 텍스트 크기

### 최소 크기 규칙

- **본문 텍스트**: 최소 14px (0.875rem)
- **가격/수량**: 최소 16px (1rem) - 중요 정보
- **버튼 텍스트**: 최소 14px (0.875rem)
- **라벨/설명**: 최소 12px (0.75rem) - 보조 정보

### 반응형 텍스트 크기

```tsx
// 모바일: 기본 크기
<p className="text-sm">본문 텍스트 (14px)</p>
<p className="text-base">가격 (16px)</p>

// PC: 약간 큰 크기
<p className="text-sm md:text-base">본문 텍스트</p>
<p className="text-base md:text-lg">가격</p>
```

### 가독성 최적화

```tsx
// 개선 후: 충분한 크기와 간격
<div className="space-y-2">
  <h3 className="text-base font-semibold">상품명</h3>
  <p className="text-lg font-semibold">12,900원</p>
  <p className="text-sm text-gray-600">잔여 25 / 100</p>
</div>

// 개선 전: 너무 작은 텍스트
<p className="text-xs">12,900원</p> {/* 12px - 너무 작음 */}
```

---

## 인터랙션

### 터치 영역 최소 크기

- **버튼**: 최소 44px × 44px
- **링크**: 최소 44px × 44px
- **체크박스/라디오**: 최소 44px × 44px

### 구현 예시

```tsx
// 개선 후: 충분한 터치 영역
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  구매하기
</button>

// 개선 후: 패딩으로 터치 영역 확보
<a className="block py-3 px-4">상품 상세</a>

// 개선 전: 터치 영역 부족
<button className="h-8 px-2">구매</button> {/* 32px - 너무 작음 */}
```

### Hover + Focus 상태

```tsx
// 개선 후: Hover와 Focus 모두 정의
<button className="
  bg-green-600 text-white px-6 py-2 rounded
  hover:bg-green-700
  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
  transition-colors
">
  구매하기
</button>

// 키보드 포커스 시각화
<button className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-green-500
  focus-visible:ring-offset-2
">
  버튼
</button>
```

### 비활성화 상태

```tsx
// 개선 후: 명확한 비활성화 상태
<button
  disabled
  className="
    bg-gray-300 text-gray-500 cursor-not-allowed
    px-6 py-2 rounded
  "
  aria-disabled="true"
>
  품절
</button>
```

---

## 스크린 리더 지원

### ARIA 라벨 사용

```tsx
// 개선 후: 명확한 라벨
<article
  aria-label={`${name}, ${formatPrice(price)}, ${isSoldOut ? '품절' : '구매 가능'}`}
>
  <h2 className="sr-only">{name}</h2>
  {/* ... */}
</article>

// 개선 후: 상태 정보 제공
<div
  role="progressbar"
  aria-valuenow={current}
  aria-valuemin={0}
  aria-valuemax={target}
  aria-label={`진행률 ${(current / target) * 100}%`}
>
  {/* 진행률 바 */}
</div>
```

### 숨김 텍스트 (Screen Reader Only)

```tsx
// 개선 후: 시각적으로 숨기지만 스크린 리더는 읽음
<span className="sr-only">상품명: {name}</span>
<span className="sr-only">가격: {formatPrice(price)}</span>

// Tailwind CSS의 sr-only 클래스
// .sr-only {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   white-space: nowrap;
//   border-width: 0;
// }
```

### 상태 정보 제공

```tsx
// 개선 후: 상태 정보 명확히
<button
  aria-label={isSoldOut ? `${name} - 품절` : `${name} - 구매하기`}
  aria-disabled={isSoldOut}
>
  {isSoldOut ? '품절' : '구매하기'}
</button>

// 개선 후: 진행률 정보
<div
  aria-label={`공동구매 진행률: ${current} / ${target}, ${(current / target) * 100}%`}
>
  {/* 진행률 바 */}
</div>
```

### 이미지 대체 텍스트

```tsx
// 개선 후: 의미 있는 alt 텍스트
<img
  src={image}
  alt={`${name} 상품 이미지`}
  loading="lazy"
/>

// 개선 후: 장식용 이미지는 빈 alt
<img
  src="/decorative-pattern.svg"
  alt=""
  aria-hidden="true"
/>

// 개선 후: 이미지 없을 때
<div
  className="aspect-square bg-gray-100 flex items-center justify-center"
  aria-label="이미지 준비중"
>
  <span className="text-gray-400 text-sm">이미지 준비중</span>
</div>
```

---

## 키보드 네비게이션

### 포커스 순서

- **논리적 순서**: 위에서 아래, 왼쪽에서 오른쪽
- **스킵 링크**: 반복되는 네비게이션 건너뛰기
- **포커스 트랩**: 모달 내부에서 포커스 유지

### 구현 예시

```tsx
// 개선 후: 키보드 접근 가능한 카드
<article
  tabIndex={0}
  className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // 상세 페이지로 이동
    }
  }}
>
  {/* 상품 카드 내용 */}
</article>

// 개선 후: 스킵 링크
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded"
>
  메인 콘텐츠로 건너뛰기
</a>
```

### 키보드 단축키

```tsx
// ✅ 좋은 예: 키보드 이벤트 처리
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // ESC: 모달 닫기
    if (e.key === 'Escape' && isModalOpen) {
      closeModal()
    }
    
    // Enter: 버튼 활성화
    if (e.key === 'Enter' && e.target === buttonRef.current) {
      handleClick()
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

---

## 접근성 체크리스트

### 색상 및 대비

- [ ] 모든 텍스트가 WCAG AA 기준 (4.5:1) 충족
- [ ] 색상만으로 상태 구분하지 않음 (텍스트/아이콘 추가)
- [ ] 포커스 상태가 명확히 표시됨

### 텍스트

- [ ] 본문 텍스트 최소 14px
- [ ] 가격/수량 최소 16px
- [ ] 텍스트 크기 조절 가능 (브라우저 줌)

### 인터랙션

- [ ] 모든 버튼 최소 44px × 44px
- [ ] Hover와 Focus 상태 모두 정의
- [ ] 비활성화 상태 명확히 표시

### 스크린 리더

- [ ] 모든 이미지에 alt 텍스트 제공
- [ ] 상태 정보 aria-label로 제공
- [ ] 진행률 정보 role="progressbar" 사용
- [ ] 숨김 텍스트 적절히 사용

### 키보드 네비게이션

- [ ] 모든 인터랙티브 요소 키보드 접근 가능
- [ ] 포커스 순서 논리적
- [ ] 스킵 링크 제공 (필요 시)

### 테스트 도구

- **Chrome DevTools**: Lighthouse 접근성 감사
- **axe DevTools**: 접근성 이슈 자동 감지
- **WAVE**: 웹 접근성 평가 도구
- **스크린 리더**: NVDA (Windows), VoiceOver (Mac)

---

## 구현 예시: 접근 가능한 상품 카드

```tsx
export function AccessibleProductCard({ product }: ProductCardProps) {
  const { name, price, image, isSoldOut, current, limit } = product
  
  return (
    <article
      className={`
        border border-gray-200 rounded-lg overflow-hidden
        ${isSoldOut ? 'opacity-50 grayscale' : ''}
        focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2
      `}
      aria-label={`${name}, ${formatPrice(price)}, ${isSoldOut ? '품절' : '구매 가능'}`}
    >
      {/* 이미지 영역 */}
      <div className="aspect-square bg-gray-100 relative">
        {image ? (
          <img
            src={image}
            alt={`${name} 상품 이미지`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            aria-label="이미지 준비중"
          >
            <span className="text-gray-400 text-sm">이미지 준비중</span>
          </div>
        )}
        
        {isSoldOut && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            aria-label="품절"
          >
            <span className="bg-white px-4 py-2 rounded font-semibold text-gray-900">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      
      {/* 상품 정보 */}
      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          {name}
        </h2>
        
        <p
          className="text-lg font-semibold text-gray-900 mb-2"
          aria-label={`가격 ${formatPrice(price)}`}
        >
          {formatPrice(price)}
        </p>
        
        {/* 진행률 */}
        {!isSoldOut && (
          <div className="mb-3">
            <div
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={limit}
              aria-label={`진행률 ${Math.round((current / limit) * 100)}%`}
              className="w-full bg-gray-200 rounded-full h-2"
            >
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(current / limit) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              잔여 {limit - current} / {limit}
            </p>
          </div>
        )}
        
        {/* 버튼 */}
        <button
          disabled={isSoldOut}
          className={`
            w-full min-h-[44px] px-4 py-2 rounded font-semibold
            transition-colors
            ${isSoldOut
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }
          `}
          aria-label={isSoldOut ? `${name} - 품절` : `${name} - 구매하기`}
          aria-disabled={isSoldOut}
        >
          {isSoldOut ? '품절' : '구매하기'}
        </button>
      </div>
    </article>
  )
}
```

---

## 결론

### 접근성 구현 단계

1. **색상 대비**: WCAG AA 기준 준수
2. **텍스트 크기**: 최소 14px (본문), 16px (가격)
3. **터치 영역**: 최소 44px × 44px
4. **ARIA 라벨**: 상태 정보 명확히 제공
5. **키보드 네비게이션**: 모든 기능 접근 가능

### 접근성 = 신뢰

접근성을 고려한 디자인은:
- ✅ 더 많은 사용자가 서비스를 이용할 수 있음
- ✅ 법적 요구사항 준수
- ✅ 사용자 신뢰도 향상
- ✅ SEO 개선 (검색 엔진 최적화)

---

## 참고 자료

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM 접근성 체크리스트](https://webaim.org/standards/wcag/checklist)
- [MDN 접근성 가이드](https://developer.mozilla.org/ko/docs/Web/Accessibility)
