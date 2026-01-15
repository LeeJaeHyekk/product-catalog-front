# 데이터 파일 가이드

## category.json 구조

`category.json` 파일은 다음과 같은 구조를 가집니다:

```json
{
  "categoryRoot": "식품",
  "categories": [
    {
      "id": "fresh_agriculture",
      "name": "신선 농산물",
      "description": "...",
      "subCategories": [
        {
          "id": "fruit",
          "name": "과일",
          "items": ["사과", "배", "딸기"],
          "englishItems": ["apple", "pear", "strawberry"],  // 선택적
          "features": ["계절성 강함"]
        }
      ]
    }
  ]
}
```

## 영어 키워드 추가 방법

### 방법 1: category.json에 직접 추가 (권장)

각 서브 카테고리의 `englishItems` 배열에 영어 키워드를 추가합니다:

```json
{
  "id": "fruit",
  "name": "과일",
  "items": ["사과", "배", "딸기"],
  "englishItems": ["apple", "apples", "pear", "pears", "strawberry", "strawberries"]
}
```

### 방법 2: 자동 매핑 사용

`lib/data/english-keywords.ts`의 `ENGLISH_KEYWORD_MAP`에 매핑을 추가하면 자동으로 적용됩니다:

```typescript
export const ENGLISH_KEYWORD_MAP: Record<string, string[]> = {
  사과: ['apple', 'apples'],
  배: ['pear', 'pears'],
  // ...
}
```

**우선순위:**
1. `category.json`의 `englishItems` (있으면 우선 사용)
2. `english-keywords.ts`의 매핑 테이블 (자동 적용)

## 타입 안전성

모든 타입은 `lib/types/category.ts`에 엄격하게 정의되어 있습니다:

- `CategoryRoot`: 루트 구조
- `Category`: 메인 카테고리
- `SubCategory`: 서브 카테고리
- `FlatCategoryInfo`: 플랫 카테고리 정보
- `CategoryMatch`: 매칭 결과

## 사용 예시

```typescript
import { CATEGORY_DATA } from '@/lib/data/categories'
import { categorizeProduct } from '@/lib/product/category'

// 카테고리 분류
const categoryInfo = categorizeProduct('사과')
// { subCategoryId: 'fruit', subCategoryName: '과일', ... }

// 영어로도 매칭
const categoryInfo2 = categorizeProduct('apple')
// 동일한 결과 반환
```
