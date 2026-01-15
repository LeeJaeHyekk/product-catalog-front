'use client'

import { useProducts } from '@/hooks'
import { ProductGrid } from './ProductGrid'

export function ProductListClient() {
  const { data: products } = useProducts()
  return <ProductGrid products={products ?? []} />
}
