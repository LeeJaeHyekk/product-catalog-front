/**
 * 이미지 관련 모듈 통합 export
 */

// 서버 전용 (동적 import만 가능)
export type { ImageFile, MatchResult } from './matcher'
export { 
  matchProductImage, 
  matchProductImages, 
  getImageFiles, 
  clearImageCache 
} from './matcher'

// 클라이언트/서버 공통
export { isOptimizableImage, getImageSrc, IMAGE_CONFIG } from './optimizer'
export type { ImageErrorHandler, ImageLoadingState } from './optimizer'

// 테스트 이미지 (개발 환경)
export { 
  TEST_IMAGE_URLS, 
  getRandomTestImage, 
  getTestImageByIndex, 
  ENABLE_TEST_IMAGES 
} from './test-images'
