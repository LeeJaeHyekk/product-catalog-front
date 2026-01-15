/**
 * API 관련 모듈 통합 (서버 전용)
 */

import 'server-only'

import type { Product } from '../types'
import type { ApiResponse } from '../types/api'
import { API_URL } from '../constants'
import { isApiResponse, isProductArray } from '../validation'
import { ApiError, ValidationError } from '../errors'
import { safeTrim } from '../utils'
import { fetchWithRetry } from './fetch'
import { mapToProduct } from './mapper'

/**
 * 상품 목록 가져오기
 */
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
    
    // 이미지 매칭: 모든 상품명에 대해 이미지 매칭 수행
    const productNames = (data.content as ApiResponse['content'])
      .map(item => safeTrim(item.name, ''))
      .filter(name => name.length > 0)
    
    let imageMap: Map<string, string | null> | undefined
    try {
      // 동적 import로 서버 전용 모듈 로드
      const imageModule = await import('../image/matcher')
      imageMap = await imageModule.matchProductImages(productNames)
    } catch (error) {
      // 이미지 매칭 실패해도 상품 데이터는 반환
      console.warn('Image matching failed, continuing without images:', error)
    }
    
    // content 배열 검증
    if (!isProductArray(data.content)) {
      // 타입 가드 실패 시 수동 변환 시도
      const products = await Promise.all(
        data.content
          .filter((item): item is ApiResponse['content'][number] => {
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
          .map(item => mapToProduct(item, imageMap))
      )
      
      if (products.length === 0) {
        throw new ValidationError('유효한 상품 데이터가 없습니다.')
      }
      
      return products
    }
    
    // 타입 가드 통과 시 직접 변환
    return Promise.all(data.content.map(item => mapToProduct(item, imageMap)))
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
