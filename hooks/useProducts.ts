/**
 * ⚠️ 주의: 이 hook은 현재 사용되지 않습니다.
 * 
 * 서버 컴포넌트에서 데이터를 가져오는 방식으로 변경되었습니다.
 * 클라이언트에서 데이터를 가져오려면 API Route를 통해 호출해야 합니다.
 * 
 * 현재는 ProductsListServer 컴포넌트를 사용하세요.
 */
import { useSuspenseQuery } from '@tanstack/react-query'
import { processProducts, STALE_TIME, GC_TIME } from '@/lib'

// 클라이언트에서 사용하려면 API Route를 통해 호출해야 합니다
async function fetchProductsClient() {
  const response = await fetch('/api/products')
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export function useProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProductsClient, // API Route를 통해 호출
    select: processProducts,  // 데이터 가공을 select에서 처리
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: true, // 포커스 시 백그라운드 갱신 (stale-while-revalidate)
    retry: 3,                 // 실패 시 3회 재시도
  })
}
