/**
 * UI 관련 상수
 */

export const SKELETON_COUNT = 10

export const GRID_COLS = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  large: 5,
} as const

/**
 * 레이아웃 간격 상수
 */
export const LAYOUT_GAPS = {
  /** 버튼 간 기본 간격 (px) */
  buttonGap: 13,
  /** 입력 필드 기본 패딩 (px) */
  inputPaddingDefault: 16, // pr-4
  /** 입력 필드 기본 오른쪽 패딩 (px) */
  inputPaddingRightDefault: 12, // right-3
} as const

/**
 * 검색 바 관련 상수
 */
export const SEARCH_BAR = {
  /** 버튼 간 간격 (px) */
  gap: LAYOUT_GAPS.buttonGap,
  /** 기본 입력 필드 패딩 (px) */
  defaultPadding: LAYOUT_GAPS.inputPaddingDefault,
  /** 기본 오른쪽 패딩 (px) */
  defaultRightPadding: LAYOUT_GAPS.inputPaddingRightDefault,
} as const
