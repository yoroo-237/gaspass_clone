import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Sidebar */}
      <nav style={{
        width: 250,
        background: '#1a1a1a',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        padding: '24px 16px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#9effa5', fontSize: 20, margin: 0 }}>GAS PASS</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '8px 0 0' }}>Admin Panel</p>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/dashboard" style={{
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              display: 'block',
              padding: '10px 12px',
              borderRadius: 6,
              transition: 'all 0.3s',
              background: 'rgba(158,255,165,0.1)'
            }}>
              📊 Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/orders" style={{
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              display: 'block',
              padding: '10px 12px',
              borderRadius: 6,
              transition: 'all 0.3s'
            }}>
              📦 Commandes
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/products" style={{
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              display: 'block',
              padding: '10px 12px',
              borderRadius: 6,
              transition: 'all 0.3s'
            }}>
              🛍️ Produits
            </Link>
          </li>
          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/users" style={{
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              display: 'block',
              padding: '10px 12px',
              borderRadius: 6,
              transition: 'all 0.3s'
            }}>
              👥 Utilisateurs
            </Link>
          </li>
        </ul>

        <button onClick={handleLogout} style={{
          width: '100%',
          marginTop: 40,
          padding: '10px 12px',
          background: '#ba0b20',
          border: 'none',
          color: '#fff',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14
        }}>
          Déconnexion
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ marginLeft: 250, flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  )
}
