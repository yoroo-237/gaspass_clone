import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, X } from 'lucide-react'
import { getAdminProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../api/client'
import '../../styles/admin.css'

const EMPTY = { name:'', slug:'', grade:'', tier:'', thc:'', cbd:'', type:'', description:'', active:true, images:[] }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getAdminProducts(0, 100)
      setProducts(data.products || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const resetForm = () => { setEditingId(null); setForm(EMPTY); setShowForm(false); setSelectedFiles([]) }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const removeImage = (idx) => {
    setForm(p => ({
      ...p,
      images: (p.images || []).filter((_, i) => i !== idx)
    }))
  }

  const removeSelectedFile = (idx) => {
    setSelectedFiles(files => files.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      let uploadedUrls = form.images || []
      
      // Upload new images if selected
      if (selectedFiles.length > 0) {
        setUploadingImages(true)
        const urls = []
        for (const file of selectedFiles) {
          try {
            const result = await uploadImage(file)
            if (result.url) urls.push(result.url)
          } catch (err) {
            console.error('Image upload error:', err)
            alert(`Erreur upload: ${err.message}`)
          }
        }
        uploadedUrls = [...uploadedUrls, ...urls]
        setUploadingImages(false)
      }
      
      const formData = { ...form, images: uploadedUrls }
      
      if (editingId) {
        await updateProduct(editingId, formData)
      } else {
        await createProduct(formData)
      }
      resetForm()
      setSelectedFiles([])
      fetchProducts()
    } catch (err) { 
      console.error(err)
      alert('Erreur lors de la sauvegarde')
    } finally { 
      setSaving(false)
      setUploadingImages(false)
    }
  }

  const handleEdit = (p) => { 
    const productWithImages = {
      ...p,
      images: (p.images || []).map(img => 
        img.startsWith('http') || img.startsWith('/') ? img : `/uploads/${img}`
      )
    }
    setForm(productWithImages)
    setEditingId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
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

            {/* Images section */}
            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <label className="admin-form-label">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="admin-form-input"
                style={{ cursor: 'pointer' }}
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                (JPEG, PNG, WebP, GIF — Max 5MB par image)
              </p>

              {/* Preview images existantes */}
              {form.images && form.images.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#111' }}>Images existantes:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                    {form.images.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
                        <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.7)',
                            border: 'none',
                            color: 'white',
                            padding: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview fichiers sélectionnés */}
              {selectedFiles.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#111' }}>À uploader:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: 4, overflow: 'hidden', border: '2px dashed #ba0b20', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(186,11,32,0.05)' }}>
                        <div style={{ textAlign: 'center', fontSize: 10, color: '#ba0b20' }}>
                          <div>{file.name.substring(0, 15)}</div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            style={{
                              marginTop: 4,
                              background: '#ba0b20',
                              color: 'white',
                              border: 'none',
                              padding: '2px 6px',
                              borderRadius: 2,
                              cursor: 'pointer',
                              fontSize: 10,
                            }}
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <label className="admin-checkbox-row" style={{ marginBottom: 24 }}>
              <input type="checkbox" checked={form.active} onChange={setCheck('active')} />
              Produit actif (visible sur la boutique)
            </label>
            <div className="admin-form-actions">
              <button type="submit" disabled={saving || uploadingImages} className="admin-btn admin-btn-primary">
                {uploadingImages
                  ? <><div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Upload images…</>
                  : saving
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