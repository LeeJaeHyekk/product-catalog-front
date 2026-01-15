import type { Product, ProcessedProduct } from './types'
import { isNotNull, isArray } from './guards'

/**
 * 안전한 processProducts 함수
 * 입력 검증 및 에러 처리 포함
 */
export function processProducts(products: Product[]): ProcessedProduct[] {
  // 입력 검증
  if (!isArray(products)) {
    throw new Error('processProducts: products must be an array')
  }

  if (products.length === 0) {
    return []
  }

  // null/undefined 필터링 및 데이터 정규화
  const validProducts = products
    .filter(isNotNull)
    .filter((p): p is Product => {
      // 기본 검증
      return (
        typeof p.index === 'number' &&
        p.index >= 0 &&
        typeof p.name === 'string' &&
        p.name.length > 0 &&
        typeof p.price === 'number' &&
        p.price >= 0 &&
        typeof p.current === 'number' &&
        p.current >= 0 &&
        typeof p.limit === 'number' &&
        p.limit > 0
      )
    })
    .map(p => ({
      ...p,
      // 데이터 정규화
      index: Math.max(0, Math.min(49, p.index)),
      name: String(p.name).trim() || '상품명 없음',
      price: Math.max(0, p.price),
      current: Math.max(0, p.current),
      limit: Math.max(1, p.limit),
      image: p.image === null ? null : String(p.image),
    }))

  // 1. isSoldOut 파생 상태 계산
  const mapped = validProducts.map(p => ({
    ...p,
    isSoldOut: p.current >= p.limit,
  }))

  // 2. 판매중 상품 필터링 및 index 오름차순 정렬 (Stable Sort)
  const available = mapped
    .filter(p => !p.isSoldOut)
    .sort((a, b) => {
      // index가 같을 경우 name으로 2차 정렬 (안정성 보장)
      if (a.index !== b.index) {
        return a.index - b.index
      }
      return a.name.localeCompare(b.name, 'ko')
    })

  // 3. 품절 상품 필터링 및 index 오름차순 정렬 (Stable Sort, 하단에서도 정렬 유지)
  const soldOut = mapped
    .filter(p => p.isSoldOut)
    .sort((a, b) => {
      // index가 같을 경우 name으로 2차 정렬 (안정성 보장)
      if (a.index !== b.index) {
        return a.index - b.index
      }
      return a.name.localeCompare(b.name, 'ko')
    })

  // 4. 판매중 상품 먼저, 품절 상품은 하단에 배치
  return [...available, ...soldOut]
}

