import type { ProcessedProduct } from '@/lib'
import { formatPrice } from '@/lib/utils'
import { STYLES } from '@/lib/styles'
import { SoldOutBadge } from './SoldOutBadge'

interface ProductCardProps {
  product: ProcessedProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, price, image, isSoldOut } = product

  return (
    <article 
      className={`${STYLES.productCard} ${isSoldOut ? STYLES.productCardSoldOut : ''}`}
      aria-label={`${name}, ${formatPrice(price)}`}
    >
      {isSoldOut && <SoldOutBadge />}
      
      <div className={STYLES.imageWrapper}>
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div 
            className={STYLES.imagePlaceholder}
            aria-label="이미지 준비중"
          >
            이미지 준비중
          </div>
        )}
      </div>
      
      <div className={STYLES.productInfo}>
        <h2 className={STYLES.productName}>{name}</h2>
        <p 
          className={STYLES.price}
          aria-label={`가격 ${formatPrice(price)}`}
        >
          {formatPrice(price)}
        </p>
        <button 
          disabled={isSoldOut}
          aria-label={isSoldOut ? `${name} - 품절` : `${name} - 구매하기`}
          aria-disabled={isSoldOut}
          className={`${STYLES.button} ${
            isSoldOut ? STYLES.buttonSoldOut : STYLES.buttonActive
          }`}
        >
          {isSoldOut ? '품절' : '구매하기'}
        </button>
      </div>
    </article>
  )
}
