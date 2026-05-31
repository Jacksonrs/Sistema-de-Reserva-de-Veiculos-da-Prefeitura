import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import Skeleton from '@/components/Skeleton'
import { useState, useEffect } from 'react'
import {
  vehicleStatusBadge, reservationStatusBadge, reservationStatusLabel,
  formatDateShort,
} from '@/utils/formatters'

export default function DashboardPage() {
  const { vehicles, reservations, navigate } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  const disponivel = vehicles.filter(v => v.status === 'disponivel').length
  const emUso = vehicles.filter(v => v.status === 'em-uso').length
  const proximos = reservations.filter(r => r.status === 'reservado')
  const inUseVehicles = vehicles.filter(v => v.status === 'em-uso')

  const lastTrip = reservations
    .filter(r => r.status === 'finalizada' && r.km !== undefined)
    .sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <>
      {/* ── KPI cards ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="cards-grid">
          <div className="stat-card"><Skeleton height="60px" style={{ marginBottom: 8 }} /><Skeleton width="60%" /></div>
          <div className="stat-card"><Skeleton height="60px" style={{ marginBottom: 8 }} /><Skeleton width="60%" /></div>
          <div className="stat-card"><Skeleton height="60px" style={{ marginBottom: 8 }} /><Skeleton width="60%" /></div>
          <div className="stat-card"><Skeleton height="60px" style={{ marginBottom: 8 }} /><Skeleton width="60%" /></div>
        </div>
      ) : (
        <div className="cards-grid">
          <div className="stat-card">
            <div className="stat-label">Veículos disponíveis</div>
            <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{disponivel}</div>
            <div className="stat-meta">
              <Badge variant="green"><i className="ti ti-check" style={{ fontSize: 10 }} />prontos</Badge>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Em uso agora</div>
            <div className="stat-value" style={{ color: 'var(--color-amber)' }}>{emUso}</div>
            <div className="stat-meta">
              <Badge variant="amber">em campo</Badge>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Próximos agendamentos</div>
            <div className="stat-value">{proximos.length}</div>
            <div className="stat-meta">
              <Badge variant="blue">hoje</Badge>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Última viagem</div>
            <div className="stat-value" style={{ fontSize: 17, marginTop: 4 }}>
              {lastTrip?.km ? `${lastTrip.km.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} km` : '—'}
            </div>
            <div className="stat-meta">
              {lastTrip ? `${lastTrip.vehiclePlate} · ${formatDateShort(lastTrip.date)}` : '—'}
            </div>
          </div>
        </div>
      )}

      {/* ── Vehicles in use ───────────────────────────────────────────── */}
      <div className="section-header">
        <div className="section-title">Veículos em uso agora</div>
        <button className="btn-sm" onClick={() => navigate('veiculos')}>Ver todos</button>
      </div>
      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Placa</th>
              <th>Veículo</th>
              <th>Motorista</th>
              <th>Destino</th>
              <th style={{ width: 70 }}>Saída</th>
              <th style={{ width: 100 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {inUseVehicles.map(v => (
              <tr key={v.id}>
                <td><strong className="mono">{v.plate}</strong></td>
                <td>{v.brand} {v.model}</td>
                <td>
                  <div className="driver-row">
                    <div className="mini-avatar">{v.currentDriverInitials}</div>
                    {v.currentDriver}
                  </div>
                </td>
                <td>{v.currentDestination}</td>
                <td>{v.departureTime}</td>
                <td><Badge variant={vehicleStatusBadge(v.status)}>Em uso</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Upcoming reservations ─────────────────────────────────────── */}
      {proximos.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: '1.25rem' }}>
            <div className="section-title">Próximos agendamentos</div>
          </div>
          <div className="table-card">
            <table className="dc-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>Placa</th>
                  <th>Veículo</th>
                  <th>Motorista</th>
                  <th>Destino</th>
                  <th style={{ width: 80 }}>Início</th>
                  <th style={{ width: 100 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {proximos.map(r => (
                  <tr key={r.id}>
                    <td><strong className="mono">{r.vehiclePlate}</strong></td>
                    <td>{r.vehicleLabel.split('—')[1]?.trim()}</td>
                    <td>
                      <div className="driver-row">
                        <div className="mini-avatar">{r.driverInitials}</div>
                        {r.driverName.split(' ')[0]} {r.driverName.split(' ').slice(-1)[0][0]}.
                      </div>
                    </td>
                    <td>{r.destination}</td>
                    <td>{r.departureTime}</td>
                    <td><Badge variant={reservationStatusBadge(r.status)}>{reservationStatusLabel(r.status)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
