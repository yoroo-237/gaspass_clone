import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import '../../styles/admin.css'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard',     icon: '📊' },
  { path: '/admin/orders',    label: 'Commandes',     icon: '📦' },
  { path: '/admin/products',  label: 'Produits',      icon: '🛍️' },
  { path: '/admin/users',     label: 'Utilisateurs',  icon: '👥' },
]

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders':    'Gestion des Commandes',
  '/admin/products':  'Gestion des Produits',
  '/admin/users':     'Gestion des Utilisateurs',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeLink, setActiveLink] = useState(location.pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setActiveLink(location.pathname)
    setSidebarOpen(false)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const currentTitle = pageTitles[location.pathname] || 'Admin Panel'

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="admin-container">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 99, backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar */}
      <nav className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">GAS PASS</h2>
          <p className="admin-sidebar-subtitle">Administration</p>
        </div>

        {/* Profile */}
        <div className="admin-sidebar-profile">
          <div className="admin-sidebar-avatar">👤</div>
          <div className="admin-sidebar-profile-info">
            <div className="admin-sidebar-name">Administrateur</div>
            <div className="admin-sidebar-role">Super Admin</div>
          </div>
        </div>

        {/* Nav */}
        <div className="admin-nav-section">Menu</div>
        <ul className="admin-nav">
          {navItems.map(item => (
            <li key={item.path} className="admin-nav-item">
              <Link
                to={item.path}
                className={`admin-nav-link ${activeLink === item.path ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer / logout */}
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span className="admin-nav-icon">🚪</span>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          {/* Mobile menu toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 20, color: 'var(--adm-text-secondary)',
                padding: 4
              }}
              className="admin-menu-toggle"
            >
              ☰
            </button>
            <h1 className="admin-topbar-title">{currentTitle}</h1>
          </div>

          <div className="admin-topbar-actions">
            <span className="admin-topbar-date">
              📅 {today}
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-menu-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  )
}