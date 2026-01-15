/**
 * 이미지 관련 상수
 */

/**
 * 이미지 Quality 설정
 * 
 * Next.js는 캐시 안정성을 위해 quality 값을 제한하도록 설계되어 있습니다.
 * 완전 동적 품질 조정은 피하고, 용도별로 명시적으로 관리합니다.
 */
export const IMAGE_QUALITY = {
  LIST: 75,      // 목록 페이지 (여러 이미지 동시 로드)
  DETAIL: 85,    // 상세 페이지 (이미지 품질 중요)
  HERO: 85,      // 히어로 섹션 (첫 화면 이미지)
} as const

/**
 * 이미지 Size 설정 (반응형)
 * 
 * 디바이스별로 적절한 크기의 이미지를 자동으로 로드합니다.
 * quality는 고정하고 size를 동적으로 조절하여 최적화합니다.
 */
export const IMAGE_SIZES = {
  // 상품 목록용 반응형 sizes
  RESPONSIVE: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  
  // 상세 페이지용 (더 큰 이미지)
  DETAIL: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  
  // 히어로 섹션용 (전체 너비)
  HERO: '100vw',
} as const

/**
 * 이미지 최적화 설정
 */
export const IMAGE_CONFIG = {
  // Next.js Image 컴포넌트 기본 설정
  width: 400,
  height: 400,
  quality: IMAGE_QUALITY.LIST,  // 기본값: 목록용
  format: 'webp' as const,
  
  // 반응형 이미지 크기
  sizes: IMAGE_SIZES.RESPONSIVE,
} as const
