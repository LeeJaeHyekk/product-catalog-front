import type { ProcessedProduct } from '@/lib/types'
import { SoldOutBadge } from './SoldOutBadge'

interface ProductCardProps {
  product: ProcessedProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, price, image, isSoldOut } = product

  return (
    <article 
      className={`product-card relative ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
      aria-label={`${name}, ${price.toLocaleString()}원`}
    >
      {isSoldOut && <SoldOutBadge />}
      
      <div className="image-wrapper aspect-square bg-gray-100 rounded overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-gray-400 text-sm"
            aria-label="이미지 준비중"
          >
            이미지 준비중
          </div>
        )}
      </div>
      
      <div className="product-info mt-2">
        <h2 className="product-name font-semibold text-sm">{name}</h2>
        <p 
          className="price text-lg font-bold mt-1"
          aria-label={`가격 ${price.toLocaleString()}원`}
        >
          {price.toLocaleString()}원
        </p>
        <button 
          disabled={isSoldOut}
          aria-label={isSoldOut ? `${name} - 품절` : `${name} - 구매하기`}
          aria-disabled={isSoldOut}
          className={`mt-2 w-full py-2 px-4 rounded ${
            isSoldOut 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSoldOut ? '품절' : '구매하기'}
        </button>
      </div>
    </article>
  )
}
