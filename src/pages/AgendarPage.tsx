import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import type { Vehicle, ReservationFormData } from '@/types'
import { vehicleStatusBadge, vehicleStatusLabel, formatKm, todayISO } from '@/utils/formatters'

export default function AgendarPage() {
  const { vehicles, addReservation, navigate, currentUser } = useApp()

  const available   = vehicles.filter(v => v.status === 'disponivel')
  const unavailable = vehicles.filter(v => v.status !== 'disponivel')

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(available[0] ?? null)
  const [form, setForm] = useState<ReservationFormData>({
    vehicleId:     available[0]?.id ?? '',
    date:          todayISO(),
    departureTime: '08:00',
    returnTime:    '12:00',
    sector:        currentUser?.sector ?? '',
    destination:   '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({})

  function selectVehicle(v: Vehicle) {
    setSelectedVehicle(v)
    setForm(f => ({ ...f, vehicleId: v.id }))
  }

  function update(field: keyof ReservationFormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.vehicleId)          next.vehicleId     = 'Selecione um veículo.'
    if (!form.date)               next.date          = 'Informe a data.'
    if (!form.departureTime)      next.departureTime = 'Informe o horário de saída.'
    if (!form.returnTime)         next.returnTime    = 'Informe o horário de retorno.'
    if (!form.destination.trim()) next.destination   = 'Informe o destino.'
    if (form.departureTime && form.returnTime && form.departureTime >= form.returnTime)
      next.returnTime = 'O retorno deve ser após a saída.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    addReservation(form)
    setTimeout(() => navigate('historico'), 1600)
  }

  return (
    <div className="schedule-layout">
      {/* ── Form ──────────────────────────────────────────────────────── */}
      <form className="form-card" onSubmit={handleSubmit}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1.25rem' }}>
          Detalhes da solicitação
        </div>

        <div className="info-banner">
          <i className="ti ti-info-circle" />
          Sua solicitação será enviada ao administrador para aprovação antes de ser confirmada.
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label className="form-label">Veículo</label>
            <select
              className="form-select"
              value={form.vehicleId}
              onChange={e => {
                const v = vehicles.find(x => x.id === e.target.value) ?? null
                if (v) selectVehicle(v)
              }}
            >
              {available.map(v => (
                <option key={v.id} value={v.id}>{v.plate} — {v.brand} {v.model}</option>
              ))}
            </select>
            {errors.vehicleId && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.vehicleId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Data</label>
            <input className="form-input" type="date" value={form.date} min={todayISO()} onChange={e => update('date', e.target.value)} />
            {errors.date && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Setor / solicitante</label>
            <input className="form-input" type="text" value={form.sector} onChange={e => update('sector', e.target.value)} placeholder="Ex: Infraestrutura" />
          </div>

          <div className="form-group">
            <label className="form-label">Horário de saída</label>
            <input className="form-input" type="time" value={form.departureTime} onChange={e => update('departureTime', e.target.value)} />
            {errors.departureTime && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.departureTime}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Horário de retorno</label>
            <input className="form-input" type="time" value={form.returnTime} onChange={e => update('returnTime', e.target.value)} />
            {errors.returnTime && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.returnTime}</span>}
          </div>

          <div className="form-group full">
            <label className="form-label">Destino / finalidade</label>
            <input className="form-input" type="text" value={form.destination} onChange={e => update('destination', e.target.value)} placeholder="Ex: Secretaria de Saúde — entrega de materiais" />
            {errors.destination && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.destination}</span>}
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '.75rem' }}>
          <button className="btn-sm btn-blue" type="submit">
            <i className="ti ti-send" aria-hidden="true" />
            Enviar solicitação
          </button>
          <button className="btn-sm" type="button" onClick={() => navigate('dashboard')}>Cancelar</button>
        </div>
      </form>

      {/* ── Vehicle sidebar ───────────────────────────────────────────── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '.75rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Veículos disponíveis
        </div>
        <div className="vehicles-aside">
          {available.map(v => (
            <div
              key={v.id}
              className={`vehicle-card${selectedVehicle?.id === v.id ? ' selected' : ''}`}
              onClick={() => selectVehicle(v)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && selectVehicle(v)}
            >
              <div className="vehicle-name">{v.brand} {v.model}</div>
              <div className="vehicle-meta">{v.plate} · {v.fuel} · {v.year} · {v.capacity} lug.</div>
              <div className="vehicle-footer">
                <Badge variant={vehicleStatusBadge(v.status)}>{vehicleStatusLabel(v.status)}</Badge>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{formatKm(v.km)}</span>
              </div>
            </div>
          ))}
          {unavailable.length > 0 && (
            <div style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '.75rem 1rem' }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: '.35rem' }}>Em uso / indisponíveis</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {unavailable.map(v => v.plate).join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
