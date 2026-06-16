// ─── Configuração base ────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ─── Helpers de token ─────────────────────────────────────────────────────────
export const token = {
  get:     () => localStorage.getItem('access_token'),
  set:     (t: string) => localStorage.setItem('access_token', t),
  refresh: () => localStorage.getItem('refresh_token'),
  setRefresh: (t: string) => localStorage.setItem('refresh_token', t),
  clear:   () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

// ─── Cliente HTTP com refresh automático ─────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  }

  const tk = token.get()
  if (tk) headers['Authorization'] = `Bearer ${tk}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Token expirado → tenta renovar uma vez
  if (res.status === 401 && retry) {
    const refreshToken = token.refresh()
    if (!refreshToken) throw new Error('Sessão expirada. Faça login novamente.')

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!refreshRes.ok) {
      token.clear()
      throw new Error('Sessão expirada. Faça login novamente.')
    }

    const { access } = await refreshRes.json()
    token.set(access)
    return request<T>(path, options, false) // retry sem loop infinito
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const msg =
      errorData.detail ||
      Object.values(errorData).flat().join(' ') ||
      `Erro ${res.status}`
    throw new Error(msg)
  }

  // DELETE retorna 204 sem body
  if (res.status === 204) return undefined as unknown as T
  return res.json()
}

const http = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// ─── Mapeadores snake_case ↔ camelCase ───────────────────────────────────────
// Veículo
function mapVeiculo(v: any) {
  return {
    id:                     String(v.id),
    plate:                  v.plate,
    model:                  v.model,
    brand:                  v.brand,
    year:                   v.year,
    fuel:                   v.fuel,
    km:                     v.km,
    capacity:               v.capacity,
    vehicleType:            v.vehicle_type,
    status:                 v.status,
    currentDriver:          v.current_driver ?? undefined,
    currentDriverInitials:  v.current_driver_initials ?? undefined,
    currentDestination:     v.current_destination ?? undefined,
    departureTime:          v.departure_time ?? undefined,
  }
}

// Reserva
function mapReserva(r: any) {
  return {
    id:               String(r.id),
    vehicleId:        String(r.veiculo),
    vehiclePlate:     r.vehicle_plate,
    vehicleLabel:     r.vehicle_label,
    driverName:       r.driver_name,
    driverInitials:   r.driver_initials,
    driverId:         String(r.driver),
    sector:           r.sector,
    destination:      r.destination,
    date:             r.date,
    departureTime:    r.departure_time,
    returnTime:       r.return_time,
    km:               r.km ?? undefined,
    status:           r.status,
    adminNote:        r.admin_note ?? undefined,
  }
}

// Usuário
function mapUsuario(u: any) {
  return {
    id:        String(u.id),
    username:  u.username,
    name:      u.name,
    initials:  u.initials,
    email:     u.email,
    role:      u.role,
    sector:    u.sector,
    active:    u.active,
    avatarUrl: u.avatar_url ?? undefined,
  }
}

// ─── Serviços de Auth ─────────────────────────────────────────────────────────
export const authService = {
  async login(username: string, password: string) {
    const data = await http.post<any>('/auth/login/', { username, password })
    token.set(data.access)
    token.setRefresh(data.refresh)
    return mapUsuario(data.user)
  },

  async me() {
    const data = await http.get<any>('/auth/me/')
    return mapUsuario(data)
  },

  logout() {
    token.clear()
  },
}

// ─── Serviços de Veículos ─────────────────────────────────────────────────────
export const veiculoService = {
  async list(statusFilter?: string) {
    const qs = statusFilter ? `?status=${statusFilter}` : ''
    const data = await http.get<any[]>(`/veiculos/${qs}`)
    return data.map(mapVeiculo)
  },

  async create(form: {
    plate: string; model: string; brand: string; year: string
    fuel: string; km: string; capacity: string; vehicleType: string; status: string
  }) {
    const payload = {
      plate:    form.plate.toUpperCase(),
      model:    form.model,
      brand:    form.brand,
      year:     Number(form.year),
      fuel:     form.fuel,
      km:       Number(form.km),
      capacity: Number(form.capacity),
      vehicle_type: form.vehicleType,
      status:   form.status,
    }
    const data = await http.post<any>('/veiculos/', payload)
    return mapVeiculo(data)
  },

  async updateStatus(id: string, status: string) {
    // Limpa campos de uso se voltou a disponível ou manutenção
    const payload: any = { status }
    if (status === 'disponivel' || status === 'manutencao') {
      payload.current_driver = null
      payload.current_driver_initials = null
      payload.current_destination = null
      payload.departure_time = null
    }
    const data = await http.patch<any>(`/veiculos/${id}/status/`, payload)
    return mapVeiculo(data)
  },

  async update(id: string, form: {
    plate: string; model: string; brand: string; year: string
    fuel: string; km: string; capacity: string; vehicleType: string; status: string
  }) {
    const payload = {
      plate:    form.plate.toUpperCase(),
      model:    form.model,
      brand:    form.brand,
      year:     Number(form.year),
      fuel:     form.fuel,
      km:       Number(form.km),
      capacity: Number(form.capacity),
      vehicle_type: form.vehicleType,
      status:   form.status,
    }
    const data = await http.patch<any>(`/veiculos/${id}/`, payload)
    return mapVeiculo(data)
  },

  async delete(id: string) {
    await http.delete(`/veiculos/${id}/`)
  },
}

// ─── Serviços de Reservas ─────────────────────────────────────────────────────
export const reservaService = {
  async list(statusFilter?: string) {
    const qs = statusFilter ? `?status=${statusFilter}` : ''
    const data = await http.get<any[]>(`/reservas/${qs}`)
    return data.map(mapReserva)
  },

  async create(form: {
    vehicleId: string; date: string; departureTime: string
    returnTime: string; sector: string; destination: string
  }) {
    const payload = {
      veiculo:        Number(form.vehicleId),
      date:           form.date,
      departure_time: form.departureTime,
      return_time:    form.returnTime,
      sector:         form.sector,
      destination:    form.destination,
    }
    const data = await http.post<any>('/reservas/', payload)
    return mapReserva(data)
  },

  async cancel(id: string) {
    const data = await http.patch<any>(`/reservas/${id}/cancelar/`, {})
    return mapReserva(data)
  },

  async approve(id: string) {
    const data = await http.patch<any>(`/reservas/${id}/acao/`, { action: 'aprovar' })
    return mapReserva(data)
  },

  async refuse(id: string, note?: string) {
    const data = await http.patch<any>(`/reservas/${id}/acao/`, {
      action: 'recusar',
      admin_note: note ?? '',
    })
    return mapReserva(data)
  },

  async finalize(id: string, km?: number) {
    const data = await http.patch<any>(`/reservas/${id}/acao/`, {
      action: 'finalizar',
      km: km ?? 0,
    })
    return mapReserva(data)
  },}

// ─── Serviços de Usuários ─────────────────────────────────────────────────────
export const usuarioService = {
  async list() {
    const data = await http.get<any[]>('/usuarios/')
    return data.map(mapUsuario)
  },

  async create(user: {
    name: string; email: string; sector: string
    role: string; initials: string; active: boolean
    password?: string
  }) {
    // Gera username a partir do primeiro nome (sem acentos, minúsculas)
    const username = user.name
      .split(' ')[0]
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const payload = {
      username,
      name:     user.name,
      email:    user.email,
      sector:   user.sector,
      role:     user.role,
      initials: user.initials,
      active:   user.active,
      password: user.password || '12345678',
    }
    const data = await http.post<any>('/usuarios/', payload)
    return mapUsuario(data)
  },

  async update(id: string, form: {
    name: string; email: string; sector: string
    role: string; initials: string; active: boolean
  }) {
    const data = await http.patch<any>(`/usuarios/${id}/`, form)
    return mapUsuario(data)
  },

  async delete(id: string) {
    await http.delete(`/usuarios/${id}/`)
  },

  async toggleAtivo(id: string) {
    const data = await http.patch<any>(`/usuarios/${id}/toggle-ativo/`, {})
    return data as { active: boolean }
  },
}
