import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, X } from 'lucide-react'
import { getAdminProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../api/client'
import '../../styles/admin.css'

// ✅ Oz instead of grams
const WEIGHTS = ['1/8 oz', '1/4 oz', '1 oz']

const EMPTY = {
  name:        '',
  slug:        '',
  grade:       '',
  tier:        '',
  thc:         '',
  cbd:         '',
  type:        '',
  lineage:     '',
  terpenes:    '',
  description: '',
  active:      true,
  images:      [],
  tags:        [],
  pricing: { '1/8 oz': '', '1/4 oz': '', '1 oz': '' },
  stock:   { '1/8 oz': '', '1/4 oz': '', '1 oz': '' },
}

export default function AdminProducts() {
  const [products, setProducts]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [showForm, setShowForm]           = useState(false)
  const [editingId, setEditingId]         = useState(null)
  const [form, setForm]                   = useState(EMPTY)
  const [saving, setSaving]               = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [tagInput, setTagInput]           = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getAdminProducts(0, 100)
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY)
    setShowForm(false)
    setSelectedFiles([])
    setTagInput('')
  }

  const handleFileSelect = (e) => setSelectedFiles(Array.from(e.target.files || []))

  const removeImage       = (idx) => setForm((p) => ({ ...p, images: (p.images || []).filter((_, i) => i !== idx) }))
  const removeSelectedFile = (idx) => setSelectedFiles((f) => f.filter((_, i) => i !== idx))

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !(form.tags || []).includes(t)) {
      setForm((p) => ({ ...p, tags: [...(p.tags || []), t] }))
    }
    setTagInput('')
  }
  const removeTag = (t) => setForm((p) => ({ ...p, tags: (p.tags || []).filter((x) => x !== t) }))

  const setPricing = (weight) => (e) => setForm((p) => ({ ...p, pricing: { ...p.pricing, [weight]: e.target.value } }))
  const setStock   = (weight) => (e) => setForm((p) => ({ ...p, stock:   { ...p.stock,   [weight]: e.target.value } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Upload images
      let uploadedUrls = form.images || []
      if (selectedFiles.length > 0) {
        setUploadingImages(true)
        for (const file of selectedFiles) {
          try {
            const result = await uploadImage(file)
            if (result.url) uploadedUrls = [...uploadedUrls, result.url]
          } catch (err) {
            alert(`Upload error: ${err.message}`)
          }
        }
        setUploadingImages(false)
      }

      // Clean pricing & stock
      const cleanPricing = {}
      const cleanStock   = {}
      WEIGHTS.forEach((w) => {
        if (form.pricing?.[w] !== '' && form.pricing?.[w] != null)
          cleanPricing[w] = Number(form.pricing[w])
        if (form.stock?.[w] !== '' && form.stock?.[w] != null)
          cleanStock[w] = Number(form.stock[w])
      })

      // ✅ Fix terpenes: always send as array
      const terpenes = typeof form.terpenes === 'string'
        ? form.terpenes.split(',').map((t) => t.trim()).filter(Boolean)
        : Array.isArray(form.terpenes) ? form.terpenes : []

      const payload = {
        ...form,
        images:   uploadedUrls,
        pricing:  cleanPricing,
        stock:    cleanStock,
        terpenes,
        tags: Array.isArray(form.tags) ? form.tags : [],
      }

      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      resetForm()
      fetchProducts()
    } catch (err) {
      console.error(err)
      alert('Save error: ' + err.message)
    } finally {
      setSaving(false)
      setUploadingImages(false)
    }
  }

  const handleEdit = (p) => {
    setForm({
      ...EMPTY,
      ...p,
      images:   (p.images || []),
      pricing:  { '1/8 oz': '', '1/4 oz': '', '1 oz': '', ...(p.pricing || {}) },
      stock:    { '1/8 oz': '', '1/4 oz': '', '1 oz': '', ...(p.stock || {}) },
      tags:     p.tags || [],
      // ✅ Display terpenes array as comma string for the input
      terpenes: Array.isArray(p.terpenes) ? p.terpenes.join(', ') : (p.terpenes || ''),
    })
    setEditingId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (err) { console.error(err) }
  }

  const set      = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const setCheck = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.checked }))
  const autoSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button
          onClick={() => { if (showForm) resetForm(); else setShowForm(true) }}
          className={`admin-btn ${showForm ? 'admin-btn-ghost' : 'admin-btn-primary'}`}
        >
          {showForm
            ? <><ArrowLeft size={15} /> Cancel</>
            : <><Plus size={15} /> New Product</>}
        </button>
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">{editingId ? 'Edit Product' : 'New Product'}</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24 }}>

            {/* Basic info */}
            <p className="admin-section-label">Basic Information</p>
            <div className="admin-form-grid" style={{ marginBottom: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Name *</label>
                <input type="text" className="admin-form-input" placeholder="e.g. OG Kush"
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setForm((p) => ({ ...p, name: val, ...(!editingId ? { slug: autoSlug(val) } : {}) }))
                  }}
                  required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug *</label>
                <input type="text" className="admin-form-input" placeholder="e.g. og-kush"
                  value={form.slug} onChange={set('slug')} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Grade</label>
                <input type="text" className="admin-form-input" placeholder="e.g. 91"
                  value={form.grade} onChange={set('grade')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tier</label>
                <input type="text" className="admin-form-input" placeholder="e.g. SUPREME"
                  value={form.tier} onChange={set('tier')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Type</label>
                <select className="admin-form-select" value={form.type} onChange={set('type')}>
                  <option value="">Select type…</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Indica">Indica</option>
                  <option value="Sativa">Sativa</option>
                  <option value="CBD">CBD</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">THC %</label>
                <input type="text" className="admin-form-input" placeholder="e.g. 28%"
                  value={form.thc} onChange={set('thc')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">CBD %</label>
                <input type="text" className="admin-form-input" placeholder="e.g. 0.2%"
                  value={form.cbd} onChange={set('cbd')} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Lineage</label>
                <input type="text" className="admin-form-input" placeholder="e.g. Chemdawg × Hindu Kush"
                  value={form.lineage} onChange={set('lineage')} />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 16 }}>
              <label className="admin-form-label">Terpenes</label>
              <input type="text" className="admin-form-input"
                placeholder="e.g. Myrcene, Limonene, Caryophyllene (comma separated)"
                value={form.terpenes} onChange={set('terpenes')} />
              <span className="admin-form-hint">Separate with commas — will be saved as a list</span>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 24 }}>
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-textarea" rows={4}
                placeholder="Full product description…"
                value={form.description} onChange={set('description')} />
            </div>

            {/* Pricing */}
            <p className="admin-section-label">Pricing (USD)</p>
            <div className="admin-form-grid" style={{ marginBottom: 24 }}>
              {WEIGHTS.map((w) => (
                <div className="admin-form-group" key={w}>
                  <label className="admin-form-label">Price — {w}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', fontSize: 13, color: '#888', pointerEvents: 'none'
                    }}>$</span>
                    <input type="number" min="0" step="0.01"
                      className="admin-form-input" style={{ paddingLeft: 24 }}
                      placeholder="0.00"
                      value={form.pricing?.[w] ?? ''}
                      onChange={setPricing(w)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Stock */}
            <p className="admin-section-label">Stock (units)</p>
            <div className="admin-form-grid" style={{ marginBottom: 24 }}>
              {WEIGHTS.map((w) => (
                <div className="admin-form-group" key={w}>
                  <label className="admin-form-label">Stock — {w}</label>
                  <input type="number" min="0" step="1"
                    className="admin-form-input" placeholder="0"
                    value={form.stock?.[w] ?? ''}
                    onChange={setStock(w)} />
                </div>
              ))}
            </div>

            {/* Tags */}
            <p className="admin-section-label">Tags</p>
            <div className="admin-form-group" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input type="text" className="admin-form-input"
                  placeholder="Add a tag and press Enter…"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  style={{ flex: 1 }} />
                <button type="button" onClick={addTag}
                  className="admin-btn admin-btn-ghost" style={{ padding: '8px 16px' }}>
                  Add
                </button>
              </div>
              {(form.tags || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(form.tags || []).map((t) => (
                    <span key={t} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: '#f0f0f0', borderRadius: 20, padding: '4px 10px', fontSize: 12
                    }}>
                      {t}
                      <button type="button" onClick={() => removeTag(t)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#666', display: 'flex' }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <p className="admin-section-label">Images</p>
            <div className="admin-form-group" style={{ marginBottom: 24 }}>
              <input type="file" multiple accept="image/*"
                onChange={handleFileSelect}
                className="admin-form-input" style={{ cursor: 'pointer' }} />
              <span className="admin-form-hint">JPEG, PNG, WebP — max 5MB each. Uploaded to Cloudinary.</span>

              {(form.images || []).length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Existing images:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {form.images.map((url, idx) => (
                      <div key={idx} style={{
                        position: 'relative', width: 80, height: 80,
                        borderRadius: 6, overflow: 'hidden', border: '1.5px solid #e0e0e0'
                      }}>
                        <img src={url} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeImage(idx)} style={{
                          position: 'absolute', top: 3, right: 3,
                          background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
                          borderRadius: '50%', width: 20, height: 20,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>To upload ({selectedFiles.length}):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} style={{
                        width: 80, height: 80, borderRadius: 6,
                        border: '2px dashed #111', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', background: '#fafafa', gap: 4
                      }}>
                        <span style={{ fontSize: 10, color: '#555', textAlign: 'center', padding: '0 4px', wordBreak: 'break-all' }}>
                          {file.name.substring(0, 12)}
                        </span>
                        <button type="button" onClick={() => removeSelectedFile(idx)} style={{
                          background: '#111', color: '#fff', border: 'none',
                          borderRadius: 3, padding: '2px 8px', cursor: 'pointer', fontSize: 10
                        }}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <label className="admin-checkbox-row" style={{ marginBottom: 24 }}>
              <input type="checkbox" checked={form.active} onChange={setCheck('active')} />
              Active — visible on the store
            </label>

            <div className="admin-form-actions">
              <button type="submit" disabled={saving || uploadingImages} className="admin-btn admin-btn-primary">
                {uploadingImages
                  ? <><div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Uploading…</>
                  : saving
                  ? <><div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</>
                  : editingId ? 'Save Changes' : 'Create Product'}
              </button>
              <button type="button" onClick={resetForm} className="admin-btn admin-btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">All Products</h2>
          <span className="admin-card-count">{products.length}</span>
        </div>
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
        ) : products.length === 0 ? (
          <div className="admin-table-empty">No products yet — add your first one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Grade</th>
                <th>Prices</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const mainImage = p.images?.[0] || null
                const prices = WEIGHTS
                  .filter((w) => p.pricing?.[w])
                  .map((w) => `${w}: $${p.pricing[w]}`)
                  .join(' · ')
                return (
                  <tr key={p.id}>
                    <td style={{ textAlign: 'center' }}>
                      {mainImage ? (
                        <div style={{
                          width: 40, height: 40, borderRadius: 6,
                          overflow: 'hidden', border: '1px solid #e0e0e0', display: 'inline-block'
                        }}>
                          <img src={mainImage} alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: '#999' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mid)' }}>{p.slug}</td>
                    <td>{p.grade || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-mid)' }}>{prices || '—'}</td>
                    <td>
                      <span className={`admin-badge ${p.active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEdit(p)}
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '5px 12px', fontSize: 12, gap: 6 }}>
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '5px 12px', fontSize: 12, gap: 6 }}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}