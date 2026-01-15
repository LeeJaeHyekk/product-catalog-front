/**
 * 핵심 명사 매칭 모듈
 */

import { splitIntoWords } from '../../utils/string-utils'
import { koreanToRoman, generateRomanVariants } from '../../converters/korean-converter'
import type { MorphologyResult } from '../../morphology'

/**
 * 핵심 명사 매칭 결과
 */
export interface CoreNounMatchResult {
  matched: boolean
  matchedCount: number
  totalCount: number
}

/**
 * 핵심 명사가 매칭되었는지 확인
 */
export function matchCoreNouns(
  nounTokens: Array<{ word: string; type: string }>,
  imageWords: string[]
): CoreNounMatchResult {
  let coreNounMatched = false
  let matchedCoreNouns = 0
  
  for (const nounToken of nounTokens) {
    const nounRoman = koreanToRoman(nounToken.word)
    const nounVariants = generateRomanVariants(nounToken.word, { tokens: [nounToken], coreWords: [nounToken.word] })
    const allNounVariants = [nounRoman, ...nounVariants]
    
    // 각 변형을 단어로 분리하여 매칭 확인
    for (const variant of allNounVariants) {
      if (!variant || variant.length === 0) continue
      
      const variantWords = splitIntoWords(variant)
      for (const variantWord of variantWords) {
        if (variantWord.length < 3) continue
        
        // 이미지 단어 목록에서 매칭 확인
        for (const imgWord of imageWords) {
          if (imgWord.length < 3) continue
          
          // 포함 관계 또는 공통 접두어 확인
          const hasInclusion = imgWord.includes(variantWord) || variantWord.includes(imgWord)
          
          if (hasInclusion) {
            // 공통 접두어 길이 확인
            const minLen = Math.min(variantWord.length, imgWord.length)
            let commonPrefix = 0
            for (let k = 0; k < minLen; k++) {
              if (variantWord[k] === imgWord[k]) {
                commonPrefix++
              } else {
                break
              }
            }
            
            // 최소 3글자 이상 공통 접두어 또는 포함 관계
            if (commonPrefix >= 3 || hasInclusion) {
              coreNounMatched = true
              matchedCoreNouns++
              break
            }
          }
        }
        if (coreNounMatched) break
      }
      if (coreNounMatched) break
    }
  }
  
  return {
    matched: coreNounMatched,
    matchedCount: matchedCoreNouns,
    totalCount: nounTokens.length,
  }
}
