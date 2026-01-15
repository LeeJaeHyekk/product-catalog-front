/**
 * 상품 필터링 모듈
 * 
 * 카테고리, 검색어, 가격 등으로 상품 필터링
 */

import type { EnrichedProduct } from './category'
import { ValidationError } from '../errors'
import { isArray } from '../validation'
import { normalizeTextForMatching } from '../utils/string'
import { calculateRelevance, multiKeywordSearch, sortByRelevance } from '../utils/search'

/**
 * 필터 옵션
 */
export interface FilterOptions {
  /** 서브 카테고리 ID 필터 */
  subCategoryId?: string | '전체'
  /** 메인 카테고리 ID 필터 */
  categoryId?: string
  /** 검색어 (상품명) */
  searchQuery?: string
  /** 검색 모드 (AND/OR) */
  searchMode?: 'AND' | 'OR'
  /** 퍼지 검색 활성화 */
  fuzzySearch?: boolean
  /** 유사도 임계값 */
  similarityThreshold?: number
  /** 최소 가격 */
  minPrice?: number
  /** 최대 가격 */
  maxPrice?: number
  /** 재고 있는 상품만 */
  onlyAvailable?: boolean
  /** 정렬 기준 */
  sortBy?: 'price' | 'name' | 'progress' | 'index'
  /** 정렬 순서 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 상품 필터링
 * 
 * EnrichedProduct 배열을 필터링 (카테고리 정보가 이미 포함된 상품)
 * 
 * @throws {ValidationError} products나 options가 유효하지 않은 경우
 */
export function filterProducts(
  products: EnrichedProduct[],
  options: FilterOptions
): EnrichedProduct[] {
  // 타입 가드를 사용한 안전한 검증
  if (!isArray(products)) {
    throw new ValidationError('상품 목록은 배열이어야 합니다.')
  }

  if (!options || typeof options !== 'object') {
    throw new ValidationError('필터 옵션이 유효하지 않습니다.')
  }

  // 가격 필터 검증
  if (options.minPrice !== undefined) {
    if (typeof options.minPrice !== 'number' || options.minPrice < 0 || !isFinite(options.minPrice)) {
      throw new ValidationError('최소 가격은 0 이상의 유효한 숫자여야 합니다.')
    }
  }

  if (options.maxPrice !== undefined) {
    if (typeof options.maxPrice !== 'number' || options.maxPrice < 0 || !isFinite(options.maxPrice)) {
      throw new ValidationError('최대 가격은 0 이상의 유효한 숫자여야 합니다.')
    }
  }

  if (options.minPrice !== undefined && options.maxPrice !== undefined) {
    if (options.minPrice > options.maxPrice) {
      throw new ValidationError('최소 가격은 최대 가격보다 작거나 같아야 합니다.')
    }
  }

  // 서브 카테고리 ID 검증
  // 실제 상품에 존재하는 카테고리 ID만 허용 (동적 카테고리 'other' 등 포함)
  if (options.subCategoryId && options.subCategoryId !== '전체') {
    if (typeof options.subCategoryId !== 'string') {
      throw new ValidationError('서브 카테고리 ID는 문자열이어야 합니다.')
    }
    // 실제 상품에 존재하는 카테고리 ID인지 확인
    const existingSubCategoryIds = new Set(products.map(p => p.category.subCategoryId))
    if (!existingSubCategoryIds.has(options.subCategoryId)) {
      throw new ValidationError(`유효하지 않은 서브 카테고리 ID입니다: ${options.subCategoryId}`)
    }
  }

  // 검색어 검증
  if (options.searchQuery !== undefined && options.searchQuery !== null) {
    if (typeof options.searchQuery !== 'string') {
      throw new ValidationError('검색어는 문자열이어야 합니다.')
    }
  }

  // 정렬 옵션 검증
  if (options.sortBy && !['price', 'name', 'progress', 'index', 'relevance'].includes(options.sortBy)) {
    throw new ValidationError(`유효하지 않은 정렬 기준입니다: ${options.sortBy}`)
  }

  if (options.sortOrder && !['asc', 'desc'].includes(options.sortOrder)) {
    throw new ValidationError(`유효하지 않은 정렬 순서입니다: ${options.sortOrder}`)
  }

  // 안정성: 빈 배열이면 조기 반환 (성능 최적화)
  if (products.length === 0) {
    return []
  }

  let filtered = [...products]

  // 서브 카테고리 필터
  if (options.subCategoryId && options.subCategoryId !== '전체') {
    filtered = filtered.filter(p => {
      // 안정성: p.category가 유효한지 확인
      return p && p.category && p.category.subCategoryId === options.subCategoryId
    })
  }

  // 메인 카테고리 필터
  if (options.categoryId) {
    if (typeof options.categoryId !== 'string') {
      throw new ValidationError('메인 카테고리 ID는 문자열이어야 합니다.')
    }
    // 실제 상품에 존재하는 카테고리 ID인지 확인
    // 안정성: category가 없는 상품은 제외
    const existingCategoryIds = new Set(
      products
        .filter(p => p && p.category && p.category.categoryId)
        .map(p => p.category.categoryId)
    )
    if (!existingCategoryIds.has(options.categoryId)) {
      throw new ValidationError(`유효하지 않은 메인 카테고리 ID입니다: ${options.categoryId}`)
    }
    filtered = filtered.filter(p => {
      // 안정성: p.category가 유효한지 확인
      return p && p.category && p.category.categoryId === options.categoryId
    })
  }

  // 검색어 필터 (고급 검색 알고리즘 적용)
  // - 관련도 점수 계산
  // - 다중 키워드 검색 지원
  // - 유사도 검색 지원
  let searchScores: Map<EnrichedProduct, number> | null = null
  
  if (options.searchQuery) {
    const normalizedQuery = normalizeTextForMatching(options.searchQuery)
    if (normalizedQuery) {
      searchScores = new Map()
      const searchMode = options.searchMode ?? 'AND'
      const fuzzySearch = options.fuzzySearch ?? false
      const similarityThreshold = options.similarityThreshold ?? 0.7

      filtered = filtered.filter(p => {
        // 안정성: p.name이 유효한지 확인
        if (!p || !p.name || typeof p.name !== 'string') {
          return false
        }

        // 다중 키워드 검색 또는 단일 키워드 검색
        const hasMultipleKeywords = normalizedQuery.split(/\s+/).length > 1
        
        if (hasMultipleKeywords) {
          // 다중 키워드 검색
          const result = multiKeywordSearch(p.name, options.searchQuery!, searchMode)
          if (result.matched && searchScores) {
            searchScores.set(p, result.score)
            return true
          }
          return false
        } else {
          // 단일 키워드 검색 (관련도 점수 계산)
          const relevance = calculateRelevance(p.name, normalizedQuery, {
            fuzzy: fuzzySearch,
            similarityThreshold,
          })
          
          if (relevance.score > 0 && searchScores) {
            searchScores.set(p, relevance.score)
            return true
          }
          return false
        }
      })
    }
  }

  // 가격 필터
  if (options.minPrice !== undefined) {
    filtered = filtered.filter(p => {
      // 안정성: price가 유효한 숫자인지 확인
      return p && typeof p.price === 'number' && isFinite(p.price) && p.price >= options.minPrice!
    })
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter(p => {
      // 안정성: price가 유효한 숫자인지 확인
      return p && typeof p.price === 'number' && isFinite(p.price) && p.price <= options.maxPrice!
    })
  }

  // 재고 필터
  if (options.onlyAvailable) {
    filtered = filtered.filter(p => {
      // 안정성: isSoldOut이 유효한지 확인
      return p && typeof p.isSoldOut === 'boolean' && !p.isSoldOut
    })
  }

  // 정렬
  if (options.sortBy) {
    filtered.sort((a, b) => {
      // 안정성: a, b가 유효한지 확인
      if (!a || !b) {
        return 0
      }

      // 검색어가 있고 관련도 정렬인 경우
      if (options.sortBy === 'relevance' && searchScores) {
        const aScore = searchScores.get(a) ?? 0
        const bScore = searchScores.get(b) ?? 0
        return sortByRelevance(a, b, aScore, bScore)
      }

      // 검색어가 있지만 다른 정렬 기준인 경우, 관련도 점수를 먼저 고려
      if (searchScores && options.sortBy !== 'relevance') {
        const aScore = searchScores.get(a) ?? 0
        const bScore = searchScores.get(b) ?? 0
        
        // 관련도 점수가 다르면 관련도 순으로 정렬
        if (aScore !== bScore) {
          return bScore - aScore
        }
        // 관련도 점수가 같으면 지정된 기준으로 정렬
      }

      let comparison = 0

      switch (options.sortBy) {
        case 'price':
          // 안정성: price가 유효한 숫자인지 확인
          const aPrice = typeof a.price === 'number' && isFinite(a.price) ? a.price : 0
          const bPrice = typeof b.price === 'number' && isFinite(b.price) ? b.price : 0
          comparison = aPrice - bPrice
          break
        case 'name':
          // 안정성: name이 유효한 문자열인지 확인
          const aName = typeof a.name === 'string' ? a.name : ''
          const bName = typeof b.name === 'string' ? b.name : ''
          comparison = aName.localeCompare(bName, 'ko')
          break
        case 'progress':
          // 안정성: current, limit이 유효한 숫자인지 확인
          const aCurrent = typeof a.current === 'number' && isFinite(a.current) ? a.current : 0
          const aLimit = typeof a.limit === 'number' && isFinite(a.limit) && a.limit > 0 ? a.limit : 1
          const bCurrent = typeof b.current === 'number' && isFinite(b.current) ? b.current : 0
          const bLimit = typeof b.limit === 'number' && isFinite(b.limit) && bLimit > 0 ? b.limit : 1
          const aProgress = (aCurrent / aLimit) * 100
          const bProgress = (bCurrent / bLimit) * 100
          comparison = aProgress - bProgress
          break
        case 'index':
          // 안정성: index가 유효한 숫자인지 확인
          const aIndex = typeof a.index === 'number' && isFinite(a.index) ? a.index : 0
          const bIndex = typeof b.index === 'number' && isFinite(b.index) ? b.index : 0
          comparison = aIndex - bIndex
          break
        case 'relevance':
          // 관련도 정렬 (검색어가 없으면 기본 정렬)
          if (searchScores) {
            const aScore = searchScores.get(a) ?? 0
            const bScore = searchScores.get(b) ?? 0
            comparison = bScore - aScore
          } else {
            // 검색어가 없으면 인덱스 순으로 정렬
            const aIdx = typeof a.index === 'number' && isFinite(a.index) ? a.index : 0
            const bIdx = typeof b.index === 'number' && isFinite(b.index) ? b.index : 0
            comparison = aIdx - bIdx
          }
          break
      }

      return options.sortOrder === 'desc' ? -comparison : comparison
    })
  } else if (searchScores) {
    // 검색어가 있지만 정렬 기준이 지정되지 않은 경우, 관련도 순으로 자동 정렬
    if (searchScores) {
      filtered.sort((a, b) => {
        const aScore = searchScores.get(a) ?? 0
        const bScore = searchScores.get(b) ?? 0
        return sortByRelevance(a, b, aScore, bScore)
      })
    }
  }

  return filtered
}

/**
 * 사용 가능한 서브 카테고리 목록 가져오기
 * 
 * 실제 상품에 존재하는 카테고리만 반환
 * 
 * @throws {ValidationError} products가 배열이 아닌 경우
 */
export function getAvailableSubCategories(products: EnrichedProduct[]): Array<{
  id: string
  name: string
  count: number
}> {
  // 타입 가드를 사용한 안전한 검증
  if (!isArray(products)) {
    throw new ValidationError('상품 목록은 배열이어야 합니다.')
  }

  // 안정성: 빈 배열이면 조기 반환
  if (products.length === 0) {
    return []
  }

  const categoryMap = new Map<string, { name: string; count: number }>()

  for (const product of products) {
    // 안정성: product와 category가 유효한지 확인
    if (!product || !product.category) {
      continue
    }

    const { subCategoryId, subCategoryName } = product.category

    // 안정성: subCategoryId와 subCategoryName이 유효한지 확인
    if (!subCategoryId || typeof subCategoryId !== 'string') {
      continue
    }
    if (!subCategoryName || typeof subCategoryName !== 'string') {
      continue
    }

    const existing = categoryMap.get(subCategoryId)
    
    if (existing) {
      existing.count++
    } else {
      categoryMap.set(subCategoryId, {
        name: subCategoryName,
        count: 1,
      })
    }
  }

  return Array.from(categoryMap.entries())
    .map(([id, data]) => {
      // 안전성: id와 data가 유효한지 확인
      if (!id || typeof id !== 'string' || !data || typeof data !== 'object') {
        return null
      }
      const { name, count } = data
      // 안전성: name과 count가 유효한지 확인
      if (typeof name !== 'string' || typeof count !== 'number' || !isFinite(count) || count < 0) {
        return null
      }
      return { id, name, count }
    })
    .filter((item): item is { id: string; name: string; count: number } => item !== null)
    .sort((a, b) => {
      // 안정성: name이 유효한지 확인 (이미 필터링했지만 추가 보호)
      const aName = typeof a.name === 'string' ? a.name : ''
      const bName = typeof b.name === 'string' ? b.name : ''
      return aName.localeCompare(bName, 'ko')
    })
}
