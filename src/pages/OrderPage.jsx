import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../api/client'

export default function OrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Veuillez vous connecter pour voir votre commande')
          setLoading(false)
          return
        }

        const data = await getOrder(id)
        setOrder(data)
      } catch (err) {
        setError('Commande non trouvée')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <main style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff' }}>Chargement...</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main style={{ paddingTop: 68, minHeight: '100vh' }}>
        <section style={{ padding: '100px 24px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: 16 }}>Erreur</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
            {error}
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
            Retour à l'accueil
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: 68, minHeight: '100vh', background: '#0a0a0a' }}>
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Success message */}
          <div style={{
            background: 'rgba(158,255,165,0.1)',
            border: '1px solid rgba(158,255,165,0.3)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 40,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 48,
              color: '#9effa5',
              marginBottom: 16
            }}>
              ✓
            </div>
            <h1 style={{ color: '#9effa5', marginBottom: 8 }}>Commande Confirmée!</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Merci pour votre commande. Votre commande a été créée avec succès.
            </p>
          </div>

          {/* Order details */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 24
          }}>
            <h2 style={{ color: '#fff', marginBottom: 24 }}>Détails de la Commande</h2>

            {/* Order number */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 16
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Numéro de commande</span>
              <span style={{ color: '#fff', fontFamily: 'monospace' }}>{order.orderNumber || order.id}</span>
            </div>

            {/* Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 16
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Statut</span>
              <span style={{
                color: order.status === 'completed' ? '#9effa5' :
                       order.status === 'shipped' ? '#9effa5' :
                       order.status === 'processing' ? '#cab171' :
                       'rgba(255,255,255,0.7)',
                fontWeight: 'bold'
              }}>
                {order.status === 'pending' && '⏳ En attente'}
                {order.status === 'processing' && '🔄 En traitement'}
                {order.status === 'shipped' && '📦 Expédié'}
                {order.status === 'completed' && '✓ Livré'}
              </span>
            </div>

            {/* Date */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 16
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Date</span>
              <span style={{ color: '#fff' }}>
                {new Date(order.createdAt || new Date()).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {/* Payment status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Paiement</span>
              <span style={{
                color: order.paymentStatus === 'completed' ? '#9effa5' : '#ba0b20'
              }}>
                {order.paymentStatus === 'completed' ? '✓ Payé' : '⏳ En attente'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 24
          }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Articles</h3>

            {order.items && order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  marginBottom: 12,
                  borderBottom: idx < order.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}
              >
                <div>
                  <div style={{ color: '#fff' }}>
                    {item.name} ({item.weight})
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    Quantité: {item.quantity}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#9effa5' }}>
                    ${(item.pricePerUnit * item.quantity).toFixed(2)}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    ${item.pricePerUnit}/unité
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sous-total</span>
              <span style={{ color: '#fff' }}>${order.total?.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Frais de port</span>
              <span style={{ color: '#fff' }}>À calculer</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 'bold' }}>
              <span style={{ color: '#fff' }}>Total</span>
              <span style={{ color: '#9effa5' }}>${order.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 24
          }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Adresse de Livraison</h3>
            {order.shippingAddress && (
              <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                <div>{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.address}</div>
                <div>{order.shippingAddress.zipcode} {order.shippingAddress.city}</div>
                <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)' }}>
                  {order.shippingAddress.phone}
                </div>
              </div>
            )}
          </div>

          {/* Next steps */}
          <div style={{
            background: 'rgba(158,255,165,0.05)',
            border: '1px solid rgba(158,255,165,0.2)',
            borderRadius: 8,
            padding: 24,
            marginBottom: 32
          }}>
            <h3 style={{ color: '#9effa5', marginBottom: 12 }}>Prochaines Étapes</h3>
            <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Vous recevrez un e-mail de confirmation avec les détails de votre commande</li>
              <li>Nous traiterons votre commande dans 24 heures</li>
              <li>Un SMS de suivi vous sera envoyé dès l'expédition</li>
              <li>Livraison en 2-3 jours ouvrables</li>
            </ul>
          </div>

          {/* CTA */}
          <Link
            to="/"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 24px',
              background: '#9effa5',
              color: '#000',
              textDecoration: 'none',
              textAlign: 'center',
              borderRadius: 6,
              fontWeight: 'bold',
              marginBottom: 12
            }}
          >
            Continuer vos achats
          </Link>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              Questions? Contactez-nous via Telegram: @GasPassSupport
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
