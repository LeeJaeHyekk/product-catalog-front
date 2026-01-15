import { AppError } from './AppError'

/**
 * Not Found 에러 클래스
 * 
 * 리소스를 찾을 수 없을 때 발생하는 에러를 나타냅니다.
 */
export class NotFoundError extends AppError {
  constructor(resource = '리소스') {
    super(`${resource}를 찾을 수 없습니다.`, 404)
  }
}
