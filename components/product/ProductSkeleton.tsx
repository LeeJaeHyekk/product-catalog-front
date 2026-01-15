import { STYLES } from '@/lib/styles'

export function ProductSkeleton() {
  return (
    <div className={STYLES.skeletonCard}>
      <div className={STYLES.skeletonImage} />
      <div className={STYLES.skeletonText} />
      <div className={STYLES.skeletonTextShort} />
    </div>
  )
}
