import type { Vehicle, Reservation, User } from '@/types'

// ─── Users ────────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'João Silva',    initials: 'JS', role: 'usuario', sector: 'Infraestrutura', email: 'joao.silva@prefeitura.gov.br',    active: true  },
  { id: 'u2', name: 'Maria Souza',   initials: 'MS', role: 'admin',   sector: 'Transportes',   email: 'maria.souza@prefeitura.gov.br',   active: true  },
  { id: 'u3', name: 'Paulo Oliveira',initials: 'PO', role: 'usuario', sector: 'Administração', email: 'paulo.oliveira@prefeitura.gov.br', active: true  },
  { id: 'u4', name: 'Tânia Santos',  initials: 'TS', role: 'usuario', sector: 'Saúde',         email: 'tania.santos@prefeitura.gov.br',   active: true  },
  { id: 'u5', name: 'Ana Lima',      initials: 'AL', role: 'usuario', sector: 'Educação',      email: 'ana.lima@prefeitura.gov.br',       active: false },
  { id: 'u6', name: 'Carlos Mendes', initials: 'CM', role: 'usuario', sector: 'Obras',         email: 'carlos.mendes@prefeitura.gov.br',  active: true  },
]

// ─── Login credentials ────────────────────────────────────────────────────────
// usuario: joao / 12345678   |   admin: admin / admin123
export const MOCK_CREDENTIALS: Record<string, { userId: string; password: string }> = {
  'joao':  { userId: 'u1', password: '12345678' },
  'admin': { userId: 'u2', password: 'admin123' },
  'paulo': { userId: 'u3', password: '12345678' },
  'tania': { userId: 'u4', password: '12345678' },
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1',  plate: 'CLR-3344', model: 'Hilux',   brand: 'Toyota',   year: 2022, fuel: 'Diesel 4×4', km: 32450, capacity: 5,  type: 'Caminhonete', status: 'disponivel' },
  { id: 'v2',  plate: 'RNL-5591', model: 'Gol',     brand: 'VW',       year: 2019, fuel: 'Flex',       km: 61890, capacity: 5,  type: 'Carro',       status: 'disponivel' },
  { id: 'v3',  plate: 'ZXC-1100', model: 'Strada',  brand: 'Fiat',     year: 2021, fuel: 'Flex',       km: 18220, capacity: 2,  type: 'Caminhonete', status: 'disponivel' },
  { id: 'v4',  plate: 'KLD-8823', model: 'Spin',    brand: 'Chevrolet',year: 2020, fuel: 'Flex',       km: 45100, capacity: 7,  type: 'Minivan',     status: 'disponivel' },
  { id: 'v5',  plate: 'PPT-3310', model: 'Ka',      brand: 'Ford',     year: 2018, fuel: 'Flex',       km: 88340, capacity: 5,  type: 'Carro',       status: 'disponivel' },
  { id: 'v6',  plate: 'ALV-7721', model: 'Creta',   brand: 'Hyundai',  year: 2022, fuel: 'Flex',       km: 22100, capacity: 5,  type: 'SUV',         status: 'disponivel' },
  { id: 'v7',  plate: 'FRT-0055', model: 'Etios',   brand: 'Toyota',   year: 2020, fuel: 'Flex',       km: 54780, capacity: 5,  type: 'Carro',       status: 'disponivel' },
  { id: 'v8',  plate: 'GNT-9982', model: 'Sandero', brand: 'Renault',  year: 2021, fuel: 'Flex',       km: 71230, capacity: 5,  type: 'Carro',       status: 'disponivel' },
  {
    id: 'v9', plate: 'HSP-1023', model: 'Argo', brand: 'Fiat', year: 2021, fuel: 'Flex', km: 41230, capacity: 5, type: 'Carro', status: 'em-uso',
    currentDriver: 'Maria Silva', currentDriverInitials: 'MS',
    currentDestination: 'Secretaria de Saúde', departureTime: '08:15',
  },
  {
    id: 'v10', plate: 'PMN-4471', model: 'S10', brand: 'Chevrolet', year: 2020, fuel: 'Diesel', km: 98110, capacity: 5, type: 'Caminhonete', status: 'em-uso',
    currentDriver: 'Roberto Gomes', currentDriverInitials: 'RG',
    currentDestination: 'Zona Rural — Assentamento', departureTime: '07:40',
  },
  {
    id: 'v11', plate: 'TRP-2209', model: 'Kombi', brand: 'VW', year: 2015, fuel: 'Flex', km: 134900, capacity: 9, type: 'Van', status: 'em-uso',
    currentDriver: 'Ana Lima', currentDriverInitials: 'AL',
    currentDestination: 'Escola Mun. João XXIII', departureTime: '09:00',
  },
  {
    id: 'v12', plate: 'BRT-0834', model: 'Duster', brand: 'Renault', year: 2021, fuel: 'Flex', km: 67400, capacity: 5, type: 'SUV', status: 'em-uso',
    currentDriver: 'Felipe Costa', currentDriverInitials: 'FC',
    currentDestination: 'INSS — reunião', departureTime: '09:30',
  },
  { id: 'v13', plate: 'MPA-6677', model: 'Ranger', brand: 'Ford', year: 2019, fuel: 'Diesel', km: 55900, capacity: 5, type: 'Caminhonete', status: 'manutencao' },
]

// ─── Reservations ─────────────────────────────────────────────────────────────
export const MOCK_RESERVATIONS: Reservation[] = [
  // Pending — awaiting admin approval
  {
    id: 'p1', vehicleId: 'v1', vehiclePlate: 'CLR-3344', vehicleLabel: 'CLR-3344 — Toyota Hilux',
    driverName: 'João Silva', driverInitials: 'JS', driverId: 'u1', sector: 'Infraestrutura',
    destination: 'Fazenda Modelo — inspeção', date: '2026-05-24',
    departureTime: '14:00', returnTime: '18:00', status: 'pendente',
  },
  {
    id: 'p2', vehicleId: 'v4', vehiclePlate: 'KLD-8823', vehicleLabel: 'KLD-8823 — Chevrolet Spin',
    driverName: 'Paulo Oliveira', driverInitials: 'PO', driverId: 'u3', sector: 'Administração',
    destination: 'Câmara — audiência pública', date: '2026-05-25',
    departureTime: '09:00', returnTime: '13:00', status: 'pendente',
  },
  {
    id: 'p3', vehicleId: 'v2', vehiclePlate: 'RNL-5591', vehicleLabel: 'RNL-5591 — VW Gol',
    driverName: 'Tânia Santos', driverInitials: 'TS', driverId: 'u4', sector: 'Saúde',
    destination: 'UPA Norte — medicamentos', date: '2026-05-23',
    departureTime: '15:30', returnTime: '17:00', status: 'pendente',
  },
  // Approved
  {
    id: 'r1', vehicleId: 'v3', vehiclePlate: 'ZXC-1100', vehicleLabel: 'ZXC-1100 — Fiat Strada',
    driverName: 'João Silva', driverInitials: 'JS', driverId: 'u1', sector: 'Infraestrutura',
    destination: 'Secretaria de Obras', date: '2026-05-26',
    departureTime: '08:00', returnTime: '11:00', status: 'reservado',
  },
  // History
  {
    id: 'h1', vehicleId: 'v9', vehiclePlate: 'HSP-1023', vehicleLabel: 'HSP-1023 — Fiat Argo',
    driverName: 'João Silva', driverInitials: 'JS', driverId: 'u1', sector: 'Infraestrutura',
    destination: 'Secretaria de Saúde — entrega de insumos', date: '2026-05-21',
    departureTime: '08:15', returnTime: '10:40', km: 47.2, status: 'finalizada',
  },
  {
    id: 'h2', vehicleId: 'v1', vehiclePlate: 'CLR-3344', vehicleLabel: 'CLR-3344 — Toyota Hilux',
    driverName: 'João Silva', driverInitials: 'JS', driverId: 'u1', sector: 'Infraestrutura',
    destination: 'INSS — renovação de documentação', date: '2026-05-19',
    departureTime: '13:00', returnTime: '16:20', km: 82.5, status: 'finalizada',
  },
  {
    id: 'h3', vehicleId: 'v9', vehiclePlate: 'HSP-1023', vehicleLabel: 'HSP-1023 — Fiat Argo',
    driverName: 'João Silva', driverInitials: 'JS', driverId: 'u1', sector: 'Infraestrutura',
    destination: 'Escola Mun. João XXIII — transporte pedagógico', date: '2026-05-17',
    departureTime: '07:30', returnTime: '12:00', km: 64.1, status: 'finalizada',
  },
  {
    id: 'h4', vehicleId: 'v2', vehiclePlate: 'RNL-5591', vehicleLabel: 'RNL-5591 — VW Gol',
    driverName: 'Paulo Oliveira', driverInitials: 'PO', driverId: 'u3', sector: 'Administração',
    destination: 'Câmara Municipal', date: '2026-05-15',
    departureTime: '09:00', returnTime: '11:30', km: 18.3, status: 'finalizada',
  },
  {
    id: 'h5', vehicleId: 'v9', vehiclePlate: 'HSP-1023', vehicleLabel: 'HSP-1023 — Fiat Argo',
    driverName: 'Tânia Santos', driverInitials: 'TS', driverId: 'u4', sector: 'Saúde',
    destination: 'UPA Norte', date: '2026-05-12',
    departureTime: '14:00', returnTime: '15:45', km: 31.0, status: 'finalizada',
  },
  {
    id: 'h6', vehicleId: 'v1', vehiclePlate: 'CLR-3344', vehicleLabel: 'CLR-3344 — Toyota Hilux',
    driverName: 'João Silva', driverInitials: 'JS', driverId: 'u1', sector: 'Infraestrutura',
    destination: 'Visita técnica — fazendas rurais', date: '2026-05-10',
    departureTime: '07:40', returnTime: '17:00', km: 143.8, status: 'finalizada',
  },
  {
    id: 'h7', vehicleId: 'v2', vehiclePlate: 'RNL-5591', vehicleLabel: 'RNL-5591 — VW Gol',
    driverName: 'Carlos Mendes', driverInitials: 'CM', driverId: 'u6', sector: 'Obras',
    destination: 'Fornecedor — retirada de materiais', date: '2026-05-08',
    departureTime: '10:00', returnTime: '12:30', km: 25.0, status: 'recusada',
    adminNote: 'Veículo já reservado para outra secretaria nessa data.',
  },
]
