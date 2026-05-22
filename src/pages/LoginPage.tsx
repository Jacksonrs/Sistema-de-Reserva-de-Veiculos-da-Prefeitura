import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const ok = login(username, password)
    if (!ok) setError('Usuário ou senha inválidos.')
  }

  function fillUser() { setUsername('joao'); setPassword('12345678'); setError('') }
  function fillAdmin() { setUsername('admin'); setPassword('admin123'); setError('') }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <i className="ti ti-steering-wheel" style={{ color: '#fff', fontSize: 20 }} aria-hidden="true" />
          </div>
          <div className="logo-text">FLEET</div>
        </div>

        <div className="login-title">Bem-vindo de volta</div>
        <div className="login-sub">Plataforma de gestão de frotas públicas</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-user">Usuário</label>
            <input
              id="login-user"
              type="text"
              placeholder="seu.usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="login-pass">Senha</label>
            <input
              id="login-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p style={{ fontSize: 12, color: 'var(--color-red)', marginBottom: '.75rem' }}>{error}</p>
          )}
          <button className="btn-primary" type="submit">Entrar no sistema</button>
        </form>

        <div className="login-demo-row">
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginRight: 8 }}>Demonstração:</span>
          <button type="button" className="demo-btn" onClick={fillUser}>
            <i className="ti ti-user" style={{ fontSize: 11 }} /> Usuário
          </button>
          <button type="button" className="demo-btn demo-btn-admin" onClick={fillAdmin}>
            <i className="ti ti-shield-check" style={{ fontSize: 11 }} /> Admin
          </button>
        </div>

        <p className="login-hint">Prefeitura Municipal — Uso institucional</p>
      </div>
    </div>
  )
}
