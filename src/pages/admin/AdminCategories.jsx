import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, Tag } from 'lucide-react'
import '../../styles/admin.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const EMPTY = { name: '', slug: '', description: '', active: true }

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
  if (!res.ok) throw new Error(data.error || 'Erreur serveur')
  return data
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await apiFetch('/api/categories')
      setCategories(data.categories || data || [])
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (cat) => {
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      active: cat.active !== false,
    })
    setEditingId(cat.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ? Les produits liés ne seront pas supprimés.')) return
    try {
      await apiFetch(`/api/categories/admin/${id}`, { method: 'DELETE' })
      fetchCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  const autoSlug = (name) =>
    name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const set = (k) => (e) => {
    const val = e.target.value
    setForm((p) => ({
      ...p,
      [k]: val,
      ...(k === 'name' && !editingId ? { slug: autoSlug(val) } : {}),
    }))
  }
  const setCheck = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.checked }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await apiFetch(`/api/categories/admin/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
      } else {
        await apiFetch('/api/categories/admin', {
          method: 'POST',
          body: JSON.stringify(form),
        })
      }
      resetForm()
      fetchCategories()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories</h1>
        <button
          onClick={() => { if (showForm) resetForm(); else setShowForm(true) }}
          className={`admin-btn ${showForm ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
        >
          {showForm
            ? <><ArrowLeft size={15} /> Cancel</>
            : <><Plus size={15} /> New Category</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <Tag size={15} style={{ marginRight: 8 }} />
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 24 }}>
            <div className="admin-form-grid" style={{ marginBottom: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Name *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Flowers"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. flowers"
                  value={form.slug}
                  onChange={set('slug')}
                  required
                />
                <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                  Auto-generated from name. Used in URLs.
                </p>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label">Description</label>
              <textarea
                className="admin-form-textarea"
                placeholder="Short description of this category…"
                value={form.description}
                onChange={set('description')}
              />
            </div>

            <label className="admin-checkbox-row" style={{ marginBottom: 24 }}>
              <input type="checkbox" checked={form.active} onChange={setCheck('active')} />
              Active (visible on the store)
            </label>

            {error && (
              <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div className="admin-form-actions">
              <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                {saving
                  ? <><div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</>
                  : editingId ? 'Save Changes' : 'Create Category'}
              </button>
              <button type="button" onClick={resetForm} className="admin-btn admin-btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">All Categories</h2>
          <span className="admin-card-count">{categories.length}</span>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" /> Loading…
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-table-empty">
            No categories yet — create your first one above.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>
                    {cat.slug}
                  </td>
                  <td style={{ color: 'var(--text-mid)', fontSize: 13, maxWidth: 260 }}>
                    {cat.description
                      ? cat.description.length > 60
                        ? cat.description.slice(0, 60) + '…'
                        : cat.description
                      : '—'}
                  </td>
                  <td>
                    <span className={`admin-badge ${cat.active !== false ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {cat.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleEdit(cat)}
                        className="admin-btn admin-btn-ghost"
                        style={{ padding: '5px 12px', fontSize: 12, gap: 6 }}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '5px 12px', fontSize: 12, gap: 6 }}
                      >
                        <Trash2 size={13} /> Delete
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
