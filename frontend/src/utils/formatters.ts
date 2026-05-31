// ─── Date formatting ──────────────────────────────────────────────────────────
export function formatDate(isoDate: string): string {
  if (!isoDate) return '—'
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateShort(isoDate: string): string {
  if (!isoDate) return '—'
  const [, month, day] = isoDate.split('-')
  return `${day}/${month}`
}

// ─── Number formatting ────────────────────────────────────────────────────────
export function formatKm(km: number): string {
  return km.toLocaleString('pt-BR') + ' km'
}

export function formatKmDecimal(km: number): string {
  return km.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' km'
}

// ─── Badge helpers ────────────────────────────────────────────────────────────
export type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'purple'

export function vehicleStatusBadge(status: string): BadgeVariant {
  switch (status) {
    case 'disponivel': return 'green'
    case 'em-uso':     return 'amber'
    case 'manutencao': return 'red'
    default:           return 'gray'
  }
}

export function vehicleStatusLabel(status: string): string {
  switch (status) {
    case 'disponivel': return 'Disponível'
    case 'em-uso':     return 'Em uso'
    case 'manutencao': return 'Manutenção'
    default:           return status
  }
}

export function reservationStatusBadge(status: string): BadgeVariant {
  switch (status) {
    case 'pendente':   return 'purple'
    case 'reservado':  return 'blue'
    case 'em-uso':     return 'amber'
    case 'finalizada': return 'green'
    case 'cancelada':  return 'gray'
    case 'recusada':   return 'red'
    default:           return 'gray'
  }
}

export function reservationStatusLabel(status: string): string {
  switch (status) {
    case 'pendente':   return 'Pendente'
    case 'reservado':  return 'Aprovado'
    case 'em-uso':     return 'Em andamento'
    case 'finalizada': return 'Finalizada'
    case 'cancelada':  return 'Cancelada'
    case 'recusada':   return 'Recusada'
    default:           return status
  }
}

// ─── Today's ISO date ─────────────────────────────────────────────────────────
export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
