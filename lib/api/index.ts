/**
 * API 관련 모듈 통합 (서버 전용)
 */

import 'server-only'

import type { Product } from '../types'
import { API_URL } from '../constants'
import { isApiResponse, isApiResponseItem } from '../validation'
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
    // 타입 가드를 사용하여 안전하게 처리
    const productNames = data.content
      .filter(isApiResponseItem)
      .map((item): string => {
        return typeof item.name === 'string' ? safeTrim(item.name, '') : ''
      })
      .filter((name): name is string => name.length > 0)
    
    let imageMap: Map<string, string | null> | undefined
    try {
      // 동적 import로 서버 전용 모듈 로드 (2중 점검 사용)
      const imageModule = await import('../image/matcher')
      // matchProductImagesWithFallback 사용 (1차: 현재 로직, 2차: 라이브러리)
      imageMap = await imageModule.matchProductImagesWithFallback(productNames)
    } catch (error) {
      // 이미지 매칭 실패해도 상품 데이터는 반환
      console.warn('Image matching failed, continuing without images:', error)
    }
    
    // content 배열 검증 및 변환
    // 타입 가드를 사용하여 안전하게 처리
    const validItems = data.content.filter(isApiResponseItem)
    
    if (validItems.length === 0) {
      throw new ValidationError('유효한 상품 데이터가 없습니다.')
    }
    
    // 타입 가드 통과한 아이템만 변환
    // 안전성: Promise.all에서 일부 실패해도 계속 진행하도록 처리
    const productPromises = validItems.map(async (item) => {
      try {
        return await mapToProduct(item, imageMap)
      } catch (error) {
        // 개별 상품 변환 실패 시 로깅하고 기본값 반환
        console.error(`Failed to map product "${item.name}":`, error)
        // 기본 상품 반환 (이미지만 null)
        return {
          index: typeof item.index === 'number' ? Math.max(0, Math.min(49, item.index)) : 0,
          name: safeTrim(item.name, '상품명 없음'),
          price: typeof item.price === 'number' && isFinite(item.price) ? Math.max(0, item.price) : 0,
          current: typeof item.current === 'number' && isFinite(item.current) ? Math.max(0, item.current) : 0,
          limit: typeof item.limit === 'number' && isFinite(item.limit) ? Math.max(1, item.limit) : 1,
          image: null,
        }
      }
    })
    
    return Promise.all(productPromises)
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
