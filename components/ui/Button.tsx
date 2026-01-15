import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { COLORS } from '@/lib/constants'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 변형 */
  variant?: ButtonVariant
  /** 버튼 크기 */
  size?: ButtonSize
  /** 버튼 내용 */
  children: ReactNode
  /** Link 컴포넌트로 렌더링할 경우 href */
  href?: string
  /** Link 컴포넌트로 렌더링할 경우 */
  asLink?: boolean
}

const variantClasses = {
  primary: `${COLORS.primary.bg} text-white hover:${COLORS.primary.bgLight} focus:ring-2 focus:ring-[#1E7F4F] focus:ring-offset-2`,
  secondary: `${COLORS.background.bgWhiteWithOpacity(90)} hover:bg-white ${COLORS.primary.text} font-semibold`,
  outline: `border-2 ${COLORS.primary.border} ${COLORS.primary.text} hover:${COLORS.primary.bg} hover:text-white`,
} as const

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const

/**
 * 버튼 컴포넌트
 * 
 * 일관된 버튼 스타일 제공
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  asLink = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none min-h-[44px]'
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (asLink && href) {
    return (
      <Link href={href} className={classes} {...(props as any)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
