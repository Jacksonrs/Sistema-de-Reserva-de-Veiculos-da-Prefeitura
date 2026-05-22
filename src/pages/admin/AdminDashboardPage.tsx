import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import { reservationStatusBadge, reservationStatusLabel, formatDate, vehicleStatusBadge, vehicleStatusLabel } from '@/utils/formatters'

export default function AdminDashboardPage() {
  const { reservations, vehicles, users, navigate, approveReservation, refuseReservation } = useApp()

  const stats = useMemo(() => ({
    pending:    reservations.filter(r => r.status === 'pendente').length,
    disponivel: vehicles.filter(v => v.status === 'disponivel').length,
    emUso:      vehicles.filter(v => v.status === 'em-uso').length,
    manutencao: vehicles.filter(v => v.status === 'manutencao').length,
    activeUsers: users.filter(u => u.active).length,
  }), [reservations, vehicles, users])

  const pendingList = reservations.filter(r => r.status === 'pendente')
  const recentAll   = [...reservations].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 6)

  return (
    <>
      {/* ── KPIs ──────────────────────────────────────────────────────── */}
      <div className="cards-grid">
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('admin-reservas')}>
          <div className="stat-label">Reservas pendentes</div>
          <div className="stat-value" style={{ color: stats.pending > 0 ? 'var(--color-amber)' : 'inherit' }}>
            {stats.pending}
          </div>
          <div className="stat-meta">aguardando aprovação</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Veículos disponíveis</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{stats.disponivel}</div>
          <div className="stat-meta">prontos para uso</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Veículos em uso</div>
          <div className="stat-value" style={{ color: 'var(--color-amber)' }}>{stats.emUso}</div>
          <div className="stat-meta">em campo agora</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Em manutenção</div>
          <div className="stat-value" style={{ color: 'var(--color-red)' }}>{stats.manutencao}</div>
          <div className="stat-meta">indisponíveis</div>
        </div>
      </div>

      {/* ── Pending approval ──────────────────────────────────────────── */}
      {pendingList.length > 0 && (
        <>
          <div className="section-header">
            <div className="section-title">
              <i className="ti ti-bell-ringing" style={{ color: 'var(--color-amber)', marginRight: 6, fontSize: 15 }} />
              Solicitações aguardando aprovação
            </div>
            <button className="btn-sm" onClick={() => navigate('admin-reservas')}>Ver todas</button>
          </div>
          {pendingList.map(r => (
            <div key={r.id} className="approval-card">
              <div className="approval-info">
                <div className="approval-title">{r.destination}</div>
                <div className="approval-meta">
                  <span><i className="ti ti-user" /> {r.driverName} — {r.sector}</span>
                  <span><i className="ti ti-car" /> {r.vehicleLabel}</span>
                  <span><i className="ti ti-calendar" /> {formatDate(r.date)}</span>
                  <span><i className="ti ti-clock" /> {r.departureTime} → {r.returnTime}</span>
                </div>
              </div>
              <div className="approval-actions">
                <button className="btn-sm btn-green" onClick={() => approveReservation(r.id)}>
                  <i className="ti ti-check" /> Aprovar
                </button>
                <button className="btn-sm btn-red" onClick={() => refuseReservation(r.id)}>
                  <i className="ti ti-x" /> Recusar
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── Fleet status ──────────────────────────────────────────────── */}
      <div className="section-header" style={{ marginTop: '1.25rem' }}>
        <div className="section-title">Status da frota</div>
        <button className="btn-sm" onClick={() => navigate('admin-veiculos')}>Gerenciar</button>
      </div>
      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Placa</th>
              <th>Modelo</th>
              <th style={{ width: 90 }}>Tipo</th>
              <th style={{ width: 55 }}>Cap.</th>
              <th style={{ width: 110 }}>Status</th>
              <th>Motorista / Info</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.slice(0, 8).map(v => (
              <tr key={v.id}>
                <td><strong className="mono">{v.plate}</strong></td>
                <td>{v.brand} {v.model}</td>
                <td>{v.type}</td>
                <td>{v.capacity} lug.</td>
                <td><Badge variant={vehicleStatusBadge(v.status)}>{vehicleStatusLabel(v.status)}</Badge></td>
                <td>
                  {v.currentDriver ? (
                    <div className="driver-row">
                      <div className="mini-avatar">{v.currentDriverInitials}</div>
                      {v.currentDriver} → {v.currentDestination}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Recent activity ───────────────────────────────────────────── */}
      <div className="section-header" style={{ marginTop: '1.25rem' }}>
        <div className="section-title">Atividade recente</div>
      </div>
      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th>Solicitante</th>
              <th>Destino</th>
              <th style={{ width: 90 }}>Veículo</th>
              <th style={{ width: 90 }}>Data</th>
              <th style={{ width: 110 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAll.map(r => (
              <tr key={r.id}>
                <td>
                  <div className="driver-row">
                    <div className="mini-avatar">{r.driverInitials}</div>
                    {r.driverName}
                  </div>
                </td>
                <td>{r.destination}</td>
                <td className="mono">{r.vehiclePlate}</td>
                <td>{formatDate(r.date)}</td>
                <td><Badge variant={reservationStatusBadge(r.status)}>{reservationStatusLabel(r.status)}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
