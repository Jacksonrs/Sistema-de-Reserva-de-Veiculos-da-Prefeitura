// ─── Role ─────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'usuario'

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  initials: string
  role: UserRole
  sector: string
  email: string
  avatarUrl?: string
  active: boolean
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────
export type VehicleStatus = 'disponivel' | 'em-uso' | 'manutencao'

export interface Vehicle {
  id: string
  plate: string
  model: string
  brand: string
  year: number
  fuel: string
  km: number
  capacity: number
  type: string
  status: VehicleStatus
  currentDriver?: string
  currentDriverInitials?: string
  currentDestination?: string
  departureTime?: string
}

// ─── Reservation ──────────────────────────────────────────────────────────────
export type ReservationStatus = 'pendente' | 'reservado' | 'em-uso' | 'finalizada' | 'cancelada' | 'recusada'

export interface Reservation {
  id: string
  vehicleId: string
  vehiclePlate: string
  vehicleLabel: string
  driverName: string
  driverInitials: string
  driverId: string
  sector: string
  destination: string
  date: string
  departureTime: string
  returnTime: string
  km?: number
  status: ReservationStatus
  adminNote?: string
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export type PageName =
  | 'dashboard' | 'agendar' | 'veiculos' | 'historico' | 'relatorios'
  | 'admin-dashboard' | 'admin-reservas' | 'admin-veiculos' | 'admin-usuarios'

// ─── Form ─────────────────────────────────────────────────────────────────────
export interface ReservationFormData {
  vehicleId: string
  date: string
  departureTime: string
  returnTime: string
  sector: string
  destination: string
}

export interface VehicleFormData {
  plate: string
  model: string
  brand: string
  year: string
  fuel: string
  km: string
  capacity: string
  type: string
  status: VehicleStatus
}
