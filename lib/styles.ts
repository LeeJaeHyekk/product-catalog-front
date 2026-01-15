/**
 * 공통 스타일 클래스
 */

export const STYLES = {
  // 상품 카드
  productCard: 'product-card relative',
  productCardSoldOut: 'opacity-50 grayscale',
  
  // 이미지
  imageWrapper: 'image-wrapper aspect-square bg-gray-100 rounded overflow-hidden',
  imagePlaceholder: 'w-full h-full flex items-center justify-center text-gray-400 text-sm',
  
  // 상품 정보
  productInfo: 'product-info mt-2',
  productName: 'product-name font-semibold text-sm',
  price: 'price text-lg font-bold mt-1',
  
  // 버튼
  button: 'mt-2 w-full py-2 px-4 rounded',
  buttonSoldOut: 'bg-gray-300 cursor-not-allowed text-gray-500',
  buttonActive: 'bg-blue-500 text-white hover:bg-blue-600',
  
  // 그리드
  grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
  
  // Skeleton
  skeletonCard: 'skeleton-card',
  skeletonImage: 'image-placeholder aspect-square bg-gray-200 animate-pulse rounded',
  skeletonText: 'text-line h-4 bg-gray-200 animate-pulse rounded mt-2',
  skeletonTextShort: 'text-line short h-4 bg-gray-200 animate-pulse rounded mt-1 w-2/3',
} as const
