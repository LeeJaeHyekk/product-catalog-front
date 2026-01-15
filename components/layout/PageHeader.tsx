import { COLORS } from '@/lib/constants'

interface PageHeaderProps {
  /** 페이지 제목 */
  title: string
  /** 서브 타이틀/설명 */
  description?: string
  /** 브랜드 컬러 포인트 라인 표시 여부 (기본값: true) */
  showBrandLine?: boolean
  /** 텍스트 컬러 타입: 'dark' (어두운 텍스트) 또는 'light' (밝은 텍스트) */
  textColor?: 'dark' | 'light'
}

/**
 * 페이지 헤더 컴포넌트
 * 
 * 일관된 페이지 헤더 구조 제공
 */
export function PageHeader({
  title,
  description,
  showBrandLine = true,
  textColor = 'dark',
}: PageHeaderProps) {
  const textColorClass = textColor === 'dark' 
    ? COLORS.text.primaryClass 
    : 'text-white'
  const descriptionColorClass = textColor === 'dark'
    ? COLORS.text.secondaryClass
    : 'text-white/90'

  return (
    <div className="pt-8 pb-6">
      <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 ${textColorClass}`}>
        {title}
      </h1>
      {showBrandLine && (
        <div className={`w-16 h-1 ${COLORS.primary.bg} rounded-full mb-4`} />
      )}
      {description && (
        <p className={`text-lg md:text-xl ${descriptionColorClass}`}>
          {description}
        </p>
      )}
    </div>
  )
}
