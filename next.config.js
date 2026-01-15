/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Turbopack 설정 (Next.js 16 기본)
  // kiwi-nlp는 선택적 의존성이므로 동적 import로 처리되어 빌드 시 경고만 발생 (에러 아님)
  
  // Webpack 설정 (Turbopack 사용 시 무시되지만, 호환성을 위해 유지)
  // Turbopack을 사용하지 않으려면 --webpack 플래그 사용
  webpack: (config, { isServer }) => {
    // 서버와 클라이언트 번들 분리 명확화
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // 모듈 해석 최적화
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }
    
    // 선택적 의존성 처리 (kiwi-nlp는 선택적이므로 빌드 에러 방지)
    config.externals = config.externals || []
    if (isServer) {
      // 서버 사이드에서만 kiwi-nlp를 optional로 처리
      config.externals.push({
        'kiwi-nlp': 'commonjs kiwi-nlp',
      })
    }
    
    // 모듈 해석 캐시 최적화
    config.cache = {
      ...config.cache,
      type: 'filesystem',
    }
    
    return config
  },
  
  // 실험적 기능
  experimental: {
    // 패키지 import 최적화 (트리 쉐이킹)
    optimizePackageImports: [
      '@tanstack/react-query',
    ],
  },
  
  images: {
    // 이미지 최적화 설정
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 허용된 quality 값 (Next.js 캐시 안정성을 위해 제한)
    qualities: [75, 85],
    // 외부 이미지 도메인 (필요 시 추가)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
