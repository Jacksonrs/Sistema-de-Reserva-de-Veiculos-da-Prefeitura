import { useApp } from '@/context/AppContext'
import type { PageName } from '@/types'

interface NavItem { page: PageName; icon: string; label: string }

const USER_NAV: NavItem[] = [
  { page: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { page: 'agendar', icon: 'ti-calendar-plus', label: 'Agendar veículo' },
  { page: 'veiculos', icon: 'ti-car', label: 'Frota disponível' },
  { page: 'historico', icon: 'ti-clock-history', label: 'Minhas reservas' },
  { page: 'relatorios', icon: 'ti-chart-bar', label: 'Relatórios' },
]

const ADMIN_NAV: NavItem[] = [
  { page: 'admin-dashboard', icon: 'ti-layout-dashboard', label: 'Painel Admin' },
  { page: 'admin-reservas', icon: 'ti-calendar-check', label: 'Gerenciar Reservas' },
  { page: 'admin-veiculos', icon: 'ti-car', label: 'Frota' },
  { page: 'admin-usuarios', icon: 'ti-users', label: 'Usuários' },
  { page: 'relatorios', icon: 'ti-chart-bar', label: 'Relatórios' },
]

interface SidebarProps { open: boolean; onClose: () => void }

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { currentPage, navigate, logout, currentUser } = useApp()
  const isAdmin = currentUser?.role === 'admin'
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>

      <div className="sidebar-logo">
       <img src="/fleet.png" alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }} />
       <div className="logo-text" style={{ color: '#fff' }}>FLEET</div>
      </div>

      {isAdmin && (
        <div className="sidebar-role-badge">
          <i className="ti ti-shield-check" style={{ fontSize: 11 }} />
          Administrador
        </div>
      )}

      <div className="nav-section">{isAdmin ? 'Administração' : 'Menu'}</div>

      {navItems.map(item => (
        <div
          key={item.page}
          className={`nav-item${currentPage === item.page ? ' active' : ''}`}
          onClick={() => navigate(item.page)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate(item.page)}
          aria-current={currentPage === item.page ? 'page' : undefined}
        >
          <i className={`ti ${item.icon}`} aria-hidden="true" />
          {item.label}
        </div>
      ))}

      <div className="sidebar-bottom">
        <div
          className="nav-item"
          onClick={logout}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && logout()}
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Sair
        </div>
      </div>
    </aside>
    </>
  )
}
