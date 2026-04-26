import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'
import { createOrder } from '../api/client'
import { SOCIAL_LINKS } from '../utils/socialLinks'

function SocialIcon({ src, alt, bg = 'transparent', size = 24, radius = 6 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: bg,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const items = cart.map(item => ({
        productId: item.productId,
        name: item.name,
        weight: item.weight,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit
      }))

      const order = await createOrder({
        items,
        total: getTotal(),
        shippingAddress: {
          name: telegramUsername || 'Guest',
          phone: '',
          email: '',
          address: address || '',
          city: '',
          zipcode: ''
        },
        telegramUsername: telegramUsername || null,
        notes: null
      })

      clearCart()

      const cartItems = items.map(item =>
        `• ${item.name} (${item.weight}g) x${item.quantity}`
      ).join('\n')

      const message = `🛒 *Order Confirmed!*

Order ID: \`${order.id}\`

*Items:*
${cartItems}

*Total:* $${getTotal().toFixed(2)}
${address ? `\n*Delivery Address:*\n${address}` : ''}

Let's confirm the details and finalize your order!`

      const encodedMessage = encodeURIComponent(message)
      const telegramUrl = `${SOCIAL_LINKS.telegram.url}?text=${encodedMessage}`

      window.open(telegramUrl, '_blank')
      setShowModal(false)
      setShowSocialModal(true)

    } catch (err) {
      alert('❌ ' + err.message)
      setLoading(false)
    }
  }

  // ── Panier vide ──
  if (cart.length === 0 && !showSocialModal) {
    return (
      <>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff'
        }}>
          <h1 style={{ fontFamily: "'VT323', monospace", fontSize: 56, margin: '0 0 12px', color: '#111' }}>
            Empty Cart
          </h1>
          <p style={{ color: '#777', marginBottom: 32 }}>
            You don't have any items in your cart.
          </p>
          <Link
            to="/shop"
            style={{
              padding: '14px 36px', background: '#111', color: '#fff',
              borderRadius: 50, fontWeight: 600,
              fontSize: 15, cursor: 'pointer', textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            ← Back to Shop
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      <style>{`
        * { box-sizing: border-box; }

        .checkout-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .checkout-overlay.open { opacity: 1; pointer-events: all; }

        .checkout-modal {
          background: #fff; border-radius: 16px;
          width: 90%; max-width: 480px; padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          transform: scale(0.95); opacity: 0;
          transition: opacity 0.3s, transform 0.3s; position: relative;
        }
        .checkout-overlay.open .checkout-modal { opacity: 1; transform: scale(1); }

        .checkout-close {
          position: absolute; top: 20px; right: 20px;
          background: none; border: none; font-size: 24px;
          color: #999; cursor: pointer; padding: 0;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .checkout-close:hover { color: #111; }

        .checkout-title {
          font-family: 'VT323', monospace; font-size: 32px;
          margin: 0 0 8px; color: #111; letter-spacing: 0.02em;
        }
        .checkout-subtitle {
          font-size: 13px; color: #999; margin-bottom: 28px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }

        .checkout-form { display: flex; flex-direction: column; gap: 20px; }
        .checkout-field { display: flex; flex-direction: column; }

        .checkout-label {
          font-size: 12px; font-weight: 600; color: #666;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 6px; display: block;
        }
        .checkout-label-optional { color: #aaa; font-weight: normal; }

        .checkout-input {
          padding: 12px 16px; border: 1.5px solid #e0e0e0;
          border-radius: 10px; font-size: 14px; color: #111;
          background: #fff; outline: none; transition: border-color 0.2s;
          font-family: inherit;
        }
        .checkout-input:focus { border-color: #111; }
        .checkout-input::placeholder { color: #bbb; }

        .checkout-tg-wrap { position: relative; }
        .checkout-tg-prefix {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; color: #999; pointer-events: none;
        }
        .checkout-tg-input { padding-left: 30px !important; }
        .checkout-hint { font-size: 11px; color: #999; margin-top: 4px; }

        .checkout-buttons { display: flex; gap: 12px; margin-top: 12px; }

        .checkout-submit {
          flex: 1; padding: 12px 24px; background: #111; color: #fff;
          border: none; border-radius: 999px; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: background 0.2s;
        }
        .checkout-submit:hover:not(:disabled) { background: #333; }
        .checkout-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .checkout-cancel {
          flex: 1; padding: 12px 24px; background: transparent;
          color: #666; border: none; border-radius: 999px;
          font-size: 14px; cursor: pointer; transition: background 0.2s;
        }
        .checkout-cancel:hover { background: #f5f5f5; }

        .social-overlay {
          position: fixed; inset: 0; z-index: 600;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .social-overlay.open { opacity: 1; pointer-events: all; }

        .social-modal {
          background: #fff; border-radius: 16px;
          width: 90%; max-width: 420px; padding: 32px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          transform: scale(0.95); opacity: 0;
          transition: opacity 0.3s, transform 0.3s; position: relative;
        }
        .social-overlay.open .social-modal { opacity: 1; transform: scale(1); }

        .social-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; font-size: 24px;
          color: #ccc; cursor: pointer; padding: 0;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .social-close:hover { color: #111; }

        .social-title {
          font-family: 'VT323', monospace; font-size: 28px;
          margin: 0 0 8px; color: #111;
        }
        .social-subtitle {
          font-size: 13px; color: #999;
          margin-bottom: 24px; line-height: 1.5;
        }

        .social-buttons { display: flex; flex-direction: column; gap: 10px; }

        .social-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; background: #f5f5f5; color: #111;
          text-decoration: none; border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .social-btn:hover { background: #111; color: #fff; }

        .social-btn-text { flex: 1; text-align: left; }
        .social-btn-arrow { font-size: 12px; opacity: 0.4; }

        .social-footer {
          margin-top: 20px; padding-top: 20px;
          border-top: 1px solid #e8e8e8;
          font-size: 12px; color: #999; text-align: center;
        }
      `}</style>

      {/* ── CHECKOUT MODAL ── */}
      <div className={`checkout-overlay ${showModal ? 'open' : ''}`}>
        <div className="checkout-modal">
          <button
            className="checkout-close"
            onClick={() => { setShowModal(false); navigate('/shop') }}
          >
            ×
          </button>

          <h2 className="checkout-title">Confirm Order</h2>
          <p className="checkout-subtitle">Quick order confirmation</p>

          <form onSubmit={handleSubmit} className="checkout-form">

            <div className="checkout-field">
              <label className="checkout-label">
                Telegram Username{' '}
                <span className="checkout-label-optional">(optional)</span>
              </label>
              <div className="checkout-tg-wrap">
                <span className="checkout-tg-prefix">@</span>
                <input
                  className="checkout-input checkout-tg-input"
                  type="text"
                  placeholder="your_username"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                />
              </div>
              <p className="checkout-hint">We'll contact you via Telegram for confirmation.</p>
            </div>

            <div className="checkout-field">
              <label className="checkout-label">
                Delivery Address{' '}
                <span className="checkout-label-optional">(optional)</span>
              </label>
              <input
                className="checkout-input"
                type="text"
                placeholder="Your address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="checkout-buttons">
              <button
                type="button"
                className="checkout-cancel"
                onClick={() => { setShowModal(false); navigate('/shop') }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="checkout-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm →'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── SOCIAL MODAL ── */}
      <div className={`social-overlay ${showSocialModal ? 'open' : ''}`}>
        <div className="social-modal">
          <button
            className="social-close"
            onClick={() => { setShowSocialModal(false); navigate('/') }}
          >
            ×
          </button>

          <h2 className="social-title">Stay Connected!</h2>
          <p className="social-subtitle">
            Follow us on your favorite platform to get updates on your order and special offers.
          </p>

          <div className="social-buttons">
            {Object.keys(SOCIAL_LINKS).map((key) => (
              /* External URLs — kept as <a> with target="_blank" */
              <a
                key={key}
                href={SOCIAL_LINKS[key].url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <SocialIcon
                  src={SOCIAL_LINKS[key].icon}
                  alt={SOCIAL_LINKS[key].label}
                  bg={SOCIAL_LINKS[key].iconBg || 'transparent'}
                  size={24}
                  radius={6}
                />
                <span className="social-btn-text">{SOCIAL_LINKS[key].label}</span>
                <span className="social-btn-arrow">→</span>
              </a>
            ))}
          </div>

          <div className="social-footer">
            <p>Check Telegram for your order confirmation message.</p>
            <button
              onClick={() => { setShowSocialModal(false); navigate('/') }}
              style={{
                background: 'none', border: 'none', color: '#666',
                cursor: 'pointer', fontSize: '13px',
                marginTop: '12px', textDecoration: 'underline'
              }}
            >
              Continue to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}