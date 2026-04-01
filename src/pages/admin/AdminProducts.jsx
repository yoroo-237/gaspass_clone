import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'
import '../../styles/admin.css'

const EMPTY = { name:'', slug:'', grade:'', tier:'', thc:'', cbd:'', type:'', description:'', active:true }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('http://localhost:5000/api/admin/products', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const resetForm = () => { setEditingId(null); setForm(EMPTY); setShowForm(false) }

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
        body: JSON.stringify(form)
      })
      if (res.ok) { resetForm(); fetchProducts() }
      else alert('Erreur lors de la sauvegarde')
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleEdit = (p) => { setForm(p); setEditingId(p.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchProducts()
    } catch (err) { console.error(err) }
  }

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const setCheck = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked }))

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Produits</h1>
        <button
          onClick={() => { if (showForm) resetForm(); else setShowForm(true) }}
          className={`admin-btn ${showForm ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
        >
          {showForm ? <><ArrowLeft size={15} /> Annuler</> : <><Plus size={15} /> Nouveau Produit</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              {editingId ? 'Modifier le Produit' : 'Nouveau Produit'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <div className="admin-form-grid" style={{ marginBottom: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nom *</label>
                <input type="text" className="admin-form-input" placeholder="Ex: Fleur OG Kush"
                  value={form.name} onChange={set('name')} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug *</label>
                <input type="text" className="admin-form-input" placeholder="Ex: fleur-og-kush"
                  value={form.slug} onChange={set('slug')} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Grade</label>
                <input type="text" className="admin-form-input" placeholder="Ex: Premium"
                  value={form.grade} onChange={set('grade')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tier</label>
                <input type="text" className="admin-form-input" placeholder="Ex: Elite"
                  value={form.tier} onChange={set('tier')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">THC %</label>
                <input type="text" className="admin-form-input" placeholder="Ex: 20.5"
                  value={form.thc} onChange={set('thc')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">CBD %</label>
                <input type="text" className="admin-form-input" placeholder="Ex: 0.2"
                  value={form.cbd} onChange={set('cbd')} />
              </div>
            </div>
            <div className="admin-form-group" style={{ marginBottom: 16 }}>
              <label className="admin-form-label">Type</label>
              <input type="text" className="admin-form-input" placeholder="Ex: Fleur, Résine…"
                value={form.type} onChange={set('type')} />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-textarea" placeholder="Description complète…"
                value={form.description} onChange={set('description')} />
            </div>
            <label className="admin-checkbox-row" style={{ marginBottom: 24 }}>
              <input type="checkbox" checked={form.active} onChange={setCheck('active')} />
              Produit actif (visible sur la boutique)
            </label>
            <div className="admin-form-actions">
              <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                {saving
                  ? <><div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Enregistrement…</>
                  : editingId ? 'Enregistrer' : 'Créer le Produit'
                }
              </button>
              <button type="button" onClick={resetForm} className="admin-btn admin-btn-ghost">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Liste des Produits</h2>
          <span className="admin-card-count">{products.length}</span>
        </div>
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Chargement…</div>
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
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>{p.slug}</td>
                  <td>{p.tier || '—'}</td>
                  <td>{p.type || '—'}</td>
                  <td>
                    <span className={`admin-badge ${p.active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {p.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(p)}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '5px 12px', fontSize: 12, gap: 6 }}>
                        <Pencil size={13} /> Éditer
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '5px 12px', fontSize: 12, gap: 6 }}>
                        <Trash2 size={13} /> Supprimer
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