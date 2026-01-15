import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchProducts, processProducts } from '@/lib'
import { STALE_TIME, GC_TIME } from '@/lib/constants'

export function useProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    select: processProducts,  // 데이터 가공을 select에서 처리
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: true, // 포커스 시 백그라운드 갱신 (stale-while-revalidate)
    retry: 3,                 // 실패 시 3회 재시도
  })
}
