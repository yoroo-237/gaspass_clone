import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Lock } from 'lucide-react'
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
        setError('Identifiants invalides ou accès admin refusé.')
      }
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            <Flame size={28} />
          </div>
          <h1 className="admin-login-title">GAS PASS</h1>
          <p className="admin-login-sub">Espace Administration</p>
        </div>

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
            <div className="admin-alert admin-alert-error">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-navy"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4 }}
          >
            {loading
              ? <><div className="admin-spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Connexion…</>
              : <><Lock size={15} /> Se connecter</>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-light)' }}>
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  )
}