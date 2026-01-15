/**
 * Kiwi 형태소 분석기 래퍼
 * 
 * 선택적 의존성: kiwi-nlp가 설치되어 있지 않아도 동작
 */

import type { MorphologyResult, SemanticToken } from '../types'

/**
 * Kiwi 라이브러리 타입 정의 (선택적 의존성)
 */
interface KiwiModule {
  default?: new () => KiwiInstance
}

interface KiwiInstance {
  ready(): Promise<void>
  analyze(text: string, topN: number): KiwiAnalysisResult[] | null
}

interface KiwiAnalysisResult {
  morphs: string[]
  pos: string[]
}

/**
 * Kiwi 라이브러리 로드 시도
 */
let kiwiInstance: KiwiInstance | null = null
let kiwiAvailable = false

/**
 * Kiwi 라이브러리 초기화
 */
async function initializeKiwi(): Promise<boolean> {
  if (kiwiAvailable) {
    return true
  }
  
  try {
    // 동적 import로 선택적 의존성 처리
    // 런타임에서만 동적으로 로드하여 빌드 타임 분석 회피
    // 문자열을 변수로 분리하여 정적 분석을 회피
    const moduleName = 'kiwi' + '-nlp'
    const kiwi = await (async () => {
      try {
        // Function 생성자를 사용하여 완전히 동적으로 import
        // 이렇게 하면 빌드 타임에 모듈을 찾으려고 시도하지 않음
        const dynamicImport = new Function('specifier', 'return import(specifier)')
        return await dynamicImport(moduleName) as unknown as KiwiModule | null
      } catch (error) {
        // 모듈이 없으면 null 반환 (선택적 의존성이므로 정상)
        return null
      }
    })() as unknown as KiwiModule | null
    
    if (!kiwi || typeof kiwi !== 'object') {
      kiwiAvailable = false
      return false
    }
    
    // null 체크 추가 (catch로 인해 null이 반환될 수 있음)
    if (kiwi === null) {
      kiwiAvailable = false
      return false
    }
    
    // Kiwi 인스턴스 생성 (small 모델로 시작 - 빠른 속도)
    if (kiwi.default && typeof kiwi.default === 'function') {
      try {
        kiwiInstance = new kiwi.default() as KiwiInstance
        if (kiwiInstance && typeof kiwiInstance.ready === 'function') {
          await kiwiInstance.ready()
          kiwiAvailable = true
          return true
        }
      } catch (initError) {
        console.warn('[Kiwi] Instance initialization failed:', initError)
        kiwiAvailable = false
        return false
      }
    }
    
    return false
  } catch (error) {
    // kiwi-nlp가 설치되지 않았거나 초기화 실패
    // 에러를 조용히 처리 (선택적 의존성이므로)
    kiwiAvailable = false
    return false
  }
}

/**
 * Kiwi를 사용한 형태소 분석
 */
export async function analyzeWithKiwi(text: string): Promise<MorphologyResult | null> {
  try {
    // Kiwi 초기화 시도 (에러 발생 시 null 반환)
    const initialized = await initializeKiwi().catch(() => false)
    if (!initialized || !kiwiInstance) {
      return null
    }
    
    // 형태소 분석 수행
    if (!kiwiInstance || typeof kiwiInstance.analyze !== 'function') {
      return null
    }

    const result = kiwiInstance.analyze(text, 1) // topN = 1 (가장 가능성 높은 분석만)
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      return null
    }
    
    const tokens: SemanticToken[] = []
    const coreWords: string[] = []
    
    // 첫 번째 분석 결과 사용
    const analysis = result[0]
    if (
      !analysis ||
      typeof analysis !== 'object' ||
      !Array.isArray(analysis.morphs) ||
      !Array.isArray(analysis.pos) ||
      analysis.morphs.length !== analysis.pos.length
    ) {
      return null
    }
    
    // 형태소와 품사 정보를 토큰으로 변환
    for (let i = 0; i < analysis.morphs.length; i++) {
      const morph = analysis.morphs[i]
      const pos = analysis.pos[i]
      
      // 안전성: morph와 pos가 유효한 문자열인지 확인
      if (
        !morph ||
        typeof morph !== 'string' ||
        morph.length === 0 ||
        !pos ||
        typeof pos !== 'string'
      ) {
        continue
      }
      
      // 품사에 따라 타입 결정
      let type: SemanticToken['type'] = 'noun'
      if (pos.startsWith('VV') || pos.startsWith('VA')) {
        type = 'adjective'
      } else if (pos.startsWith('NNP') || pos.startsWith('NNG') || pos.startsWith('NNB')) {
        type = 'noun'
      } else if (pos.startsWith('MM')) {
        type = 'prefix'
      }
      
      tokens.push({
        word: morph,
        type,
        confidence: 0.9, // 라이브러리 분석 결과는 높은 신뢰도
      })
      
      // 명사와 형용사만 핵심 단어로 추가
      if (type === 'noun' || type === 'adjective') {
        coreWords.push(morph)
      }
    }
    
    return {
      tokens,
      coreWords,
    }
  } catch (error) {
    console.warn('[Kiwi] Analysis error:', error)
    return null
  }
}

/**
 * Kiwi 라이브러리 사용 가능 여부 확인
 */
export function isKiwiAvailable(): boolean {
  return kiwiAvailable
}
