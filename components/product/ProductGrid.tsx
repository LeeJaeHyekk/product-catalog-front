'use client'

import { useMemo } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { createProductKey, STYLES } from '@/lib'
import { EmptyState } from '@/components/ui'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: EnrichedProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  // filter 연산 메모이제이션
  const { available, soldOut } = useMemo(() => {
    const available = products.filter(p => !p.isSoldOut)
    const soldOut = products.filter(p => p.isSoldOut)
    return { available, soldOut }
  }, [products])

  if (products.length === 0) {
    return <EmptyState message="표시할 상품이 없습니다." />
  }
  
  if (available.length === 0 && soldOut.length > 0) {
    return (
      <EmptyState 
        message="현재 판매 가능한 상품이 없습니다."
        subMessage="품절 상품만 표시됩니다."
      />
    )
  }
  
  // 첫 카드 여부 계산 메모이제이션
  const firstCardClassName = useMemo(
    () => 'transform transition-all duration-300 hover:scale-[1.02]',
    []
  )

  return (
    <div className={STYLES.grid}>
      {products.map((product, idx) => {
        const isFirstCard = idx === 0
        
        return (
          <div
            key={createProductKey(product, idx)}
            className={isFirstCard ? firstCardClassName : ''}
          >
            <ProductCard product={product} />
          </div>
        )
      })}
    </div>
  )
}
