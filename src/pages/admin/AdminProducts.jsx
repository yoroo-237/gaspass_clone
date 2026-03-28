import React, { useState, useEffect } from 'react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    grade: '',
    tier: '',
    thc: '',
    cbd: '',
    type: '',
    description: '',
    active: true
  })

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Erreur fetch produits:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData({ name: '', slug: '', grade: '', tier: '', thc: '', cbd: '', type: '', description: '', active: true })
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const url = editingId 
        ? `http://localhost:5000/api/admin/products/${editingId}`
        : 'http://localhost:5000/api/admin/products'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        resetForm()
        fetchProducts()
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (err) {
      console.error('Erreur sauvegarde produit:', err)
    }
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        fetchProducts()
      }
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#fff', margin: 0 }}>Gestion Produits</h1>
        <button 
          onClick={() => { if (!showForm) resetForm(); setShowForm(!showForm); }}
          style={{
            padding: '10px 20px',
            background: '#9effa5',
            border: 'none',
            color: '#000',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ {showForm ? 'Annuler' : 'Ajouter Produit'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.05)',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ color: '#fff', marginBottom: 16 }}>
            {editingId ? 'Éditer Produit' : 'Ajouter Nouveau Produit'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
            <input 
              type="text" 
              placeholder="Nom *" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                color: '#fff'
              }}
            />
            <input 
              type="text" 
              placeholder="Slug *" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              required
              style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                color: '#fff'
              }}
            />
            <input 
              type="text" 
              placeholder="Grade" 
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                color: '#fff'
              }}
            />
            <input 
              type="text" 
              placeholder="Tier" 
              value={formData.tier}
              onChange={(e) => setFormData({...formData, tier: e.target.value})}
              style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                color: '#fff'
              }}
            />
            <input 
              type="text" 
              placeholder="THC%" 
              value={formData.thc}
              onChange={(e) => setFormData({...formData, thc: e.target.value})}
              style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                color: '#fff'
              }}
            />
            <input 
              type="text" 
              placeholder="CBD%" 
              value={formData.cbd}
              onChange={(e) => setFormData({...formData, cbd: e.target.value})}
              style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                color: '#fff'
              }}
            />
          </div>

          <input 
            type="text" 
            placeholder="Type" 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              color: '#fff',
              marginBottom: 16
            }}
          />

          <textarea 
            placeholder="Description" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              color: '#fff',
              minHeight: 100,
              marginBottom: 16
            }}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#fff' }}>
            <input 
              type="checkbox" 
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
              style={{ width: 18, height: 18 }}
            />
            Actif
          </label>

          <button type="submit" style={{
            padding: '10px 20px',
            background: '#9effa5',
            border: 'none',
            color: '#000',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: 12
          }}>
            {editingId ? '💾 Enregistrer' : 'Créer Produit'}
          </button>
          <button type="button" onClick={resetForm} style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: 6,
            cursor: 'pointer'
          }}>
            Annuler
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Nom</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Slug</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Tier</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>État</th>
            <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: 12, color: '#fff' }}>{product.name}</td>
              <td style={{ padding: 12, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{product.slug}</td>
              <td style={{ padding: 12, color: 'rgba(255,255,255,0.6)' }}>{product.tier}</td>
              <td style={{ padding: 12 }}>
                <span style={{ color: product.active ? '#9effa5' : '#ba0b20', fontSize: 12 }}>
                  {product.active ? '✓ Actif' : '✗ Inactif'}
                </span>
              </td>
              <td style={{ padding: 12 }}>
                <button 
                  onClick={() => handleEdit(product)}
                  style={{
                    padding: '6px 12px',
                    background: '#9effa5',
                    border: 'none',
                    borderRadius: 4,
                    color: '#000',
                    cursor: 'pointer',
                    fontSize: 12,
                    marginRight: 8
                  }}
                >
                  ✎ Éditer
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  style={{
                    padding: '6px 12px',
                    background: '#ba0b20',
                    border: 'none',
                    borderRadius: 4,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  ✕ Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
