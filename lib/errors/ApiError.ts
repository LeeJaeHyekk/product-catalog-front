import { AppError } from './AppError'

/**
 * API 에러 클래스
 * 
 * 서버 요청 중 발생하는 에러를 나타냅니다.
 */
export class ApiError extends AppError {
  constructor(
    message = '서버 요청 중 오류가 발생했습니다.',
    statusCode = 500
  ) {
    super(message, statusCode)
  }
}
