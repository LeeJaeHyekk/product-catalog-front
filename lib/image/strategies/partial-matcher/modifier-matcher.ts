/**
 * 수식어 매칭 모듈
 */

import { splitIntoWords } from '../../utils/string-utils'
import { koreanToRoman, generateRomanVariants } from '../../converters/korean-converter'

/**
 * 수식어 매칭 결과
 */
export interface ModifierMatchResult {
  matched: boolean
  matchCount: number
}

/**
 * 수식어(형용사, 접두어) 매칭 확인
 */
export function matchModifiers(
  modifierTokens: Array<{ word: string; type: string }>,
  imageWords: string[]
): ModifierMatchResult {
  let hasModifierMatch = false
  let modifierMatchCount = 0
  
  if (modifierTokens.length === 0) {
    return { matched: false, matchCount: 0 }
  }
  
  for (const modifierToken of modifierTokens) {
    const modifierRoman = koreanToRoman(modifierToken.word)
    const semanticToken = {
      word: modifierToken.word,
      type: (modifierToken.type === 'noun' || modifierToken.type === 'adjective' || modifierToken.type === 'prefix' || modifierToken.type === 'suffix' 
        ? modifierToken.type 
        : 'unknown') as 'noun' | 'adjective' | 'prefix' | 'suffix' | 'unknown',
      confidence: 0.8,
    }
    const modifierVariants = generateRomanVariants(modifierToken.word, { tokens: [semanticToken], coreWords: [modifierToken.word] })
    const allModifierVariants = [modifierRoman, ...modifierVariants]
    
    for (const variant of allModifierVariants) {
      if (!variant || variant.length === 0) continue
      
      const variantWords = splitIntoWords(variant)
      for (const variantWord of variantWords) {
        if (variantWord.length < 3) continue
        
        for (const imgWord of imageWords) {
          if (imgWord.length < 3) continue
          
          if (imgWord.includes(variantWord) || variantWord.includes(imgWord)) {
            const minLen = Math.min(variantWord.length, imgWord.length)
            let commonPrefix = 0
            for (let k = 0; k < minLen; k++) {
              if (variantWord[k] === imgWord[k]) {
                commonPrefix++
              } else {
                break
              }
            }
            
            if (commonPrefix >= 3 || imgWord.includes(variantWord) || variantWord.includes(imgWord)) {
              hasModifierMatch = true
              modifierMatchCount++
              break
            }
          }
        }
        if (hasModifierMatch) break
      }
      if (hasModifierMatch) break
    }
  }
  
  return {
    matched: hasModifierMatch,
    matchCount: modifierMatchCount,
  }
}
