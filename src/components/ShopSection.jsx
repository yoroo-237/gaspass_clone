import React from 'react'
import useReveal from '../hooks/useReveal.js'

const PRODUCTS = [
  { name: 'AUTO-AUTO-TOURISTE', slug: 'hitch-hiker',      badge: 'Nouveau', image: 'public/JZlZpcElgglkOzxiEgbXIpsYy4.jpg' },
  { name: 'LIMONADE VIOLETTE',  slug: 'purple-lemonade',  badge: 'Nouveau', image: 'public/crE5g6o6sQNSWbWVCYXUHUktB1Y.jpg' },
  { name: 'CHAUFFEUR DE SUNDAE',slug: 'sundae-driver',    badge: 'Nouveau', image: 'public/6dnHHpKmlxZ5iN3DroU9xjuMu1s.jpg' },
  { name: 'GELONADE SMALLS',    slug: 'gelonade-smalls',  badge: 'Nouveau', image: 'public/uFSQWKnoF44CCyIUJwJAUYSQxs.jpg' },
  { name: 'PERMANENT MARKER',   slug: 'permanent-marker', badge: 'Nouveau', image: 'public/EZVdTIllwqZp3jRzDmQ87WGvg.jpg' },
  { name: 'BISCOTTI CAKE',      slug: 'biscotti-cake',    badge: 'Nouveau', image: 'public/IvRrxhETfI0kGllqcnEKrKgKdQE.jpg' },
]

function ProductCard({ product, index }) {
  const ref = useReveal(0.1)

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 80}ms`, cursor: 'pointer' }}
    >
      {/* Image fully rounded on all 4 corners */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#d4c9b0',
      }}>
        {/* Badge */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 500,
          color: '#1a1a1a',
          background: '#c8a96e',
          padding: '5px 14px',
          borderRadius: 30,
          zIndex: 2,
          letterSpacing: '0',
        }}>
          {product.badge}
        </div>

        <img
          src={product.image || undefined}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Title sits OUTSIDE the card, directly on the page background */}
      <div style={{ padding: '12px 4px 4px' }}>
        <h3 style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 11,
          fontWeight: 500,
          color: '#111',
          letterSpacing: '0.03em',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {product.name}
        </h3>
      </div>
    </div>
  )
}

export default function ShopSection() {
  const titleRef = useReveal(0.2)

  return (
    <section
      id="shop"
      style={{
        padding: '48px 32px 80px',
        background: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header row */}
        <div
          ref={titleRef}
          className="reveal"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 28,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(18px, 2.8vw, 32px)',
            color: '#111',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
            margin: 0,
            fontWeight: 700,
          }}>
            BOUTIQUE DE FLEURS
          </h2>

          <a
            href="#"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 18,
              fontWeight: 600,
              color: '#111',
              textDecoration: 'none',
              letterSpacing: '0',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Explorez la boutique →
          </a>
        </div>

        {/* Grid — 3 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px 16px',
        }}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}