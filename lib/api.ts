import type { Product } from './types'
import { isApiResponse, isProductArray } from './guards'

const API_URL = 'https://api.zeri.pics'

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
 * price 값을 숫자로 변환
 */
function parsePrice(price: string | number): number {
  if (typeof price === 'number') {
    return price >= 0 ? price : 0
  }
  
  if (typeof price === 'string') {
    const parsed = parseInt(price.replace(/[^0-9]/g, ''), 10)
    return isNaN(parsed) ? 0 : parsed
  }
  
  return 0
}

/**
 * API 응답 아이템을 Product로 변환
 */
function mapToProduct(item: ApiResponseItem): Product {
  return {
    index: Math.max(0, Math.min(49, item.index)), // 0~49 범위로 제한
    name: String(item.name || '').trim() || '상품명 없음',
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
  timeout = 10000
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
      throw new Error('Request timeout: API 응답이 너무 오래 걸립니다.')
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
  maxRetries = 3,
  retryDelay = 1000
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
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      // 5xx 에러는 재시도
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        continue
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt < maxRetries && !lastError.message.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        continue
      }
      
      throw lastError
    }
  }

  throw lastError || new Error('Failed to fetch products')
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
      throw new Error('Invalid response format: expected object with content array')
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
        throw new Error('No valid products found in response')
      }
      
      return products
    }
    
    // 타입 가드 통과 시 직접 변환
    return data.content.map(mapToProduct)
  } catch (error) {
    // 에러 로깅
    console.error('Failed to fetch products:', error)
    
    // 사용자 친화적인 에러 메시지
    if (error instanceof Error) {
      throw new Error(`상품 데이터를 불러오는데 실패했습니다: ${error.message}`)
    }
    
    throw new Error('상품 데이터를 불러오는데 실패했습니다.')
  }
}

