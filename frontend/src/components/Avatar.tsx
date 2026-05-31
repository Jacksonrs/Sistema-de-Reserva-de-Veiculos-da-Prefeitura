interface AvatarProps {
  initials: string
  avatarUrl?: string
  size?: 'sm' | 'md'
  isAdmin?: boolean
}

export default function Avatar({ initials, avatarUrl, size = 'md', isAdmin }: AvatarProps) {
  const className = [
    size === 'sm' ? 'mini-avatar' : 'avatar',
    isAdmin ? (size === 'sm' ? 'mini-avatar-admin' : 'avatar-admin') : ''
  ].join(' ').trim()

  return (
    <div className={className}>
      {avatarUrl
        ? <img src={avatarUrl} alt={initials} />
        : initials
      }
    </div>
  )
}