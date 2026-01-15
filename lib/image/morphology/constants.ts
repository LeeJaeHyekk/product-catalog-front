/**
 * 형태소 분석 상수
 */

/**
 * 조사/접미어 패턴 (제거 대상)
 */
export const PARTICLES = [
  '은', '는', '이', '가', '을', '를', '의', '에', '에서', '로', '으로',
  '와', '과', '도', '만', '부터', '까지', '처럼', '같이', '보다',
] as const

/**
 * 형용사 어미 패턴 (제거 후 형용사로 처리)
 */
export const ADJECTIVE_SUFFIXES = [
  '한', '된', '인', '할', '하는', '가득한', '많은', '적은',
] as const

/**
 * 접두어 패턴
 */
export const PREFIXES = [
  { pattern: /^고(.+)/, prefix: '고', meaning: 'high' },
  { pattern: /^신선(.+)/, prefix: '신선', meaning: 'fresh' },
  { pattern: /^프리미엄(.+)/, prefix: '프리미엄', meaning: 'premium' },
  { pattern: /^명품(.+)/, prefix: '명품', meaning: 'luxury' },
  { pattern: /^유기농(.+)/, prefix: '유기농', meaning: 'organic' },
  { pattern: /^무항생제(.+)/, prefix: '무항생제', meaning: 'antibioticfree' },
  { pattern: /^냉동(.+)/, prefix: '냉동', meaning: 'frozen' },
  { pattern: /^특별(.+)/, prefix: '특별', meaning: 'special' },
  { pattern: /^전통(.+)/, prefix: '전통', meaning: 'traditional' },
  { pattern: /^간편(.+)/, prefix: '간편', meaning: 'easy' },
] as const
