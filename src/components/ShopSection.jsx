import React from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'

const PRODUCTS = [
  { name: 'HITCH HIKER',      slug: 'hitch-hiker',      grade: '91', tier: 'SUPREME',     color: '#9effa5' },
  { name: 'PURPLE LEMONADE',  slug: 'purple-lemonade',  grade: '89', tier: 'PREMIUM',     color: '#cab171' },
  { name: 'SUNDAE DRIVER',    slug: 'sundae-driver',    grade: '93', tier: 'HIGH OCTANE', color: '#ba0b20' },
  { name: 'GELONADE SMALLS',  slug: 'gelonade-smalls',  grade: '87', tier: 'REGULAR',     color: 'rgba(255,255,255,0.5)' },
  { name: 'PERMANENT MARKER', slug: 'permanent-marker', grade: '93', tier: 'HIGH OCTANE', color: '#ba0b20' },
  { name: 'BISCOTTI CAKE',    slug: 'biscotti-cake',    grade: '91', tier: 'SUPREME',     color: '#9effa5' },
]

function ProductCard({ product, index }) {
  const ref = useReveal(0.1)

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.3s, transform 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(158,255,165,0.2)'
          e.currentTarget.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Product visual placeholder */}
        <div style={{
          height: 220,
          background: `radial-gradient(circle at 60% 40%, ${product.color}18 0%, rgba(26,10,11,0.8) 70%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Grade badge */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: 14,
            fontFamily: 'var(--font-pixel)',
            fontSize: 9,
            color: product.color,
            border: `1px solid ${product.color}55`,
            padding: '5px 10px',
            borderRadius: 2,
            background: `${product.color}11`,
          }}>
            {product.grade}
          </div>

          {/* Tier badge */}
          <div style={{
            position: 'absolute',
            top: 14,
            right: 14,
            fontFamily: 'var(--font-pixel)',
            fontSize: 7,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
          }}>
            {product.tier}
          </div>

          {/* Center icon (stylized leaf/flower) */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.25">
            <ellipse cx="32" cy="32" rx="18" ry="28" fill={product.color} transform="rotate(0 32 32)"/>
            <ellipse cx="32" cy="32" rx="18" ry="28" fill={product.color} transform="rotate(60 32 32)"/>
            <ellipse cx="32" cy="32" rx="18" ry="28" fill={product.color} transform="rotate(120 32 32)"/>
            <circle cx="32" cy="32" r="8" fill={product.color}/>
          </svg>
        </div>

        {/* Info */}
        <div style={{ padding: '20px 20px 22px' }}>
          <h3 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 9,
            color: '#fff',
            letterSpacing: '0.1em',
            marginBottom: 12,
            lineHeight: 1.6,
          }}>
            {product.name}
          </h3>

          <Link
            to={`/shop/${product.slug}`}
            style={{
              display: 'block',
              fontFamily: 'var(--font-pixel)',
              fontSize: 7,
              color: product.color,
              background: 'none',
              border: `1px solid ${product.color}44`,
              borderRadius: 2,
              padding: '8px 14px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              transition: 'background 0.2s, border-color 0.2s',
              width: '100%',
              textDecoration: 'none',
              textAlign: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${product.color}18`
              e.currentTarget.style.borderColor = product.color
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.borderColor = `${product.color}44`
            }}
          >
            VIEW STRAIN →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ShopSection() {
  const titleRef = useReveal(0.2)

  return (
    <section id="shop" style={{ padding: '80px 24px 120px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div ref={titleRef} className="reveal" style={{ marginBottom: 60 }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: '#ba0b20',
            letterSpacing: '0.2em',
            marginBottom: 20,
          }}>
            EXPLORE THE SHOP
          </div>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(18px, 3vw, 32px)',
            color: '#fff',
            letterSpacing: '0.04em',
            lineHeight: 1.5,
            maxWidth: 500,
          }}>
            TOP SHELF STRAINS<br/>
            <span style={{ color: '#9effa5' }}>AVAILABLE NOW</span>
          </h2>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <a href="#" style={{
            display: 'inline-block',
            fontFamily: 'var(--font-pixel)',
            fontSize: 9,
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '16px 36px',
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.1em',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#9effa5'
            e.currentTarget.style.color = '#9effa5'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.color = '#fff'
          }}
          >
            VIEW ALL STRAINS →
          </a>
        </div>
      </div>
    </section>
  )
}
