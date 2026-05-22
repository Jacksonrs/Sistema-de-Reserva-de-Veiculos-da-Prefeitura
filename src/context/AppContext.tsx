import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Vehicle, Reservation, PageName, ReservationFormData, VehicleFormData } from '@/types'
import { MOCK_USERS, MOCK_CREDENTIALS, MOCK_VEHICLES, MOCK_RESERVATIONS } from '@/data/mockData'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Toast { message: string; type: 'success' | 'error' | 'info' }

interface AppContextValue {
  // Auth
  isAuthenticated: boolean
  currentUser: User | null
  login: (username: string, password: string) => boolean
  logout: () => void

  // Navigation
  currentPage: PageName
  navigate: (page: PageName) => void

  // Data
  vehicles: Vehicle[]
  reservations: Reservation[]
  users: User[]

  // User actions
  addReservation: (data: ReservationFormData) => void
  cancelReservation: (id: string) => void

  // Admin actions
  approveReservation: (id: string) => void
  refuseReservation: (id: string, note?: string) => void
  addVehicle: (data: VehicleFormData) => void
  updateVehicleStatus: (id: string, status: Vehicle['status']) => void
  deleteVehicle: (id: string) => void
  toggleUserActive: (id: string) => void
  addUser: (user: Omit<User, 'id'>) => void

  // Toast
  toast: Toast | null
  showToast: (message: string, type?: Toast['type']) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<PageName>('dashboard')
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES)
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS)
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const login = useCallback((username: string, password: string): boolean => {
    const cred = MOCK_CREDENTIALS[username.trim().toLowerCase()]
    if (!cred || cred.password !== password) return false
    const user = MOCK_USERS.find(u => u.id === cred.userId)
    if (!user || !user.active) return false
    setIsAuthenticated(true)
    setCurrentUser(user)
    setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')
    return true
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCurrentPage('dashboard')
  }, [])

  const navigate = useCallback((page: PageName) => setCurrentPage(page), [])

  // ─── User actions ──────────────────────────────────────────────────────────
  const addReservation = useCallback((data: ReservationFormData) => {
    const vehicle = vehicles.find(v => v.id === data.vehicleId)
    if (!vehicle || !currentUser) return
    const newR: Reservation = {
      id: `r_${Date.now()}`,
      vehicleId: data.vehicleId,
      vehiclePlate: vehicle.plate,
      vehicleLabel: `${vehicle.plate} — ${vehicle.brand} ${vehicle.model}`,
      driverName: currentUser.name,
      driverInitials: currentUser.initials,
      driverId: currentUser.id,
      sector: data.sector || currentUser.sector,
      destination: data.destination,
      date: data.date,
      departureTime: data.departureTime,
      returnTime: data.returnTime,
      status: 'pendente',
    }
    setReservations(prev => [newR, ...prev])
    showToast('Solicitação enviada! Aguardando aprovação do administrador.', 'info')
  }, [vehicles, currentUser, showToast])

  const cancelReservation = useCallback((id: string) => {
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'cancelada' as const } : r
    ))
    showToast('Reserva cancelada.', 'info')
  }, [showToast])

  // ─── Admin actions ─────────────────────────────────────────────────────────
  const approveReservation = useCallback((id: string) => {
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'reservado' as const } : r
    ))
    showToast('Reserva aprovada com sucesso!')
  }, [showToast])

  const refuseReservation = useCallback((id: string, note?: string) => {
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'recusada' as const, adminNote: note } : r
    ))
    showToast('Reserva recusada.', 'info')
  }, [showToast])

  const addVehicle = useCallback((data: VehicleFormData) => {
    const newV: Vehicle = {
      id: `v_${Date.now()}`,
      plate: data.plate.toUpperCase(),
      model: data.model,
      brand: data.brand,
      year: Number(data.year),
      fuel: data.fuel,
      km: Number(data.km),
      capacity: Number(data.capacity),
      type: data.type,
      status: data.status,
    }
    setVehicles(prev => [newV, ...prev])
    showToast(`Veículo ${newV.plate} cadastrado com sucesso!`)
  }, [showToast])

  const updateVehicleStatus = useCallback((id: string, status: Vehicle['status']) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v))
    showToast('Status do veículo atualizado.')
  }, [showToast])

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
    showToast('Veículo removido.', 'info')
  }, [showToast])

  const toggleUserActive = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
    showToast('Status do usuário atualizado.')
  }, [showToast])

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = { id: `u_${Date.now()}`, ...userData }
    setUsers(prev => [...prev, newUser])
    showToast(`Usuário ${newUser.name} cadastrado!`)
  }, [showToast])

  return (
    <AppContext.Provider value={{
      isAuthenticated, currentUser, login, logout,
      currentPage, navigate,
      vehicles, reservations, users,
      addReservation, cancelReservation,
      approveReservation, refuseReservation,
      addVehicle, updateVehicleStatus, deleteVehicle,
      toggleUserActive, addUser,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
