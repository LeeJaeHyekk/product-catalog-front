'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { COLORS, SEARCH_BAR } from '@/lib/constants'
import { useSearchBarLayout } from '@/lib/hooks'

interface SearchBarProps {
  /** 검색어 변경 핸들러 */
  onSearch: (query: string) => void
  /** 초기 검색어 (선택적) */
  initialQuery?: string
  /** placeholder 텍스트 */
  placeholder?: string
  /** 오른쪽에 표시할 추가 요소 (카테고리 버튼 등) */
  rightElement?: React.ReactNode
}

/**
 * 검색 바 컴포넌트
 * 
 * 실시간 검색 지원 (debounce 없이 즉시 반영)
 * 현대적인 디자인 적용
 */
export function SearchBar({
  onSearch,
  initialQuery = '',
  placeholder = '상품명 검색 (한글/영어 지원)...',
  rightElement,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const rightElementRef = useRef<HTMLDivElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)

  // 동적 레이아웃 계산 (모듈화된 훅 사용)
  const layout = useSearchBarLayout({
    rightElementRef: rightElementRef as React.RefObject<HTMLElement | null>,
    clearButtonRef: clearButtonRef as React.RefObject<HTMLElement | null>,
    hasClearButton: !!query,
    hasRightElement: !!rightElement,
    gap: SEARCH_BAR.gap,
  })

  // initialQuery prop이 변경되면 state 동기화
  useEffect(() => {
    // 안전성: initialQuery가 유효한 문자열인지 확인
    const safeQuery = typeof initialQuery === 'string' ? initialQuery : ''
    setQuery(safeQuery)
  }, [initialQuery])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      onSearch(newQuery)
    },
    [onSearch]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(query)
    },
    [query, onSearch]
  )

  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative">
        {/* 검색 아이콘 */}
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${query ? COLORS.primary.text : COLORS.text.secondaryClass} pointer-events-none transition-colors duration-300 ease-out`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            paddingRight: `${layout.inputPaddingRight}px`,
          }}
          className={`w-full pl-12 py-4 ${COLORS.background.bgMain} backdrop-blur-sm border-2 ${query ? `${COLORS.primary.border} border-opacity-50` : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E7F4F]/30 focus:border-[#1E7F4F] transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:border-[#1E7F4F]/40 ${COLORS.text.primaryClass} placeholder:${COLORS.text.secondaryClass}`}
        />

        {/* 오른쪽 요소 (카테고리 버튼 등) */}
        {rightElement && (
          <div
            ref={rightElementRef}
            className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 z-10"
            style={{
              right: `${SEARCH_BAR.gap}px`,
            }}
          >
            {rightElement}
          </div>
        )}

        {/* 지우기 버튼 */}
        {query && (
          <button
            ref={clearButtonRef}
            type="button"
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 ${COLORS.text.secondaryClass} hover:${COLORS.primary.text} transition-all duration-300 ease-out p-1.5 rounded-full hover:bg-[#1E7F4F]/10 z-10`}
            style={{
              right: rightElement ? `${layout.clearButtonRight}px` : `${SEARCH_BAR.gap}px`,
            }}
            aria-label="검색어 지우기"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
