/**
 * 이미지 매칭 (3단계 검증)
 * 
 * 컨셉:
 * 1차: 현재 로직으로 정확한 매칭 확인
 * 2차: 라이브러리로 정확한 매칭 확인
 * 3차: 가장 가까운 이미지로 매칭 (fallback)
 * 
 * 정확한 매칭 기준:
 * - Exact match: score >= 0.9
 * - Partial match: score >= 0.7
 * - Similarity match: score >= 0.6
 */

import { normalizeString } from './utils/string-utils'
import { getImageFiles } from './utils/file-reader'
import { koreanToRoman, generateRomanVariants } from './converters/korean-converter'
import { analyzeMorphology } from './morphology'
import { getKnownKoreanWords } from './semantic-dict'
import { tryExactMatch } from './strategies/exact-matcher'
import { tryPartialMatch } from './strategies/partial-matcher'
import { trySimilarityMatch } from './strategies/similarity-matcher'
import { isMatchResult, isNonEmptyString, isNonNegativeNumber } from '../validation'
import type { ImageFile, MatchResult } from './types'

/**
 * 매칭 결과 정렬
 */
function sortMatches(matches: MatchResult[], imageFiles: ImageFile[]): MatchResult[] {
  // 안전성: 빈 배열이면 조기 반환
  if (!Array.isArray(matches) || matches.length === 0) {
    return []
  }

  return matches.sort((a, b) => {
    // 안전성: 타입 가드를 사용하여 검증
    if (!isMatchResult(a) || !isMatchResult(b)) {
      return 0
    }

    // 점수 차이가 작은 경우 (0.05 이내) 더 정확한 매칭 우선
    if (Math.abs(a.score - b.score) < 0.05) {
      // 1. exact > partial > similarity 순서로 우선순위
      const methodOrder: Record<string, number> = { exact: 0, partial: 1, similarity: 2 }
      const aMethodOrder = methodOrder[a.method] ?? 2
      const bMethodOrder = methodOrder[b.method] ?? 2
      const methodDiff = aMethodOrder - bMethodOrder
      if (methodDiff !== 0) {
        return methodDiff
      }
      
      // 2. 같은 메서드인 경우, 더 긴 파일명 우선 (더 구체적인 매칭)
      // 안전성: 타입 가드를 사용하여 filename 검증
      if (isNonEmptyString(a.filename) && isNonEmptyString(b.filename)) {
        const aFile = imageFiles.find(f => f && f.fullPath === a.filename)
        const bFile = imageFiles.find(f => f && f.fullPath === b.filename)
        if (aFile && bFile && aFile.nameWithoutExt && bFile.nameWithoutExt) {
          const aLength = aFile.nameWithoutExt.length
          const bLength = bFile.nameWithoutExt.length
          if (Math.abs(aLength - bLength) > 3) {
            return bLength - aLength
          }
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
  productRomanVariants: string[],
  usedLibrary: boolean = false
): void {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  
  if (bestMatch) {
    const source = usedLibrary ? ' (library)' : ' (custom)'
    console.log(`[Image Match] "${productName}" -> "${bestMatch.filename}" (score: ${bestMatch.score.toFixed(2)}, method: ${bestMatch.method})${source}`)
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
 * 단일 매칭 시도
 */
function tryMatching(
  productName: string,
  imageFiles: ImageFile[],
  normalizedProduct: string,
  normalizedProductWithSpaces: string,
  morphology: ReturnType<typeof analyzeMorphology>,
  productRoman: string,
  productRomanVariants: string[],
  productRomanWithSpaces: string
): MatchResult[] {
  const matches: MatchResult[] = []
  
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
  
  return matches
}

/**
 * 상품명과 이미지 파일 매칭 (2중 점검)
 * 
 * 매칭 우선순위:
 * 1. 현재 로직으로 매칭 시도
 * 2. 라이브러리 기반 형태소 분석으로 재시도
 * 3. 매칭 실패
 */
export async function matchProductImageWithFallback(productName: string): Promise<string | null> {
  try {
    const imageFiles = await getImageFiles()
    
    if (imageFiles.length === 0) {
      return null
    }
    
    // ===== 하드코딩 매핑 (최우선) =====
    const hardcodedMappings: Record<string, string> = {
      '전통 약과': 'prefixnoun',
      '전통약과': 'prefixnoun',
      '밀폐유나베': 'milleFeuilleNabe',
      '밀푀유나베': 'milleFeuilleNabe',
      '밀푀유 나베': 'milleFeuilleNabe',
      '당도보장 배 사과': 'highSugarHoneyApplesHighSugarHoneyApples',
      '당도보장배사과': 'highSugarHoneyApplesHighSugarHoneyApples',
      '당도보장 배': 'highSugarHoneyPear',
      '당도보장배': 'highSugarHoneyPear',
      '명품 한우 세트': 'luxuryKoreanbeefset',
      '명품한우세트': 'luxuryKoreanbeefset',
      '명품 한우': 'luxuryKoreanbeefset',
      '명품한우': 'luxuryKoreanbeefset',
    }
    
    const normalizedName = productName.trim()
    if (hardcodedMappings[normalizedName]) {
      const targetFilename = hardcodedMappings[normalizedName]
      const matchedFile = imageFiles.find(f => 
        f.nameWithoutExt.toLowerCase() === targetFilename.toLowerCase()
      )
      if (matchedFile) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Image Match] 하드코딩 매핑: "${productName}" -> "${matchedFile.fullPath}"`)
        }
        return matchedFile.fullPath
      }
    }
    
    // 정규화 및 변환 준비
    const normalizedProduct = normalizeString(productName, true)
    const normalizedProductWithSpaces = normalizeString(productName, false)
    
    if (normalizedProduct.length === 0) {
      return null
    }
    
    const knownWords = getKnownKoreanWords()
    
    // ===== 1차: 현재 로직으로 매칭 시도 =====
    const primaryMorphology = analyzeMorphology(productName, knownWords)
    const primaryProductRoman = koreanToRoman(productName)
    const primaryProductRomanVariants = generateRomanVariants(productName, primaryMorphology)
    const primaryProductRomanWithSpaces = koreanToRoman(normalizedProductWithSpaces)
    
    const primaryMatches = tryMatching(
      productName,
      imageFiles,
      normalizedProduct,
      normalizedProductWithSpaces,
      primaryMorphology,
      primaryProductRoman,
      primaryProductRomanVariants,
      primaryProductRomanWithSpaces
    )
    
    // 매칭 결과 정렬
    const sortedPrimaryMatches = sortMatches(primaryMatches, imageFiles)
    
    // ===== 1차: 정확한 매칭 확인 =====
    const bestPrimaryMatch = sortedPrimaryMatches[0]
    const isAccurateMatch = bestPrimaryMatch && (
      (bestPrimaryMatch.method === 'exact' && bestPrimaryMatch.score >= 0.9) ||
      (bestPrimaryMatch.method === 'partial' && bestPrimaryMatch.score >= 0.7) ||
      (bestPrimaryMatch.method === 'similarity' && bestPrimaryMatch.score >= 0.6)
    )
    
    if (isAccurateMatch && isMatchResult(bestPrimaryMatch) && isNonEmptyString(bestPrimaryMatch.filename)) {
      logMatchResult(productName, bestPrimaryMatch, imageFiles, primaryMorphology, primaryProductRoman, primaryProductRomanVariants, false)
      return bestPrimaryMatch.filename
    }
    
    // ===== 2차: 라이브러리 기반 형태소 분석으로 재시도 (항상 수행) =====
    try {
      // 라이브러리로 직접 형태소 분석 수행
      const { analyzeWithKiwi } = await import('./morphology/library/kiwi-wrapper')
      const libraryMorphology = await analyzeWithKiwi(productName)
      
      if (libraryMorphology && libraryMorphology.coreWords.length > 0) {
        // 라이브러리로 인식된 글자와 이미지명 비교
        // 라이브러리 형태소 분석 결과를 사용하여 변환
        const libraryProductRoman = koreanToRoman(productName, libraryMorphology)
        const libraryProductRomanVariants = generateRomanVariants(productName, libraryMorphology)
        const libraryProductRomanWithSpaces = koreanToRoman(normalizedProductWithSpaces, libraryMorphology)
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Image Match] 2차 검증 (라이브러리): "${productName}"`)
          console.log(`[Image Match] 라이브러리 형태소 분석:`, libraryMorphology)
          console.log(`[Image Match] 라이브러리 변환 결과:`, libraryProductRomanVariants)
        }
        
        const libraryMatches = tryMatching(
          productName,
          imageFiles,
          normalizedProduct,
          normalizedProductWithSpaces,
          libraryMorphology,
          libraryProductRoman,
          libraryProductRomanVariants,
          libraryProductRomanWithSpaces
        )
        
        // 매칭 결과 정렬
        const sortedLibraryMatches = sortMatches(libraryMatches, imageFiles)
        
        // ===== 2차: 라이브러리로 정확한 매칭 확인 =====
        const bestLibraryMatch = sortedLibraryMatches[0]
        const isLibraryAccurateMatch = bestLibraryMatch && (
          (bestLibraryMatch.method === 'exact' && bestLibraryMatch.score >= 0.9) ||
          (bestLibraryMatch.method === 'partial' && bestLibraryMatch.score >= 0.7) ||
          (bestLibraryMatch.method === 'similarity' && bestLibraryMatch.score >= 0.6)
        )
        
        if (isLibraryAccurateMatch && isMatchResult(bestLibraryMatch) && isNonEmptyString(bestLibraryMatch.filename)) {
          logMatchResult(productName, bestLibraryMatch, imageFiles, libraryMorphology, libraryProductRoman, libraryProductRomanVariants, true)
          return bestLibraryMatch.filename
        }
      }
    } catch (error) {
      // 라이브러리가 없거나 실패해도 계속 진행 (1차 결과 사용)
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Image Match] Library fallback not available or failed:', error instanceof Error ? error.message : 'Unknown error')
      }
    }
    
    // ===== 3차: 가장 가까운 이미지로 매칭 (fallback) =====
    // 1차와 2차 결과를 모두 수집하여 최고 점수 선택
    const allMatches: MatchResult[] = []
    
    // 안전성: 타입 가드를 사용하여 검증
    if (isMatchResult(bestPrimaryMatch) && isNonEmptyString(bestPrimaryMatch.filename)) {
      allMatches.push(bestPrimaryMatch)
    }
    
    try {
      const { analyzeWithKiwi } = await import('./morphology/library/kiwi-wrapper')
      const libraryMorphology = await analyzeWithKiwi(productName)
      
      if (libraryMorphology && libraryMorphology.coreWords.length > 0) {
        const libraryProductRoman = koreanToRoman(productName, libraryMorphology)
        const libraryProductRomanVariants = generateRomanVariants(productName, libraryMorphology)
        const libraryProductRomanWithSpaces = koreanToRoman(normalizedProductWithSpaces, libraryMorphology)
        
        const libraryMatches = tryMatching(
          productName,
          imageFiles,
          normalizedProduct,
          normalizedProductWithSpaces,
          libraryMorphology,
          libraryProductRoman,
          libraryProductRomanVariants,
          libraryProductRomanWithSpaces
        )
        
        const sortedLibraryMatches = sortMatches(libraryMatches, imageFiles)
        // 안전성: 타입 가드를 사용하여 검증
        const bestLibraryMatch = sortedLibraryMatches[0]
        if (isMatchResult(bestLibraryMatch)) {
          allMatches.push(bestLibraryMatch)
        }
      }
    } catch (error) {
      // 라이브러리 실패해도 계속 진행
    }
    
    // 모든 매칭 결과 중 최고 점수 선택
    if (allMatches.length > 0) {
      // 안전성: 타입 가드를 사용하여 reduce
      const bestMatch = allMatches.reduce((best, current) => {
        // 안전성: 타입 가드로 검증
        if (!isMatchResult(current)) {
          return best
        }
        if (!isMatchResult(best)) {
          return current
        }
        return current.score > best.score ? current : best
      })
      
      // 안전성: 타입 가드를 사용하여 bestMatch 검증
      if (
        isMatchResult(bestMatch) &&
        isNonNegativeNumber(bestMatch.score) &&
        bestMatch.score >= 0.2 &&
        isNonEmptyString(bestMatch.filename)
      ) {
        const usedLibrary = bestMatch !== bestPrimaryMatch
        logMatchResult(productName, bestMatch, imageFiles, primaryMorphology, primaryProductRoman, primaryProductRomanVariants, usedLibrary)
        return bestMatch.filename
      }
    }
    
    // 매칭 실패
    logMatchResult(productName, null, imageFiles, primaryMorphology, primaryProductRoman, primaryProductRomanVariants, false)
    return null
  } catch (error) {
    console.error('Error matching product image:', error)
    return null
  }
}

/**
 * 여러 상품에 대한 이미지 매칭 (배치 처리, 2중 점검)
 */
export async function matchProductImagesWithFallback(productNames: string[]): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>()
  
  // 병렬 처리로 성능 최적화
  const promises = productNames.map(async (name) => {
    const image = await matchProductImageWithFallback(name)
    return { name, image }
  })
  
  const resolved = await Promise.all(promises)
  for (const { name, image } of resolved) {
    results.set(name, image)
  }
  
  return results
}
