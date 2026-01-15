// 타입 export
export type { Product, ProcessedProduct } from './types'

// 에러 타입 export
export {
  AppError,
  ApiError,
  ValidationError,
  NotFoundError,
} from './errors'

// 타입 가드 export
export {
  isNotNull,
  isArray,
  isProduct,
  isProductArray,
  isApiResponse,
} from './guards'

// 상수 export
export {
  API_URL,
  API_TIMEOUT,
  MAX_RETRIES,
  RETRY_DELAY,
  STALE_TIME,
  GC_TIME,
  PRODUCT_INDEX_MIN,
  PRODUCT_INDEX_MAX,
  SKELETON_COUNT,
  GRID_COLS,
} from './constants'

// 유틸리티 함수 export
export {
  parsePrice,
  formatPrice,
  createProductKey,
  clamp,
  safeTrim,
} from './utils'

// 공통 스타일 export
export { STYLES } from './styles'

// API 함수 export
export { fetchProducts } from './api'

// 데이터 가공 함수 export
export { processProducts } from './product'
