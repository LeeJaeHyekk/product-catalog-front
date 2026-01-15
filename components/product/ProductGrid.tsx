'use client'

import type { ProcessedProduct } from '@/lib'
import { createProductKey, STYLES } from '@/lib'
import { EmptyState } from '@/components/ui'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: ProcessedProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState message="표시할 상품이 없습니다." />
  }
  
  const available = products.filter(p => !p.isSoldOut)
  const soldOut = products.filter(p => p.isSoldOut)
  
  if (available.length === 0 && soldOut.length > 0) {
    return (
      <EmptyState 
        message="현재 판매 가능한 상품이 없습니다."
        subMessage="품절 상품만 표시됩니다."
      />
    )
  }
  
  return (
    <div className={STYLES.grid}>
      {products.map((product, idx) => (
        <ProductCard 
          key={createProductKey(product, idx)} 
          product={product} 
        />
      ))}
    </div>
  )
}
