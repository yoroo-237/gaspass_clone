import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'

const PRODUCTS_DB = {
  'hitch-hiker':      { name: 'HITCH HIKER',      grade: '91', tier: 'SUPREME',     color: '#9effa5', thc: '30%', cbd: '0.1%', type: 'Hybrid', lineage: 'Dosidos × Sherbert', terpenes: ['Limonene', 'Caryophyllene', 'Myrcene'], desc: 'A euphoric, full-body hybrid that hits from every angle. Dense frost-covered nugs with a sharp citrus nose that fades into a smooth earthy finish.' },
  'purple-lemonade':  { name: 'PURPLE LEMONADE',  grade: '89', tier: 'PREMIUM',     color: '#cab171', thc: '26%', cbd: '0.2%', type: 'Indica', lineage: 'Purple Punch × Lemon OG', terpenes: ['Terpinolene', 'Ocimene', 'Myrcene'], desc: 'Deep purple hues and a punchy lemon aroma. Relaxing body effect with a clean, fruity exhale. Ideal for evening use.' },
  'sundae-driver':    { name: 'SUNDAE DRIVER',    grade: '93', tier: 'HIGH OCTANE', color: '#ba0b20', thc: '33%', cbd: '0.1%', type: 'Hybrid', lineage: 'Fruity Pebbles OG × Grape Pie', terpenes: ['Caryophyllene', 'Limonene', 'Linalool'], desc: 'Creamy, dessert-like smoke with an insane terp profile. The kind of pack that makes the whole room stop and ask what you\'re smoking.' },
  'gelonade-smalls':  { name: 'GELONADE SMALLS',  grade: '87', tier: 'REGULAR',     color: 'rgba(255,255,255,0.55)', thc: '22%', cbd: '0.3%', type: 'Sativa', lineage: 'Gelato 41 × Lemon Tree', terpenes: ['Limonene', 'Linalool', 'Myrcene'], desc: 'Budget-friendly smalls with a bright lemon-gelato nose. Excellent value for bulk buyers looking for a consistent daily driver.' },
  'permanent-marker': { name: 'PERMANENT MARKER', grade: '93', tier: 'HIGH OCTANE', color: '#ba0b20', thc: '31%', cbd: '0.1%', type: 'Hybrid', lineage: 'Biscotti × Jealousy × Sherb Bx', terpenes: ['Caryophyllene', 'Limonene', 'Bisabolol'], desc: 'One of the most sought-after cuts of the season. Pungent, loud aroma with a complex flavor profile. Each nug is a statement.' },
  'biscotti-cake':    { name: 'BISCOTTI CAKE',    grade: '91', tier: 'SUPREME',     color: '#9effa5', thc: '29%', cbd: '0.2%', type: 'Indica', lineage: 'Biscotti × Wedding Cake', terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'], desc: 'Rich, doughy terps with a sugary exhale. Heavy indica effects that unwind the body without putting you on the couch.' },
}

const WEIGHTS = ['3.5g', '7g', '14g', '28g', 'QP', 'HP', 'LB']

export default function ProductDetailPage() {
  const { id } = useParams()
  const [selectedWeight, setSelectedWeight] = useState('7g')
  const [added, setAdded] = useState(false)

  const product = PRODUCTS_DB[id] || Object.values(PRODUCTS_DB)[0]

  const titleRef = useReveal(0.2)
  const infoRef = useReveal(0.15)

  const handleOrder = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{ paddingTop: 68, minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ padding: '24px 24px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/shop/categories/all" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Shop</Link>
          <span>/</span>
          <Link to={`/shop/categories/${product.grade}`} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{product.tier}</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>{product.name}</span>
        </div>
      </div>

      {/* Product layout */}
      <section style={{ padding: '48px 24px 100px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
          alignItems: 'start',
        }}>

          {/* Left: visual */}
          <div ref={titleRef} className="reveal">
            <div style={{
              aspectRatio: '1',
              background: `radial-gradient(circle at 55% 40%, ${product.color}20 0%, rgba(26,10,11,0.9) 65%)`,
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Grade watermark */}
              <div style={{
                position: 'absolute', top: 20, left: 20,
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(60px, 14vw, 120px)',
                color: `${product.color}10`,
                lineHeight: 1, userSelect: 'none',
                pointerEvents: 'none',
              }}>
                {product.grade}
              </div>

              {/* Center flower icon */}
              <svg width="120" height="120" viewBox="0 0 64 64" fill="none" opacity="0.2">
                <ellipse cx="32" cy="32" rx="18" ry="28" fill={product.color} transform="rotate(0 32 32)"/>
                <ellipse cx="32" cy="32" rx="18" ry="28" fill={product.color} transform="rotate(60 32 32)"/>
                <ellipse cx="32" cy="32" rx="18" ry="28" fill={product.color} transform="rotate(120 32 32)"/>
                <circle cx="32" cy="32" r="8" fill={product.color}/>
              </svg>

              {/* Tier badge */}
              <div style={{
                position: 'absolute', bottom: 20, right: 20,
                fontFamily: 'var(--font-pixel)',
                fontSize: 7, color: product.color,
                border: `1px solid ${product.color}44`,
                padding: '7px 12px', borderRadius: 2,
                background: `${product.color}10`,
                letterSpacing: '0.12em',
              }}>
                {product.tier}
              </div>
            </div>

            {/* Terpenes */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 7, color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.2em', marginBottom: 12,
              }}>TERPENES</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.terpenes.map(t => (
                  <span key={t} style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '5px 12px', borderRadius: 20,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: info */}
          <div ref={infoRef} className="reveal" style={{ paddingTop: 12 }}>
            {/* Grade + type */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: 8,
                color: product.color, border: `1px solid ${product.color}44`,
                padding: '5px 12px', borderRadius: 2, background: `${product.color}0f`,
              }}>{product.grade}</span>
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: 8,
                color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '5px 12px', borderRadius: 2,
              }}>{product.type.toUpperCase()}</span>
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(18px, 3vw, 30px)',
              color: '#fff', lineHeight: 1.5,
              letterSpacing: '0.04em', marginBottom: 12,
            }}>
              {product.name}
            </h1>

            {/* Lineage */}
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.35)',
              marginBottom: 28, letterSpacing: '0.03em',
            }}>
              {product.lineage}
            </div>

            {/* THC/CBD */}
            <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
              {[{ label: 'THC', value: product.thc }, { label: 'CBD', value: product.cbd }].map(s => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'var(--font-pixel)', fontSize: 7,
                    color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 6,
                  }}>{s.label}</div>
                  <div style={{
                    fontFamily: 'var(--font-pixel)', fontSize: 20, color: product.color,
                  }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p style={{
              fontSize: 14, lineHeight: 1.95,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              {product.desc}
            </p>

            {/* Weight selector */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: 'var(--font-pixel)', fontSize: 7,
                color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 14,
              }}>SELECT WEIGHT</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {WEIGHTS.map(w => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    style={{
                      fontFamily: 'var(--font-pixel)', fontSize: 8,
                      padding: '10px 16px', borderRadius: 4, cursor: 'pointer',
                      transition: 'all 0.2s', letterSpacing: '0.08em',
                      background: selectedWeight === w ? product.color : 'transparent',
                      color: selectedWeight === w ? '#000' : 'rgba(255,255,255,0.45)',
                      border: selectedWeight === w
                        ? `1px solid ${product.color}`
                        : '1px solid rgba(255,255,255,0.12)',
                    }}
                  >{w}</button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleOrder}
              style={{
                width: '100%',
                fontFamily: 'var(--font-pixel)', fontSize: 10,
                color: added ? '#000' : '#000',
                background: added ? '#9effa5' : product.color,
                border: 'none', borderRadius: 4,
                padding: '18px 32px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: added ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {added ? '✓ ADDED TO ORDER' : `ORDER ${selectedWeight} VIA TELEGRAM`}
            </button>

            <p style={{
              fontSize: 12, color: 'rgba(255,255,255,0.25)',
              textAlign: 'center', marginTop: 12, lineHeight: 1.7,
            }}>
              Contact us via Telegram or Signal to complete your order.
              Stealthy packaging guaranteed.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          main > section > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </main>
  )
}
