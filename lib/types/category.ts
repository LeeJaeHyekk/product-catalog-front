/**
 * 카테고리 관련 타입 정의
 * 
 * category.json 파일 구조를 기반으로 엄격한 타입 정의
 */

/**
 * 서브 카테고리 타입
 */
export interface SubCategory {
  /** 서브 카테고리 ID (영문) */
  id: string
  /** 서브 카테고리 이름 (한글) */
  name: string
  /** 상품명 키워드 목록 (한글) */
  items: readonly string[]
  /** 영어 키워드 목록 (선택적, category.json에 직접 추가 가능) */
  englishItems?: readonly string[]
  /** 카테고리 특징 (선택적) */
  features?: readonly string[]
}

/**
 * 메인 카테고리 타입
 */
export interface Category {
  /** 카테고리 ID (영문) */
  id: string
  /** 카테고리 이름 (한글) */
  name: string
  /** 카테고리 설명 */
  description: string
  /** 서브 카테고리 목록 */
  subCategories: readonly SubCategory[]
}

/**
 * 카테고리 루트 구조
 */
export interface CategoryRoot {
  /** 루트 카테고리 이름 */
  categoryRoot: string
  /** 메인 카테고리 목록 */
  categories: readonly Category[]
}

/**
 * 플랫 카테고리 정보 (분류에 사용)
 */
export interface FlatCategoryInfo {
  /** 서브 카테고리 ID */
  subCategoryId: string
  /** 서브 카테고리 이름 */
  subCategoryName: string
  /** 메인 카테고리 ID */
  categoryId: string
  /** 메인 카테고리 이름 */
  categoryName: string
  /** 한글 키워드 목록 */
  koreanKeywords: readonly string[]
  /** 영어 키워드 목록 */
  englishKeywords: readonly string[]
}

/**
 * 카테고리 분류 결과
 */
export interface CategoryMatch {
  /** 서브 카테고리 ID */
  subCategoryId: string
  /** 서브 카테고리 이름 */
  subCategoryName: string
  /** 메인 카테고리 ID */
  categoryId: string
  /** 메인 카테고리 이름 */
  categoryName: string
  /** 매칭된 키워드 */
  matchedKeyword: string
  /** 매칭 타입 (한글/영어) */
  matchType: 'korean' | 'english'
}
