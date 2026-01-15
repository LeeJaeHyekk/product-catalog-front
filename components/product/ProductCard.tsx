import { memo } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { formatPrice, STYLES } from '@/lib'
import { useProductState, useMemoClassName } from '@/lib/hooks'
import { compareProductProps } from '@/lib/utils/react'
import { COLORS } from '@/lib/constants'
import { ProductImage } from './ProductImage'
import { ProductBadge } from './ProductBadge'
import { ProductStatusIndicator } from './ProductStatusIndicator'
import { CategoryTag } from '@/components/ui'

interface ProductCardProps {
  product: EnrichedProduct
}

function ProductCardComponent({ product }: ProductCardProps) {
  const { name, price, image, isSoldOut, current, limit } = product
  
  // 상품 상태 계산 (커스텀 훅 사용)
  const { progressPercentage, remaining, status, isComplete, isUrgent, isPopular } =
    useProductState({ current, limit, isSoldOut })

  // className 메모이제이션 (커스텀 훅 사용)
  const cardClassName = useMemoClassName(
    `${STYLES.productCard} relative`,
    { [STYLES.productCardSoldOut]: isSoldOut }
  )

  const ariaLabel = `${name}, ${formatPrice(price)}, ${isSoldOut ? '품절' : '구매 가능'}`

  const progressBarClassName = useMemoClassName(STYLES.progressFill, {
    [COLORS.primary.bg]: status === 'complete',
    [COLORS.accent.bg]: status === 'urgent',
    'bg-gray-400': status !== 'complete' && status !== 'urgent',
  })

  const buttonClassName = useMemoClassName(STYLES.button, {
    [STYLES.buttonSoldOut]: isSoldOut,
    [STYLES.buttonActive]: !isSoldOut,
  })

  return (
    <article 
      className={cardClassName}
      aria-label={ariaLabel}
    >
      {/* 상태 배지 */}
      {isPopular && <ProductBadge type="popular" />}
      {isUrgent && <ProductBadge type="urgent" />}
      {isComplete && !isSoldOut && <ProductBadge type="complete" />}
      
      {/* 품절 오버레이 */}
      {isSoldOut && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <span className="bg-white px-4 py-2 rounded font-semibold text-gray-900">
            SOLD OUT
          </span>
        </div>
      )}
      
      {/* 상태 인디케이터 - 카드 하단 얇은 컬러 바 */}
      {!isSoldOut && <ProductStatusIndicator status={status} />}
      
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
        {/* 카테고리 해시태그 */}
        <CategoryTag categoryName={product.category.subCategoryName} />
        
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
                className={progressBarClassName}
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
          className={buttonClassName}
        >
          {isSoldOut ? '품절' : '구매하기'}
        </button>
      </div>
    </article>
  )
}

ProductCardComponent.displayName = 'ProductCard'

/**
 * 메모이제이션된 ProductCard 컴포넌트
 * 
 * product 객체의 참조가 변경되지 않으면 리렌더링 방지
 */
export const ProductCard = memo(ProductCardComponent, compareProductProps)
