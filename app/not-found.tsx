import { Container } from '@/components/layout'

/**
 * 글로벌 404 페이지
 * 
 * 존재하지 않는 경로로 접근했을 때 표시됩니다.
 */
export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다.</h1>
        <p className="text-gray-600">요청하신 페이지가 존재하지 않습니다.</p>
        <a
          href="/"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </Container>
  )
}
