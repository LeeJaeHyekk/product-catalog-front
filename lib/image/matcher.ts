/**
 * 이미지 매칭 유틸리티 (서버 전용)
 * 
 * ⚠️ 주의: 이 모듈은 Node.js의 fs 모듈을 사용하므로 서버 컴포넌트에서만 사용 가능합니다.
 * 클라이언트 컴포넌트에서는 사용할 수 없습니다.
 * 
 * 상품명과 이미지 파일명을 매칭하는 알고리즘
 * - 한글/영어 이름 매칭
 * - 부분 매칭 (유사도 기반)
 * - 매칭 실패 시 null 반환
 */

import { readdir } from 'fs/promises'
import { join } from 'path'

/**
 * 이미지 파일 확장자 목록
 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] as const

/**
 * 이미지 파일 정보
 */
export interface ImageFile {
  filename: string
  nameWithoutExt: string
  extension: string
  fullPath: string
}

/**
 * 매칭 결과
 */
export interface MatchResult {
  filename: string
  score: number
  method: 'exact' | 'partial' | 'similarity'
}

/**
 * 문자열 정규화 (매칭을 위해)
 * 
 * @param str 정규화할 문자열
 * @param removeSpaces 공백 제거 여부 (기본값: true)
 */
function normalizeString(str: string, removeSpaces = true): string {
  let normalized = str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // 여러 공백을 하나로
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거 (한글, 영문, 숫자만)
  
  if (removeSpaces) {
    normalized = normalized.replace(/\s/g, '') // 공백 제거 (매칭 정확도 향상)
  }
  
  return normalized
}

/**
 * 한글을 로마자로 변환 (확장된 매핑)
 * 
 * 실제 상품명과 이미지 파일명을 기반으로 매핑 확장
 */
function koreanToRoman(str: string): string {
  const mapping: Record<string, string> = {
    // 과일/식자재
    '샤인': 'shine',
    '머스캣': 'muscat',
    '머스캐트': 'muscat',
    '초코': 'choco',
    '초콜릿': 'chocolate',
    '파이': 'pie',
    '과자': 'cookie',
    '인절미': 'injeolmi',
    '고소한': 'crispy',
    
    // 일반적인 음식 관련
    '과일': 'fruit',
    '채소': 'vegetable',
    '식자재': 'ingredient',
  }
  
  let result = normalizeString(str)
  
  // 매핑 적용
  for (const [korean, roman] of Object.entries(mapping)) {
    result = result.replace(new RegExp(korean, 'gi'), roman)
  }
  
  return result
}

/**
 * 영어를 한글로 변환 (역방향 매핑)
 */
function romanToKorean(str: string): string {
  const mapping: Record<string, string> = {
    'shine': '샤인',
    'muscat': '머스캣',
    'choco': '초코',
    'chocolate': '초콜릿',
    'pie': '파이',
    'cookie': '과자',
  }
  
  let result = normalizeString(str)
  
  for (const [roman, korean] of Object.entries(mapping)) {
    result = result.replace(new RegExp(roman, 'gi'), korean)
  }
  
  return result
}

/**
 * 레벤슈타인 거리 계산 (문자열 유사도)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // 삭제
          matrix[i][j - 1] + 1,     // 삽입
          matrix[i - 1][j - 1] + 1 // 교체
        )
      }
    }
  }

  return matrix[len1][len2]
}

/**
 * 유사도 점수 계산 (0~1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length)
  if (maxLen === 0) return 1
  
  const distance = levenshteinDistance(str1, str2)
  return 1 - distance / maxLen
}

/**
 * 부분 문자열 매칭 점수 계산
 * 
 * 입력은 이미 정규화된 문자열 (공백 유지 또는 제거 상태)
 */
function calculatePartialMatchScore(productName: string, imageName: string): number {
  // 정확히 포함되는 경우
  if (imageName.includes(productName) || productName.includes(imageName)) {
    const longer = Math.max(productName.length, imageName.length)
    const shorter = Math.min(productName.length, imageName.length)
    return longer > 0 ? shorter / longer : 0
  }
  
  // 공백 제거 후 다시 포함 여부 확인
  const productNoSpace = productName.replace(/\s/g, '')
  const imageNoSpace = imageName.replace(/\s/g, '')
  
  if (imageNoSpace.includes(productNoSpace) || productNoSpace.includes(imageNoSpace)) {
    const longer = Math.max(productNoSpace.length, imageNoSpace.length)
    const shorter = Math.min(productNoSpace.length, imageNoSpace.length)
    return longer > 0 ? shorter / longer : 0
  }
  
  // 단어 단위로 매칭
  const productWords = productName
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(w => w.length >= 2)
    .map(w => normalizeString(w, true)) // 단어는 공백 제거하여 정규화
  
  const imageWords = imageName
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(w => w.length >= 2)
    .map(w => normalizeString(w, true))
  
  if (productWords.length === 0 || imageWords.length === 0) {
    return 0
  }
  
  let matchCount = 0
  for (const word of productWords) {
    if (imageWords.some(imgWord => {
      return imgWord.includes(word) || word.includes(imgWord)
    })) {
      matchCount++
    }
  }
  
  return matchCount / productWords.length
}

/**
 * 이미지 파일 목록 가져오기 (서버 사이드)
 * 
 * 안정성 개선:
 * - 에러 발생 시 빈 배열 반환 (상품 데이터는 정상 표시)
 * - 파일명 인코딩 문제 처리
 * - 대소문자 구분 없이 확장자 매칭
 */
let cachedImageFiles: ImageFile[] | null = null

export async function getImageFiles(): Promise<ImageFile[]> {
  if (cachedImageFiles) {
    return cachedImageFiles
  }
  
  try {
    const publicDir = join(process.cwd(), 'public')
    const files = await readdir(publicDir, { encoding: 'utf8' })
    
    const imageFiles: ImageFile[] = files
      .filter(file => {
        // 파일명이 유효한지 확인
        if (!file || typeof file !== 'string') {
          return false
        }
        
        const lastDot = file.lastIndexOf('.')
        if (lastDot === -1 || lastDot === 0) {
          return false // 확장자가 없거나 파일명이 .으로 시작
        }
        
        const ext = file.toLowerCase().substring(lastDot)
        return IMAGE_EXTENSIONS.includes(ext as typeof IMAGE_EXTENSIONS[number])
      })
      .map(file => {
        const lastDot = file.lastIndexOf('.')
        const nameWithoutExt = file.substring(0, lastDot)
        const extension = file.substring(lastDot)
        
        // URL 인코딩 처리 (한글 파일명 등)
        const encodedFilename = encodeURIComponent(file)
        
        return {
          filename: file,
          nameWithoutExt,
          extension,
          fullPath: `/${encodedFilename}`, // Next.js public 폴더 경로
        }
      })
      .filter(file => file.nameWithoutExt.length > 0) // 파일명이 있는 경우만
    
    cachedImageFiles = imageFiles
    
    // 개발 환경에서 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image Matcher] Found ${imageFiles.length} image files:`, imageFiles.map(f => f.filename))
    }
    
    return imageFiles
  } catch (error) {
    // 에러 발생 시 빈 배열 반환 (상품 데이터는 정상 표시)
    console.error('Failed to read image files:', error)
    return []
  }
}

/**
 * 상품명과 이미지 파일 매칭
 * 
 * 매칭 우선순위:
 * 1. 정확한 매칭 (한글/영어 모두)
 * 2. 부분 매칭 (단어 단위)
 * 3. 유사도 기반 매칭
 */
export async function matchProductImage(productName: string): Promise<string | null> {
  try {
    const imageFiles = await getImageFiles()
    
    if (imageFiles.length === 0) {
      return null
    }
    
    // 공백 제거한 정규화 (정확한 매칭용)
    const normalizedProduct = normalizeString(productName, true)
    const productRoman = koreanToRoman(normalizedProduct)
    
    // 공백 유지한 정규화 (단어 단위 매칭용)
    const normalizedProductWithSpaces = normalizeString(productName, false)
    const productRomanWithSpaces = koreanToRoman(normalizedProductWithSpaces)
    
    // 정규화된 상품명이 비어있으면 매칭 불가
    if (normalizedProduct.length === 0) {
      return null
    }
    
    const matches: MatchResult[] = []
    
    for (const imageFile of imageFiles) {
      // 공백 제거한 정규화
      const normalizedImage = normalizeString(imageFile.nameWithoutExt, true)
      const imageRoman = koreanToRoman(normalizedImage)
      
      // 공백 유지한 정규화 (단어 단위 매칭용)
      const normalizedImageWithSpaces = normalizeString(imageFile.nameWithoutExt, false)
      const imageRomanWithSpaces = koreanToRoman(normalizedImageWithSpaces)
      
      // 1. 정확한 매칭 (한글, 공백 제거)
      if (normalizedImage === normalizedProduct) {
        matches.push({
          filename: imageFile.fullPath,
          score: 1.0,
          method: 'exact',
        })
        continue
      }
      
      // 2. 정확한 매칭 (로마자 변환 후)
      if (imageRoman === productRoman && productRoman !== normalizedProduct) {
        matches.push({
          filename: imageFile.fullPath,
          score: 0.95,
          method: 'exact',
        })
        continue
      }
      
      // 2-1. 역방향 매칭 (영어 파일명 <-> 한글 상품명)
      const imageKorean = romanToKorean(normalizedImage)
      if (imageKorean === normalizedProduct && imageKorean !== normalizedImage) {
        matches.push({
          filename: imageFile.fullPath,
          score: 0.9,
          method: 'exact',
        })
        continue
      }
      
      // 2-2. 교차 매칭 (한글 파일명 <-> 영어 상품명, 또는 그 반대)
      if (normalizedImage === productRoman || imageRoman === normalizedProduct) {
        matches.push({
          filename: imageFile.fullPath,
          score: 0.85,
          method: 'exact',
        })
        continue
      }
      
      // 3. 부분 매칭 점수 계산 (여러 변형 시도)
      const partialScore1 = calculatePartialMatchScore(normalizedProductWithSpaces, normalizedImageWithSpaces)
      const partialScore2 = calculatePartialMatchScore(productRomanWithSpaces, imageRomanWithSpaces)
      const partialScore3 = calculatePartialMatchScore(normalizedProduct, normalizedImage)
      const partialScore4 = calculatePartialMatchScore(productRoman, imageRoman)
      
      const maxPartialScore = Math.max(partialScore1, partialScore2, partialScore3, partialScore4)
      
      if (maxPartialScore > 0.3) { // 최소 30% 이상 매칭
        matches.push({
          filename: imageFile.fullPath,
          score: maxPartialScore,
          method: 'partial',
        })
        continue
      }
      
      // 4. 유사도 기반 매칭 (여러 변형 시도)
      const similarity1 = calculateSimilarity(normalizedProduct, normalizedImage)
      const similarity2 = calculateSimilarity(productRoman, imageRoman)
      const similarity3 = calculateSimilarity(normalizedProduct, imageRoman)
      const similarity4 = calculateSimilarity(productRoman, normalizedImage)
      
      const maxSimilarity = Math.max(similarity1, similarity2, similarity3, similarity4)
      
      if (maxSimilarity > 0.5) { // 최소 50% 이상 유사
        matches.push({
          filename: imageFile.fullPath,
          score: maxSimilarity * 0.8, // 유사도는 부분 매칭보다 낮은 가중치
          method: 'similarity',
        })
      }
    }
    
    // 점수 순으로 정렬
    matches.sort((a, b) => {
      // 점수가 같으면 exact > partial > similarity 순서로 우선순위
      if (Math.abs(a.score - b.score) < 0.01) {
        const methodOrder = { exact: 0, partial: 1, similarity: 2 }
        return methodOrder[a.method] - methodOrder[b.method]
      }
      return b.score - a.score
    })
    
    // 최고 점수가 0.3 이상이면 매칭 성공
    if (matches.length > 0 && matches[0].score >= 0.3) {
      const bestMatch = matches[0]
      
      // 개발 환경에서 매칭 정보 로깅
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Image Match] "${productName}" -> "${bestMatch.filename}" (score: ${bestMatch.score.toFixed(2)}, method: ${bestMatch.method})`)
      }
      
      return bestMatch.filename
    }
    
    // 매칭 실패 시 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image Match] No match found for "${productName}"`)
    }
    
    return null
  } catch (error) {
    console.error('Error matching product image:', error)
    return null
  }
}

/**
 * 여러 상품에 대한 이미지 매칭 (배치 처리)
 */
export async function matchProductImages(productNames: string[]): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>()
  
  // 병렬 처리로 성능 최적화
  const promises = productNames.map(async (name) => {
    const image = await matchProductImage(name)
    return { name, image }
  })
  
  const resolved = await Promise.all(promises)
  for (const { name, image } of resolved) {
    results.set(name, image)
  }
  
  return results
}

/**
 * 캐시 초기화 (개발 환경에서 파일 변경 시 사용)
 */
export function clearImageCache(): void {
  cachedImageFiles = null
}
