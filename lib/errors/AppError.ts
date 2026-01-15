/**
 * 베이스 에러 클래스
 * 
 * 모든 커스텀 에러의 부모 클래스
 * instanceof AppError로 의도된 에러 vs 버그 구분 가능
 */
export abstract class AppError extends Error {
  readonly statusCode: number
  readonly isOperational: boolean

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = true
    
    // Error.captureStackTrace가 있으면 스택 트레이스 개선
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
