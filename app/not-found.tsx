'use client'

import { DynamicErrorPage } from '@/components/error'
import { NotFoundError } from '@/lib/errors'

/**
 * 글로벌 404 페이지
 * 
 * 존재하지 않는 경로로 접근했을 때 표시됩니다.
 * 프로젝트 브랜드 디자인 시스템에 맞춘 동적 에러 페이지를 사용합니다.
 */
export default function NotFound() {
  // NotFoundError를 시뮬레이션하여 DynamicErrorPage에 전달
  const notFoundError = new NotFoundError('페이지')
  
  return (
    <DynamicErrorPage
      error={notFoundError}
      customTitle="페이지를 찾을 수 없습니다"
    />
  )
}
