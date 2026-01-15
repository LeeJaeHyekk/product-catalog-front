/**
 * 부분 매칭 메인 모듈
 */

import { normalizeString, splitIntoWords } from '../../utils/string-utils'
import { koreanToRoman } from '../../converters/korean-converter'
import { calculatePartialMatchScore, calculateWordMatchInfo } from '../../scoring/score-calculator'
import type { ImageFile, MatchResult } from '../../types'
import type { MorphologyResult } from '../../morphology'
import { tryInclusionMatch } from './inclusion-matcher'
import { tryVariantMatch } from './variant-matcher'
import { tryWordOrderMatch } from './word-matcher'
import { matchCoreNouns } from './core-noun-matcher'
import { matchModifiers } from './modifier-matcher'
import { adjustScore } from './score-adjuster'

/**
 * 부분 매칭 시도
 */
export function tryPartialMatch(
  productName: string,
  imageFile: ImageFile,
  normalizedProduct: string,
  productRoman: string,
  normalizedProductWithSpaces: string,
  productRomanWithSpaces: string,
  productRomanVariants: string[],
  morphology: MorphologyResult
): MatchResult | null {
  const normalizedImage = normalizeString(imageFile.nameWithoutExt, true)
  const imageRoman = koreanToRoman(normalizedImage)
  const normalizedImageWithSpaces = normalizeString(imageFile.nameWithoutExt, false)
  const imageRomanWithSpaces = koreanToRoman(normalizedImageWithSpaces)
  const imageWords = splitIntoWords(imageRoman)
  
  // 1. 변환된 문자열 포함 여부 확인
  const inclusionMatch = tryInclusionMatch(imageFile, productRoman)
  if (inclusionMatch) {
    return inclusionMatch
  }
  
  // 2. 여러 변환 후보 시도
  const variantMatch = tryVariantMatch(imageFile, productRoman, productRomanVariants)
  if (variantMatch) {
    return variantMatch
  }
  
  // 3. 단어 순서 무시 매칭
  const wordOrderMatch = tryWordOrderMatch(productRoman, imageRoman)
  if (wordOrderMatch.matched) {
    return {
      filename: imageFile.fullPath,
      score: wordOrderMatch.score,
      method: 'partial',
    }
  }
  
  // 4. 부분 매칭 점수 계산
  const partialScore1 = calculatePartialMatchScore(normalizedProductWithSpaces, normalizedImageWithSpaces)
  const partialScore2 = calculatePartialMatchScore(productRomanWithSpaces, imageRomanWithSpaces)
  const partialScore3 = calculatePartialMatchScore(normalizedProduct, normalizedImage)
  const partialScore4 = calculatePartialMatchScore(productRoman, imageRoman)
  
  // 5. 단어 단위 매칭 정보 (핵심 명사 우선순위 반영)
  const coreNouns = morphology.tokens
    .filter(t => t.type === 'noun')
    .map(t => {
      const roman = koreanToRoman(t.word)
      return roman.toLowerCase()
    })
  const wordMatchInfo = calculateWordMatchInfo(productRoman, imageRoman, coreNouns)
  const wordInclusionScore = wordMatchInfo.wordMatchRatio > 0
    ? (wordMatchInfo.wordMatchRatio * 0.6 + (wordMatchInfo.totalMatchScore / wordMatchInfo.includedWords) * 0.4)
    : 0
  
  const maxPartialScore = Math.max(
    partialScore1,
    partialScore2,
    partialScore3,
    partialScore4,
    wordInclusionScore * 0.9
  )
  
  if (maxPartialScore > 0.2) {
    // 핵심 단어(명사) 우선순위 확인
    const nounTokens = morphology.tokens.filter(t => t.type === 'noun')
    const adjectiveTokens = morphology.tokens.filter(t => t.type === 'adjective')
    const prefixTokens = morphology.tokens.filter(t => t.type === 'prefix')
    const allModifiers = [...adjectiveTokens, ...prefixTokens]
    
    // 수식어 매칭 확인
    const modifierMatch = matchModifiers(allModifiers, imageWords)
    
    // 핵심 명사 매칭 확인
    const coreNounMatch = matchCoreNouns(nounTokens, imageWords)
    
    // 점수 조정
    const productWords = splitIntoWords(productRoman)
    const adjustment = adjustScore(
      maxPartialScore,
      coreNounMatch,
      modifierMatch,
      productWords,
      imageWords,
      wordMatchInfo
    )
    
    return {
      filename: imageFile.fullPath,
      score: adjustment.finalScore,
      method: adjustment.method,
    }
  }
  
  return null
}
