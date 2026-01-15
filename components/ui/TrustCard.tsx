interface TrustCardProps {
  /** 카드 제목/숫자 */
  title: string
  /** 카드 설명 */
  description: string
}

/**
 * 신뢰 요소 카드 컴포넌트
 * 
 * 메인 페이지의 신뢰 요소를 표시하는 카드
 */
export function TrustCard({ title, description }: TrustCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="text-3xl font-bold text-white mb-2">{title}</div>
      <div className="text-white/90 text-sm">{description}</div>
    </div>
  )
}
