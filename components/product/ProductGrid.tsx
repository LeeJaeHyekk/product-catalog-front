'use client'

import type { ProcessedProduct } from '@/lib/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: ProcessedProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state text-center py-12">
        <p className="text-gray-500">표시할 상품이 없습니다.</p>
      </div>
    )
  }
  
  const available = products.filter(p => !p.isSoldOut)
  const soldOut = products.filter(p => p.isSoldOut)
  
  if (available.length === 0 && soldOut.length > 0) {
    return (
      <div className="empty-state text-center py-12">
        <p className="text-gray-500">현재 판매 가능한 상품이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">품절 상품만 표시됩니다.</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product, idx) => (
        <ProductCard 
          key={`${product.index}-${product.name}-${idx}`} 
          product={product} 
        />
      ))}
    </div>
  )
}
