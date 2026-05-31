import type { BadgeVariant } from '@/utils/formatters'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function Badge({ variant, children, style }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`} style={style}>
      {children}
    </span>
  )
}
