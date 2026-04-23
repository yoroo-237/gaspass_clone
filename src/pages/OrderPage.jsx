import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../api/client'

const STATUS_MAP = {
  pending:    { label: 'Pending',     icon: '', color: '#c8a96e' },
  processing: { label: 'Processing',  icon: '', color: '#c8a96e' },
  shipped:    { label: 'Shipped',     icon: '', color: '#2d8c4e' },
  completed:  { label: 'Delivered',   icon: '',  color: '#2d8c4e' },
  cancelled:  { label: 'Cancelled',   icon: '',  color: '#cc3333' },
}

export default function OrderPage() {
  const { id } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        const data  = await getOrder(id, token || null)
        setOrder(data)
      } catch (err) {
        setError(err.message || 'Order not found')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#fff',
          fontFamily: "'Helvetica Neue', Arial, sans-serif"
        }}>
          <p style={{ color: '#999', fontSize: 15 }}>Loading your order...</p>
        </div>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif",
          padding: '40px 24px', textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: "'VT323', monospace", fontSize: 56,
            margin: '0 0 12px', color: '#111',
            WebkitFontSmoothing: 'none'
          }}>
            Order Not Found
          </h1>
          <p style={{ color: '#777', marginBottom: 32, fontSize: 15 }}>
            {error || "We couldn't find this order."}
          </p>
          <Link to="/" style={{
            padding: '14px 36px', background: '#111', color: '#fff',
            borderRadius: 50, textDecoration: 'none', fontWeight: 600, fontSize: 15
          }}>
            ← Back to Home
          </Link>
        </div>
      </>
    )
  }

  const status  = STATUS_MAP[order.status] || STATUS_MAP.pending
  const subtotal = parseFloat(order.total || 0)

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      <style>{`
        .op-root * { box-sizing: border-box; }
        .op-root {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #fff;
          color: #111;
          min-height: 100vh;
          padding: 120px 40px 80px;
        }
        .op-inner { max-width: 760px; margin: 0 auto; }

        /* ── BREADCRUMB ── */
        .op-breadcrumb {
          font-size: 13px; color: #999;
          display: flex; gap: 6px; align-items: center;
          margin-bottom: 20px;
        }
        .op-breadcrumb a { color: #999; text-decoration: none; }
        .op-breadcrumb a:hover { color: #111; }

        /* ── SUCCESS BANNER ── */
        .op-banner {
          text-align: center;
          padding: 40px 24px 36px;
          border: 1.5px solid #e8e8e8;
          border-radius: 16px;
          margin-bottom: 28px;
        }
        .op-check {
          width: 56px; height: 56px;
          background: #111; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px; color: #fff;
        }
        .op-banner-title {
          font-family: 'VT323', monospace;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 400; margin: 0 0 8px;
          letter-spacing: 0.02em;
          -webkit-font-smoothing: none;
        }
        .op-banner-sub {
          font-size: 14px; color: #777; margin: 0;
        }
        .op-order-num {
          display: inline-block;
          margin-top: 16px;
          font-family: monospace;
          font-size: 13px;
          background: #f5f0e8;
          color: #7a5c1e;
          padding: 6px 16px;
          border-radius: 50px;
          letter-spacing: 0.05em;
        }

        /* ── CARD ── */
        .op-card {
          border: 1.5px solid #e8e8e8;
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 16px;
        }
        .op-card-title {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #999; margin: 0 0 20px;
        }

        /* ── INFO ROWS ── */
        .op-row {
          display: flex; justify-content: space-between;
          align-items: center;
          padding: 11px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }
        .op-row:last-child { border-bottom: none; }
        .op-row-label { color: #999; }
        .op-row-value { color: #111; font-weight: 500; }

        /* ── STATUS BADGE ── */
        .op-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 14px; border-radius: 50px;
          font-size: 13px; font-weight: 600;
          background: #f5f5f5;
        }

        /* ── ITEMS ── */
        .op-item {
          display: flex; justify-content: space-between;
          align-items: flex-start;
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }
        .op-item:last-child { border-bottom: none; }
        .op-item-name { font-weight: 600; margin-bottom: 3px; }
        .op-item-meta { font-size: 12px; color: #999; }
        .op-item-price { text-align: right; }
        .op-item-total { font-weight: 600; }
        .op-item-unit  { font-size: 12px; color: #bbb; margin-top: 2px; }

        /* ── TOTALS ── */
        .op-totals { padding-top: 4px; }
        .op-total-row {
          display: flex; justify-content: space-between;
          font-size: 13px; color: #999; padding: 8px 0;
        }
        .op-total-final {
          display: flex; justify-content: space-between;
          font-size: 17px; font-weight: 700; color: #111;
          padding-top: 14px; margin-top: 6px;
          border-top: 1.5px solid #e8e8e8;
        }

        /* ── ADDRESS ── */
        .op-address {
          font-size: 14px; color: #555;
          line-height: 1.8;
        }

        /* ── NEXT STEPS ── */
        .op-steps {
          list-style: none; padding: 0; margin: 0;
        }
        .op-steps li {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 10px 0; border-bottom: 1px solid #f0f0f0;
          font-size: 14px; color: #555; line-height: 1.5;
        }
        .op-steps li:last-child { border-bottom: none; }
        .op-step-num {
          width: 22px; height: 22px; border-radius: 50%;
          background: #111; color: #fff;
          font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }

        /* ── CTA ── */
        .op-cta {
          display: block; width: 100%;
          padding: 15px 24px;
          background: #111; color: #fff;
          border: none; border-radius: 50px;
          font-size: 15px; font-weight: 600;
          text-align: center; text-decoration: none;
          cursor: pointer; font-family: inherit;
          transition: background 0.2s;
          margin-top: 28px;
        }
        .op-cta:hover { background: #333; }

        .op-support {
          text-align: center;
          font-size: 13px; color: #aaa;
          margin-top: 16px;
        }
        .op-support a { color: #111; text-decoration: underline; }

        /* ── RESPONSIVE ── */
        @media (max-width: 600px) {
          .op-root { padding: 90px 16px 60px; }
          .op-card { padding: 20px 18px; }
        }
      `}</style>

      <div className="op-root">
        <div className="op-inner">

          {/* Breadcrumb */}
          <nav className="op-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span style={{ color: '#111' }}>Order Confirmation</span>
          </nav>

          {/* Success banner */}
          <div className="op-banner">
            <div className="op-check">✓</div>
            <h1 className="op-banner-title">Order Confirmed!</h1>
            <p className="op-banner-sub">
              Thank you for your order. We'll get it ready as soon as possible.
            </p>
            <span className="op-order-num">{order.orderNumber || `#${order.id}`}</span>
          </div>

          {/* Order details */}
          <div className="op-card">
            <p className="op-card-title">Order Details</p>

            <div className="op-row">
              <span className="op-row-label">Order Number</span>
              <span className="op-row-value" style={{ fontFamily: 'monospace' }}>
                {order.orderNumber || order.id}
              </span>
            </div>

            <div className="op-row">
              <span className="op-row-label">Status</span>
              <span className="op-status-badge" style={{ color: status.color }}>
                {status.icon} {status.label}
              </span>
            </div>

            <div className="op-row">
              <span className="op-row-label">Date</span>
              <span className="op-row-value">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>

            <div className="op-row">
              <span className="op-row-label">Payment</span>
              <span className="op-row-value" style={{
                color: order.paymentStatus === 'completed' ? '#2d8c4e' : '#c8a96e'
              }}>
                {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="op-card">
            <p className="op-card-title">Items Ordered</p>
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="op-item">
                <div>
                  <p className="op-item-name">{item.name}</p>
                  <p className="op-item-meta">{item.weight} · qty {item.quantity}</p>
                </div>
                <div className="op-item-price">
                  <p className="op-item-total">${(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                  <p className="op-item-unit">${item.pricePerUnit} / unit</p>
                </div>
              </div>
            ))}

            <div className="op-totals">
              <div className="op-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="op-total-row">
                <span>Shipping</span>
                <span>To be confirmed</span>
              </div>
              <div className="op-total-final">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="op-card">
              <p className="op-card-title">Shipping Address</p>
              <div className="op-address">
                <div style={{ fontWeight: 600, color: '#111', marginBottom: 4 }}>
                  {order.shippingAddress.name}
                </div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {[order.shippingAddress.zipcode, order.shippingAddress.city]
                    .filter(Boolean).join(' ')}
                </div>
                {order.shippingAddress.phone && (
                  <div style={{ marginTop: 6, color: '#aaa', fontSize: 13 }}>
                    {order.shippingAddress.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next steps */}
          <div className="op-card">
            <p className="op-card-title">What Happens Next</p>
            <ul className="op-steps">
              <li>
                <span className="op-step-num">1</span>
                You'll receive an order confirmation via Telegram from <strong>@Gaspassstoresbot</strong>.
              </li>
              <li>
                <span className="op-step-num">2</span>
                We'll process your order within 24 hours and prepare it for dispatch.
              </li>
              <li>
                <span className="op-step-num">3</span>
                Once shipped, you'll get a tracking update straight to your Telegram.
              </li>
              <li>
                <span className="op-step-num">4</span>
                Delivery typically takes 2–3 business days in discreet packaging.
              </li>
            </ul>
          </div>

          <Link to="/shop" className="op-cta">Continue Shopping →</Link>

          <p className="op-support">
            Questions? Reach us on Telegram:{' '}
            <a href="https://t.me/gaspassreal" target="_blank" rel="noreferrer">
              @gaspassreal
            </a>
          </p>

        </div>
      </div>
    </>
  )
}