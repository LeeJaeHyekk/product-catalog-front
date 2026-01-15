/**
 * 레이아웃 계산 유틸리티
 * 
 * 동적 레이아웃 계산을 위한 유틸리티 함수들
 */

/**
 * 요소의 너비를 안전하게 가져오기
 * 
 * @param element DOM 요소
 * @returns 요소의 너비 (px), 요소가 없으면 0
 */
export function getElementWidth(element: HTMLElement | null): number {
  if (!element) return 0
  return element.offsetWidth || 0
}

/**
 * 검색 바 레이아웃 계산 결과
 */
export interface SearchBarLayout {
  /** 입력 필드의 오른쪽 패딩 (px) */
  inputPaddingRight: number
  /** 지우기 버튼의 오른쪽 위치 (px) */
  clearButtonRight: number
}

/**
 * 검색 바 레이아웃 계산 옵션
 */
export interface CalculateSearchBarLayoutOptions {
  /** 오른쪽 요소의 너비 (px) */
  rightElementWidth: number
  /** 지우기 버튼의 너비 (px) */
  clearButtonWidth: number
  /** 버튼 간 간격 (px) */
  gap: number
  /** 지우기 버튼이 표시되는지 여부 */
  hasClearButton: boolean
  /** 오른쪽 요소가 있는지 여부 */
  hasRightElement: boolean
}

/**
 * 검색 바의 동적 레이아웃을 계산합니다.
 * 
 * 레이아웃 구조 (오른쪽에서 왼쪽으로):
 * [input] ... [x버튼] gap [카테고리버튼] gap [오른쪽 끝]
 * 
 * @param options 레이아웃 계산 옵션
 * @returns 계산된 레이아웃 값
 */
export function calculateSearchBarLayout(
  options: CalculateSearchBarLayoutOptions
): SearchBarLayout {
  const {
    rightElementWidth,
    clearButtonWidth,
    gap,
    hasClearButton,
    hasRightElement,
  } = options

  // 오른쪽 요소가 없을 때
  if (!hasRightElement) {
    if (hasClearButton) {
      // x 버튼만 있을 때: 오른쪽에서 gap만큼 떨어진 위치
      return {
        inputPaddingRight: clearButtonWidth + gap,
        clearButtonRight: gap,
      }
    } else {
      // 버튼이 없을 때: 기본 패딩
      return {
        inputPaddingRight: 16, // pr-4
        clearButtonRight: 12, // right-3
      }
    }
  }

  // 오른쪽 요소가 있을 때
  if (hasClearButton) {
    // 지우기 버튼도 있을 때
    // 카테고리 버튼: right = gap (오른쪽 끝이 gap 위치)
    // x 버튼: 카테고리 버튼의 왼쪽 끝 + gap = (gap + rightElementWidth) + gap
    const clearButtonRightPosition = gap + rightElementWidth + gap
    
    // input padding: x버튼 너비 + x버튼과 카테고리 사이 간격 + 카테고리 너비 + 카테고리와 오른쪽 끝 사이 간격
    const totalWidth = clearButtonWidth + gap + rightElementWidth + gap
    
    return {
      inputPaddingRight: totalWidth,
      clearButtonRight: clearButtonRightPosition,
    }
  } else {
    // 지우기 버튼이 없을 때
    // input padding: 카테고리 너비 + 카테고리와 오른쪽 끝 사이 간격
    return {
      inputPaddingRight: rightElementWidth + gap,
      clearButtonRight: 12, // 사용되지 않지만 초기화
    }
  }
}
