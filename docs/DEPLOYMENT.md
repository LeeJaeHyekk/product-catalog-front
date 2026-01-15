# 배포 가이드

## Vercel 배포 설정

### 1. 프로젝트 설정

Vercel에서 프로젝트를 생성할 때 다음 설정을 사용하세요:

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./`
- **Build Command**: `npm run build` (자동 감지)
- **Output Directory**: Next.js default (자동 감지)
- **Install Command**: `npm install` (자동 감지)

### 2. 배포 프로세스

1. GitHub 레포지토리를 Vercel에 연결
2. main 브랜치 선택
3. 자동으로 빌드 및 배포됩니다

### 3. 환경 변수

현재 프로젝트는 필수 환경 변수가 없습니다. 필요 시 Vercel 대시보드에서 설정할 수 있습니다.

### 4. 배포 확인

배포가 완료되면 Vercel이 자동으로 배포 URL을 생성합니다.

## 문제 해결

### 빌드 실패 시

1. 빌드 로그에서 에러 확인
2. TypeScript 타입 에러 확인
3. 의존성 문제 확인

### 참고

- `vercel.json` 파일이 있어 Vercel이 자동으로 설정을 읽습니다
- Next.js는 자동 감지되므로 추가 설정 없이 배포 가능합니다
