/**
 * 형태소 분석 모듈
 */

export type { SemanticToken, MorphologyResult } from './types'
export { analyzeMorphology } from './analyzer'
export { analyzeMorphologyWithFallback } from './analyzer-with-fallback'
export { splitCompoundWord } from './compound-splitter'
export { extractCoreWords } from './core-word-extractor'
export { isKiwiAvailable } from './library'
