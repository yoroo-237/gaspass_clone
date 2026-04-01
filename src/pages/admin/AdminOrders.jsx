import React, { useState, useEffect } from 'react'
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react'
import '../../styles/admin.css'

const STATUS_FR = {
  pending:    'En attente',
  processing: 'En traitement',
  shipped:    'Expédiée',
  completed:  'Complétée',
}

const PAYMENT_FR = {
  pending:    'En attente',
  processing: 'En traitement',
  completed:  'Complété',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const url = filter === 'all'
        ? 'http://localhost:5000/api/admin/orders'
        : `http://localhost:5000/api/admin/orders?status=${filter}`
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [filter])

  const updateOrder = async (orderId, payload) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId)
          setSelectedOrder(prev => ({ ...prev, ...payload }))
      }
    } catch (err) { console.error(err) }
  }

  const getBadge = status =>
    status === 'completed'  ? 'admin-badge-success' :
    status === 'processing' ? 'admin-badge-info'    :
    status === 'shipped'    ? 'admin-badge-info'    :
    'admin-badge-pending'

  const FILTERS = ['all', 'pending', 'processing', 'shipped', 'completed']

  /* ─── DETAIL VIEW ─── */
  if (selectedOrder) return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedOrder(null)} className="admin-btn admin-btn-ghost">
            <ArrowLeft size={15} /> Retour
          </button>
          <h1 className="admin-page-title">Commande #{selectedOrder.orderNumber}</h1>
        </div>
        <span className={`admin-badge ${getBadge(selectedOrder.status)}`} style={{ fontSize: 12 }}>
          {STATUS_FR[selectedOrder.status] || selectedOrder.status}
        </span>
      </div>

      <div className="admin-detail-grid">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Items */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={15} /> Articles ({selectedOrder.items?.length || 0})
              </h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Poids</th>
                  <th>Qté</th>
                  <th>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td style={{ color: 'var(--text-mid)' }}>{item.weight}</td>
                    <td>×{item.quantity}</td>
                    <td style={{ fontWeight: 700, color: 'var(--orange)' }}>
                      ${(item.subtotal || item.pricePerUnit * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-total-row">
              <span className="admin-total-label">Total</span>
              <span className="admin-total-value">${selectedOrder.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} /> Adresse de Livraison
              </h2>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div className="admin-info-grid">
                <div className="admin-info-item">
                  <span className="admin-info-label">Nom</span>
                  <span className="admin-info-value">{selectedOrder.shippingAddress?.name || '—'}</span>
                </div>
                <div className="admin-info-item">
                  <span className="admin-info-label">Email</span>
                  <span className="admin-info-value">{selectedOrder.shippingAddress?.email || '—'}</span>
                </div>
                <div className="admin-info-item">
                  <span className="admin-info-label">Téléphone</span>
                  <span className="admin-info-value">{selectedOrder.shippingAddress?.phone || '—'}</span>
                </div>
                <div className="admin-info-item">
                  <span className="admin-info-label">Ville</span>
                  <span className="admin-info-value">
                    {[selectedOrder.shippingAddress?.city, selectedOrder.shippingAddress?.zipcode].filter(Boolean).join(', ') || '—'}
                  </span>
                </div>
                <div className="admin-info-item" style={{ gridColumn: '1/-1' }}>
                  <span className="admin-info-label">Adresse</span>
                  <span className="admin-info-value">{selectedOrder.shippingAddress?.address || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — status controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={15} /> Mise à Jour
              </h2>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Statut Commande</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => updateOrder(selectedOrder.id, { status: e.target.value })}
                  className="admin-form-select"
                >
                  {Object.entries(STATUS_FR).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Statut Paiement</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={e => updateOrder(selectedOrder.id, { paymentStatus: e.target.value })}
                  className="admin-form-select"
                >
                  {Object.entries(PAYMENT_FR).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amount summary */}
          <div className="admin-stat-card navy">
            <div className="admin-stat-header">
              <p className="admin-stat-label">Montant Total</p>
            </div>
            <p className="admin-stat-value">${selectedOrder.total?.toFixed(2)}</p>
            <div style={{ marginTop: 12 }}>
              <span className={`admin-badge ${getBadge(selectedOrder.paymentStatus)}`}>
                {PAYMENT_FR[selectedOrder.paymentStatus] || selectedOrder.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /* ─── LIST VIEW ─── */
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Commandes</h1>
        <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>{orders.length} résultat(s)</span>
      </div>

      <div className="admin-filters">
        {FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`admin-filter-btn ${filter === s ? 'active' : ''}`}
          >
            {s === 'all' ? 'Toutes' : STATUS_FR[s]}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Chargement…</div>
        ) : orders.length === 0 ? (
          <div className="admin-table-empty">Aucune commande trouvée</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Total</th>
                <th>Paiement</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>
                    #{order.orderNumber}
                  </td>
                  <td style={{ fontWeight: 500 }}>{order.shippingAddress?.name || '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--orange)' }}>${order.total?.toFixed(2)}</td>
                  <td><span className={`admin-badge ${getBadge(order.paymentStatus)}`}>{order.paymentStatus}</span></td>
                  <td><span className={`admin-badge ${getBadge(order.status)}`}>{order.status}</span></td>
                  <td>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="admin-btn admin-btn-ghost"
                      style={{ padding: '6px 14px', fontSize: 12 }}
                    >
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