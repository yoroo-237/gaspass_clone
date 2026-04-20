import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, Package, DollarSign, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react'
import { getAdminUsers, getAdminOrders } from '../../api/client'
import '../../styles/admin.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers(0, 100)
        setUsers(data.users || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchUsers()
  }, [])

  const handleViewUser = async (user) => {
    setSelectedUser(user)
    setUserOrders([])
    setLoadingOrders(true)
    try {
      const data = await getAdminOrders(0, 100)
      setUserOrders((data.orders || []).filter(o => o.userId === user.id))
    } catch (err) { console.error(err) }
    finally { setLoadingOrders(false) }
  }

  const getBadge = status =>
    status === 'completed' ? 'admin-badge-success' : 'admin-badge-pending'

  const totalSpent = userOrders.reduce((s, o) => s + (o.total || 0), 0)

  /* ─── DETAIL ─── */
  if (selectedUser) return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedUser(null)} className="admin-btn admin-btn-ghost">
            <ArrowLeft size={15} /> Retour
          </button>
          <h1 className="admin-page-title">Profil Utilisateur</h1>
        </div>
        <span className={`admin-badge ${selectedUser.role === 'admin' ? 'admin-badge-success' : 'admin-badge-info'}`}>
          {selectedUser.role}
        </span>
      </div>

      {/* Stat cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        <div className="admin-stat-card navy">
          <div className="admin-stat-header">
            <p className="admin-stat-label">Commandes</p>
            <span className="admin-stat-icon"><Package size={18} /></span>
          </div>
          <p className="admin-stat-value">{userOrders.length}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <p className="admin-stat-label">Total Dépensé</p>
            <span className="admin-stat-icon"><DollarSign size={18} /></span>
          </div>
          <p className="admin-stat-value">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <p className="admin-stat-label">Panier Moyen</p>
            <span className="admin-stat-icon"><DollarSign size={18} /></span>
          </div>
          <p className="admin-stat-value">
            ${userOrders.length ? (totalSpent / userOrders.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Info + orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Profile card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={15} /> Informations
            </h2>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { Icon: Mail, label: 'Email', value: selectedUser.email },
              { Icon: Phone, label: 'Téléphone', value: selectedUser.phone || '—' },
              { Icon: ShieldCheck, label: 'Rôle', value: selectedUser.role },
              { Icon: Calendar, label: 'Inscrit le', value: new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon size={15} style={{ color: 'var(--text-mid)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-light)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-dark)' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={15} /> Historique des Commandes
            </h2>
            <span className="admin-card-count">{userOrders.length}</span>
          </div>
          {loadingOrders ? (
            <div className="admin-loading"><div className="admin-spinner" /> Chargement…</div>
          ) : userOrders.length === 0 ? (
            <div className="admin-table-empty">Aucune commande</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>#{order.orderNumber}</td>
                    <td style={{ fontWeight: 700, color: 'var(--orange)' }}>${order.total?.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-mid)', fontSize: 13 }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <span className={`admin-badge ${getBadge(order.status)}`}>{order.status}</span>
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

  /* ─── LIST ─── */
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Utilisateurs</h1>
        <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>{users.length} utilisateur(s)</span>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Chargement…</div>
        ) : users.length === 0 ? (
          <div className="admin-table-empty">Aucun utilisateur enregistré</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Inscription</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.email}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{user.phone || '—'}</td>
                  <td>
                    <span className={`admin-badge ${user.role === 'admin' ? 'admin-badge-success' : 'admin-badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-mid)' }}>
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <button onClick={() => handleViewUser(user)}
                      className="admin-btn admin-btn-ghost"
                      style={{ padding: '6px 14px', fontSize: 12 }}>
                      Voir →
                    </button>
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