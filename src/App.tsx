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

function PageContent() {
  const { currentPage } = useApp()
  switch (currentPage) {
    case 'dashboard':       return <DashboardPage />
    case 'agendar':         return <AgendarPage />
    case 'veiculos':        return <VeiculosPage />
    case 'historico':       return <HistoricoPage />
    case 'relatorios':      return <RelatoriosPage />
    case 'admin-dashboard': return <AdminDashboardPage />
    case 'admin-reservas':  return <AdminReservasPage />
    case 'admin-veiculos':  return <AdminVeiculosPage />
    case 'admin-usuarios':  return <AdminUsuariosPage />
    default:                return <DashboardPage />
  }
}

export default function App() {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) return <><LoginPage /><Toast /></>
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content"><PageContent /></div>
      </div>
      <Toast />
    </div>
  )
}
