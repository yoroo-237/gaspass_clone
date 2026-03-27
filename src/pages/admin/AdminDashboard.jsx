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

  if (loading) return <div style={{ color: '#fff' }}>Chargement...</div>

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
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Total Commandes</p>
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
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Revenu Total</p>
          <h3 style={{ color: '#ba0b20', fontSize: 28, margin: '8px 0 0' }}>
            ${stats?.stats?.totalRevenue?.toFixed(2) || 0}
          </h3>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: 20
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Total Utilisateurs</p>
          <h3 style={{ color: '#fff', fontSize: 28, margin: '8px 0 0' }}>
            {stats?.stats?.totalUsers || 0}
          </h3>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 style={{ color: '#fff', marginBottom: 16 }}>Commandes Récentes</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 40
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>ID</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Client</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Total</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders?.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: 12, color: '#fff' }}>{order.orderNumber}</td>
                <td style={{ padding: 12, color: 'rgba(255,255,255,0.7)' }}>User #{order.userId}</td>
                <td style={{ padding: 12, color: '#fff' }}>${order.total}</td>
                <td style={{ padding: 12, color: order.status === 'completed' ? '#9effa5' : '#ba0b20' }}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
