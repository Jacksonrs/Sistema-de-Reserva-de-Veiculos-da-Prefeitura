import { useApp } from '@/context/AppContext'

export default function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  const iconMap = {
    success: 'ti-check',
    error:   'ti-x',
    info:    'ti-info-circle',
  }

  return (
    <div className={`toast toast-${toast.type}`}>
      <i className={`ti ${iconMap[toast.type]}`} aria-hidden="true" />
      <span>{toast.message}</span>
    </div>
  )
}
