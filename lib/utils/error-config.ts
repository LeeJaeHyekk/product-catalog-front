/**
 * 에러 타입별 설정
 * 
 * 각 에러 타입에 대해 동적으로 적용되는 UI 설정을 정의합니다.
 */

import { AppError } from '../errors/AppError'
import { ApiError } from '../errors/ApiError'
import { ValidationError } from '../errors/ValidationError'
import { NotFoundError } from '../errors/NotFoundError'

/**
 * 에러 타입별 UI 설정
 */
export interface ErrorConfig {
  /** 에러 제목 */
  title: string
  /** 에러 설명 */
  description: string
  /** 아이콘 (이모지 또는 텍스트) */
  icon: string
  /** 에러 이미지 경로 */
  image?: string
  /** 주요 색상 (HEX 값) */
  color: {
    /** 배경색 HEX */
    bg: string
    /** 텍스트 색상 HEX */
    text: string
    /** 버튼 배경색 HEX */
    button: string
    /** 버튼 호버 색상 HEX */
    buttonHover: string
  }
  /** 권장 액션 */
  actions: {
    /** 다시 시도 가능 여부 */
    canRetry: boolean
    /** 홈으로 이동 가능 여부 */
    canGoHome: boolean
    /** 이전 페이지로 이동 가능 여부 */
    canGoBack?: boolean
    /** 검색 기능 사용 가능 여부 */
    canSearch?: boolean
    /** 새로고침 가능 여부 */
    canReload: boolean
  }
}

/**
 * 에러 클래스 생성자 타입
 */
type ErrorConstructor = typeof AppError | typeof ApiError | typeof ValidationError | typeof NotFoundError

/**
 * 에러 타입별 설정 맵
 * 
 * 프로젝트 브랜드 컬러 시스템에 맞춘 디자인:
 * - Primary Green (#1E7F4F) - 신뢰감 있는 메인 컬러
 * - Accent Yellow (#F2C94C) - 경고/주의
 * - Background Off White (#F7F8F7) - 깔끔한 배경
 * - Text Dark Gray (#1F2933) - 가독성 높은 텍스트
 */
const errorConfigMap: Map<ErrorConstructor, ErrorConfig> = new Map([
  [
    ApiError,
    {
      title: '일시적인 연결 문제',
      description: '서버와의 통신 중 잠깐 문제가 생겼어요. 잠시 후 다시 시도해주시면 정상적으로 작동할 거예요.',
      icon: '⚠️',
      image: '/error/500Error.gif',
      color: {
        bg: '#F7F8F7',
        text: '#1F2933',
        button: '#1E7F4F',
        buttonHover: '#2E9F6B',
      },
      actions: {
        canRetry: true,
        canGoHome: true,
        canReload: true,
      },
    },
  ],
  [
    ValidationError,
    {
      title: '입력 정보 확인이 필요해요',
      description: '입력하신 내용을 다시 한 번 확인해주세요. 형식이 맞지 않아 처리할 수 없어요.',
      icon: '📋',
      image: '/error/400Error.gif',
      color: {
        bg: '#F7F8F7',
        text: '#1F2933',
        button: '#F2C94C',
        buttonHover: '#E5B83D',
      },
      actions: {
        canRetry: false,
        canGoHome: true,
        canReload: false,
      },
    },
  ],
  [
    NotFoundError,
    {
      title: '길을 잃으셨어요',
      description: '찾으시는 페이지가 사라졌거나 주소가 잘못되었어요. 하지만 괜찮아요, 돌아갈 곳은 있어요.',
      icon: '',
      image: '/error/404Error.gif',
      color: {
        bg: '#F7F8F7',
        text: '#1F2933',
        button: '#1E7F4F',
        buttonHover: '#2E9F6B',
      },
      actions: {
        canRetry: false,
        canGoHome: true,
        canGoBack: true,
        canSearch: true,
        canReload: false,
      },
    },
  ],
])

/**
 * 기본 에러 설정 (알 수 없는 에러)
 * 
 * 프로젝트 브랜드 컬러를 사용한 신뢰감 있는 디자인
 */
const defaultErrorConfig: ErrorConfig = {
  title: '예상치 못한 상황이 발생했어요',
  description: '일시적인 문제가 생긴 것 같아요. 잠시 후 다시 시도해주시면 정상적으로 작동할 거예요.',
  icon: '⚠️',
  image: '/error/defaultError.png',
  color: {
    bg: '#F7F8F7',
    text: '#1F2933',
    button: '#1E7F4F',
    buttonHover: '#2E9F6B',
  },
  actions: {
    canRetry: true,
    canGoHome: true,
    canReload: true,
  },
}

/**
 * 에러 타입에 따른 설정을 가져옵니다.
 * 
 * @param error 에러 인스턴스
 * @returns 에러 타입별 설정
 */
export function getErrorConfig(error: Error): ErrorConfig {
  // AppError의 서브클래스인지 확인
  if (error instanceof AppError) {
    // NotFoundError는 항상 404 이미지 사용
    if (error instanceof NotFoundError) {
      const config = errorConfigMap.get(NotFoundError)
      if (config) return config
    }
    
    // ValidationError는 항상 400 이미지 사용
    if (error instanceof ValidationError) {
      const config = errorConfigMap.get(ValidationError)
      if (config) return config
    }
    
    // ApiError는 statusCode에 따라 이미지 선택
    if (error instanceof ApiError) {
      const baseConfig = errorConfigMap.get(ApiError)
      if (baseConfig) {
        // statusCode에 따라 다른 이미지 사용 (기본은 500)
        let image = baseConfig.image
        if (error.statusCode === 400) {
          image = '/error/400Error.gif'
        } else if (error.statusCode === 404) {
          image = '/error/404Error.gif'
        } else if (error.statusCode === 500) {
          image = '/error/500Error.gif'
        }
        
        return {
          ...baseConfig,
          image,
        }
      }
    }
    
    // 에러 타입별 설정 찾기
    for (const [ErrorClass, config] of errorConfigMap.entries()) {
      if (error instanceof ErrorClass) {
        return config
      }
    }
    
    // AppError이지만 특정 타입이 아닌 경우
    return {
      ...defaultErrorConfig,
      title: '문제가 발생했습니다',
      description: error.message || defaultErrorConfig.description,
    }
  }
  
  // 알 수 없는 에러
  return defaultErrorConfig
}

/**
 * 에러 타입 이름을 가져옵니다.
 * 
 * @param error 에러 인스턴스
 * @returns 에러 타입 이름
 */
export function getErrorTypeName(error: Error): string {
  if (error instanceof ApiError) return 'ApiError'
  if (error instanceof ValidationError) return 'ValidationError'
  if (error instanceof NotFoundError) return 'NotFoundError'
  if (error instanceof AppError) return 'AppError'
  return 'UnknownError'
}
