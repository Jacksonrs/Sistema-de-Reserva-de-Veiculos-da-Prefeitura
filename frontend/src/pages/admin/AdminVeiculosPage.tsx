import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import type { VehicleFormData, VehicleStatus } from '@/types'
import { vehicleStatusBadge, vehicleStatusLabel, formatKm } from '@/utils/formatters'

const EMPTY_FORM: VehicleFormData = {
  plate: '', model: '', brand: '', year: String(new Date().getFullYear()),
  fuel: 'Flex', km: '0', capacity: '5', vehicleType: 'Carro', status: 'disponivel',
}

export default function AdminVeiculosPage() {
  const { vehicles, addVehicle, updateVehicle, updateVehicleStatus, deleteVehicle } = useApp()
  const [form, setForm] = useState<VehicleFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({})
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<VehicleFormData | null>(null)
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)

  function update(field: keyof VehicleFormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function updateEdit(field: keyof VehicleFormData, value: string) {
    setEditForm(f => f ? { ...f, [field]: value } : null)
    setEditErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next: typeof errors = {}
    if (!form.plate.trim()) next.plate = 'Informe a placa.'
    if (!form.model.trim()) next.model = 'Informe o modelo.'
    if (!form.brand.trim()) next.brand = 'Informe a marca.'
    if (!form.year || isNaN(Number(form.year))) next.year = 'Ano inválido.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateEdit() {
    if (!editForm) return false
    const next: typeof editErrors = {}
    if (!editForm.plate.trim()) next.plate = 'Informe a placa.'
    if (!editForm.model.trim()) next.model = 'Informe o modelo.'
    if (!editForm.brand.trim()) next.brand = 'Informe a marca.'
    if (!editForm.year || isNaN(Number(editForm.year))) next.year = 'Ano inválido.'
    setEditErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await addVehicle(form)
      setForm(EMPTY_FORM)
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editForm || !editingId || !validateEdit()) return
    setEditSubmitting(true)
    try {
      await updateVehicle(editingId, editForm)
      setEditingId(null)
      setEditForm(null)
    } finally {
      setEditSubmitting(false)
    }
  }

  function startEdit(v: Vehicle) {
    setEditingId(v.id)
    setEditForm({
      plate: v.plate,
      model: v.model,
      brand: v.brand,
      year: String(v.year),
      fuel: v.fuel,
      km: String(v.km),
      capacity: String(v.capacity),
      vehicleType: v.vehicleType,
      status: v.status,
    })
  }

  const statusOptions: VehicleStatus[] = ['disponivel', 'em-uso', 'manutencao']

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-sm btn-blue" onClick={() => setShowForm(s => !s)}>
          <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'}`} />
          {showForm ? 'Fechar formulário' : 'Novo veículo'}
        </button>
      </div>

      {/* ── Form ──────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Cadastrar novo veículo</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Placa *</label>
                <input className="form-input" placeholder="CLR-3344" value={form.plate} onChange={e => update('plate', e.target.value)} />
                {errors.plate && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.plate}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Modelo *</label>
                <input className="form-input" placeholder="Hilux" value={form.model} onChange={e => update('model', e.target.value)} />
                {errors.model && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.model}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Marca *</label>
                <input className="form-input" placeholder="Toyota" value={form.brand} onChange={e => update('brand', e.target.value)} />
                {errors.brand && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.brand}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Ano *</label>
                <input className="form-input" type="number" placeholder="2022" value={form.year} onChange={e => update('year', e.target.value)} />
                {errors.year && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.year}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)}>
                  {['Carro','Caminhonete','Van','Ônibus','SUV','Minivan'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Combustível</label>
                <select className="form-select" value={form.fuel} onChange={e => update('fuel', e.target.value)}>
                  {['Flex','Gasolina','Diesel','Elétrico','Diesel 4×4'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">KM atual</label>
                <input className="form-input" type="number" placeholder="0" value={form.km} onChange={e => update('km', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Capacidade (lugares)</label>
                <input className="form-input" type="number" placeholder="5" value={form.capacity} onChange={e => update('capacity', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => update('status', e.target.value as VehicleStatus)}>
                  {statusOptions.map(s => <option key={s} value={s}>{vehicleStatusLabel(s)}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
              <button className="btn-sm btn-blue" type="submit" disabled={submitting}>
                {submitting ? 'Cadastrando…' : <><i className="ti ti-device-floppy" /> Cadastrar veículo</>}
              </button>
              <button className="btn-sm" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────── */}
      {editingId && editForm && (
        <div className="modal-overlay" onClick={() => { setEditingId(null); setEditForm(null) }}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Editar veículo — {editForm.plate}</div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Placa *</label>
                  <input className="form-input" placeholder="CLR-3344" value={editForm.plate} onChange={e => updateEdit('plate', e.target.value)} />
                  {editErrors.plate && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.plate}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Modelo *</label>
                  <input className="form-input" placeholder="Hilux" value={editForm.model} onChange={e => updateEdit('model', e.target.value)} />
                  {editErrors.model && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.model}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Marca *</label>
                  <input className="form-input" placeholder="Toyota" value={editForm.brand} onChange={e => updateEdit('brand', e.target.value)} />
                  {editErrors.brand && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.brand}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Ano *</label>
                  <input className="form-input" type="number" placeholder="2022" value={editForm.year} onChange={e => updateEdit('year', e.target.value)} />
                  {editErrors.year && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.year}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select className="form-select" value={editForm.vehicleType} onChange={e => updateEdit('vehicleType', e.target.value)}>
                    {['Carro','Caminhonete','Van','Ônibus','SUV','Minivan'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Combustível</label>
                  <select className="form-select" value={editForm.fuel} onChange={e => updateEdit('fuel', e.target.value)}>
                    {['Flex','Gasolina','Diesel','Elétrico','Diesel 4×4'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">KM atual</label>
                  <input className="form-input" type="number" placeholder="0" value={editForm.km} onChange={e => updateEdit('km', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacidade (lugares)</label>
                  <input className="form-input" type="number" placeholder="5" value={editForm.capacity} onChange={e => updateEdit('capacity', e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
                <button className="btn-sm btn-blue" type="submit" disabled={editSubmitting}>
                  {editSubmitting ? 'Salvando…' : <><i className="ti ti-device-floppy" /> Salvar</>}
                </button>
                <button className="btn-sm" type="button" onClick={() => { setEditingId(null); setEditForm(null) }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Placa</th>
              <th>Modelo / Marca</th>
              <th style={{ width: 55 }}>Ano</th>
              <th style={{ width: 80 }}>Tipo</th>
              <th style={{ width: 55 }}>Cap.</th>
              <th style={{ width: 100 }}>KM</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 100 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td><strong className="mono">{v.plate}</strong></td>
                <td>{v.brand} {v.model}</td>
                <td>{v.year}</td>
                <td>{v.vehicleType}</td>
                <td>{v.capacity}</td>
                <td>{formatKm(v.km)}</td>
                <td>
                  <select
                    className="form-select"
                    style={{ fontSize: 12, padding: '3px 6px', height: 'auto' }}
                    value={v.status}
                    onChange={e => updateVehicleStatus(v.id, e.target.value as VehicleStatus)}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{vehicleStatusLabel(s)}</option>)}
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn-sm" style={{ fontSize: 11, padding: '3px 10px' }}
                      onClick={() => startEdit(v)}>
                      <i className="ti ti-edit" />
                    </button>
                    {confirmDelete === v.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-sm btn-red" style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => { deleteVehicle(v.id); setConfirmDelete(null) }}>
                          Sim
                        </button>
                        <button className="btn-sm" style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => setConfirmDelete(null)}>
                          Não
                        </button>
                      </div>
                    ) : (
                      <button className="btn-sm btn-red" style={{ fontSize: 11, padding: '3px 10px' }}
                        onClick={() => setConfirmDelete(v.id)}>
                        <i className="ti ti-trash" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
