import React, { useState, useEffect } from 'react'
import '../../styles/admin.css'

const STAT_CONFIG = [
  {
    key:   'totalOrders',
    label: 'Total Commandes',
    icon:  '📦',
    color: 'blue',
    accent: 'blue',
    format: v => v,
  },
  {
    key:   'totalRevenue',
    label: 'Revenu Total',
    icon:  '💰',
    color: 'green',
    accent: 'green',
    format: v => `$${Number(v).toFixed(2)}`,
  },
  {
    key:   'totalUsers',
    label: 'Utilisateurs',
    icon:  '👥',
    color: 'gold',
    accent: 'gold',
    format: v => v,
  },
  {
    key:   'avgRevenue',
    label: 'Panier Moyen',
    icon:  '📈',
    color: 'red',
    accent: 'red',
    format: v => `$${Number(v).toFixed(2)}`,
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('Erreur fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-loading-spinner" />
      Chargement du dashboard…
    </div>
  )

  if (!stats) return (
    <div className="admin-error">
      ⚠️ Impossible de charger les statistiques.
    </div>
  )

  const rawStats = {
    totalOrders:  stats?.stats?.totalOrders  || 0,
    totalRevenue: stats?.stats?.totalRevenue || 0,
    totalUsers:   stats?.stats?.totalUsers   || 0,
    avgRevenue:   stats?.stats?.totalOrders
      ? (stats.stats.totalRevenue / stats.stats.totalOrders)
      : 0,
  }

  const getStatusBadgeClass = (status) =>
    status === 'completed' ? 'admin-badge-success'  :
    status === 'processing' ? 'admin-badge-info'    :
    status === 'shipped'    ? 'admin-badge-info'    :
    'admin-badge-pending'

  return (
    <div>
      {/* Stat cards */}
      <div className="admin-grid">
        {STAT_CONFIG.map(cfg => (
          <div key={cfg.key} className="admin-card" data-accent={cfg.accent}>
            <div className="admin-card-content">
              <div className={`admin-card-icon ${cfg.color}`}>
                {cfg.icon}
              </div>
              <p className="admin-card-label">{cfg.label}</p>
              <h3 className="admin-card-value">{cfg.format(rawStats[cfg.key])}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2 className="admin-section-title">📋 Commandes Récentes</h2>
          <span style={{ fontSize: 12, color: 'var(--adm-text-muted)' }}>
            {stats?.recentOrders?.length || 0} commande(s)
          </span>
        </div>

        {!stats?.recentOrders?.length ? (
          <div className="admin-table-empty">Aucune commande récente</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Total</th>
                <th>Paiement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--adm-mono)', fontSize: 12, color: 'var(--adm-text-secondary)' }}>
                      #{order.orderNumber}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {order.shippingAddress?.name || '—'}
                  </td>
                  <td>
                    <span className="admin-card-accent">
                      ${order.total?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}