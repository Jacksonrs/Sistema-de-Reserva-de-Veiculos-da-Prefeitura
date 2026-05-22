import { useApp } from '@/context/AppContext'
import type { PageName } from '@/types'

interface NavItem { page: PageName; icon: string; label: string }

const USER_NAV: NavItem[] = [
  { page: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { page: 'agendar',   icon: 'ti-calendar-plus',    label: 'Agendar veículo' },
  { page: 'veiculos',  icon: 'ti-car',              label: 'Frota disponível' },
  { page: 'historico', icon: 'ti-clock-history',    label: 'Minhas reservas' },
  { page: 'relatorios',icon: 'ti-chart-bar',        label: 'Relatórios' },
]

const ADMIN_NAV: NavItem[] = [
  { page: 'admin-dashboard', icon: 'ti-layout-dashboard', label: 'Painel Admin' },
  { page: 'admin-reservas',  icon: 'ti-calendar-check',   label: 'Gerenciar Reservas' },
  { page: 'admin-veiculos',  icon: 'ti-car',              label: 'Frota' },
  { page: 'admin-usuarios',  icon: 'ti-users',            label: 'Usuários' },
  { page: 'relatorios',      icon: 'ti-chart-bar',        label: 'Relatórios' },
]

export default function Sidebar() {
  const { currentPage, navigate, logout, currentUser } = useApp()
  const isAdmin = currentUser?.role === 'admin'
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className="ti ti-steering-wheel" style={{ color: '#fff', fontSize: 16 }} aria-hidden="true" />
        </div>
        <div className="logo-text">FLEET</div>
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
  )
}
