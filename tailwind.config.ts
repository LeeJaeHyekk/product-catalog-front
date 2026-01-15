/**
 * Tailwind CSS 4 설정 파일
 * 
 * Tailwind CSS 4에서는 대부분의 설정을 CSS 파일의 @theme 디렉티브에서 정의합니다.
 * 이 파일은 content 경로만 정의합니다.
 * 
 * 커스텀 컬러, 폰트 등은 app/globals.css의 @theme 블록에서 정의합니다.
 */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Tailwind CSS 4에서는 theme 설정을 CSS의 @theme 디렉티브로 이동
  // app/globals.css의 @theme 블록을 참조하세요
}
export default config
