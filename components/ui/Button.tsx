import type { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { COLORS } from '@/lib/constants'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

// Button과 Link의 공통 props만 추출
type CommonProps = {
  className?: string
  children: ReactNode
}

type ButtonOnlyProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | 'variant' | 'size'>
type LinkOnlyProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps, keyof CommonProps>

interface ButtonProps extends CommonProps {
  /** 버튼 변형 */
  variant?: ButtonVariant
  /** 버튼 크기 */
  size?: ButtonSize
  /** Link 컴포넌트로 렌더링할 경우 href */
  href?: string
  /** Link 컴포넌트로 렌더링할 경우 */
  asLink?: boolean
  /** Button 전용 props (onClick 등) */
  buttonProps?: ButtonOnlyProps
  /** Link 전용 props */
  linkProps?: LinkOnlyProps
}

// Button props를 위한 타입: buttonProps와 직접 props 병합
type MergedButtonProps = ButtonProps & ButtonOnlyProps

const variantClasses = {
  primary: `${COLORS.primary.bg} text-white hover:${COLORS.primary.bgLight} focus:ring-2 focus:ring-[#1E7F4F] focus:ring-offset-2`,
  secondary: `bg-white hover:bg-gray-50 ${COLORS.primary.text} font-semibold`,
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
  buttonProps,
  linkProps,
  ...restProps
}: MergedButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none min-h-[44px] active:translate-y-0'
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  // buttonProps와 restProps 병합 (restProps가 우선)
  const mergedButtonProps = { ...buttonProps, ...restProps }

  if (asLink && href) {
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...mergedButtonProps}>
      {children}
    </button>
  )
}
