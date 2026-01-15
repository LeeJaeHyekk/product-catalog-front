/**
 * 컬러 상수 정의
 * 
 * design-tokens.ts의 컬러 값을 Tailwind CSS 클래스로 변환한 헬퍼
 * 하드코딩된 컬러 값을 제거하고 일관된 컬러 시스템 사용
 */

import { designTokens } from '@/docs/design/design-tokens'

/**
 * 브랜드 컬러
 */
export const COLORS = {
  // Primary (메인 브랜드 컬러)
  primary: {
    main: designTokens.colors.primary.main, // #1E7F4F
    light: designTokens.colors.primary.light, // #2E9F6B
    dark: designTokens.colors.primary.dark, // #0F3D2E
    // Tailwind 클래스
    bg: 'bg-[#1E7F4F]',
    bgLight: 'bg-[#2E9F6B]',
    bgDark: 'bg-[#0F3D2E]',
    text: 'text-[#1E7F4F]',
    textLight: 'text-[#2E9F6B]',
    border: 'border-[#1E7F4F]',
    // 투명도 변형
    bgWithOpacity: (opacity: number) => `bg-[#1E7F4F]/${opacity}`,
    bgLightWithOpacity: (opacity: number) => `bg-[#2E9F6B]/${opacity}`,
  },
  
  // Accent (강조 컬러)
  accent: {
    main: designTokens.colors.accent.main, // #F2C94C
    bg: 'bg-[#F2C94C]',
    text: 'text-[#F2C94C]',
    border: 'border-[#F2C94C]',
    bgWithOpacity: (opacity: number) => `bg-[#F2C94C]/${opacity}`,
  },
  
  // Text (텍스트 컬러)
  text: {
    primary: designTokens.colors.text.primary, // #1F2933
    secondary: designTokens.colors.text.secondary, // #6B7280
    tertiary: designTokens.colors.text.tertiary, // #9CA3AF
    // Tailwind 클래스
    primaryClass: 'text-[#1F2933]',
    secondaryClass: 'text-[#6B7280]',
    tertiaryClass: 'text-[#9CA3AF]',
  },
  
  // Background
  background: {
    main: designTokens.colors.background.main, // #F7F8F7
    white: designTokens.colors.background.white, // #FFFFFF
    bgMain: 'bg-[#F7F8F7]',
    bgWhite: 'bg-white',
    bgWhiteWithOpacity: (opacity: number) => `bg-white/${opacity}`,
  },
  
  // Status
  status: {
    success: designTokens.colors.status.success, // #1E7F4F
    warning: designTokens.colors.status.warning, // #F2C94C
    error: designTokens.colors.status.error, // #DC2626
    info: designTokens.colors.status.info, // #2563EB
  },
} as const
