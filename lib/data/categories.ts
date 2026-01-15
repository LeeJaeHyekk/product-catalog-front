/**
 * 카테고리 데이터 로더
 * 
 * category.json 파일을 타입 안전하게 로드하고 변환
 */

import categoryData from './category.json'
import type { CategoryRoot, FlatCategoryInfo, Category } from '../types/category'
import { getEnglishKeywords } from './english-keywords'
import { ValidationError } from '../errors'
import { isCategoryArray } from '../validation/guards'

/**
 * 카테고리 데이터 타입 검증 및 로드
 * 
 * @throws {ValidationError} 카테고리 데이터가 유효하지 않은 경우
 */
function loadCategoryData(): CategoryRoot {
  // 타입 검증 (런타임)
  if (!categoryData || typeof categoryData !== 'object') {
    throw new ValidationError('카테고리 데이터: 루트 객체가 없습니다.')
  }

  if (!('categoryRoot' in categoryData) || typeof categoryData.categoryRoot !== 'string') {
    throw new ValidationError('카테고리 데이터: categoryRoot가 없거나 유효하지 않습니다.')
  }

  if (!('categories' in categoryData) || !Array.isArray(categoryData.categories)) {
    throw new ValidationError('카테고리 데이터: categories 배열이 없습니다.')
  }

  // 각 카테고리 및 서브카테고리 검증
  for (let i = 0; i < categoryData.categories.length; i++) {
    const category = categoryData.categories[i]
    
    if (!category || typeof category !== 'object') {
      throw new ValidationError(`카테고리 데이터: 카테고리 ${i}가 유효하지 않습니다.`)
    }

    if (!category.id || typeof category.id !== 'string') {
      throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 id가 없거나 유효하지 않습니다.`)
    }

    if (!category.name || typeof category.name !== 'string') {
      throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 name이 없거나 유효하지 않습니다.`)
    }

    if (!Array.isArray(category.subCategories)) {
      throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 subCategories가 배열이 아닙니다.`)
    }

    // 서브카테고리 검증
    for (let j = 0; j < category.subCategories.length; j++) {
      const subCategory = category.subCategories[j]

      if (!subCategory || typeof subCategory !== 'object') {
        throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}가 유효하지 않습니다.`)
      }

      if (!subCategory.id || typeof subCategory.id !== 'string') {
        throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}의 id가 없거나 유효하지 않습니다.`)
      }

      if (!subCategory.name || typeof subCategory.name !== 'string') {
        throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}의 name이 없거나 유효하지 않습니다.`)
      }

      if (!Array.isArray(subCategory.items)) {
        throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}의 items가 배열이 아닙니다.`)
      }

      // items 배열의 각 항목이 문자열인지 검증
      for (let k = 0; k < subCategory.items.length; k++) {
        if (typeof subCategory.items[k] !== 'string') {
          throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}의 items[${k}]가 문자열이 아닙니다.`)
        }
      }

      // englishItems가 있으면 검증
      if ('englishItems' in subCategory && subCategory.englishItems !== undefined) {
        if (!Array.isArray(subCategory.englishItems)) {
          throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}의 englishItems가 배열이 아닙니다.`)
        }

        for (let k = 0; k < subCategory.englishItems.length; k++) {
          if (typeof subCategory.englishItems[k] !== 'string') {
            throw new ValidationError(`카테고리 데이터: 카테고리 ${i}의 서브카테고리 ${j}의 englishItems[${k}]가 문자열이 아닙니다.`)
          }
        }
      }
    }
  }

  // 모든 검증을 통과했으므로 타입 가드로 안전하게 변환
  const validatedCategoryRoot: string = 
    typeof categoryData.categoryRoot === 'string' 
      ? categoryData.categoryRoot 
      : ''
  
  // 타입 가드를 사용하여 안전하게 변환
  const validatedCategories: readonly Category[] = 
    isCategoryArray(categoryData.categories)
      ? categoryData.categories
      : []
  
  const validatedData: CategoryRoot = {
    categoryRoot: validatedCategoryRoot,
    categories: validatedCategories,
  }
  return validatedData
}

/**
 * 로드된 카테고리 데이터
 */
const categoryRoot = loadCategoryData()

/**
 * 플랫 카테고리 정보 생성
 * 
 * 모든 서브 카테고리의 키워드를 평탄화하여 빠른 검색 가능하도록 변환
 */
function createFlatCategoryInfo(): FlatCategoryInfo[] {
  const flatInfo: FlatCategoryInfo[] = []

  // 안정성: categoryRoot.categories가 유효한지 확인
  if (!categoryRoot.categories || !Array.isArray(categoryRoot.categories)) {
    return []
  }

  for (const category of categoryRoot.categories) {
    // 안정성: category와 subCategories가 유효한지 확인
    if (!category || !category.subCategories || !Array.isArray(category.subCategories)) {
      continue
    }

    for (const subCategory of category.subCategories) {
      // 안정성: subCategory가 유효한지 확인
      if (!subCategory || !subCategory.id || !subCategory.name) {
        continue
      }

      // 안정성: items가 유효한 배열인지 확인
      const koreanKeywords = Array.isArray(subCategory.items) 
        ? subCategory.items.filter((item: unknown): item is string => 
            typeof item === 'string' && item.trim().length > 0
          )
        : []

      // 영어 키워드 매핑 생성
      // 1. category.json에 englishItems가 있으면 사용
      // 2. 없으면 english-keywords.ts의 매핑 테이블에서 자동 생성
      const englishKeywordsFromJson = Array.isArray(subCategory.englishItems)
        ? subCategory.englishItems.filter((item: unknown): item is string => 
            typeof item === 'string' && item.trim().length > 0
          )
        : []
      
      const englishKeywordsFromMap = koreanKeywords.flatMap((item: string) => {
        try {
          return getEnglishKeywords(item)
        } catch {
          return []
        }
      })
      
      // 중복 제거 및 병합
      const englishKeywords = Array.from(
        new Set([...englishKeywordsFromJson, ...englishKeywordsFromMap])
      ).filter((keyword: unknown): keyword is string => 
        typeof keyword === 'string' && keyword.trim().length > 0
      )

      // 안정성: 키워드가 하나도 없으면 스킵하지 않음 (기타 카테고리 등)
      flatInfo.push({
        subCategoryId: subCategory.id,
        subCategoryName: subCategory.name,
        categoryId: category.id,
        categoryName: category.name,
        koreanKeywords,
        englishKeywords,
      })
    }
  }

  return flatInfo
}

/**
 * 플랫 카테고리 정보 (캐시)
 */
const flatCategoryInfo = createFlatCategoryInfo()

/**
 * 카테고리 데이터 export
 */
export const CATEGORY_DATA = {
  root: categoryRoot,
  flat: flatCategoryInfo,
} as const

/**
 * 모든 서브 카테고리 ID 목록
 * 
 * 타입 안전성: flatCategoryInfo의 subCategoryId는 이미 string 타입이므로 안전
 */
export const SUB_CATEGORY_IDS: readonly string[] = flatCategoryInfo.map(info => info.subCategoryId)

/**
 * 모든 서브 카테고리 이름 목록
 * 
 * 타입 안전성: flatCategoryInfo의 subCategoryName은 이미 string 타입이므로 안전
 */
export const SUB_CATEGORY_NAMES: readonly string[] = flatCategoryInfo.map(info => info.subCategoryName)

/**
 * 서브 카테고리 ID로 정보 찾기
 */
export function getSubCategoryById(subCategoryId: string): FlatCategoryInfo | undefined {
  return flatCategoryInfo.find(info => info.subCategoryId === subCategoryId)
}

/**
 * 서브 카테고리 이름으로 정보 찾기
 */
export function getSubCategoryByName(subCategoryName: string): FlatCategoryInfo | undefined {
  return flatCategoryInfo.find(info => info.subCategoryName === subCategoryName)
}
