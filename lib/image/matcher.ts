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

import { normalizeString } from './utils/string-utils'
import { getImageFiles } from './utils/file-reader'
import { koreanToRoman, generateRomanVariants } from './converters/korean-converter'
import { analyzeMorphology } from './morphology'
import { getKnownKoreanWords } from './semantic-dict'
import { tryExactMatch } from './strategies/exact-matcher'
import { tryPartialMatch } from './strategies/partial-matcher'
import { trySimilarityMatch } from './strategies/similarity-matcher'
import type { ImageFile, MatchResult } from './types'

/**
 * 매칭 결과 정렬
 */
function sortMatches(matches: MatchResult[], imageFiles: ImageFile[]): MatchResult[] {
  return matches.sort((a, b) => {
    // 점수 차이가 작은 경우 (0.05 이내) 더 정확한 매칭 우선
    if (Math.abs(a.score - b.score) < 0.05) {
      // 1. exact > partial > similarity 순서로 우선순위
      const methodOrder = { exact: 0, partial: 1, similarity: 2 }
      const methodDiff = methodOrder[a.method] - methodOrder[b.method]
      if (methodDiff !== 0) {
        return methodDiff
      }
      
      // 2. 같은 메서드인 경우, 더 긴 파일명 우선 (더 구체적인 매칭)
      const aFile = imageFiles.find(f => f.fullPath === a.filename)
      const bFile = imageFiles.find(f => f.fullPath === b.filename)
      if (aFile && bFile) {
        const aLength = aFile.nameWithoutExt.length
        const bLength = bFile.nameWithoutExt.length
        if (Math.abs(aLength - bLength) > 3) {
          return bLength - aLength
        }
      }
    }
    
    // 점수 순으로 정렬
    return b.score - a.score
  })
}

/**
 * 매칭 결과 로깅
 */
function logMatchResult(
  productName: string,
  bestMatch: MatchResult | null,
  imageFiles: ImageFile[],
  morphology: ReturnType<typeof analyzeMorphology>,
  productRoman: string,
  productRomanVariants: string[]
): void {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  
  if (bestMatch) {
    console.log(`[Image Match] "${productName}" -> "${bestMatch.filename}" (score: ${bestMatch.score.toFixed(2)}, method: ${bestMatch.method})`)
    const matchedFile = imageFiles.find(f => f.fullPath === bestMatch.filename)
    console.log(`[Image Match] Morphology:`, morphology)
    console.log(`[Image Match] Product Roman: "${productRoman}"`)
    console.log(`[Image Match] Product Variants:`, productRomanVariants)
    console.log(`[Image Match] Image Normalized: "${normalizeString(matchedFile?.nameWithoutExt || '', true)}"`)
    console.log(`[Image Match] Image Roman: "${koreanToRoman(matchedFile?.nameWithoutExt || '')}"`)
  } else {
    console.log(`[Image Match] No match found for "${productName}"`)
    console.log(`[Image Match] Morphology:`, morphology)
    console.log(`[Image Match] Normalized product: "${normalizeString(productName, true)}"`)
    console.log(`[Image Match] Product Roman: "${productRoman}"`)
    console.log(`[Image Match] Product Variants:`, productRomanVariants)
    console.log(`[Image Match] Available files (first 5):`, imageFiles.slice(0, 5).map(f => ({
      filename: f.filename,
      normalized: normalizeString(f.nameWithoutExt, true),
      roman: koreanToRoman(f.nameWithoutExt)
    })))
  }
}

/**
 * 상품명과 이미지 파일 매칭
 * 
 * 매칭 우선순위:
 * 1. 정확한 매칭 (한글/영어 모두)
 * 2. 부분 매칭 (단어 단위)
 * 3. 유사도 기반 매칭
 * 
 * @deprecated Use matchProductImageWithFallback for better accuracy with library fallback
 */
export async function matchProductImage(productName: string): Promise<string | null> {
  try {
    const imageFiles = await getImageFiles()
    
    if (imageFiles.length === 0) {
      return null
    }
    
    // 정규화 및 변환 준비
    const normalizedProduct = normalizeString(productName, true)
    const normalizedProductWithSpaces = normalizeString(productName, false)
    
    if (normalizedProduct.length === 0) {
      return null
    }
    
    const knownWords = getKnownKoreanWords()
    const morphology = analyzeMorphology(productName, knownWords)
    const productRoman = koreanToRoman(productName)
    const productRomanVariants = generateRomanVariants(productName, morphology)
    const productRomanWithSpaces = koreanToRoman(normalizedProductWithSpaces)
    
    const matches: MatchResult[] = []
    
    // 각 이미지 파일에 대해 매칭 시도
    for (const imageFile of imageFiles) {
      // 1. 정확한 매칭 시도
      const exactMatch = tryExactMatch(productName, imageFile, normalizedProduct, productRoman)
      if (exactMatch) {
        matches.push(exactMatch)
        continue
      }
      
      // 2. 부분 매칭 시도
      const partialMatch = tryPartialMatch(
        productName,
        imageFile,
        normalizedProduct,
        productRoman,
        normalizedProductWithSpaces,
        productRomanWithSpaces,
        productRomanVariants,
        morphology
      )
      if (partialMatch) {
        matches.push(partialMatch)
        continue
      }
      
      // 3. 유사도 기반 매칭 시도
      const similarityMatch = trySimilarityMatch(productName, imageFile, normalizedProduct, productRoman)
      if (similarityMatch) {
        matches.push(similarityMatch)
      }
    }
    
    // 매칭 결과 정렬
    const sortedMatches = sortMatches(matches, imageFiles)
    
    // 최고 점수가 0.2 이상이면 매칭 성공
    const bestMatch = sortedMatches[0]
    if (bestMatch && bestMatch.score >= 0.2) {
      logMatchResult(productName, bestMatch, imageFiles, morphology, productRoman, productRomanVariants)
      return bestMatch.filename
    }
    
    // 매칭 실패 시 로깅
    logMatchResult(productName, null, imageFiles, morphology, productRoman, productRomanVariants)
    
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
  
  // 안전성: productNames가 유효한 배열인지 확인
  if (!Array.isArray(productNames) || productNames.length === 0) {
    return results
  }
  
  // 병렬 처리로 성능 최적화
  const promises = productNames.map(async (name) => {
    try {
      // 안전성: name이 유효한 문자열인지 확인
      if (!name || typeof name !== 'string') {
        return { name: String(name || ''), image: null }
      }
      const image = await matchProductImage(name)
      return { name, image }
    } catch (error) {
      // 개별 매칭 실패해도 계속 진행
      console.warn(`[Image Match] Failed to match image for "${name}":`, error)
      return { name: String(name || ''), image: null }
    }
  })
  
  try {
    const resolved = await Promise.all(promises)
    // 안전성: resolved가 유효한 배열인지 확인
    if (Array.isArray(resolved)) {
      for (const item of resolved) {
        // 안전성: item이 유효한 객체인지 확인
        if (item && typeof item === 'object' && 'name' in item && 'image' in item) {
          const name = typeof item.name === 'string' ? item.name : String(item.name || '')
          const image = item.image === null || (typeof item.image === 'string' && item.image.length > 0) ? item.image : null
          results.set(name, image)
        }
      }
    }
  } catch (error) {
    // Promise.all 실패 시 빈 Map 반환
    console.error('[Image Match] Failed to match product images:', error)
  }
  
  return results
}

// 타입 및 인터페이스 재export
export type { ImageFile, MatchResult } from './types'

// 2중 점검 매칭 함수 재export
export { matchProductImageWithFallback, matchProductImagesWithFallback } from './matcher-with-fallback'
