/**
 * 복합어 분리 모듈
 */

/**
 * 복합어 분리 (의미 사전 기반 + 동적 분리)
 * 
 * 예: "샤인머스캣" → ["샤인", "머스캣"]
 * 예: "소불고기" → ["소", "불고기"]
 * 예: "닭갈비" → ["닭", "갈비"]
 * 
 * 전략:
 * 1. 최장 일치 우선 (Longest Match First)
 * 2. 부분 매칭 시도 (예: "소불고기"에서 "불고기" 찾기)
 * 3. 재귀적 분리 (나머지 부분도 다시 분리 시도)
 * 
 * @param word 분리할 단어
 * @param knownWords 의미 사전 단어 목록
 * @param visited 재귀 방문 추적 (순환 참조 방지)
 * @param depth 현재 재귀 깊이
 * @param maxDepth 최대 재귀 깊이 (기본값: 10)
 * @returns 분리된 단어 배열
 */
export function splitCompoundWord(
  word: string,
  knownWords: Set<string>,
  visited: Set<string> = new Set(),
  depth: number = 0,
  maxDepth: number = 10
): string[] {
  // 입력 검증
  if (typeof word !== 'string' || word.length === 0) {
    return []
  }
  
  // 공백 제거
  word = word.trim()
  if (word.length === 0) {
    return []
  }
  
  // 최대 재귀 깊이 체크 (무한 루프 방지)
  if (depth >= maxDepth) {
    return [word]
  }
  
  // 순환 참조 방지
  if (visited.has(word)) {
    return [word]
  }
  
  // 너무 짧으면 분리 불가
  if (word.length <= 1) {
    return [word]
  }
  
  // knownWords 검증
  if (!knownWords || knownWords.size === 0) {
    return [word]
  }
  
  // 이미 사전에 있는 단어면 그대로 반환
  if (knownWords.has(word)) {
    return [word]
  }
  
  // 방문 표시
  const newVisited = new Set(visited)
  newVisited.add(word)
  
  const result: string[] = []
  let startPos = 0
  
  // 긴 단어부터 매칭 (최장 일치 우선)
  const sortedKnownWords = Array.from(knownWords)
    .filter(w => w && w.length > 0)
    .sort((a, b) => b.length - a.length)
  
  // knownWords가 비어있으면 원본 반환
  if (sortedKnownWords.length === 0) {
    return [word]
  }
  
  while (startPos < word.length) {
    let matched = false
    let bestMatch = ''
    let bestLength = 0
    let bestPos = -1
    
    // 현재 위치부터 끝까지 모든 위치에서 매칭 시도
    for (let pos = startPos; pos < word.length; pos++) {
      for (const knownWord of sortedKnownWords) {
        // 빈 문자열 체크
        if (!knownWord || knownWord.length === 0) {
          continue
        }
        
        // 부분 문자열 매칭
        const remaining = word.slice(pos)
        if (remaining.startsWith(knownWord)) {
          if (knownWord.length > bestLength) {
            bestMatch = knownWord
            bestLength = knownWord.length
            bestPos = pos
            matched = true
          }
        }
      }
    }
    
    if (matched && bestLength > 0 && bestPos >= startPos) {
      // 매칭 전 부분이 있으면 처리
      if (bestPos > startPos) {
        const prefix = word.slice(startPos, bestPos)
        
        // 접두어 부분도 재귀적으로 분리 시도
        if (prefix.length >= 2) {
          try {
            const prefixSplit = splitCompoundWord(prefix, knownWords, newVisited, depth + 1, maxDepth)
            // 분리 결과 검증
            if (prefixSplit.length > 0 && prefixSplit.every(w => w && w.length > 0)) {
              result.push(...prefixSplit)
            } else {
              result.push(prefix)
            }
          } catch (error) {
            // 재귀 에러 발생 시 접두어를 그대로 추가
            console.warn('Error in splitCompoundWord recursion:', error)
            result.push(prefix)
          }
        } else if (prefix.length > 0) {
          result.push(prefix)
        }
      }
      
      // 매칭된 단어 추가
      if (bestMatch && bestMatch.length > 0) {
        result.push(bestMatch)
      }
      
      startPos = bestPos + bestLength
      
      // 무한 루프 방지: startPos가 변하지 않으면 종료
      if (startPos === bestPos) {
        break
      }
    } else {
      // 매칭 실패
      if (result.length === 0) {
        // 처음부터 매칭 실패하면 원본 반환
        return [word]
      }
      
      // 나머지 부분 처리
      const remaining = word.slice(startPos)
      if (remaining.length > 0) {
        // 나머지 부분도 재귀적으로 분리 시도
        if (remaining.length >= 2) {
          try {
            const remainingSplit = splitCompoundWord(remaining, knownWords, newVisited, depth + 1, maxDepth)
            // 분리 결과 검증
            if (remainingSplit.length > 0 && remainingSplit.every(w => w && w.length > 0)) {
              result.push(...remainingSplit)
            } else {
              result.push(remaining)
            }
          } catch (error) {
            // 재귀 에러 발생 시 나머지를 그대로 추가
            console.warn('Error in splitCompoundWord recursion:', error)
            result.push(remaining)
          }
        } else {
          result.push(remaining)
        }
      }
      break
    }
  }
  
  // 결과 검증: 빈 배열이거나 빈 문자열만 있으면 원본 반환
  const validResult = result.filter(w => w && w.length > 0)
  if (validResult.length === 0) {
    return [word]
  }
  
  // 모든 부분이 합쳐져 원본과 같은지 검증
  const combined = validResult.join('')
  if (combined === word) {
    return validResult
  }
  
  // 검증 실패 시 원본 반환
  return [word]
}
