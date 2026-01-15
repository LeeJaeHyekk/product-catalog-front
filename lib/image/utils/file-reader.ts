/**
 * 이미지 파일 읽기 유틸리티
 */

import { readdir } from 'fs/promises'
import { join } from 'path'
import type { ImageFile } from '../types'

/**
 * 이미지 파일 확장자 목록
 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] as const

let cachedImageFiles: ImageFile[] | null = null

/**
 * 이미지 파일 캐시 초기화
 */
export function clearImageCache(): void {
  cachedImageFiles = null
}

/**
 * 이미지 파일 목록 가져오기 (서버 사이드)
 */
export async function getImageFiles(): Promise<ImageFile[]> {
  if (cachedImageFiles) {
    return cachedImageFiles
  }
  
  try {
    const productsPageDir = join(process.cwd(), 'public', 'productsPage')
    const files = await readdir(productsPageDir, { encoding: 'utf8' })
    
    const imageFiles: ImageFile[] = files
      .filter(file => {
        if (!file || typeof file !== 'string') {
          return false
        }
        
        const lastDot = file.lastIndexOf('.')
        if (lastDot === -1 || lastDot === 0) {
          return false
        }
        
        const ext = file.toLowerCase().substring(lastDot)
        return IMAGE_EXTENSIONS.includes(ext as typeof IMAGE_EXTENSIONS[number])
      })
      .map(file => {
        const lastDot = file.lastIndexOf('.')
        const nameWithoutExt = file.substring(0, lastDot)
        const extension = file.substring(lastDot)
        const encodedFilename = /[^\w.-]/.test(file) ? encodeURIComponent(file) : file
        
        return {
          filename: file,
          nameWithoutExt,
          extension,
          fullPath: `/productsPage/${encodedFilename}`,
        }
      })
      .filter(file => file.nameWithoutExt.length > 0)
    
    cachedImageFiles = imageFiles
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image Matcher] Found ${imageFiles.length} image files`)
      console.log(`[Image Matcher] Sample files:`, imageFiles.slice(0, 5).map(f => f.filename))
    }
    
    return imageFiles
  } catch (error) {
    console.error('Failed to read image files:', error)
    return []
  }
}
