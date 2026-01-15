'use client'

import { DynamicErrorPage } from '@/components/error'
import { NotFoundError } from '@/lib/errors'

/**
 * 상품 도메인 404 페이지
 * 
 * 상품 관련 리소스를 찾을 수 없을 때 표시됩니다.
 * 프로젝트 브랜드 디자인 시스템에 맞춘 동적 에러 페이지를 사용합니다.
 */
export default function ProductsNotFound() {
  // NotFoundError를 시뮬레이션하여 DynamicErrorPage에 전달
  const notFoundError = new NotFoundError('상품')
  
  return (
    <DynamicErrorPage
      error={notFoundError}
      customTitle="상품을 찾을 수 없습니다"
    />
  )
}
