/**
 * 디자인 토큰 정의
 * 
 * 브랜드 정체성에 맞는 디자인 시스템의 토큰을 정의합니다.
 * Tailwind CSS와 함께 사용하여 일관된 디자인을 유지합니다.
 * 
 * 디자인 토큰 설계 원칙:
 * - 모든 UI 값은 토큰에서 파생
 * - 임의 px 사용 금지
 * - Tailwind 커스텀 값은 토큰 기준
 */

export const designTokens = {
  colors: {
    primary: {
      main: '#1E7F4F',
      light: '#2E9F6B',
      dark: '#0F3D2E',
    },
    secondary: {
      main: '#0F3D2E',
    },
    accent: {
      main: '#F2C94C',
    },
    background: {
      main: '#F7F8F7',
      white: '#FFFFFF',
    },
    text: {
      primary: '#1F2933',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    status: {
      success: '#1E7F4F',
      warning: '#F2C94C',
      error: '#DC2626',
      info: '#2563EB',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Pretendard, SUIT, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      regular: 400,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    none: 'none',
  },
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const

/**
 * Tailwind CSS 클래스 매핑
 * 
 * 디자인 토큰을 Tailwind CSS 클래스로 변환하는 헬퍼 함수
 */
export const tailwindClasses = {
  // 컬러
  primary: {
    bg: 'bg-[#1E7F4F]',
    text: 'text-[#1E7F4F]',
    border: 'border-[#1E7F4F]',
  },
  accent: {
    bg: 'bg-[#F2C94C]',
    text: 'text-[#F2C94C]',
    border: 'border-[#F2C94C]',
  },
  // 타이포그래피
  heading: {
    h1: 'font-bold text-2xl md:text-3xl',
    h2: 'font-semibold text-xl md:text-2xl',
    h3: 'font-semibold text-lg md:text-xl',
  },
  // 레이아웃
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    mobile: 'grid grid-cols-1 gap-4',
    tablet: 'md:grid-cols-2 gap-4',
    desktop: 'lg:grid-cols-3 xl:grid-cols-4 gap-4',
  },
} as const
