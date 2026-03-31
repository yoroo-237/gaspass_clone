import React, { useState, useEffect } from 'react'
import '../../styles/admin.css'

const EMPTY_FORM = {
  name: '', slug: '', grade: '', tier: '', thc: '', cbd: '',
  type: '', description: '', active: true
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Erreur fetch produits:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const url = editingId
        ? `http://localhost:5000/api/admin/products/${editingId}`
        : 'http://localhost:5000/api/admin/products'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (res.ok) { resetForm(); fetchProducts() }
      else alert('Erreur lors de la sauvegarde')
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (productId) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchProducts()
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))
  const setCheck = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.checked }))

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Produits</h1>
        <button
          onClick={() => { if (showForm) resetForm(); else setShowForm(true) }}
          className={`admin-btn ${showForm ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
        >
          {showForm ? '✕ Annuler' : '+ Nouveau Produit'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-section-card" style={{ marginBottom: 24 }}>
          <div className="admin-section-header">
            <h2 className="admin-section-title">
              {editingId ? '✏️ Modifier le Produit' : '✨ Nouveau Produit'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div className="admin-form-grid" style={{ marginBottom: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nom du Produit *</label>
                <input type="text" className="admin-form-input"
                  placeholder="Ex: Fleur OG Kush" value={formData.name}
                  onChange={set('name')} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug *</label>
                <input type="text" className="admin-form-input"
                  placeholder="Ex: fleur-og-kush" value={formData.slug}
                  onChange={set('slug')} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Grade</label>
                <input type="text" className="admin-form-input"
                  placeholder="Ex: Premium" value={formData.grade}
                  onChange={set('grade')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tier</label>
                <input type="text" className="admin-form-input"
                  placeholder="Ex: Elite" value={formData.tier}
                  onChange={set('tier')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">THC %</label>
                <input type="text" className="admin-form-input"
                  placeholder="Ex: 20.5" value={formData.thc}
                  onChange={set('thc')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">CBD %</label>
                <input type="text" className="admin-form-input"
                  placeholder="Ex: 0.2" value={formData.cbd}
                  onChange={set('cbd')} />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 16 }}>
              <label className="admin-form-label">Type</label>
              <input type="text" className="admin-form-input"
                placeholder="Ex: Fleur, Résine, Huile…" value={formData.type}
                onChange={set('type')} />
            </div>

            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-textarea"
                placeholder="Description complète du produit…" value={formData.description}
                onChange={set('description')} />
            </div>

            <label className="admin-checkbox-label" style={{ marginBottom: 24 }}>
              <input type="checkbox" checked={formData.active} onChange={setCheck('active')} />
              Produit actif (visible sur la boutique)
            </label>

            <div className="admin-form-actions">
              <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                {saving
                  ? <><div className="admin-loading-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} /> Enregistrement…</>
                  : editingId ? '💾 Enregistrer' : '✓ Créer le Produit'
                }
              </button>
              <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2 className="admin-section-title">📋 Liste des Produits</h2>
          <span style={{ fontSize: 12, color: 'var(--adm-text-muted)' }}>
            {products.length} produit(s)
          </span>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" /> Chargement…
          </div>
        ) : products.length === 0 ? (
          <div className="admin-table-empty">Aucun produit enregistré</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Slug</th>
                <th>Tier</th>
                <th>Type</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--adm-mono)', fontSize: 12, color: 'var(--adm-text-secondary)' }}>
                      {product.slug}
                    </span>
                  </td>
                  <td>{product.tier || '—'}</td>
                  <td>{product.type || '—'}</td>
                  <td>
                    <span className={`admin-badge ${product.active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {product.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(product)}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '5px 12px', fontSize: 12 }}>
                        ✏️ Éditer
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '5px 12px', fontSize: 12 }}>
                        🗑 Supprimer
                      </button>
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