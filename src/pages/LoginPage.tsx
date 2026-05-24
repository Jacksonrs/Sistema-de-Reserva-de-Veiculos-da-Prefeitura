import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
      {/* Lado esquerdo */}
      <div className="login-left">
        <div className="login-left-logo">
          <img src="/fleet.png" alt="Logo" style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 12 }} />
          <div className="logo-text" style={{ color: '#fff', fontSize: 24 }}>FLEET</div>
        </div>
        <div className="login-left-title">Gestão inteligente<br />da frota pública</div>
        <div className="login-left-sub">
          Controle reservas, acompanhe a frota em tempo real e mantenha o histórico completo de todas as viagens.
        </div>
      </div>

      {/* Lado direito */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-title">Bem-vindo de volta</div>
          <div className="login-sub">Acesse com suas credenciais institucionais</div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-user">Usuário</label>
              <div className="field-input-wrap">
                <i className="ti ti-user" />
                <input id="login-user" type="text" className="form-input" placeholder="seu.usuario"
                  value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="login-pass">Senha</label>
              <div className="field-input-wrap">
                <i className="ti ti-lock" />
                <input id="login-pass" type={showPassword ? 'text' : 'password'} className="form-input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(s => !s)}
                >
                  <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} />
                </button>
              </div>
            </div>
            {error && <p style={{ fontSize: 12, color: 'var(--color-red)', marginBottom: '.75rem' }}>{error}</p>}
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
    </div>
  )
}