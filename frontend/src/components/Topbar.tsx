import { useApp } from '@/context/AppContext'
import Avatar from '@/components/Avatar'
import type { PageName } from '@/types'

const PAGE_TITLES: Record<PageName, string> = {
  'dashboard': 'Dashboard',
  'agendar': 'Agendar veículo',
  'veiculos': 'Frota disponível',
  'historico': 'Minhas reservas',
  'relatorios': 'Relatórios',
  'admin-dashboard': 'Painel Administrativo',
  'admin-reservas': 'Gerenciar Reservas',
  'admin-veiculos': 'Cadastro de Veículos',
  'admin-usuarios': 'Gerenciar Usuários',
}

interface TopbarProps { onMenuClick: () => void }

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { currentPage, navigate, currentUser, isDark, toggleDark } = useApp()
  const isAdmin = currentUser?.role === 'admin'

  return (

    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenuClick}>
        <i className="ti ti-menu-2" />
      </button>
      <div className="topbar-title">{PAGE_TITLES[currentPage]}</div>
      <div className="topbar-right">
        {!isAdmin && (
          <button className="btn-sm btn-blue" onClick={() => navigate('agendar')}>
            <i className="ti ti-plus" aria-hidden="true" />
            Nova reserva
          </button>
        )}
        <button
          className="icon-btn"
          onClick={toggleDark}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
        >
          <i className={`ti ${isDark ? 'ti-sun' : 'ti-moon'}`} />
        </button>

        <div className="user-chip">
          <Avatar initials={currentUser?.initials} avatarUrl={currentUser?.avatarUrl} isAdmin={isAdmin} />
          <div>
            <div style={{ fontWeight: 500, lineHeight: 1.2 }}>{currentUser?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', lineHeight: 1.2 }}>
              {isAdmin ? 'Administrador' : currentUser?.sector}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
