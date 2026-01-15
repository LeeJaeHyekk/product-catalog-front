/**
 * 문자열 유틸리티 함수
 */

/**
 * camelCase를 단어로 분리
 * 
 * 예: "almondBreeze" -> "almond breeze"
 */
export function splitCamelCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // 소문자 다음 대문자 사이에 공백 추가
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // 대문자 연속 시 분리
}

/**
 * 문자열을 단어로 분리 (camelCase, 공백, 언더스코어 등 고려)
 * 
 * 예: "chuncheonDakgalbi" -> ["chuncheon", "dakgalbi"]
 * 예: "almond breeze" -> ["almond", "breeze"]
 */
export function splitIntoWords(str: string): string[] {
  if (!str || str.length === 0) {
    return []
  }
  
  // camelCase 분리 후 공백/언더스코어로 분리
  const withSpaces = splitCamelCase(str)
  return withSpaces
    .toLowerCase()
    .split(/[\s_\-]+/)
    .filter(w => w.length > 0)
}

/**
 * 문자열 정규화 (매칭을 위해)
 * 
 * @param str 정규화할 문자열
 * @param removeSpaces 공백 제거 여부 (기본값: true)
 */
export function normalizeString(str: string, removeSpaces = true): string {
  // camelCase를 단어로 분리 (예: "almondBreeze" -> "almond breeze")
  let processed = splitCamelCase(str)
  
  let normalized = processed
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // 여러 공백을 하나로
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거 (한글, 영문, 숫자만)
  
  if (removeSpaces) {
    normalized = normalized.replace(/\s/g, '') // 공백 제거 (매칭 정확도 향상)
  }
  
  return normalized
}
