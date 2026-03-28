import React, { useState, useEffect } from 'react'

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

  if (loading) return <div style={{ color: '#fff' }}>Chargement du dashboard...</div>
  if (!stats) return <div style={{ color: '#ba0b20' }}>Erreur lors du chargement</div>

  return (
    <div>
      <h1 style={{ color: '#fff', marginBottom: 32 }}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 40
      }}>
        <div style={{
          background: 'rgba(158,255,165,0.1)',
          border: '1px solid rgba(158,255,165,0.2)',
          borderRadius: 8,
          padding: 20
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>📊 Total Commandes</p>
          <h3 style={{ color: '#9effa5', fontSize: 28, margin: '8px 0 0' }}>
            {stats?.stats?.totalOrders || 0}
          </h3>
        </div>

        <div style={{
          background: 'rgba(186,11,32,0.1)',
          border: '1px solid rgba(186,11,32,0.2)',
          borderRadius: 8,
          padding: 20
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>💵 Revenu Total</p>
          <h3 style={{ color: '#ba0b20', fontSize: 28, margin: '8px 0 0' }}>
            ${stats?.stats?.totalRevenue?.toFixed(2) || '0.00'}
          </h3>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: 20
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>👥 Utilisateurs</p>
          <h3 style={{ color: '#fff', fontSize: 28, margin: '8px 0 0' }}>
            {stats?.stats?.totalUsers || 0}
          </h3>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: 20
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>📈 Revenu Moyen</p>
          <h3 style={{ color: '#9effa5', fontSize: 28, margin: '8px 0 0' }}>
            ${stats?.stats?.totalOrders ? (stats.stats.totalRevenue / stats.stats.totalOrders).toFixed(2) : '0.00'}
          </h3>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 style={{ color: '#fff', marginBottom: 16 }}>Commandes Récentes</h2>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          {stats?.recentOrders?.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.6)', padding: 20, margin: 0 }}>Aucune commande</p>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: 0
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Client</th>
                  <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Total</th>
                  <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Paiement</th>
                  <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 12, color: '#fff', fontSize: 13 }}>{order.orderNumber}</td>
                    <td style={{ padding: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                      {order.shippingAddress?.name || 'Anonyme'}
                    </td>
                    <td style={{ padding: 12, color: '#9effa5', fontWeight: 'bold' }}>
                      ${order.total?.toFixed(2) || '0.00'}
                    </td>
                    <td style={{ padding: 12, color: order.paymentStatus === 'completed' ? '#9effa5' : '#ba0b20' }}>
                      {order.paymentStatus}
                    </td>
                    <td style={{ padding: 12, color: '#fff', fontSize: 13 }}>
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
