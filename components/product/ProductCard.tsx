import type { ProcessedProduct } from '@/lib'
import { formatPrice } from '@/lib'
import { STYLES } from '@/lib'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: ProcessedProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, price, image, isSoldOut, current, limit } = product
  
  // 진행률 계산 (0~100%)
  const progressPercentage = Math.min((current / limit) * 100, 100)
  const remaining = limit - current
  
  // 공동구매 상태 판단
  const isComplete = current >= limit
  const isUrgent = !isComplete && progressPercentage >= 75

  return (
    <article 
      className={`${STYLES.productCard} ${isSoldOut ? STYLES.productCardSoldOut : ''}`}
      aria-label={`${name}, ${formatPrice(price)}, ${isSoldOut ? '품절' : '구매 가능'}`}
    >
      {/* 품절 오버레이 */}
      {isSoldOut && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <span className="bg-white px-4 py-2 rounded font-semibold text-gray-900">
            SOLD OUT
          </span>
        </div>
      )}
      
      {/* 이미지 영역 */}
      <div className={STYLES.imageWrapper}>
        <ProductImage
          src={image}
          alt={`${name} 상품 이미지`}
          productName={name}
          priority={false}  // 목록 페이지이므로 lazy loading
        />
      </div>
      
      {/* 상품 정보 */}
      <div className={STYLES.productInfo}>
        {/* 상품명 */}
        <h2 className={STYLES.productName}>{name}</h2>
        
        {/* 가격 (1순위: 가장 중요) */}
        <p 
          className={STYLES.price}
          aria-label={`가격 ${formatPrice(price)}`}
        >
          {formatPrice(price)}
        </p>
        
        {/* 진행률 바 (2순위: 공동구매 핵심) */}
        {!isSoldOut && (
          <div className="mb-3">
            {/* 진행률 바 */}
            <div
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={limit}
              aria-label={`진행률 ${Math.round(progressPercentage)}%`}
              className={STYLES.progressBar}
            >
              <div
                className={`${STYLES.progressFill} ${
                  isComplete
                    ? 'bg-[#1E7F4F]'
                    : isUrgent
                    ? 'bg-[#F2C94C]'
                    : 'bg-gray-400'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* 수량 정보 (3순위) */}
            <p className={STYLES.progressText}>
              잔여 {remaining} / {limit}
            </p>
          </div>
        )}
        
        {/* 버튼 */}
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
