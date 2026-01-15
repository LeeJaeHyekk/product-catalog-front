/**
 * 이미지 최적화 유틸리티
 * 
 * Next.js Image 컴포넌트와 함께 사용하는 이미지 최적화 헬퍼
 * 
 * 최적화 전략:
 * - quality는 고정값 사용 (캐시 안정성)
 * - size, priority, lazy loading으로 체감 최적화
 */

import { IMAGE_QUALITY, IMAGE_SIZES } from '../constants/image'

/**
 * 이미지 최적화 설정
 * 
 * @deprecated IMAGE_CONFIG는 하위 호환성을 위해 유지하지만,
 * 새로운 코드에서는 IMAGE_QUALITY와 IMAGE_SIZES를 직접 사용하세요.
 */
export const IMAGE_CONFIG = {
  // Next.js Image 컴포넌트 기본 설정
  width: 400,
  height: 400,
  quality: IMAGE_QUALITY.LIST,  // 목록용 기본값
  format: 'webp' as const,
  
  // 반응형 이미지 크기
  sizes: IMAGE_SIZES.RESPONSIVE,
} as const

/**
 * 이미지 경로가 최적화 가능한지 확인
 */
export function isOptimizableImage(src: string | null): boolean {
  if (!src) return false
  
  // 외부 URL은 Next.js Image로 최적화 가능
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return true
  }
  
  // public 폴더의 이미지는 최적화 가능
  if (src.startsWith('/')) {
    return true
  }
  
  return false
}

/**
 * 이미지 src를 안전하게 처리
 */
export function getImageSrc(src: string | null): string | null {
  if (!src) return null
  
  // 이미 절대 경로인 경우
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // 상대 경로인 경우 public 폴더 기준으로 변환
  return `/${src}`
}

/**
 * 이미지 에러 핸들링
 */
export interface ImageErrorHandler {
  onError?: () => void
  fallbackSrc?: string | null
}

/**
 * 이미지 로딩 상태
 */
export type ImageLoadingState = 'loading' | 'loaded' | 'error'
