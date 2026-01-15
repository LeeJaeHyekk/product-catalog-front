'use client'

import { useProducts } from '@/hooks'
import { ProductGrid } from './ProductGrid'
import { enrichProducts } from '@/lib/product'
import type { EnrichedProduct } from '@/lib/product'

export function ProductListClient() {
  const { data: products } = useProducts()
  
  // 클라이언트에서도 카테고리 정보 추가 (서버 컴포넌트 사용 권장)
  const enrichedProducts: EnrichedProduct[] = products 
    ? enrichProducts(products)
    : []
  
  return <ProductGrid products={enrichedProducts} />
}
