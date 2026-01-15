/**
 * 타입 정의 통합 export
 */

export type { Product, ProcessedProduct } from './product'
export type { ApiResponse, ApiResponseItem } from './api'

// 기존 파일과의 호환성을 위한 re-export
export type { Product as ProductType, ProcessedProduct as ProcessedProductType } from './product'
