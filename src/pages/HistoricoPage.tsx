import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import { reservationStatusBadge, reservationStatusLabel, formatDate, formatKmDecimal } from '@/utils/formatters'

export default function HistoricoPage() {
  const { reservations, cancelReservation, currentUser } = useApp()
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  // Show only current user's reservations
  const myReservations = useMemo(() =>
    [...reservations]
      .filter(r => r.driverId === currentUser?.id)
      .sort((a, b) => b.date.localeCompare(a.date))
  , [reservations, currentUser])

  const completed = myReservations.filter(r => r.status === 'finalizada')
  const pending   = myReservations.filter(r => r.status === 'pendente')
  const totalKm   = completed.reduce((sum, r) => sum + (r.km ?? 0), 0)

  const vehicleCount: Record<string, number> = {}
  completed.forEach(r => {
    vehicleCount[r.vehiclePlate] = (vehicleCount[r.vehiclePlate] ?? 0) + 1
  })
  const mostUsed = Object.entries(vehicleCount).sort((a, b) => b[1] - a[1])[0]

  const dotColor: Record<string, string> = {
    finalizada: 'var(--color-accent)',
    'em-uso':   'var(--color-amber)',
    reservado:  '#185FA5',
    pendente:   '#7C3AED',
    cancelada:  'var(--color-text-tertiary)',
    recusada:   'var(--color-red)',
  }

  function handleCancel(id: string) {
    cancelReservation(id)
    setConfirmCancel(null)
  }

  return (
    <>
      {/* ── KPI strip ─────────────────────────────────────────────────── */}
      <div className="history-grid">
        <div className="stat-card">
          <div className="stat-label">Total de viagens</div>
          <div className="stat-value">{completed.length}</div>
          <div className="stat-meta">finalizadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendentes de aprovação</div>
          <div className="stat-value" style={{ color: pending.length > 0 ? '#7C3AED' : 'inherit' }}>
            {pending.length}
          </div>
          <div className="stat-meta">aguardando admin</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">KM total rodados</div>
          <div className="stat-value">{totalKm.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</div>
          <div className="stat-meta">km em maio/2026</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Veículo mais usado</div>
          <div className="stat-value" style={{ fontSize: 17, marginTop: 6 }}>{mostUsed?.[0] ?? '—'}</div>
          {mostUsed && <div className="stat-meta">{mostUsed[1]} viagens</div>}
        </div>
      </div>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <div className="section-header">
        <div className="section-title">Linha do tempo</div>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Suas reservas</span>
      </div>

      {myReservations.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <i className="ti ti-calendar-off" style={{ fontSize: 28, color: 'var(--color-text-tertiary)', display: 'block', marginBottom: 8 }} />
          <div style={{ color: 'var(--color-text-secondary)' }}>Você ainda não tem reservas.</div>
        </div>
      ) : myReservations.map(r => (
        <div key={r.id} className="timeline-item">
          <div className="tl-line">
            <div className="tl-dot" style={{ background: dotColor[r.status] ?? 'var(--color-accent)' }} />
            <div className="tl-bar" />
          </div>
          <div className="tl-content">
            <div className="tl-title">{r.destination}</div>
            <div className="tl-meta">
              <span className="tl-detail"><i className="ti ti-car" /> {r.vehicleLabel}</span>
              <span className="tl-detail"><i className="ti ti-calendar" /> {formatDate(r.date)}</span>
              <span className="tl-detail"><i className="ti ti-clock" /> {r.departureTime} → {r.returnTime || '—'}</span>
              {r.km !== undefined && (
                <span className="tl-detail"><i className="ti ti-road" /> {formatKmDecimal(r.km)}</span>
              )}
              <Badge variant={reservationStatusBadge(r.status)} style={{ marginLeft: 4 }}>
                {reservationStatusLabel(r.status)}
              </Badge>
            </div>
            {r.adminNote && (
              <div style={{ fontSize: 12, color: 'var(--color-red)', marginTop: 4 }}>
                <i className="ti ti-message-circle" style={{ marginRight: 3 }} />Motivo: {r.adminNote}
              </div>
            )}
            {r.status === 'pendente' && (
              <div style={{ marginTop: '.5rem' }}>
                {confirmCancel === r.id ? (
                  <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Cancelar solicitação?{' '}
                    <button className="btn-sm btn-red" style={{ fontSize: 11, padding: '3px 10px' }} onClick={() => handleCancel(r.id)}>Sim</button>
                    <button className="btn-sm" style={{ fontSize: 11, padding: '3px 10px' }} onClick={() => setConfirmCancel(null)}>Não</button>
                  </span>
                ) : (
                  <button className="btn-sm" style={{ fontSize: 11, padding: '3px 10px' }} onClick={() => setConfirmCancel(r.id)}>
                    <i className="ti ti-x" style={{ fontSize: 12 }} /> Cancelar solicitação
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
