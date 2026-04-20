import React from 'react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <main style={{ paddingTop: 68, minHeight: '100vh' }}>
        <section style={{ padding: '100px 24px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: 16 }}>Panier Vide</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
            Votre panier est vide. Commencez vos achats!
          </p>
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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', marginBottom: 40 }}>Panier</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 40 }}>
            {/* Items list */}
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Produit</th>
                    <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Poids</th>
                    <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Prix</th>
                    <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Quantité</th>
                    <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}>Total</th>
                    <th style={{ textAlign: 'left', padding: 12, color: 'rgba(255,255,255,0.7)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr
                      key={`${item.productId}-${item.weight}`}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td style={{ padding: 12, color: '#fff' }}>{item.name}</td>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.7)' }}>{item.weight}</td>
                      <td style={{ padding: 12, color: '#9effa5' }}>${item.pricePerUnit}</td>
                      <td style={{ padding: 12 }}>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, item.weight, parseInt(e.target.value))
                          }
                          style={{
                            width: 60,
                            padding: '6px 8px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 4,
                            color: '#fff',
                            textAlign: 'center'
                          }}
                        />
                      </td>
                      <td style={{ padding: 12, color: '#fff' }}>
                        ${(item.pricePerUnit * item.quantity).toFixed(2)}
                      </td>
                      <td style={{ padding: 12 }}>
                        <button
                          onClick={() => removeFromCart(item.productId, item.weight)}
                          style={{
                            width: 32,
                            height: 32,
                            background: '#ba0b20',
                            border: 'none',
                            color: '#fff',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 16
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <button
                  onClick={clearCart}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(186,11,32,0.2)',
                    border: '1px solid rgba(186,11,32,0.4)',
                    color: '#ba0b20',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Vider le panier
                </button>
              </div>
            </div>

            {/* Summary */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: 24,
                height: 'fit-content'
              }}
            >
              <h3 style={{ color: '#fff', marginBottom: 24 }}>Résumé</h3>

              <div
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: 16,
                  marginBottom: 16
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sous-total</span>
                  <span style={{ color: '#fff' }}>${getTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Livraison</span>
                  <span style={{ color: '#fff' }}>À calculer</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>Total</span>
                <span style={{ color: '#9effa5', fontWeight: 'bold', fontSize: 18 }}>
                  ${getTotal().toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  background: '#9effa5',
                  color: '#000',
                  textDecoration: 'none',
                  textAlign: 'center',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  marginBottom: 12,
                  transition: 'all 0.3s'
                }}
              >
                Passer la commande
              </Link>

              <Link
                to="/"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  textDecoration: 'none',
                  textAlign: 'center',
                  borderRadius: 6
                }}
              >
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
