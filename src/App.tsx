import { useApp } from '@/context/AppContext'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Toast from '@/components/Toast'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AgendarPage from '@/pages/AgendarPage'
import VeiculosPage from '@/pages/VeiculosPage'
import HistoricoPage from '@/pages/HistoricoPage'
import RelatoriosPage from '@/pages/RelatoriosPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminReservasPage from '@/pages/admin/AdminReservasPage'
import AdminVeiculosPage from '@/pages/admin/AdminVeiculosPage'
import AdminUsuariosPage from '@/pages/admin/AdminUsuariosPage'
import { useState } from 'react'

function PageContent() {
  const { currentPage } = useApp()
  switch (currentPage) {
    case 'dashboard': return <DashboardPage />
    case 'agendar': return <AgendarPage />
    case 'veiculos': return <VeiculosPage />
    case 'historico': return <HistoricoPage />
    case 'relatorios': return <RelatoriosPage />
    case 'admin-dashboard': return <AdminDashboardPage />
    case 'admin-reservas': return <AdminReservasPage />
    case 'admin-veiculos': return <AdminVeiculosPage />
    case 'admin-usuarios': return <AdminUsuariosPage />
    default: return <DashboardPage />
  }
}

export default function App() {
  const { isAuthenticated, currentPage } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  if (!isAuthenticated) return <><LoginPage /><Toast /></>
  return (
    <div className="app-shell">
      <Sidebar open = {sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Topbar onMenuClick={() => setSidebarOpen(s => !s)} />
        <div key={currentPage} className="content page-fade">
          <PageContent />
        </div>
      </div>
      <Toast />
    </div>
  )
}
