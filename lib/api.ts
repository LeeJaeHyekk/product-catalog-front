import type { Product } from './types'
import { isApiResponse, isProductArray } from './guards'
import { API_URL, API_TIMEOUT, MAX_RETRIES, RETRY_DELAY, PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX } from './constants'
import { parsePrice, clamp, safeTrim } from './utils'
import { ApiError, ValidationError } from './errors'

interface ApiResponseItem {
  index: number
  name: string
  price: string | number  // API에서 "38100원" 형태로 올 수 있음
  current: number
  limit: number
  image: string | null
}

interface ApiResponse {
  content: ApiResponseItem[]
  status: number
}

/**
 * API 응답 아이템을 Product로 변환
 */
function mapToProduct(item: ApiResponseItem): Product {
  return {
    index: clamp(item.index, PRODUCT_INDEX_MIN, PRODUCT_INDEX_MAX),
    name: safeTrim(item.name, '상품명 없음'),
    price: parsePrice(item.price),
    current: Math.max(0, item.current),
    limit: Math.max(1, item.limit), // 최소 1
    image: item.image === null ? null : String(item.image),
  }
}

/**
 * 타임아웃이 있는 fetch 래퍼
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('API 응답이 너무 오래 걸립니다. 잠시 후 다시 시도해주세요.', 504)
    }
    throw error
  }
}

/**
 * 재시도 로직이 있는 fetch
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = MAX_RETRIES,
  retryDelay = RETRY_DELAY
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options)
      
      if (response.ok) {
        return response
      }

      // 4xx 에러는 재시도하지 않음
      if (response.status >= 400 && response.status < 500) {
        throw new ApiError(
          `서버 오류가 발생했습니다: ${response.status} ${response.statusText}`,
          response.status
        )
      }

      // 5xx 에러는 재시도
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        continue
      }

      throw new ApiError(
        `서버 오류가 발생했습니다: ${response.status} ${response.statusText}`,
        response.status
      )
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt < maxRetries && !lastError.message.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        continue
      }
      
      throw lastError
    }
  }

  throw lastError || new ApiError('상품 데이터를 불러오는데 실패했습니다.')
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithRetry(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data: unknown = await response.json()
    
    // 타입 가드를 사용한 런타임 검증
    if (!isApiResponse(data)) {
      throw new ValidationError('API 응답 형식이 올바르지 않습니다.')
    }
    
    // content 배열 검증
    if (!isProductArray(data.content)) {
      // 타입 가드 실패 시 수동 변환 시도
      const products: Product[] = data.content
        .filter((item): item is ApiResponseItem => {
          return (
            typeof item === 'object' &&
            item !== null &&
            'index' in item &&
            'name' in item &&
            'price' in item &&
            'current' in item &&
            'limit' in item
          )
        })
        .map(mapToProduct)
      
      if (products.length === 0) {
        throw new ValidationError('유효한 상품 데이터가 없습니다.')
      }
      
      return products
    }
    
    // 타입 가드 통과 시 직접 변환
    return data.content.map(mapToProduct)
  } catch (error) {
    // 이미 AppError인 경우 그대로 재던지기
    if (error instanceof ApiError || error instanceof ValidationError) {
      throw error
    }
    
    // 네트워크 에러 또는 기타 에러 처리
    if (error instanceof Error) {
      // 네트워크 에러인 경우
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        throw new ApiError('네트워크 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 503)
      }
      
      // 기타 에러는 ApiError로 래핑
      throw new ApiError(`상품 데이터를 불러오는데 실패했습니다: ${error.message}`)
    }
    
    // 알 수 없는 에러
    throw new ApiError('상품 데이터를 불러오는데 실패했습니다.')
  }
}

