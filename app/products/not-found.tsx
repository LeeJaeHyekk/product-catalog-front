import { Container } from '@/components/layout'

/**
 * 상품 도메인 404 페이지
 * 
 * 상품 관련 리소스를 찾을 수 없을 때 표시됩니다.
 */
export default function ProductsNotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">상품을 찾을 수 없습니다.</h1>
        <p className="text-gray-600">요청하신 상품이 존재하지 않습니다.</p>
        <a
          href="/products"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          상품 목록으로 돌아가기
        </a>
      </div>
    </Container>
  )
}
