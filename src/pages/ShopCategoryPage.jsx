import React, { useState } from 'react'
import useReveal from '../hooks/useReveal.js'

const CATEGORIES = [
  {
    id: '87-regular',
    grade: '87',
    label: 'Regular',
    color: 'rgba(255,255,255,0.55)',
    accent: 'rgba(255,255,255,0.06)',
    products: [
      { name: 'GELONADE SMALLS', thc: '22%', weight: '3.5g / 7g / 28g', price: '$' },
      { name: 'BISCOTTI CAKE', thc: '24%', weight: '3.5g / 7g / 28g', price: '$' },
      { name: 'SUNSET SHERBET', thc: '21%', weight: '3.5g / 7g / 28g', price: '$' },
    ],
  },
  {
    id: '89-premium',
    grade: '89',
    label: 'Premium',
    color: '#cab171',
    accent: 'rgba(202,177,113,0.07)',
    products: [
      { name: 'PURPLE LEMONADE', thc: '26%', weight: '3.5g / 7g / 28g', price: '$$' },
      { name: 'SUNDAE DRIVER', thc: '27%', weight: '3.5g / 7g / 28g', price: '$$' },
      { name: 'MAC 1', thc: '25%', weight: '3.5g / 7g / 28g', price: '$$' },
    ],
  },
  {
    id: '91-supreme',
    grade: '91',
    label: 'Supreme',
    color: '#9effa5',
    accent: 'rgba(158,255,165,0.06)',
    products: [
      { name: 'HITCH HIKER', thc: '30%', weight: '3.5g / 7g / 28g', price: '$$$' },
      { name: 'PERMANENT MARKER', thc: '31%', weight: '3.5g / 7g / 28g', price: '$$$' },
      { name: 'JEALOUSY', thc: '29%', weight: '3.5g / 7g / 28g', price: '$$$' },
    ],
  },
  {
    id: '93-high-octane',
    grade: '93',
    label: 'High Octane',
    color: '#ba0b20',
    accent: 'rgba(186,11,32,0.07)',
    products: [
      { name: 'RUNTZ OG', thc: '34%', weight: '3.5g / 7g / 28g', price: '$$$$' },
      { name: 'EXOTIC ZKITTLEZ', thc: '33%', weight: '3.5g / 7g / 28g', price: '$$$$' },
      { name: 'WEDDING CAKE X', thc: '35%', weight: '3.5g / 7g / 28g', price: '$$$$' },
    ],
  },
]

function ProductRow({ product, color, index }) {
  const ref = useReveal(0.1)
  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'center',
          gap: 24,
          padding: '22px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 9,
            color: '#fff',
            letterSpacing: '0.1em',
            marginBottom: 6,
          }}>{product.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            THC {product.thc} · {product.weight}
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 8,
          color,
          letterSpacing: '0.1em',
        }}>
          {product.price}
        </div>
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 7,
            color,
            border: `1px solid ${color}55`,
            padding: '8px 14px',
            borderRadius: 2,
            textDecoration: 'none',
            letterSpacing: '0.08em',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ORDER →
        </a>
      </div>
    </div>
  )
}

export default function ShopCategoryPage() {
  const [activeGrade, setActiveGrade] = useState('91-supreme')
  const titleRef = useReveal(0.2)

  const active = CATEGORIES.find(c => c.id === activeGrade) || CATEGORIES[2]

  return (
    <main style={{ paddingTop: 68, minHeight: '100vh' }}>

      {/* Header */}
      <section style={{
        padding: '80px 24px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${active.color}12 0%, transparent 65%)`,
          transition: 'background 0.5s',
          pointerEvents: 'none',
        }}/>
        <div ref={titleRef} className="reveal" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8, color: '#ba0b20',
            letterSpacing: '0.2em', marginBottom: 20,
          }}>
            SHOP BY CATEGORY
          </div>
          <h1 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(20px, 4vw, 42px)',
            color: '#fff', lineHeight: 1.4,
            letterSpacing: '0.04em',
          }}>
            SELECT YOUR<br/>
            <span style={{ color: active.color, transition: 'color 0.3s' }}>OCTANE GRADE</span>
          </h1>
        </div>
      </section>

      {/* Grade tabs */}
      <section style={{ padding: '0 24px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', gap: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveGrade(cat.id)}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer',
                padding: '20px 28px',
                borderBottom: `2px solid ${activeGrade === cat.id ? cat.color : 'transparent'}`,
                transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 16,
                color: activeGrade === cat.id ? cat.color : 'rgba(255,255,255,0.3)',
                transition: 'color 0.2s',
              }}>
                {cat.grade}
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 7,
                color: activeGrade === cat.id ? cat.color : 'rgba(255,255,255,0.2)',
                letterSpacing: '0.1em',
                transition: 'color 0.2s',
              }}>
                {cat.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Products list */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Category info bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '28px 28px 0',
            marginBottom: 8,
          }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 8, color: active.color, letterSpacing: '0.15em',
              }}>
                {active.label.toUpperCase()} — {active.grade} OCTANE
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              {active.products.length} strains available
            </span>
          </div>

          {/* Products */}
          <div style={{
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8, overflow: 'hidden',
            marginTop: 16,
          }}>
            {active.products.map((p, i) => (
              <ProductRow key={p.name} product={p} color={active.color} index={i} />
            ))}
          </div>

          {/* Order note */}
          <div style={{
            marginTop: 40, padding: '28px 28px',
            background: `${active.color}08`,
            border: `1px solid ${active.color}20`,
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.5)',
          }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: active.color, display: 'block', marginBottom: 12 }}>
              HOW TO ORDER
            </span>
            Order today by contacting our Signal/Telegram with your cart order.
            Our team will respond to you promptly.
          </div>
        </div>
      </section>
    </main>
  )
}
