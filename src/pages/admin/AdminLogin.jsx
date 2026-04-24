import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Lock } from 'lucide-react'
import '../../styles/admin.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && (data.user?.role === 'admin' || data.user?.role === 'superadmin')) {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin/dashboard')
      } else {
        setError('Invalid credentials or access denied.')
      }
    } catch {
      setError('Connection error. Please check your network.')
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
          <p className="admin-login-sub">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-form-input"
              placeholder="admin@gaspass.com"
              required
              autoFocus
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="admin-alert admin-alert-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-navy"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4 }}
          >
            {loading ? (
              <>
                <div className="admin-spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                Signing in…
              </>
            ) : (
              <>
                <Lock size={15} /> Sign In
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-light)' }}>
          Restricted access — administrators only
        </p>
      </div>
    </div>
  )
}