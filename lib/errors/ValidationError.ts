import { AppError } from './AppError'

/**
 * 검증 에러 클래스
 * 
 * 데이터 검증 실패 시 발생하는 에러를 나타냅니다.
 */
export class ValidationError extends AppError {
  constructor(message = '잘못된 데이터 형식입니다.') {
    super(message, 400)
  }
}
