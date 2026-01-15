import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'
import { processProducts } from '@/lib/product'

export function useProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: processProducts,  // 데이터 가공을 select에서 처리
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30,   // 30분간 캐시 유지 (v5에서는 cacheTime -> gcTime)
    refetchOnWindowFocus: true, // 포커스 시 백그라운드 갱신 (stale-while-revalidate)
    retry: 3,                 // 실패 시 3회 재시도
  })
}
