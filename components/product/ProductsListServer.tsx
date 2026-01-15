import { fetchProducts } from '@/lib/api' // 서버 전용 직접 import
import { processAndEnrichProducts } from '@/lib/product' // 상품 처리 및 보강 모듈
import { NotFoundError } from '@/lib/errors'
import { ProductGridWithFilters } from './ProductGridWithFilters'

/**
 * 상품 목록 서버 컴포넌트
 * 
 * Streaming + Suspense 전략:
 * - 서버 컴포넌트에서 데이터 fetching
 * - Suspense boundary 안에서 사용되어 스트리밍 가능
 * - 데이터 준비되면 즉시 스트리밍으로 전송
 * 
 * 효과:
 * - 사용자는 즉시 Skeleton을 보고, 데이터 준비되면 부드럽게 전환
 * - 실제 서버 렌더 시간은 유지하되 체감 시간 최소화
 * 
 * 에러 처리:
 * - 에러는 Error Boundary에서 처리되도록 그대로 던집니다
 * - 도메인별 에러 타입(NotFoundError 등)을 사용하여 적절한 UI 표시
 */
export async function ProductsListServer() {
  // 1. API 호출
  const rawProducts = await fetchProducts()
  
  // 2. 한 번에 가공 (카테고리 포함)
  const enrichedProducts = processAndEnrichProducts(rawProducts)

  // 빈 배열인 경우 NotFoundError 던지기 (선택적)
  if (enrichedProducts.length === 0) {
    throw new NotFoundError('상품')
  }

  return <ProductGridWithFilters products={enrichedProducts} />
}
