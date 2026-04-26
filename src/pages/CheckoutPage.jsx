import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import { createOrder } from '../api/client'
import CloudinaryImage from '../components/CloudinaryImage'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: info, 2: confirmation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    telegramUsername: '',
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
      // Required fields: first name, last name, email, phone, telegram username
      if (!formData.firstName.trim() || !formData.lastName.trim() ||
          !formData.email.trim() || !formData.phone.trim() ||
          !formData.telegramUsername.trim()) {
        throw new Error('Please fill in all required fields')
      }

      const items = cart.map(item => ({
        productId: item.productId,
        name:      item.name,
        weight:    item.weight,
        quantity:  item.quantity,
        pricePerUnit: item.pricePerUnit
      }))

      const order = await createOrder({
        items,
        total: getTotal(),
        shippingAddress: {
          name:    `${formData.firstName} ${formData.lastName}`,
          phone:   formData.phone,
          email:   formData.email,
          address: formData.address || '',
          city:    formData.city || '',
          zipcode: formData.zipcode || ''
        },
        telegramUsername: formData.telegramUsername,
        notes: formData.notes || null
      })

      clearCart()
      navigate(`/order/${order.id}`)
    } catch (err) {
      alert('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
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
          <Link to="/shop" style={{
            padding: '14px 36px', background: '#111', color: '#fff',
            borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: 15
          }}>
            ← Back to Shop
          </Link>
        </div>
      </>
    )
  }

  const subtotal = getTotal()

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      <style>{`
        .co-root * { box-sizing: border-box; }
        .co-root {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #fff;
          color: #111;
          min-height: 100vh;
          padding: 120px 40px 80px;
        }

        .co-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ── HEADER ── */
        .co-header {
          margin-bottom: 48px;
        }
        .co-breadcrumb {
          font-size: 13px; color: #999;
          display: flex; gap: 6px; align-items: center;
          margin-bottom: 20px;
        }
        .co-breadcrumb a {
          color: #999; text-decoration: none;
        }
        .co-breadcrumb a:hover { color: #111; }
        .co-title {
          font-family: 'VT323', monospace;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 400; margin: 0;
          letter-spacing: 0.02em;
          -webkit-font-smoothing: none;
        }

        /* ── GRID ── */
        .co-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 48px;
          align-items: start;
        }

        /* ── SECTIONS ── */
        .co-section {
          border: 1.5px solid #e8e8e8;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
        }
        .co-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
          margin: 0 0 20px;
        }

        /* ── INPUTS ── */
        .co-row { display: grid; gap: 12px; margin-bottom: 12px; }
        .co-row-2 { grid-template-columns: 1fr 1fr; }
        .co-row-1 { grid-template-columns: 1fr; }

        .co-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #111;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }
        .co-input:focus { border-color: #111; }
        .co-input::placeholder { color: #bbb; }

        .co-textarea {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #111;
          background: #fff;
          outline: none;
          resize: vertical;
          min-height: 90px;
          transition: border-color 0.15s;
        }
        .co-textarea:focus { border-color: #111; }

        /* Telegram input special */
        .co-tg-wrap {
          position: relative;
        }
        .co-tg-prefix {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; color: #999;
          pointer-events: none;
        }
        .co-tg-input {
          padding-left: 30px !important;
        }
        .co-tg-hint {
          font-size: 12px; color: #aaa;
          margin-top: 6px;
        }

        /* Required field indicator */
        .co-required {
          color: #e74c3c;
          margin-left: 4px;
        }

        /* ── SUBMIT BTN ── */
        .co-submit {
          width: 100%;
          height: 54px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s;
          margin-top: 8px;
        }
        .co-submit:hover:not(:disabled) { background: #333; }
        .co-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── SUMMARY PANEL ── */
        .co-summary {
          border: 1.5px solid #e8e8e8;
          border-radius: 16px;
          padding: 28px;
          position: sticky;
          top: 120px;
        }
        .co-summary-title {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #999; margin: 0 0 20px;
        }

        .co-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .co-item:last-of-type { border-bottom: none; }
        .co-item-img {
          width: 52px; height: 52px;
          border-radius: 8px; object-fit: cover;
          background: #e8e0d0; flex-shrink: 0;
        }
        .co-item-info { flex: 1; min-width: 0; }
        .co-item-name {
          font-size: 13px; font-weight: 600;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .co-item-sub { font-size: 12px; color: #999; margin-top: 2px; }
        .co-item-price {
          font-size: 13px; font-weight: 600;
          flex-shrink: 0;
        }

        .co-totals { margin-top: 16px; padding-top: 16px; border-top: 1.5px solid #e8e8e8; }
        .co-total-row {
          display: flex; justify-content: space-between;
          font-size: 13px; color: #777; margin-bottom: 8px;
        }
        .co-total-final {
          display: flex; justify-content: space-between;
          font-size: 17px; font-weight: 700; color: #111;
          margin-top: 12px; padding-top: 12px;
          border-top: 1px solid #e8e8e8;
        }

        /* Telegram note badge */
        .co-tg-badge {
          display: flex; gap: 10px; align-items: flex-start;
          background: #f5f0e8; border-radius: 10px;
          padding: 14px 16px; margin-top: 20px;
          font-size: 13px; color: #7a5c1e; line-height: 1.5;
        }
        .co-tg-badge-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }

        /* Optional field styling */
        .co-optional {
          font-size: 11px;
          color: #bbb;
          font-weight: normal;
          margin-left: 6px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .co-root { padding: 90px 16px 60px; }
          .co-grid { grid-template-columns: 1fr; }
          .co-summary { position: static; }
          .co-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="co-root">
        <div className="co-inner">

          {/* Header */}
          <div className="co-header">
            <nav className="co-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <span style={{ color: '#111' }}>Checkout</span>
            </nav>
            <h1 className="co-title">Complete Your Order</h1>
          </div>

          <div className="co-grid">

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit}>

              {/* Personal Information */}
              <div className="co-section">
                <p className="co-section-title">Personal Information <span className="co-optional">(all fields required)</span></p>

                <div className="co-row co-row-2">
                  <input className="co-input" type="text" name="firstName"
                    placeholder="First Name *" value={formData.firstName}
                    onChange={handleChange} required />
                  <input className="co-input" type="text" name="lastName"
                    placeholder="Last Name *" value={formData.lastName}
                    onChange={handleChange} required />
                </div>

                <div className="co-row co-row-2">
                  <input className="co-input" type="email" name="email"
                    placeholder="Email *" value={formData.email}
                    onChange={handleChange} required />
                  <input className="co-input" type="tel" name="phone"
                    placeholder="Phone *" value={formData.phone}
                    onChange={handleChange} required />
                </div>
              </div>

              {/* Shipping (Optional) */}
              <div className="co-section">
                <p className="co-section-title">Shipping Address <span className="co-optional">(optional)</span></p>

                <div className="co-row co-row-1">
                  <input className="co-input" type="text" name="address"
                    placeholder="Street Address (optional)" value={formData.address}
                    onChange={handleChange} />
                </div>

                <div className="co-row co-row-2">
                  <input className="co-input" type="text" name="city"
                    placeholder="City (optional)" value={formData.city}
                    onChange={handleChange} />
                  <input className="co-input" type="text" name="zipcode"
                    placeholder="Postal Code (optional)" value={formData.zipcode}
                    onChange={handleChange} />
                </div>
              </div>

              {/* Telegram - REQUIRED */}
              <div className="co-section">
                <p className="co-section-title">Telegram for Order Updates <span className="co-required">*</span></p>

                <div className="co-tg-wrap">
                  <span className="co-tg-prefix">@</span>
                  <input
                    className="co-input co-tg-input"
                    type="text"
                    name="telegramUsername"
                    placeholder="your_username"
                    value={formData.telegramUsername}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="co-tg-hint">
                  Required. You will receive real-time order updates via our Telegram bot.
                </p>
              </div>

              {/* Notes (Optional) */}
              <div className="co-section">
                <p className="co-section-title">Additional Notes <span className="co-optional">(optional)</span></p>
                <textarea
                  className="co-textarea"
                  name="notes"
                  placeholder="Special delivery instructions..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="co-submit" disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Order →'}
              </button>
            </form>

            {/* ── ORDER SUMMARY ── */}
            <div className="co-summary">
              <p className="co-summary-title">Your Order</p>

              {cart.map(item => (
                <div key={`${item.productId}-${item.weight}`} className="co-item">
                  {item.image
                    ? <CloudinaryImage 
                        src={item.image} 
                        alt={item.name} 
                        width={80}
                        height={80}
                        crop="fill"
                        className="co-item-img"
                      />
                    : <div className="co-item-img" />
                  }
                  <div className="co-item-info">
                    <p className="co-item-name">{item.name}</p>
                    <p className="co-item-sub">{item.weight} · x{item.quantity}</p>
                  </div>
                  <span className="co-item-price">
                    ${(item.pricePerUnit * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="co-totals">
                <div className="co-total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="co-total-row">
                  <span>Shipping</span>
                  <span>To be confirmed</span>
                </div>
                <div className="co-total-final">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="co-tg-badge">
                <span>
                  Once your order is confirmed, you will receive a confirmation message
                  and real-time tracking via our Telegram bot <strong>@Gaspassstoresbot</strong>.
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}