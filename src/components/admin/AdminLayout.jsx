import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  User,
  Menu,
  X,
  Flame
} from 'lucide-react'
import '../../styles/admin.css'

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard',    Icon: LayoutDashboard },
  { path: '/admin/orders',    label: 'Commandes',    Icon: ShoppingBag },
  { path: '/admin/products',  label: 'Produits',     Icon: Package },
  { path: '/admin/users',     label: 'Utilisateurs', Icon: Users },
]

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders':    'Commandes',
  '/admin/products':  'Produits',
  '/admin/users':     'Utilisateurs',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activePath = location.pathname
  const pageTitle = PAGE_TITLES[activePath] || 'Admin'

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Capitalize first letter
  const todayStr = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <div className="admin-root">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 199,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <nav className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Profile block (like JOHN DON in the image) */}
        <div className="admin-profile">
          <div className="admin-avatar">
            <User size={36} />
          </div>
          <p className="admin-profile-name">Administrateur</p>
          <p className="admin-profile-email">admin@gaspass.com</p>
        </div>

        {/* Nav links */}
        <ul className="admin-nav">
          {NAV_ITEMS.map(({ path, label, Icon }) => (
            <li key={path} className="admin-nav-item">
              <Link
                to={path}
                className={`admin-nav-link ${activePath === path ? 'active' : ''}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="admin-main">

        {/* Topbar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                display: 'none',
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-mid)',
                padding: 4, borderRadius: 6,
              }}
              className="admin-menu-toggle"
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="admin-topbar-title">{pageTitle}</h1>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-topbar-chip">{todayStr}</span>
          </div>
        </div>

        {/* Page content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile toggle visibility */}
      <style>{`
        @media (max-width: 768px) {
          .admin-menu-toggle { display: flex !important; align-items: center; }
        }
      `}</style>
    </div>
  )
}