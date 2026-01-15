export interface Product {
  index: number   // 0 ~ 49
  name: string
  price: number
  current: number // 현재까지 주문된 수량
  limit: number   // 최대 제공 가능 수량
  image: string | null // 항상 null (레이아웃 공간은 확보)
}

export interface ProcessedProduct extends Product {
  isSoldOut: boolean // 파생 상태 (계산 결과)
}
