/**
 * 공통 스타일 클래스
 * 
 * 디자인 시스템에 맞춘 스타일 정의
 * 브랜드 정체성: "현장감을 살린 신뢰 중심 유통 플랫폼 UI"
 */

import { COLORS } from './constants/colors'

export const STYLES = {
  // 상품 카드
  productCard: 'product-card relative border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm',
  productCardSoldOut: 'opacity-50 grayscale',
  
  // 이미지
  imageWrapper: `image-wrapper aspect-square ${COLORS.background.bgMain} rounded overflow-hidden relative`,
  imagePlaceholder: `w-full h-full flex items-center justify-center ${COLORS.text.secondaryClass} text-sm`,
  
  // 상품 정보
  productInfo: 'product-info p-4',
  productName: `product-name font-semibold text-sm ${COLORS.text.primaryClass} mb-2`,
  price: `price text-lg font-semibold ${COLORS.text.primaryClass} mb-3`,
  
  // 진행률 (공동구매 특화)
  progressBar: 'w-full bg-gray-200 rounded-full h-2 mb-2',
  progressFill: 'h-2 rounded-full transition-all duration-300',
  progressText: 'text-xs text-text-secondary',
  
  // 버튼
  button: 'mt-2 w-full min-h-[44px] py-2 px-4 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  buttonSoldOut: 'bg-gray-300 cursor-not-allowed text-gray-500',
  buttonActive: `${COLORS.primary.bg} text-white hover:${COLORS.primary.bgLight} focus:ring-[#1E7F4F]`,
  
  // 그리드
  grid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4',
  
  // Skeleton
  skeletonCard: 'skeleton-card border border-gray-200 rounded-lg overflow-hidden bg-white',
  skeletonImage: 'image-placeholder aspect-square bg-gray-200 animate-pulse',
  skeletonText: 'text-line h-4 bg-gray-200 animate-pulse rounded mt-2',
  skeletonTextShort: 'text-line short h-4 bg-gray-200 animate-pulse rounded mt-1 w-2/3',
} as const
