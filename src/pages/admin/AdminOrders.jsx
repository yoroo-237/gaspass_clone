import React, { useState, useEffect } from 'react'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

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

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (err) {
      console.error('Erreur mise à jour:', err)
    }
  }

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      })
      
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus })
        }
      }
    } catch (err) {
      console.error('Erreur mise à jour:', err)
    }
  }

  return (
    <div>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>Gestion Commandes</h1>
      
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
              fontSize: 12,
              fontWeight: filter === status ? 'bold' : 'normal'
            }}
          >
            {status === 'all' ? '📊 Tous' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {selectedOrder ? (
        <div style={{ marginBottom: 24, background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={() => setSelectedOrder(null)}
            style={{
              background: '#ba0b20',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              marginBottom: 16
            }}
          >
            ← Retour aux commandes
          </button>

          <h2 style={{ color: '#fff', marginBottom: 16 }}>Commande {selectedOrder.orderNumber}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Statut Commande</p>
              <select 
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  color: '#fff',
                  marginTop: 8
                }}
              >
                <option value="pending">Attendant</option>
                <option value="processing">En traitement</option>
                <option value="shipped">Expédiée</option>
                <option value="completed">Complétée</option>
              </select>
            </div>

            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Statut Paiement</p>
              <select 
                value={selectedOrder.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  color: '#fff',
                  marginTop: 8
                }}
              >
                <option value="pending">Attendant</option>
                <option value="processing">En traitement</option>
                <option value="completed">Complété</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 6, marginBottom: 16 }}>
            <h3 style={{ color: '#9effa5', marginTop: 0 }}>Adresse de Livraison</h3>
            <p style={{ color: '#fff', margin: '4px 0' }}>{selectedOrder.shippingAddress?.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0', fontSize: 13 }}>{selectedOrder.shippingAddress?.address}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0', fontSize: 13 }}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipcode}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0', fontSize: 13 }}>📧 {selectedOrder.shippingAddress?.email}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0', fontSize: 13 }}>📱 {selectedOrder.shippingAddress?.phone}</p>
          </div>

          <div>
            <h3 style={{ color: '#9effa5', marginTop: 0 }}>Articles ({selectedOrder.items?.length || 0})</h3>
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 4, marginBottom: 8 }}>
                <p style={{ color: '#fff', margin: '0 0 4px' }}>{item.name} ({item.weight}) x{item.quantity}</p>
                <p style={{ color: '#9effa5', margin: 0 }}>${(item.subtotal || item.pricePerUnit * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>Total</p>
            <p style={{ color: '#9effa5', fontSize: 24, fontWeight: 'bold', margin: 0 }}>${selectedOrder.total?.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Commande</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Client</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Total</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Paiement</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Statut</th>
              <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: 12, color: '#fff', fontSize: 13 }}>{order.orderNumber}</td>
                <td style={{ padding: 12, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  {order.shippingAddress?.name || 'Anonyme'}
                </td>
                <td style={{ padding: 12, color: '#fff' }}>${order.total?.toFixed(2)}</td>
                <td style={{ padding: 12, color: order.paymentStatus === 'completed' ? '#9effa5' : '#ba0b20', fontSize: 12 }}>
                  {order.paymentStatus}
                </td>
                <td style={{ padding: 12, color: '#fff', fontSize: 12 }}>{order.status}</td>
                <td style={{ padding: 12 }}>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '6px 12px',
                      background: '#9effa5',
                      border: 'none',
                      borderRadius: 4,
                      color: '#000',
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
