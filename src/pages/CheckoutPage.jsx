import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import { createOrder, createPaymentIntent } from '../api/client'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation du formulaire
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        throw new Error('Veuillez remplir tous les champs requis')
      }

      const items = cart.map(item => ({
        productId: item.productId,
        weight: item.weight,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        subtotal: item.pricePerUnit * item.quantity
      }))

      const orderRes = await createOrder({
        items,
        total: getTotal(),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipcode: formData.zipcode
        },
        notes: formData.notes
      })

      // Create payment intent with Stripe (optionnel)
      try {
        const paymentRes = await createPaymentIntent(orderRes.id, getTotal())
        console.log('Payment intent:', paymentRes)
      } catch (payErr) {
        console.log('Payment intent error (non-blocking):', payErr)
      }

      clearCart()
      navigate(`/order/${orderRes.id}`)
    } catch (err) {
      alert('❌ Erreur: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main style={{ paddingTop: 68, minHeight: '100vh' }}>
        <section style={{ padding: '100px 24px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: 16 }}>Panier Vide</h1>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: '#9effa5',
              color: '#000',
              textDecoration: 'none',
              borderRadius: 6,
              fontWeight: 'bold'
            }}
          >
            Retour à la boutique
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: 68, minHeight: '100vh', background: '#0a0a0a' }}>
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', marginBottom: 40 }}>Passer la Commande</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40 }}>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 8, marginBottom: 24 }}>
                <h3 style={{ color: '#fff', marginBottom: 16 }}>Informations Personnelles</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: '#fff'
                    }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: '#fff'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: '#fff'
                    }}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 8, marginBottom: 24 }}>
                <h3 style={{ color: '#fff', marginBottom: 16 }}>Livraison</h3>

                <input
                  type="text"
                  name="address"
                  placeholder="Adresse"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    color: '#fff',
                    marginBottom: 16,
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <input
                    type="text"
                    name="city"
                    placeholder="Ville"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: '#fff'
                    }}
                  />
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="Code postal"
                    value={formData.zipcode}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 6,
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 8, marginBottom: 24 }}>
                <h3 style={{ color: '#fff', marginBottom: 16 }}>Notes (optionnel)</h3>
                <textarea
                  name="notes"
                  placeholder="Notes spéciales pour la commande..."
                  value={formData.notes}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    color: '#fff',
                    minHeight: 100,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: '#9effa5',
                  border: 'none',
                  color: '#000',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? 'Traitement...' : 'Procéder au paiement'}
              </button>
            </form>

            {/* Summary */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 24,
              height: 'fit-content'
            }}>
              <h3 style={{ color: '#fff', marginBottom: 16 }}>Résumé</h3>

              {cart.map(item => (
                <div key={`${item.productId}-${item.weight}`} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                      {item.name} ({item.weight}) x{item.quantity}
                    </span>
                    <span style={{ color: '#fff', fontSize: 13 }}>
                      ${(item.pricePerUnit * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: 16,
                marginTop: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sous-total</span>
                  <span style={{ color: '#fff' }}>${getTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Livraison</span>
                  <span style={{ color: '#fff' }}>À calculer</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Total</span>
                  <span style={{ color: '#9effa5', fontWeight: 'bold', fontSize: 18 }}>
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
