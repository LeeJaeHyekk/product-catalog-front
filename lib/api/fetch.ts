/**
 * API Fetch 유틸리티 (서버 전용)
 */

import 'server-only'

import { API_TIMEOUT, MAX_RETRIES, RETRY_DELAY } from '../constants'
import { ApiError } from '../errors'

/**
 * 타임아웃이 있는 fetch 래퍼
 */
export async function fetchWithTimeout(
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
export async function fetchWithRetry(
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
