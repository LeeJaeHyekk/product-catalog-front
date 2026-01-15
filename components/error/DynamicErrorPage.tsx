'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getErrorConfig } from '@/lib/utils/error-config'
import { COLORS } from '@/lib/constants'
import { NotFoundError } from '@/lib/errors'

interface DynamicErrorPageProps {
  error: Error & { digest?: string }
  onReset?: () => void
  customTitle?: string
}

/**
 * 동적 에러 페이지 컴포넌트
 * 
 * 프로젝트 브랜드 디자인 시스템에 맞춘 에러 페이지입니다.
 * - 실용성 중심의 깔끔한 디자인
 * - 신뢰감 있는 브랜드 컬러 사용
 * - 에러 타입별 적절한 메시지와 액션 제공
 * 
 * 디자인 원칙:
 * - 장식보다 기능
 * - 명확한 정보 전달
 * - 일관된 브랜드 컬러 사용
 */
export function DynamicErrorPage({
  error,
  onReset,
  customTitle,
}: DynamicErrorPageProps) {
  const router = useRouter()
  const config = getErrorConfig(error)
  const isNotFoundError = error instanceof NotFoundError
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const handleGoHome = () => {
    router.push('/')
  }
  
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }
  
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: config.color.bg }}
    >
      <div 
        className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 rounded-xl border border-gray-200 shadow-sm max-w-2xl w-full mx-auto"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* 에러 이미지 */}
        {config.image && (
          <div className="relative w-full max-w-md h-auto mb-2">
            <Image
              src={config.image}
              alt={customTitle || config.title}
              width={600}
              height={400}
              className="w-full h-auto object-contain"
              loading="eager"
              unoptimized={config.image.endsWith('.gif')}
            />
          </div>
        )}

        {/* 에러 아이콘 (이미지가 없을 때만 표시) */}
        {!config.image && config.icon && (
          <div className="text-5xl md:text-6xl mb-2">
            {config.icon}
          </div>
        )}

        {/* 에러 제목 */}
        <h1 
          className="text-2xl md:text-3xl font-bold text-center"
          style={{ color: config.color.text }}
        >
          {customTitle || config.title}
        </h1>

        {/* 에러 설명 */}
        <p 
          className="text-base md:text-lg text-center max-w-md leading-relaxed"
          style={{ color: COLORS.text.secondary }}
        >
          {isNotFoundError ? config.description : (error.message || config.description)}
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-wrap gap-3 justify-center mt-4 w-full">
          {/* Secondary 버튼: 이전 페이지 (404 전용) */}
          {config.actions.canGoBack && (
            <button
              onClick={handleGoBack}
              className="bg-white border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out shadow-sm hover:shadow-md min-w-[140px]"
              style={{ color: COLORS.text.secondary }}
            >
              이전 페이지
            </button>
          )}

          {/* Primary 버튼: 홈으로 이동 */}
          {config.actions.canGoHome && (
            <button
              onClick={handleGoHome}
              className="text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out shadow-md hover:shadow-lg min-w-[140px]"
              style={{ 
                backgroundColor: config.color.button 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = config.color.buttonHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = config.color.button
              }}
            >
              홈으로 가기
            </button>
          )}
          
          {/* 다시 시도 버튼 (에러 복구용) */}
          {config.actions.canRetry && onReset && (
            <button
              onClick={onReset}
              className="text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out shadow-md hover:shadow-lg min-w-[140px]"
              style={{ 
                backgroundColor: config.color.button 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = config.color.buttonHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = config.color.button
              }}
            >
              다시 시도
            </button>
          )}
          
          {/* 새로고침 버튼 */}
          {config.actions.canReload && (
            <button
              onClick={handleReload}
              className="bg-white border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out shadow-sm hover:shadow-md min-w-[140px]"
              style={{ color: COLORS.text.secondary }}
            >
              페이지 새로고침
            </button>
          )}
        </div>

        {/* 개발 환경에서만 상세 에러 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-gray-50 rounded-lg text-left w-full border border-gray-200">
            <summary 
              className="cursor-pointer text-sm font-semibold mb-2 transition-colors"
              style={{ color: COLORS.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.text.secondary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = COLORS.text.primary
              }}
            >
              에러 상세 정보 (개발 환경)
            </summary>
            <div className="mt-3 space-y-3">
              {isMounted && error.stack && (
                <div>
                  <p 
                    className="text-xs font-semibold mb-2"
                    style={{ color: COLORS.text.secondary }}
                  >
                    Stack Trace:
                  </p>
                  <pre className="text-xs overflow-auto bg-white p-3 rounded border border-gray-200 font-mono">
                    {error.stack}
                  </pre>
                </div>
              )}
              {error.digest && (
                <div>
                  <p 
                    className="text-xs font-semibold mb-2"
                    style={{ color: COLORS.text.secondary }}
                  >
                    Digest:
                  </p>
                  <code className="text-xs bg-white p-2 rounded border border-gray-200 font-mono block">
                    {error.digest}
                  </code>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
