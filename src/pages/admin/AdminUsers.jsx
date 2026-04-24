import React, { useState, useEffect } from 'react'
import {
  ArrowLeft, User, Package, DollarSign, Mail, Phone,
  ShieldCheck, Calendar, Trash2, ChevronDown, Shield
} from 'lucide-react'
import { getAdminUsers, getAdminOrders } from '../../api/client'
import '../../styles/admin.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// What roles can the current admin assign
const ASSIGNABLE_ROLES = {
  admin:      ['customer', 'admin'],
  superadmin: ['customer', 'admin', 'superadmin'],
}

const ROLE_BADGE = {
  superadmin: 'admin-badge-gold',
  admin:      'admin-badge-success',
  customer:   'admin-badge-info',
}

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('adminToken')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Server error')
  return data
}

// Decode JWT to get current admin role (no lib needed — just parse payload)
const getCurrentAdminRole = () => {
  try {
    const token = localStorage.getItem('adminToken')
    if (!token) return 'admin'
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || 'admin'
  } catch {
    return 'admin'
  }
}

export default function AdminUsers() {
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userOrders, setUserOrders]     = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [roleUpdating, setRoleUpdating] = useState(null)
  const [deleting, setDeleting]         = useState(null)
  const [search, setSearch]             = useState('')

  const currentRole = getCurrentAdminRole()
  const isSuperAdmin = currentRole === 'superadmin'
  const assignable = ASSIGNABLE_ROLES[currentRole] || ASSIGNABLE_ROLES.admin

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAdminUsers(0, 100)
      setUsers(data.users || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleViewUser = async (user) => {
    setSelectedUser(user)
    setUserOrders([])
    setLoadingOrders(true)
    try {
      const data = await getAdminOrders(0, 200)
      setUserOrders((data.orders || []).filter((o) => o.userId === user.id))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    if (!assignable.includes(newRole)) return
    setRoleUpdating(userId)
    try {
      await apiFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      })
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, role: newRole }))
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setRoleUpdating(null)
    }
  }

  const handleDelete = async (userId, email) => {
    if (!isSuperAdmin) return
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return
    setDeleting(userId)
    try {
      await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      if (selectedUser?.id === userId) setSelectedUser(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.phone?.includes(search) ||
          u.role?.includes(search.toLowerCase())
      )
    : users

  const totalSpent = userOrders.reduce((s, o) => s + (o.total || 0), 0)
  const getBadge = (status) =>
    status === 'completed' ? 'admin-badge-success' : 'admin-badge-pending'

  /* ─── DETAIL VIEW ─── */
  if (selectedUser)
    return (
      <div>
        <div className="admin-page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSelectedUser(null)}
              className="admin-btn admin-btn-ghost"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="admin-page-title">User Profile</h1>
          </div>
          <span className={`admin-badge ${ROLE_BADGE[selectedUser.role] || 'admin-badge-info'}`}>
            {selectedUser.role}
          </span>
        </div>

        {/* Stats */}
        <div
          className="admin-stats-grid"
          style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}
        >
          <div className="admin-stat-card navy">
            <div className="admin-stat-header">
              <p className="admin-stat-label">Orders</p>
              <span className="admin-stat-icon"><Package size={18} /></span>
            </div>
            <p className="admin-stat-value">{userOrders.length}</p>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <p className="admin-stat-label">Total Spent</p>
              <span className="admin-stat-icon"><DollarSign size={18} /></span>
            </div>
            <p className="admin-stat-value">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <p className="admin-stat-label">Avg Order</p>
              <span className="admin-stat-icon"><DollarSign size={18} /></span>
            </div>
            <p className="admin-stat-value">
              ${userOrders.length ? (totalSpent / userOrders.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Profile card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <User size={15} /> Profile
                </h2>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { Icon: Mail,        label: 'Email',  value: selectedUser.email },
                  { Icon: Phone,       label: 'Phone',  value: selectedUser.phone || '—' },
                  { Icon: Calendar,    label: 'Joined', value: new Date(selectedUser.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { Icon: ShieldCheck, label: 'Verified', value: selectedUser.verified ? 'Yes' : 'No' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Icon size={15} style={{ color: 'var(--text-mid)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-light)', marginBottom: 2 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-dark)' }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role management */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <Shield size={15} /> Role
                </h2>
              </div>
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>
                  Current role:{' '}
                  <span className={`admin-badge ${ROLE_BADGE[selectedUser.role] || 'admin-badge-info'}`}>
                    {selectedUser.role}
                  </span>
                </p>
                <div className="admin-form-group">
                  <label className="admin-form-label">Change role</label>
                  <select
                    className="admin-form-select"
                    value={selectedUser.role}
                    disabled={roleUpdating === selectedUser.id}
                    onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                  >
                    {assignable.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                {roleUpdating === selectedUser.id && (
                  <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>Updating…</p>
                )}

                {/* Delete — superadmin only */}
                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(selectedUser.id, selectedUser.email)}
                    disabled={deleting === selectedUser.id}
                    className="admin-btn admin-btn-danger"
                    style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
                  >
                    <Trash2 size={14} />
                    {deleting === selectedUser.id ? 'Deleting…' : 'Delete this user'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <Package size={15} /> Order History
              </h2>
              <span className="admin-card-count">{userOrders.length}</span>
            </div>
            {loadingOrders ? (
              <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
            ) : userOrders.length === 0 ? (
              <div className="admin-table-empty">No orders for this user</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>
                        #{order.orderNumber}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--orange)' }}>
                        ${order.total?.toFixed(2)}
                      </td>
                      <td style={{ color: 'var(--text-mid)', fontSize: 13 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td>
                        <span className={`admin-badge ${getBadge(order.status)}`}>
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
      </div>
    )

  /* ─── LIST VIEW ─── */
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
        <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>
          {filtered.length} user(s)
          {isSuperAdmin && (
            <span className="admin-badge admin-badge-gold" style={{ marginLeft: 10 }}>
              Superadmin
            </span>
          )}
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          className="admin-form-input"
          placeholder="Search by email, phone or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">No users found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.email}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{user.phone || '—'}</td>
                  <td>
                    <span className={`admin-badge ${ROLE_BADGE[user.role] || 'admin-badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-mid)' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <select
                        className="admin-form-select"
                        value={user.role}
                        disabled={roleUpdating === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{ fontSize: 12, padding: '5px 28px 5px 10px', minWidth: 120 }}
                      >
                        {assignable.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    {roleUpdating === user.id && (
                      <div className="admin-spinner" style={{ width: 12, height: 12, borderWidth: 2, display: 'inline-block', marginLeft: 8 }} />
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleViewUser(user)}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '6px 14px', fontSize: 12 }}
                      >
                        View →
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={deleting === user.id}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                        >
                          <Trash2 size={13} />
                          {deleting === user.id ? '…' : ''}
                        </button>
                      )}
                    </div>
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