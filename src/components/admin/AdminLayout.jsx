import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import '../../styles/admin.css'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeLink, setActiveLink] = useState(location.pathname)

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location])
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin/dashboard', label: '📊 Dashboard', emoji: '📊' },
    { path: '/admin/orders', label: '📦 Commandes', emoji: '📦' },
    { path: '/admin/products', label: '🛍️ Produits', emoji: '🛍️' },
    { path: '/admin/users', label: '👥 Utilisateurs', emoji: '👥' }
  ]

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">GAS PASS</h2>
          <p className="admin-sidebar-subtitle">Admin Panel</p>
        </div>

        <ul className="admin-nav">
          {navItems.map(item => (
            <li key={item.path} className="admin-nav-item">
              <Link 
                to={item.path}
                className={`admin-nav-link ${activeLink === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} className="admin-logout-btn">
          ⧉ Déconnexion
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
