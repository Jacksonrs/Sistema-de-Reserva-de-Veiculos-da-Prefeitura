import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react'
import type {
  User, Vehicle, Reservation, PageName,
  ReservationFormData, VehicleFormData,
} from '@/types'
import {
  authService, veiculoService, reservaService, usuarioService, token,
} from '@/services/api'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Toast { message: string; type: 'success' | 'error' | 'info' }

interface AppContextValue {
  // Auth
  isAuthenticated: boolean
  currentUser: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void

  // Navigation
  currentPage: PageName
  navigate: (page: PageName) => void

  // Data
  vehicles: Vehicle[]
  reservations: Reservation[]
  users: User[]
  loading: boolean

  // User actions
  addReservation: (data: ReservationFormData) => Promise<void>
  cancelReservation: (id: string) => Promise<void>

  // Admin actions
  approveReservation: (id: string) => Promise<void>
  refuseReservation: (id: string, note?: string) => Promise<void>
  addVehicle: (data: VehicleFormData) => Promise<void>
  updateVehicleStatus: (id: string, status: Vehicle['status']) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>
  toggleUserActive: (id: string) => Promise<void>
  addUser: (user: Omit<User, 'id'>) => Promise<void>

  // Toast
  toast: Toast | null
  showToast: (message: string, type?: Toast['type']) => void

  // Theme
  isDark: boolean
  toggleDark: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser]         = useState<User | null>(null)
  const [currentPage, setCurrentPage]         = useState<PageName>('dashboard')
  const [vehicles, setVehicles]               = useState<Vehicle[]>([])
  const [reservations, setReservations]       = useState<Reservation[]>([])
  const [users, setUsers]                     = useState<User[]>([])
  const [toast, setToast]                     = useState<Toast | null>(null)
  const [loading, setLoading]                 = useState(false)

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('dc-theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('dc-theme', next ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  // ─── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ─── Carregar dados após login ───────────────────────────────────────────────
  const loadData = useCallback(async (role: string) => {
    setLoading(true)
    try {
      const [veiculosData, reservasData] = await Promise.all([
        veiculoService.list(),
        reservaService.list(),
      ])
      setVehicles(veiculosData)
      setReservations(reservasData)

      // Apenas admin carrega lista de usuários
      if (role === 'admin') {
        const usuariosData = await usuarioService.list()
        setUsers(usuariosData)
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // ─── Restaurar sessão ao recarregar página ───────────────────────────────────
  useEffect(() => {
    const savedToken = token.get()
    if (!savedToken) return

    authService.me()
      .then(user => {
        setCurrentUser(user as User)
        setIsAuthenticated(true)
        setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')
        loadData(user.role)
      })
      .catch(() => {
        token.clear()
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await authService.login(username, password)
      setCurrentUser(user as User)
      setIsAuthenticated(true)
      setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')
      await loadData(user.role)
      return true
    } catch (err: any) {
      // Erros de credencial retornam false (a LoginPage mostra a mensagem)
      return false
    }
  }, [loadData])

  const logout = useCallback(() => {
    authService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCurrentPage('dashboard')
    setVehicles([])
    setReservations([])
    setUsers([])
  }, [])

  const navigate = useCallback((page: PageName) => setCurrentPage(page), [])

  // ─── Ações do usuário ────────────────────────────────────────────────────────
  const addReservation = useCallback(async (data: ReservationFormData) => {
    try {
      const nova = await reservaService.create(data)
      setReservations(prev => [nova, ...prev])
      showToast('Solicitação enviada! Aguardando aprovação do administrador.', 'info')
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar reserva.', 'error')
      throw err
    }
  }, [showToast])

  const cancelReservation = useCallback(async (id: string) => {
    try {
      const atualizada = await reservaService.cancel(id)
      setReservations(prev => prev.map(r => r.id === id ? atualizada : r))
      showToast('Reserva cancelada.', 'info')
    } catch (err: any) {
      showToast(err.message || 'Erro ao cancelar reserva.', 'error')
    }
  }, [showToast])

  // ─── Ações do admin ──────────────────────────────────────────────────────────
  const approveReservation = useCallback(async (id: string) => {
    try {
      const atualizada = await reservaService.approve(id)
      setReservations(prev => prev.map(r => r.id === id ? atualizada : r))
      showToast('Reserva aprovada com sucesso!')
    } catch (err: any) {
      showToast(err.message || 'Erro ao aprovar reserva.', 'error')
    }
  }, [showToast])

  const refuseReservation = useCallback(async (id: string, note?: string) => {
    try {
      const atualizada = await reservaService.refuse(id, note)
      setReservations(prev => prev.map(r => r.id === id ? atualizada : r))
      showToast('Reserva recusada.', 'info')
    } catch (err: any) {
      showToast(err.message || 'Erro ao recusar reserva.', 'error')
    }
  }, [showToast])

  const addVehicle = useCallback(async (data: VehicleFormData) => {
    try {
      const novo = await veiculoService.create(data)
      setVehicles(prev => [novo, ...prev])
      showToast(`Veículo ${novo.plate} cadastrado com sucesso!`)
    } catch (err: any) {
      showToast(err.message || 'Erro ao cadastrar veículo.', 'error')
      throw err
    }
  }, [showToast])

  const updateVehicleStatus = useCallback(async (id: string, status: Vehicle['status']) => {
    try {
      const atualizado = await veiculoService.updateStatus(id, status)
      setVehicles(prev => prev.map(v => v.id === id ? atualizado : v))
      showToast('Status do veículo atualizado.')
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar status.', 'error')
    }
  }, [showToast])

  const deleteVehicle = useCallback(async (id: string) => {
    try {
      await veiculoService.delete(id)
      setVehicles(prev => prev.filter(v => v.id !== id))
      showToast('Veículo removido.', 'info')
    } catch (err: any) {
      showToast(err.message || 'Erro ao remover veículo.', 'error')
    }
  }, [showToast])

  const toggleUserActive = useCallback(async (id: string) => {
    try {
      const { active } = await usuarioService.toggleAtivo(id)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active } : u))
      showToast('Status do usuário atualizado.')
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar usuário.', 'error')
    }
  }, [showToast])

  const addUser = useCallback(async (userData: Omit<User, 'id'>) => {
    try {
      const novo = await usuarioService.create(userData as any)
      setUsers(prev => [...prev, novo as User])
      showToast(`Usuário ${novo.name} cadastrado! Senha padrão: 12345678`)
    } catch (err: any) {
      showToast(err.message || 'Erro ao cadastrar usuário.', 'error')
      throw err
    }
  }, [showToast])

  return (
    <AppContext.Provider value={{
      isAuthenticated, currentUser, login, logout,
      currentPage, navigate,
      vehicles, reservations, users, loading,
      addReservation, cancelReservation,
      approveReservation, refuseReservation,
      addVehicle, updateVehicleStatus, deleteVehicle,
      toggleUserActive, addUser,
      toast, showToast, isDark, toggleDark,
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
