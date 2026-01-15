/**
 * 상품 관련 상수
 */

// API 설정
export const API_URL = 'https://api.zeri.pics'

// API 타임아웃 설정 (ms)
export const API_TIMEOUT = 10000 // 10초

// 재시도 설정
export const MAX_RETRIES = 3
export const RETRY_DELAY = 1000 // 1초

// 캐시 설정
export const STALE_TIME = 1000 * 60 * 5 // 5분
export const GC_TIME = 1000 * 60 * 30 // 30분

// 상품 인덱스 범위
export const PRODUCT_INDEX_MIN = 0
export const PRODUCT_INDEX_MAX = 49

// Skeleton 개수
export const SKELETON_COUNT = 10

// Grid 컬럼 설정
export const GRID_COLS = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  large: 5,
} as const
