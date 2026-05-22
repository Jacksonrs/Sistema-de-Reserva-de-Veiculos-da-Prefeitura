import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import { reservationStatusBadge, reservationStatusLabel, formatDate } from '@/utils/formatters'
import type { ReservationStatus } from '@/types'

type Filter = 'todas' | ReservationStatus

export default function AdminReservasPage() {
  const { reservations, approveReservation, refuseReservation } = useApp()
  const [filter, setFilter] = useState<Filter>('pendente')
  const [refuseId, setRefuseId] = useState<string | null>(null)
  const [refuseNote, setRefuseNote] = useState('')

  const counts = useMemo(() => ({
    todas:     reservations.length,
    pendente:  reservations.filter(r => r.status === 'pendente').length,
    reservado: reservations.filter(r => r.status === 'reservado').length,
    finalizada:reservations.filter(r => r.status === 'finalizada').length,
    recusada:  reservations.filter(r => r.status === 'recusada').length,
    cancelada: reservations.filter(r => r.status === 'cancelada').length,
    'em-uso':  reservations.filter(r => r.status === 'em-uso').length,
  }), [reservations])

  const filtered = useMemo(() =>
    filter === 'todas' ? [...reservations].sort((a, b) => b.id.localeCompare(a.id))
    : reservations.filter(r => r.status === filter).sort((a, b) => b.id.localeCompare(a.id))
  , [reservations, filter])

  const filterOptions: { key: Filter; label: string }[] = [
    { key: 'pendente',  label: `Pendentes (${counts.pendente})` },
    { key: 'reservado', label: `Aprovadas (${counts.reservado})` },
    { key: 'finalizada',label: `Finalizadas (${counts.finalizada})` },
    { key: 'recusada',  label: `Recusadas (${counts.recusada})` },
    { key: 'todas',     label: `Todas (${counts.todas})` },
  ]

  function confirmRefuse() {
    if (!refuseId) return
    refuseReservation(refuseId, refuseNote || undefined)
    setRefuseId(null)
    setRefuseNote('')
  }

  return (
    <>
      <div className="filter-row">
        {filterOptions.map(opt => (
          <div
            key={opt.key}
            className={`filter-chip${filter === opt.key ? ' active' : ''}`}
            onClick={() => setFilter(opt.key)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setFilter(opt.key)}
          >
            {opt.label}
          </div>
        ))}
      </div>

      {/* Refuse modal */}
      {refuseId && (
        <div className="modal-overlay" onClick={() => setRefuseId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Recusar reserva</div>
            <div className="modal-sub">Informe um motivo (opcional). O solicitante poderá ver essa mensagem.</div>
            <textarea
              className="form-input"
              style={{ height: 80, resize: 'vertical', marginBottom: '1rem' }}
              placeholder="Ex: veículo já reservado para essa data..."
              value={refuseNote}
              onChange={e => setRefuseNote(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-sm btn-red" onClick={confirmRefuse}>Confirmar recusa</button>
              <button className="btn-sm" onClick={() => setRefuseId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th>Solicitante</th>
              <th>Setor</th>
              <th>Destino</th>
              <th style={{ width: 95 }}>Veículo</th>
              <th style={{ width: 90 }}>Data</th>
              <th style={{ width: 70 }}>Saída</th>
              <th style={{ width: 110 }}>Status</th>
              {filter === 'pendente' || filter === 'todas' ? <th style={{ width: 160 }}>Ações</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <i className="ti ti-calendar-off" />
                    Nenhuma reserva encontrada.
                  </div>
                </td>
              </tr>
            ) : filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <div className="driver-row">
                    <div className="mini-avatar">{r.driverInitials}</div>
                    {r.driverName}
                  </div>
                </td>
                <td>{r.sector}</td>
                <td>
                  {r.destination}
                  {r.adminNote && (
                    <div style={{ fontSize: 11, color: 'var(--color-red)', marginTop: 2 }}>
                      <i className="ti ti-message-circle" style={{ marginRight: 3 }} />{r.adminNote}
                    </div>
                  )}
                </td>
                <td className="mono">{r.vehiclePlate}</td>
                <td>{formatDate(r.date)}</td>
                <td>{r.departureTime}</td>
                <td><Badge variant={reservationStatusBadge(r.status)}>{reservationStatusLabel(r.status)}</Badge></td>
                {(filter === 'pendente' || filter === 'todas') && (
                  <td>
                    {r.status === 'pendente' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-sm btn-green" style={{ fontSize: 11, padding: '3px 10px' }}
                          onClick={() => approveReservation(r.id)}>
                          <i className="ti ti-check" /> Aprovar
                        </button>
                        <button className="btn-sm btn-red" style={{ fontSize: 11, padding: '3px 10px' }}
                          onClick={() => { setRefuseId(r.id); setRefuseNote('') }}>
                          <i className="ti ti-x" /> Recusar
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
