/**
 * 점수 조정 모듈
 */

// splitIntoWords는 현재 사용되지 않음
import type { WordMatchInfo } from '../../scoring/score-calculator'
import type { CoreNounMatchResult } from './core-noun-matcher'
import type { ModifierMatchResult } from './modifier-matcher'

/**
 * 점수 조정 결과
 */
export interface ScoreAdjustment {
  finalScore: number
  method: 'exact' | 'partial'
}

/**
 * 핵심 명사 및 수식어 매칭 결과에 따라 점수 조정
 */
export function adjustScore(
  baseScore: number,
  coreNounMatch: CoreNounMatchResult,
  modifierMatch: ModifierMatchResult,
  productWords: string[],
  imageWords: string[],
  wordMatchInfo: WordMatchInfo
): ScoreAdjustment {
  let finalScore = baseScore * 0.85
  
  // 핵심 명사가 매칭되지 않으면 점수 크게 감소
  if (coreNounMatch.totalCount > 0 && !coreNounMatch.matched) {
    // 수식어만 매칭되고 핵심 명사가 없으면 더 크게 감소
    if (modifierMatch.matched) {
      finalScore *= 0.05 // 수식어만 매칭되고 핵심 명사가 없으면 95% 감소 (더 엄격하게)
    } else {
      finalScore *= 0.15 // 핵심 명사가 없으면 85% 감소
    }
  } else if (coreNounMatch.matched) {
    // 핵심 명사가 매칭되면 보너스 (매칭된 명사 비율에 따라)
    const matchRatio = coreNounMatch.matchedCount / coreNounMatch.totalCount
    if (matchRatio >= 1.0) {
      // 모든 핵심 명사가 매칭됨
      finalScore = Math.min(0.98, finalScore + 0.2)
    } else if (matchRatio >= 0.5) {
      // 절반 이상 매칭됨
      finalScore = Math.min(0.95, finalScore + 0.15)
    } else {
      // 일부만 매칭됨
      finalScore = Math.min(0.9, finalScore + 0.1)
    }
  } else if (coreNounMatch.totalCount === 0) {
    // 명사 토큰이 없는 경우 (형태소 분석 실패 등)
    // 수식어만 매칭된 경우 점수 감소
    if (modifierMatch.matched && modifierMatch.matchCount > 0) {
      finalScore *= 0.3 // 수식어만 매칭되고 명사가 없으면 70% 감소
    }
  }
  
  // 접두어만 매칭된 경우 점수 감소
  if (productWords.length >= 2 && imageWords.length >= 2) {
    const productSecondWord = productWords[1]
    const imageSecondWord = imageWords[1]
    
    if (productSecondWord !== imageSecondWord &&
        !imageSecondWord.includes(productSecondWord) &&
        !productSecondWord.includes(imageSecondWord)) {
      finalScore *= 0.6
    } else if (productSecondWord === imageSecondWord) {
      finalScore = Math.min(0.95, finalScore + 0.1)
    }
  }
  
  // 단어 순서 일치 보너스
  let method: 'exact' | 'partial' = 'partial'
  if (wordMatchInfo.wordOrderMatch && wordMatchInfo.allWordsMatched) {
    finalScore = Math.min(0.98, finalScore + 0.2)
    method = 'exact'
  } else if (wordMatchInfo.allWordsMatched) {
    finalScore = Math.min(0.95, finalScore + 0.15)
  } else if (wordMatchInfo.wordMatchRatio >= 0.8) {
    finalScore = Math.min(0.9, finalScore + 0.1)
  }
  
  return {
    finalScore,
    method,
  }
}
