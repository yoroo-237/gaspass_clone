import React, { useState, useEffect } from 'react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
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
    fetchUsers()
  }, [])

  return (
    <div>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>Gestion Utilisateurs</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Email</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Téléphone</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Telegram</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Rôle</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: 12, color: '#fff' }}>{user.email}</td>
              <td style={{ padding: 12, color: 'rgba(255,255,255,0.7)' }}>{user.phone || '-'}</td>
              <td style={{ padding: 12, color: user.telegramConnected ? '#9effa5' : 'rgba(255,255,255,0.4)' }}>
                {user.telegramConnected ? '✅ Lié' : '-'}
              </td>
              <td style={{ padding: 12, color: '#fff' }}>{user.role}</td>
              <td style={{ padding: 12 }}>
                <button style={{
                  padding: '6px 12px',
                  background: '#ba0b20',
                  border: 'none',
                  borderRadius: 4,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 12
                }}>
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
