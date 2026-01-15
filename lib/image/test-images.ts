/**
 * 이미지 테스트용 URL 목록
 * 
 * 실제 이미지 테스트를 위한 샘플 이미지 URL들을 제공합니다.
 * 
 * 사용 방법:
 * 1. 개발 환경에서만 사용하도록 조건부 적용
 * 2. API 응답의 image가 null일 때 테스트 이미지 사용
 */

export const TEST_IMAGE_URLS = [
  'https://via.placeholder.com/400x400/1E7F4F/FFFFFF?text=Product+1',
  'https://via.placeholder.com/400x400/2E9F6B/FFFFFF?text=Product+2',
  'https://via.placeholder.com/400x400/F2C94C/000000?text=Product+3',
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
]

/**
 * 랜덤 이미지 URL 반환
 */
export function getRandomTestImage(): string {
  const randomIndex = Math.floor(Math.random() * TEST_IMAGE_URLS.length)
  return TEST_IMAGE_URLS[randomIndex] ?? TEST_IMAGE_URLS[0] ?? ''
}

/**
 * 인덱스 기반 이미지 URL 반환
 */
export function getTestImageByIndex(index: number): string {
  const url = TEST_IMAGE_URLS[index % TEST_IMAGE_URLS.length]
  return url ?? ''
}

/**
 * 테스트 모드 활성화 여부
 * 환경 변수로 제어 가능
 */
export const ENABLE_TEST_IMAGES = process.env.NEXT_PUBLIC_ENABLE_TEST_IMAGES === 'true'
