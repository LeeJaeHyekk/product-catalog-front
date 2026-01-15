/**
 * 상품 카테고리 분류 모듈
 * 
 * 상품명을 기반으로 카테고리를 자동 분류
 * 한글 및 영어 키워드 지원
 */

import type { ProcessedProduct } from '../types'
import type { CategoryMatch } from '../types/category'
import { CATEGORY_DATA } from '../data/categories'
import { ValidationError } from '../errors'
import { isArray, isCategoryMatch, isNonEmptyString } from '../validation'
import { normalizeTextForMatching } from '../utils/string'

/**
 * 상품명에서 카테고리 매칭
 * 
 * 한글 키워드 우선, 없으면 영어 키워드 검색
 * 띄어쓰기 차이를 무시하고 매칭 (텍스트 정규화 적용)
 * 
 * @throws {ValidationError} productName이 유효하지 않은 경우
 */
export function matchCategory(productName: string): CategoryMatch | null {
  if (typeof productName !== 'string') {
    throw new ValidationError('상품명은 문자열이어야 합니다.')
  }

  // 텍스트 정규화: 띄어쓰기 제거 및 소문자 변환
  const normalizedName = normalizeTextForMatching(productName)

  if (!normalizedName) {
    return null
  }

  // 모든 플랫 카테고리 정보를 순회하며 매칭
  // 안정성: CATEGORY_DATA.flat이 빈 배열이거나 undefined일 수 있으므로 안전하게 처리
  if (!CATEGORY_DATA.flat || CATEGORY_DATA.flat.length === 0) {
    return null
  }

  // 모든 매칭 결과를 수집 (더 긴 키워드를 우선하기 위해)
  const matches: Array<{
    info: typeof CATEGORY_DATA.flat[0]
    keyword: string
    matchType: 'korean' | 'english'
    keywordLength: number
  }> = []

  for (const info of CATEGORY_DATA.flat) {
    // 안정성: info가 유효한지 확인
    if (!info || !info.koreanKeywords || !info.englishKeywords) {
      continue
    }

    // 1. 한글 키워드 검색 (우선)
    // 안정성: 빈 키워드는 스킵
    for (const keyword of info.koreanKeywords) {
      if (!keyword || typeof keyword !== 'string') {
        continue
      }
      const normalizedKeyword = normalizeTextForMatching(keyword)
      // 안정성: 정규화 후 빈 문자열이면 스킵
      if (!normalizedKeyword) {
        continue
      }
      if (normalizedName.includes(normalizedKeyword)) {
        matches.push({
          info,
          keyword,
          matchType: 'korean',
          keywordLength: normalizedKeyword.length,
        })
      }
    }

    // 2. 영어 키워드 검색
    // 안정성: 빈 키워드는 스킵
    for (const keyword of info.englishKeywords) {
      if (!keyword || typeof keyword !== 'string') {
        continue
      }
      const normalizedKeyword = normalizeTextForMatching(keyword)
      // 안정성: 정규화 후 빈 문자열이면 스킵
      if (!normalizedKeyword) {
        continue
      }
      if (normalizedName.includes(normalizedKeyword)) {
        matches.push({
          info,
          keyword,
          matchType: 'english',
          keywordLength: normalizedKeyword.length,
        })
      }
    }
  }

  // 매칭 결과가 없으면 null 반환
  if (matches.length === 0) {
    return null
  }

  // 더 긴 키워드를 우선적으로 선택 (같은 길이면 한글 우선)
  matches.sort((a, b) => {
    // 1. 키워드 길이로 정렬 (긴 것 우선)
    if (b.keywordLength !== a.keywordLength) {
      return b.keywordLength - a.keywordLength
    }
    // 2. 같은 길이면 한글 우선
    if (a.matchType !== b.matchType) {
      return a.matchType === 'korean' ? -1 : 1
    }
    return 0
  })

  // 가장 우선순위가 높은 매칭 결과 반환
  // 안전성: matches.length > 0 체크 후이지만 타입 안전성을 위해 명시적 체크
  const bestMatch = matches[0]
  if (!bestMatch || !bestMatch.info) {
    return null
  }

  // 안전성: 타입 가드를 사용하여 필수 필드 검증
  if (
    !isNonEmptyString(bestMatch.info.subCategoryId) ||
    !isNonEmptyString(bestMatch.info.subCategoryName) ||
    !isNonEmptyString(bestMatch.info.categoryId) ||
    !isNonEmptyString(bestMatch.info.categoryName) ||
    !isNonEmptyString(bestMatch.keyword)
  ) {
    return null
  }

  // 타입 가드를 통과한 값들로 CategoryMatch 객체 생성
  const categoryMatch: CategoryMatch = {
    subCategoryId: bestMatch.info.subCategoryId,
    subCategoryName: bestMatch.info.subCategoryName,
    categoryId: bestMatch.info.categoryId,
    categoryName: bestMatch.info.categoryName,
    matchedKeyword: bestMatch.keyword,
    matchType: bestMatch.matchType,
  }

  // 최종 검증: 생성된 객체가 유효한 CategoryMatch인지 확인
  if (!isCategoryMatch(categoryMatch)) {
    return null
  }

  return categoryMatch
}

/**
 * 카테고리 분류 결과 타입
 */
export interface ProductCategoryInfo {
  /** 서브 카테고리 ID */
  subCategoryId: string
  /** 서브 카테고리 이름 */
  subCategoryName: string
  /** 메인 카테고리 ID */
  categoryId: string
  /** 메인 카테고리 이름 */
  categoryName: string
  /** 매칭된 키워드 (없으면 null) */
  matchedKeyword: string | null
  /** 매칭 타입 (없으면 null) */
  matchType: 'korean' | 'english' | null
}

/**
 * 기본 카테고리 (매칭 실패 시)
 */
const DEFAULT_CATEGORY: ProductCategoryInfo = {
  subCategoryId: 'other',
  subCategoryName: '기타',
  categoryId: 'other',
  categoryName: '기타',
  matchedKeyword: null,
  matchType: null,
}

/**
 * 상품에 카테고리 정보 추가
 * 
 * @throws {ValidationError} productName이 유효하지 않은 경우
 */
export function categorizeProduct(productName: string): ProductCategoryInfo {
  if (typeof productName !== 'string') {
    throw new ValidationError('상품명은 문자열이어야 합니다.')
  }

  const match = matchCategory(productName)

  if (!match) {
    return DEFAULT_CATEGORY
  }

  return {
    subCategoryId: match.subCategoryId,
    subCategoryName: match.subCategoryName,
    categoryId: match.categoryId,
    categoryName: match.categoryName,
    matchedKeyword: match.matchedKeyword,
    matchType: match.matchType,
  }
}

/**
 * 상품 배열에 카테고리 정보 추가
 */
export interface EnrichedProduct extends ProcessedProduct {
  category: ProductCategoryInfo
}

/**
 * 상품 배열에 카테고리 정보 추가
 * 
 * @throws {ValidationError} products가 배열이 아니거나, 상품 데이터가 유효하지 않은 경우
 */
export function enrichProductsWithCategory(
  products: ProcessedProduct[]
): EnrichedProduct[] {
  // 타입 가드를 사용한 안전한 검증
  if (!isArray(products)) {
    throw new ValidationError('상품 목록은 배열이어야 합니다.')
  }

  if (products.length === 0) {
    return []
  }

  try {
    return products.map((product, index) => {
      if (!product || typeof product !== 'object') {
        throw new ValidationError(`상품 데이터가 유효하지 않습니다. (인덱스: ${index})`)
      }

      if (typeof product.name !== 'string' || !product.name.trim()) {
        throw new ValidationError(`상품명이 유효하지 않습니다. (인덱스: ${index})`)
      }

      // 안정성: categorizeProduct가 에러를 던지면 기본 카테고리 사용
      let category: ProductCategoryInfo
      try {
        category = categorizeProduct(product.name)
      } catch (error) {
        // 카테고리 분류 실패 시 기본 카테고리 사용
        category = DEFAULT_CATEGORY
      }

      return {
        ...product,
        category,
      }
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError(`카테고리 분류 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
  }
}
