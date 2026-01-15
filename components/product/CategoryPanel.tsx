'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import type { EnrichedProduct } from '@/lib/product'
import { getAvailableSubCategories } from '@/lib/product'
import { COLORS } from '@/lib/constants'
import { useMemoClassName } from '@/lib/hooks'
import { isArray } from '@/lib/validation'

interface CategoryPanelProps {
  /** 상품 목록 (카테고리 정보 포함) */
  products: EnrichedProduct[]
  /** 선택된 서브 카테고리 ID */
  selectedSubCategoryId: string | '전체'
  /** 카테고리 변경 핸들러 */
  onCategoryChange: (subCategoryId: string | '전체') => void
}

/**
 * 카테고리 패널 컴포넌트
 * 
 * 최소화 상태: 이모티콘 버튼만 표시
 * 최대화 상태: 검색 바 아래에 슬라이드 다운되는 패널로 카테고리 목록 표시
 */
export function CategoryPanel({
  products,
  selectedSubCategoryId,
  onCategoryChange,
}: CategoryPanelProps) {
  // 안전성: products prop 검증
  if (!isArray(products)) {
    console.warn('CategoryPanel: products must be an array')
    return null
  }

  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 사용 가능한 카테고리 목록 (실제 상품에 존재하는 것만)
  const availableCategories = useMemo(() => {
    try {
      return getAvailableSubCategories(products)
    } catch (error) {
      console.error('CategoryPanel: Failed to get available categories', error)
      return []
    }
  }, [products])

  // 선택된 카테고리 이름 찾기
  const selectedCategoryName = useMemo(() => {
    if (selectedSubCategoryId === '전체') {
      return '전체'
    }
    const category = availableCategories.find(cat => cat.id === selectedSubCategoryId)
    return category?.name || '전체'
  }, [selectedSubCategoryId, availableCategories])

  // 외부 클릭 시 패널 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // ESC 키로 닫기
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])


  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const handleCategorySelect = (subCategoryId: string | '전체') => {
    try {
      // 안전성: 유효한 subCategoryId인지 확인
      if (subCategoryId !== '전체' && typeof subCategoryId !== 'string') {
        console.warn('CategoryPanel: Invalid subCategoryId', subCategoryId)
        return
      }
      
      // 안전성: 선택된 카테고리가 실제로 존재하는지 확인
      if (subCategoryId !== '전체') {
        const categoryExists = availableCategories.some(cat => cat.id === subCategoryId)
        if (!categoryExists) {
          console.warn('CategoryPanel: Selected category does not exist', subCategoryId)
          return
        }
      }
      
      onCategoryChange(subCategoryId)
      setIsOpen(false)
    } catch (error) {
      console.error('CategoryPanel: Error in handleCategorySelect', error)
      // 에러 발생 시에도 패널은 닫기
      setIsOpen(false)
    }
  }

  // 버튼 상태 결정
  const hasSelectedCategory = selectedSubCategoryId !== '전체'
  const showIconOnly = !hasSelectedCategory && !isOpen
  const showCategoryName = hasSelectedCategory && !isOpen

  const buttonClassName = useMemoClassName(
    'flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 border-2 whitespace-nowrap',
    {
      [`${COLORS.primary.bg} text-white border-[#1E7F4F] shadow-lg shadow-[#1E7F4F]/25`]: isOpen || hasSelectedCategory,
      [`${COLORS.background.bgMain} ${COLORS.text.primaryClass} border-gray-200 hover:border-[#1E7F4F]/40 hover:${COLORS.primary.bgWithOpacity(10)}`]: !isOpen && !hasSelectedCategory,
      'justify-center': showCategoryName, // 카테고리 이름만 표시될 때 중앙 정렬
    }
  )

  // 배지 클래스명 (상태값에 따라 조건부 스타일 적용)
  const badgeClassName = useMemo(() => {
    const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium'
    
    // 버튼이 활성화된 상태(녹색 배경)일 때: 흰색 배지
    if (isOpen || hasSelectedCategory) {
      return `${baseClasses} bg-white/25 text-white`
    }
    
    // 버튼이 비활성화된 상태일 때: 녹색 배지
    return `${baseClasses} bg-[#1E7F4F]/15 text-[#1E7F4F]`
  }, [isOpen, hasSelectedCategory])

  return (
    <div className="relative z-50">
      {/* 카테고리 버튼 */}
      <button
        ref={buttonRef}
        type="button"
        onClick={togglePanel}
        className={buttonClassName}
        aria-label="카테고리 필터"
        aria-expanded={isOpen}
      >
        {/* 필터 아이콘 - 초기 상태 또는 패널이 열려있을 때만 표시 */}
        {(showIconOnly || isOpen) && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
        )}
        
        {/* 선택된 카테고리 이름 - 카테고리가 선택되고 패널이 닫혀있을 때만 표시 */}
        {showCategoryName && (
          <span className="font-medium">
            {selectedCategoryName}
          </span>
        )}
        
        {/* 선택된 카테고리가 있으면 배지 표시 */}
        {hasSelectedCategory && (
          <span className={badgeClassName}>
            {availableCategories.find(cat => cat.id === selectedSubCategoryId)?.count || 0}
          </span>
        )}
      </button>

      {/* 슬라이드 다운 패널 */}
      <div
        ref={panelRef}
        className={`absolute top-full right-0 mt-2 w-[90vw] sm:w-[500px] md:w-[600px] max-h-[70vh] overflow-y-auto bg-white backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200/60 transition-all duration-300 ease-out ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
        style={{
          zIndex: 9999,
          minWidth: '320px',
          display: isOpen ? 'block' : 'none',
        }}
      >
        <div className="p-5">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${COLORS.primary.bgWithOpacity(10)}`}>
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
              </div>
              <div>
                <h3 className={`text-base font-bold ${COLORS.text.primaryClass}`}>
                  카테고리 필터
                </h3>
                <p className={`text-xs ${COLORS.text.secondaryClass} mt-0.5`}>
                  원하는 카테고리를 선택하세요
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-lg ${COLORS.text.secondaryClass} hover:${COLORS.primary.text} hover:bg-[#1E7F4F]/10 transition-all duration-200`}
              aria-label="닫기"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 카테고리 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {/* 전체 버튼 */}
            <button
              onClick={() => handleCategorySelect('전체')}
              className={`group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 text-left border-2 transform hover:scale-105 active:scale-95 ${
                selectedSubCategoryId === '전체'
                  ? `${COLORS.primary.bg} text-white border-[#1E7F4F] shadow-lg shadow-[#1E7F4F]/25`
                  : `${COLORS.background.bgMain} ${COLORS.text.primaryClass} border-gray-200/60 hover:border-[#1E7F4F]/40 hover:${COLORS.primary.bgWithOpacity(10)} shadow-sm hover:shadow-md`
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm">전체</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                  selectedSubCategoryId === '전체'
                    ? 'bg-white/30 text-white'
                    : `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`
                }`}>
                  {Array.isArray(products) ? products.length : 0}
                </span>
              </div>
            </button>

            {/* 카테고리 버튼들 */}
            {availableCategories.length === 0 ? (
              <div className="col-span-full text-center py-4">
                <p className={`text-sm ${COLORS.text.secondaryClass}`}>
                  사용 가능한 카테고리가 없습니다.
                </p>
              </div>
            ) : (
              availableCategories.map(({ id, name, count }) => {
                // 안전성: id, name, count 유효성 검증
                if (!id || typeof id !== 'string' || !name || typeof name !== 'string') {
                  return null
                }
                
                const validCount = typeof count === 'number' && count >= 0 && isFinite(count) ? count : 0
                
                return (
                  <button
                    key={id}
                    onClick={() => handleCategorySelect(id)}
                    className={`group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 text-left border-2 transform hover:scale-105 active:scale-95 ${
                      selectedSubCategoryId === id
                        ? `${COLORS.primary.bg} text-white border-[#1E7F4F] shadow-lg shadow-[#1E7F4F]/25`
                        : `${COLORS.background.bgMain} ${COLORS.text.primaryClass} border-gray-200/60 hover:border-[#1E7F4F]/40 hover:${COLORS.primary.bgWithOpacity(10)} shadow-sm hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm truncate">{name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                        selectedSubCategoryId === id
                          ? 'bg-white/30 text-white'
                          : `${COLORS.primary.bgWithOpacity(15)} ${COLORS.primary.text}`
                      }`}>
                        {validCount}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
