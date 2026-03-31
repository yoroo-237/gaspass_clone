import React, { useState, useEffect } from 'react'
import '../../styles/admin.css'

const STATUS_LABELS = {
  pending:    'En attente',
  processing: 'En traitement',
  shipped:    'Expédiée',
  completed:  'Complétée',
}

const PAYMENT_LABELS = {
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
      console.error('Erreur fetch commandes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [filter])

  const updateField = async (orderId, payload) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, ...payload }))
        }
      }
    } catch (err) {
      console.error('Erreur mise à jour:', err)
    }
  }

  const getBadgeClass = status =>
    status === 'completed'  ? 'admin-badge-success'  :
    status === 'processing' ? 'admin-badge-info'     :
    status === 'shipped'    ? 'admin-badge-info'     :
    'admin-badge-pending'

  const FILTERS = ['all', 'pending', 'processing', 'shipped', 'completed']

  /* ── Detail view ── */
  if (selectedOrder) return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedOrder(null)} className="admin-btn admin-btn-ghost">
            ← Retour
          </button>
          <h1 className="admin-page-title">Commande #{selectedOrder.orderNumber}</h1>
        </div>
        <span className={`admin-badge ${getBadgeClass(selectedOrder.status)}`} style={{ fontSize: 12 }}>
          {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Articles */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <h2 className="admin-section-title">🛍️ Articles ({selectedOrder.items?.length || 0})</h2>
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
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: 'var(--adm-text-secondary)' }}>{item.weight}</td>
                    <td>×{item.quantity}</td>
                    <td className="admin-card-accent" style={{ fontWeight: 600 }}>
                      ${(item.subtotal || item.pricePerUnit * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '0 20px' }}>
              <div className="admin-total-row">
                <span className="admin-total-label">Total commande</span>
                <span className="admin-total-value">${selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ height: 16 }} />
          </div>

          {/* Delivery address */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <h2 className="admin-section-title">📍 Adresse de Livraison</h2>
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
                  <span className="admin-info-label">Ville / CP</span>
                  <span className="admin-info-value">
                    {selectedOrder.shippingAddress?.city}{selectedOrder.shippingAddress?.zipcode ? `, ${selectedOrder.shippingAddress.zipcode}` : ''}
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

        {/* Right column — status controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="admin-section-card">
            <div className="admin-section-header">
              <h2 className="admin-section-title">⚙️ Mise à Jour</h2>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Statut Commande</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => updateField(selectedOrder.id, { status: e.target.value })}
                  className="admin-form-select"
                >
                  {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Statut Paiement</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={e => updateField(selectedOrder.id, { paymentStatus: e.target.value })}
                  className="admin-form-select"
                >
                  {Object.entries(PAYMENT_LABELS).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div className="admin-card" data-accent="green">
            <div className="admin-card-content">
              <div className="admin-card-label">Montant Total</div>
              <div className="admin-card-value">${selectedOrder.total?.toFixed(2)}</div>
              <div className="admin-card-trend">
                <span className={`admin-badge ${getBadgeClass(selectedOrder.paymentStatus)}`} style={{ marginTop: 10 }}>
                  {PAYMENT_LABELS[selectedOrder.paymentStatus] || selectedOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /* ── List view ── */
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Commandes</h1>
        <span style={{ fontSize: 13, color: 'var(--adm-text-muted)' }}>
          {orders.length} commande(s)
        </span>
      </div>

      {/* Filters */}
      <div className="admin-btn-filters">
        {FILTERS.map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`admin-btn-filter ${filter === status ? 'active' : ''}`}
          >
            {status === 'all' ? '📊 Toutes' : STATUS_LABELS[status] || status}
          </button>
        ))}
      </div>

      <div className="admin-section-card">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" /> Chargement…
          </div>
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
                  <td>
                    <span style={{ fontFamily: 'var(--adm-mono)', fontSize: 12 }}>
                      #{order.orderNumber}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{order.shippingAddress?.name || '—'}</td>
                  <td className="admin-card-accent" style={{ fontWeight: 600 }}>
                    ${order.total?.toFixed(2)}
                  </td>
                  <td>
                    <span className={`admin-badge ${getBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${getBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
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