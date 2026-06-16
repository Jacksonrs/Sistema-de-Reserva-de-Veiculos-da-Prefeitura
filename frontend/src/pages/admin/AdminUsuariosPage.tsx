import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import type { UserRole } from '@/types'

interface UserForm {
  name: string; email: string; sector: string; role: UserRole; initials: string
}

export default function AdminUsuariosPage() {
  const { users, toggleUserActive, addUser, updateUser, deleteUser } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', sector: '', role: 'usuario' as UserRole, password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UserForm | null>(null)
  const [editErrors, setEditErrors] = useState<Partial<UserForm>>({})
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function updateEdit(field: keyof UserForm, value: string) {
    setEditForm(f => f ? { ...f, [field]: value } : null)
    setEditErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next: typeof errors = {}
    if (!form.name.trim())   next.name   = 'Informe o nome.'
    if (!form.email.trim())  next.email  = 'Informe o e-mail.'
    if (!form.sector.trim()) next.sector = 'Informe o setor.'
    if (!form.password)       next.password = 'Informe uma senha.'
    else if (form.password.length < 8) next.password = 'Mínimo 8 caracteres.'
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Senhas não conferem.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateEdit() {
    if (!editForm) return false
    const next: typeof editErrors = {}
    if (!editForm.name.trim())   next.name   = 'Informe o nome.'
    if (!editForm.email.trim())  next.email  = 'Informe o e-mail.'
    if (!editForm.sector.trim()) next.sector = 'Informe o setor.'
    setEditErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const initials = form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
      await addUser({ name: form.name, email: form.email, sector: form.sector, role: form.role, initials, active: true, password: form.password })
      setForm({ name: '', email: '', sector: '', role: 'usuario', password: '', confirmPassword: '' })
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
      const user = users.find(u => u.id === editingId)
      if (!user) return
      await updateUser(editingId, { ...editForm, active: user.active })
      setEditingId(null)
      setEditForm(null)
    } finally {
      setEditSubmitting(false)
    }
  }

  function startEdit(u: typeof users[0]) {
    setEditingId(u.id)
    setEditForm({
      name: u.name,
      email: u.email,
      sector: u.sector,
      role: u.role,
      initials: u.initials,
    })
  }

  const activeUsers   = users.filter(u => u.active)
  const inactiveUsers = users.filter(u => !u.active)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-sm btn-blue" onClick={() => setShowForm(s => !s)}>
          <i className={`ti ${showForm ? 'ti-x' : 'ti-user-plus'}`} />
          {showForm ? 'Fechar' : 'Novo usuário'}
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Cadastrar novo usuário</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Nome completo *</label>
                <input className="form-input" placeholder="João Silva" value={form.name} onChange={e => update('name', e.target.value)} />
                {errors.name && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">E-mail institucional *</label>
                <input className="form-input" type="email" placeholder="joao@prefeitura.gov.br" value={form.email} onChange={e => update('email', e.target.value)} />
                {errors.email && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Setor *</label>
                <input className="form-input" placeholder="Infraestrutura" value={form.sector} onChange={e => update('sector', e.target.value)} />
                {errors.sector && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.sector}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Perfil de acesso</label>
                <select className="form-select" value={form.role} onChange={e => update('role', e.target.value)}>
                  <option value="usuario">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Senha *</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                    <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} />
                  </button>
                </div>
                {errors.password && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar senha *</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                {errors.confirmPassword && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{errors.confirmPassword}</span>}
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
              <button className="btn-sm btn-blue" type="submit" disabled={submitting}>
                {submitting ? 'Cadastrando…' : <><i className="ti ti-user-plus" /> Cadastrar</>}
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
            <div className="modal-title">Editar usuário — {editForm.name}</div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-grid">
                <div className="form-group full">
                  <label className="form-label">Nome completo *</label>
                  <input className="form-input" placeholder="João Silva" value={editForm.name} onChange={e => updateEdit('name', e.target.value)} />
                  {editErrors.name && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Iniciais</label>
                  <input className="form-input" placeholder="JS" value={editForm.initials} onChange={e => updateEdit('initials', e.target.value)} maxLength={4} />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail institucional *</label>
                  <input className="form-input" type="email" placeholder="joao@prefeitura.gov.br" value={editForm.email} onChange={e => updateEdit('email', e.target.value)} />
                  {editErrors.email && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Setor *</label>
                  <input className="form-input" placeholder="Infraestrutura" value={editForm.sector} onChange={e => updateEdit('sector', e.target.value)} />
                  {editErrors.sector && <span style={{ fontSize: 11, color: 'var(--color-red)' }}>{editErrors.sector}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Perfil de acesso</label>
                  <select className="form-select" value={editForm.role} onChange={e => updateEdit('role', e.target.value)}>
                    <option value="usuario">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
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

      <div className="table-card">
        <table className="dc-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Setor</th>
              <th>E-mail</th>
              <th style={{ width: 110 }}>Perfil</th>
              <th style={{ width: 100 }}>Situação</th>
              <th style={{ width: 160 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ opacity: u.active ? 1 : 0.55 }}>
                <td>
                  <div className="driver-row">
                    <div className={`mini-avatar${u.role === 'admin' ? ' mini-avatar-admin' : ''}`}>{u.initials}</div>
                    {u.name}
                  </div>
                </td>
                <td>{u.sector}</td>
                <td style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{u.email}</td>
                <td>
                  <Badge variant={u.role === 'admin' ? 'purple' : 'blue'}>
                    {u.role === 'admin' ? 'Admin' : 'Usuário'}
                  </Badge>
                </td>
                <td>
                  <Badge variant={u.active ? 'green' : 'gray'}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn-sm" style={{ fontSize: 11, padding: '3px 10px' }}
                      onClick={() => startEdit(u)}>
                      <i className="ti ti-edit" />
                    </button>
                    <button
                      className={`btn-sm ${u.active ? 'btn-red' : 'btn-green'}`}
                      style={{ fontSize: 11, padding: '3px 10px' }}
                      onClick={() => toggleUserActive(u.id)}
                    >
                      {u.active ? <><i className="ti ti-user-off" /></> : <><i className="ti ti-user-check" /></>}
                    </button>
                    {confirmDelete === u.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-sm btn-red" style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => { deleteUser(u.id); setConfirmDelete(null) }}>
                          Sim
                        </button>
                        <button className="btn-sm" style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => setConfirmDelete(null)}>
                          Não
                        </button>
                      </div>
                    ) : (
                      <button className="btn-sm btn-red" style={{ fontSize: 11, padding: '3px 10px' }}
                        onClick={() => setConfirmDelete(u.id)}>
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

      <div className="section-header" style={{ marginTop: '1.25rem' }}>
        <div className="section-title">Resumo</div>
      </div>
      <div className="cards-grid" style={{ '--cols': '3' } as React.CSSProperties}>
        <div className="stat-card">
          <div className="stat-label">Total de usuários</div>
          <div className="stat-value">{users.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ativos</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{activeUsers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Inativos</div>
          <div className="stat-value" style={{ color: 'var(--color-text-tertiary)' }}>{inactiveUsers.length}</div>
        </div>
      </div>
    </>
  )
}
