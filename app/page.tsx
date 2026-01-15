import Link from 'next/link'
import { Container } from '@/components/layout'

export default function Home() {
  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">상품 카탈로그</h1>
          <p className="text-gray-600 mb-8">상품 목록을 확인하세요</p>
          <Link
            href="/products"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 inline-block"
          >
            상품 목록 보기
          </Link>
        </div>
      </div>
    </Container>
  )
}
