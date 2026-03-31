import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/admin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok && data.user?.role === 'admin') {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin/dashboard')
      } else {
        setError('Identifiants invalides ou accès administrateur refusé.')
      }
    } catch (err) {
      setError('Erreur de connexion. Vérifiez votre réseau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo / brand */}
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">🔒</div>
          <h1 className="admin-login-title">GAS PASS</h1>
          <p className="admin-login-subtitle">Connectez-vous à votre espace admin</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="admin-form-input"
              placeholder="admin@gaspass.com"
              required
              autoFocus
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="admin-alert admin-alert-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
          >
            {loading
              ? <><div className="admin-loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Connexion…</>
              : '→ Se connecter'
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--adm-text-muted)' }}>
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  )
}