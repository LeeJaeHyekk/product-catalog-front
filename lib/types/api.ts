/**
 * API 관련 타입 정의
 */

export interface ApiResponseItem {
  index: number
  name: string
  price: string | number  // API에서 "38100원" 형태로 올 수 있음
  current: number
  limit: number
  image: string | null
}

export interface ApiResponse {
  content: ApiResponseItem[]
  status: number
}
