'use client'

import { useState, useRef } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { COLORS } from '@/lib/constants'
import { useMemoClassName, useClickOutside, useEscapeKey, useCategorySelection } from '@/lib/hooks'
import { CategoryButton } from './CategoryButton'

interface CategoryDropdownProps {
  /** 상품 목록 (카테고리 정보 포함) */
  products: EnrichedProduct[]
  /** 선택된 서브 카테고리 ID */
  selectedSubCategoryId: string | '전체'
  /** 카테고리 변경 핸들러 */
  onCategoryChange: (subCategoryId: string | '전체') => void
}

/**
 * 카테고리 드롭다운 컴포넌트
 * 
 * 최소화 상태: 이모티콘 버튼만 표시
 * 최대화 상태: 카테고리 목록 펼쳐짐
 */
export function CategoryDropdown({
  products,
  selectedSubCategoryId,
  onCategoryChange,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 카테고리 선택 로직 (모듈화된 훅 사용)
  const { availableCategories, selectedCategoryName, selectedCategoryCount } = useCategorySelection({
    products,
    selectedSubCategoryId,
  })

  // 외부 클릭 시 드롭다운 닫기 (모듈화된 훅 사용)
  useClickOutside(dropdownRef, {
    handler: () => setIsOpen(false),
    enabled: isOpen,
  })

  // ESC 키로 닫기 (모듈화된 훅 사용)
  useEscapeKey({
    handler: () => setIsOpen(false),
    enabled: isOpen,
  })

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleCategorySelect = (subCategoryId: string | '전체') => {
    onCategoryChange(subCategoryId)
    setIsOpen(false)
  }

  const buttonClassName = useMemoClassName(
    'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-out border-2',
    {
      [`${COLORS.primary.bg} text-white border-[#1E7F4F] shadow-lg shadow-[#1E7F4F]/25`]: isOpen || selectedSubCategoryId !== '전체',
      [`${COLORS.background.bgMain} ${COLORS.text.primaryClass} border-gray-200 hover:border-[#1E7F4F]/40 hover:${COLORS.primary.bgWithOpacity(10)}`]: !isOpen && selectedSubCategoryId === '전체',
    }
  )

  return (
    <div ref={dropdownRef} className="relative">
      {/* 카테고리 버튼 */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={buttonClassName}
        aria-label="카테고리 필터"
        aria-expanded={isOpen}
      >
        {/* 필터 아이콘 */}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="hidden sm:inline">
          {selectedCategoryName}
        </span>
        {/* 선택된 카테고리가 있으면 배지 표시 */}
        {selectedSubCategoryId !== '전체' && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            isOpen
              ? 'bg-white/25 text-white'
              : `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`
          }`}>
            {selectedCategoryCount}
          </span>
        )}
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] sm:w-[400px] max-h-[500px] overflow-y-auto z-50 bg-white rounded-2xl shadow-2xl border border-gray-200/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg
                  className={`w-5 h-5 ${COLORS.primary.text}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <h3 className={`text-sm font-semibold ${COLORS.text.primaryClass}`}>
                  카테고리 필터
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg ${COLORS.text.secondaryClass} hover:${COLORS.primary.text} hover:bg-[#1E7F4F]/10 transition-colors`}
                aria-label="닫기"
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
            </div>

            {/* 카테고리 목록 */}
            <div className="space-y-2">
              {/* 전체 버튼 */}
              <CategoryButton
                id="전체"
                name="전체"
                count={products.length}
                isSelected={selectedSubCategoryId === '전체'}
                onClick={() => handleCategorySelect('전체')}
                variant="default"
                className="w-full"
              />

              {/* 카테고리 버튼들 */}
              {availableCategories.map(({ id, name, count }) => (
                <CategoryButton
                  key={id}
                  id={id}
                  name={name}
                  count={count}
                  isSelected={selectedSubCategoryId === id}
                  onClick={() => handleCategorySelect(id)}
                  variant="default"
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
