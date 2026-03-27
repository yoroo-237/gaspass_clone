import React, { useState, useEffect } from 'react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    grade: '',
    tier: '',
    thc: '',
    cbd: '',
    type: '',
    description: ''
  })

  useEffect(() => {
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
    fetchProducts()
  }, [])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setFormData({ name: '', slug: '', grade: '', tier: '', thc: '', cbd: '', type: '', description: '' })
        setShowForm(false)
        // Refresh list
        const newRes = await fetch('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await newRes.json()
        setProducts(data)
      }
    } catch (err) {
      console.error('Erreur ajout produit:', err)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#fff', margin: 0 }}>Gestion Produits</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
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
          ➕ Ajouter Produit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddProduct} style={{
          background: 'rgba(255,255,255,0.05)',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
            <input 
              type="text" 
              placeholder="Nom" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              placeholder="Slug" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
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
          </div>
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
          <button type="submit" style={{
            padding: '10px 20px',
            background: '#9effa5',
            border: 'none',
            color: '#000',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Créer Produit
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {products.map(product => (
          <div key={product.id} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 16
          }}>
            <h3 style={{ color: '#9effa5', margin: '0 0 8px' }}>{product.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>{product.tier}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '8px 0 0' }}>Grade: {product.grade}</p>
            <button style={{
              width: '100%',
              marginTop: 12,
              padding: '8px 12px',
              background: '#ba0b20',
              border: 'none',
              color: '#fff',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}>
              Éditer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
