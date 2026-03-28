import React, { useState, useEffect } from 'react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('Erreur fetch utilisateurs:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleViewUser = async (user) => {
    setSelectedUser(user)
    // Fetch user's orders
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const allOrders = await res.json()
      const orders = allOrders.filter(order => order.userId === user.id)
      setUserOrders(orders)
    } catch (err) {
      console.error('Erreur fetch commandes utilisateur:', err)
    }
  }

  if (selectedUser) {
    return (
      <div>
        <button 
          onClick={() => setSelectedUser(null)}
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
          ← Retour aux utilisateurs
        </button>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
          <h2 style={{ color: '#fff', marginTop: 0 }}>Profil: {selectedUser.email}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>Email</p>
              <p style={{ color: '#fff', margin: 0 }}>{selectedUser.email}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>Téléphone</p>
              <p style={{ color: '#fff', margin: 0 }}>{selectedUser.phone || '-'}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>Rôle</p>
              <p style={{ color: '#fff', margin: 0 }}>{selectedUser.role}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>Inscrit</p>
              <p style={{ color: '#fff', margin: 0 }}>
                {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        <h3 style={{ color: '#fff', marginBottom: 12 }}>Commandes ({userOrders.length})</h3>
        
        {userOrders.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Aucune commande</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Commande</th>
                <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Total</th>
                <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Date</th>
                <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 12, color: '#fff' }}>{order.orderNumber}</td>
                  <td style={{ padding: 12, color: '#9effa5' }}>${order.total?.toFixed(2)}</td>
                  <td style={{ padding: 12, color: 'rgba(255,255,255,0.6)' }}>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: 12, color: order.status === 'completed' ? '#9effa5' : '#ba0b20' }}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>Gestion Utilisateurs ({users.length})</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Email</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Téléphone</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Rôle</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Inscrit</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: 12, color: '#fff' }}>{user.email}</td>
              <td style={{ padding: 12, color: 'rgba(255,255,255,0.7)' }}>{user.phone || '-'}</td>
              <td style={{ padding: 12, color: user.role === 'admin' ? '#9effa5' : '#fff' }}>{user.role}</td>
              <td style={{ padding: 12, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </td>
              <td style={{ padding: 12 }}>
                <button 
                  onClick={() => handleViewUser(user)}
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
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
