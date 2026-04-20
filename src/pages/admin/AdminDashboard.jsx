import React, { useState, useEffect } from 'react'
import { DollarSign, Share2, ThumbsUp, Star } from 'lucide-react'
import { getAdminDashboard } from '../../api/client'
import '../../styles/admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError('')
        const data = await getAdminDashboard('30d')
        setStats(data)
      } catch (err) {
        console.error('Erreur fetch stats:', err)
        setError(err.message || 'Impossible de charger les données.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        Chargement du dashboard…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 32, color: 'var(--red)', textAlign: 'center', fontSize: 14 }}>
        ⚠️ {error}
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ padding: 32, color: 'var(--red)', textAlign: 'center', fontSize: 14 }}>
        ⚠️ Impossible de charger les données.
      </div>
    )
  }

  const dashboardStats = stats.stats || stats || {}

  const totalOrders = Number(dashboardStats.totalOrders ?? 0)
  const totalRevenue = Number(dashboardStats.totalRevenue ?? 0)
  const totalUsers = Number(dashboardStats.totalUsers ?? 0)
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const STAT_CARDS = [
    {
      label: 'Revenu Total',
      value: `$${totalRevenue.toFixed(2)}`,
      Icon: DollarSign,
      navy: true,
    },
    {
      label: 'Commandes',
      value: totalOrders,
      Icon: Share2,
      navy: false,
    },
    {
      label: 'Utilisateurs',
      value: totalUsers,
      Icon: ThumbsUp,
      navy: false,
    },
    {
      label: 'Panier Moyen',
      value: `$${avgOrder.toFixed(2)}`,
      Icon: Star,
      navy: false,
    },
  ]

  const recentOrders = Array.isArray(stats.recentOrders) ? stats.recentOrders : []

  const getBadgeClass = (status) =>
    status === 'completed'
      ? 'admin-badge-success'
      : status === 'processing'
      ? 'admin-badge-info'
      : status === 'shipped'
      ? 'admin-badge-info'
      : 'admin-badge-pending'

  const formatMoney = (value) => {
    const amount = Number(value ?? 0)
    return `$${amount.toFixed(2)}`
  }

  return (
    <div>
      <div className="admin-stats-grid">
        {STAT_CARDS.map(({ label, value, Icon, navy }) => (
          <div key={label} className={`admin-stat-card ${navy ? 'navy' : ''}`}>
            <div className="admin-stat-header">
              <p className="admin-stat-label">{label}</p>
              <span className="admin-stat-icon">
                <Icon size={20} />
              </span>
            </div>
            <p className="admin-stat-value">{value}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Commandes Récentes</h2>
          <span className="admin-card-count">
            {recentOrders.length} commande(s)
          </span>
        </div>

        {!recentOrders.length ? (
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
              {recentOrders.map((order) => (
                <tr key={order.id || order._id || order.orderNumber}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>
                    #{order.orderNumber || order.id || '—'}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {order.shippingAddress?.name || order.customerName || '—'}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--orange)' }}>
                    {formatMoney(order.total)}
                  </td>
                  <td>
                    <span className={`admin-badge ${getBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${getBadgeClass(order.status)}`}>
                      {order.status || 'pending'}
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