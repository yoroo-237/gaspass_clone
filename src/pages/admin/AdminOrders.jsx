import React, { useState, useEffect } from 'react'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const url = filter === 'all' 
          ? 'http://localhost:5000/api/admin/orders'
          : `http://localhost:5000/api/admin/orders?status=${filter}`
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error('Erreur fetch commandes:', err)
      }
    }
    fetchOrders()
  }, [filter])

  return (
    <div>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>Gestion Commandes</h1>
      
      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        {['all', 'pending', 'processing', 'shipped', 'completed'].map(status => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              background: filter === status ? '#ba0b20' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Commande</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Total</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Paiement</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Status</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: 12, color: '#fff' }}>{order.orderNumber}</td>
              <td style={{ padding: 12, color: '#fff' }}>${order.total}</td>
              <td style={{ padding: 12, color: order.paymentStatus === 'completed' ? '#9effa5' : '#ba0b20' }}>
                {order.paymentStatus}
              </td>
              <td style={{ padding: 12, color: '#fff' }}>{order.status}</td>
              <td style={{ padding: 12 }}>
                <button style={{
                  padding: '6px 12px',
                  background: '#9effa5',
                  border: 'none',
                  borderRadius: 4,
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: 12
                }}>
                  Détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
