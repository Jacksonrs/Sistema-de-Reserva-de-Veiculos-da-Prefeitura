import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import Badge from '@/components/Badge'
import type { UserRole } from '@/types'

export default function AdminUsuariosPage() {
  const { users, toggleUserActive, addUser } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', sector: '', role: 'usuario' as UserRole })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  function update(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next: typeof errors = {}
    if (!form.name.trim())   next.name   = 'Informe o nome.'
    if (!form.email.trim())  next.email  = 'Informe o e-mail.'
    if (!form.sector.trim()) next.sector = 'Informe o setor.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const initials = form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    addUser({ name: form.name, email: form.email, sector: form.sector, role: form.role, initials, active: true })
    setForm({ name: '', email: '', sector: '', role: 'usuario' })
    setShowForm(false)
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
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
              <button className="btn-sm btn-blue" type="submit">
                <i className="ti ti-user-plus" /> Cadastrar
              </button>
              <button className="btn-sm" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
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
              <th style={{ width: 120 }}>Ações</th>
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
                  <button
                    className={`btn-sm ${u.active ? 'btn-red' : 'btn-green'}`}
                    style={{ fontSize: 11, padding: '3px 10px' }}
                    onClick={() => toggleUserActive(u.id)}
                  >
                    {u.active ? <><i className="ti ti-user-off" /> Desativar</> : <><i className="ti ti-user-check" /> Reativar</>}
                  </button>
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
