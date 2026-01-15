/**
 * 라이브러리 통합 export
 * 
 * 기능별로 모듈화된 구조:
 * - types: 타입 정의
 * - constants: 상수 정의
 * - utils: 유틸리티 함수
 * - validation: 검증 로직
 * - product: 상품 처리 로직
 * - image: 이미지 관련 (클라이언트/서버 공통)
 * - api: API 관련 (서버 전용, 직접 import 필요)
 * - errors: 에러 타입
 * - styles: 스타일 정의
 */

// 타입 export
export type { Product, ProcessedProduct, ApiResponse, ApiResponseItem } from './types'

// 에러 타입 export
export {
  AppError,
  ApiError,
  ValidationError,
  NotFoundError,
} from './errors'

// 검증 함수 export
export {
  isNotNull,
  isArray,
  isProduct,
  isProductArray,
  isApiResponse,
} from './validation'

// 상수 export
export * from './constants'

// 유틸리티 함수 export
export * from './utils'

// 커스텀 훅 export
export * from './hooks'

// 공통 스타일 export
export { STYLES } from './styles'

// 상품 처리 함수 export (클라이언트/서버 모두 사용 가능)
export * from './product'

// 카테고리 관련 export
export type { EnrichedProduct, ProductCategoryInfo, FilterOptions } from './product'
export { filterProducts, getAvailableSubCategories } from './product'

// 이미지 관련 export (클라이언트/서버 공통)
export { isOptimizableImage, getImageSrc, IMAGE_CONFIG } from './image/optimizer'
export type { ImageErrorHandler, ImageLoadingState } from './image/optimizer'
export { IMAGE_QUALITY, IMAGE_SIZES } from './constants/image'

// API 함수는 서버 전용이므로 직접 import 필요
// 서버 컴포넌트에서 사용: import { fetchProducts } from '@/lib/api'
