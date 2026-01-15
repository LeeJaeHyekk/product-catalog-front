import { ProductGrid } from './ProductGrid'
import { fetchProducts } from '@/lib/api'
import { processProducts } from '@/lib/product'

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
 */
export async function ProductsListServer() {
  try {
    // 서버 컴포넌트에서 데이터를 가져와서 클라이언트에 전달
    // 이렇게 하면 서버와 클라이언트가 동일한 데이터를 사용하여 Hydration 오류 방지
    // API 지연(1~5초)은 의도적이므로 그대로 유지
    const products = await fetchProducts()
    const processedProducts = processProducts(products)

    return <ProductGrid products={processedProducts} />
  } catch (error) {
    // 에러 발생 시 사용자 친화적인 메시지 표시
    console.error('Failed to load products:', error)
    
    return (
      <div className="error-state text-center py-12">
        <p className="text-red-500 mb-4">
          {error instanceof Error ? error.message : '상품을 불러오는데 실패했습니다.'}
        </p>
        <p className="text-gray-500 text-sm">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    )
  }
}
