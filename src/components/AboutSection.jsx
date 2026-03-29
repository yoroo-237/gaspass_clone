import React from 'react'
import useReveal from '../hooks/useReveal.js'

// ← Remplace chaque chemin par le vrai path de ton image
import img87 from '../../public/uujydSe0o9iVF7Z4pt1d3keHXI.png'
import img89 from '../../public/nfQ028TI3tI9RAdPLLEmSzzZE.png'
import img91 from '../../public/qDJkxOcZfTQ8Z1EVbgfYFQi5So.jpg'
import img93 from '../../public/xc72uPpMsmZXRb0w4DNCaI794ok.jpg'

const CATEGORIES = [
  { label: 'Shop 87', sublabel: 'REG',        img: img87, href: '/shop/categories/87' },
  { label: 'Shop 89', sublabel: 'PREMIUM',    img: img89, href: '/shop/categories/89' },
  { label: 'Shop 91', sublabel: 'SUPREME',    img: img91, href: '/shop/categories/91' },
  { label: 'Shop 93', sublabel: 'HIGH OCTANE',img: img93, href: '/shop/categories/93' },
]

export default function AboutSection() {
  const titleRef = useReveal(0.2)
  const gridRef  = useReveal(0.15)

  return (
    <section id="about" style={{
      padding: '80px 24px',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div ref={titleRef} className="reveal" style={{
          textAlign: 'center',
          marginBottom: 48,
        }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(10px, 1.2vw, 14px)',
            color: '#ba0b20',
            letterSpacing: '0.2em',
            marginBottom: 16,
          }}>
            ONLY GAS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: '#111',
            lineHeight: 1.3,
            letterSpacing: '0.04em',
          }}>
            Shop Gas Pass
          </h2>
        </div>

        {/* ── Grid ── */}
        <div
          ref={gridRef}
          className="reveal shop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {CATEGORIES.map(({ label, sublabel, img, href }) => (
            <a
              key={label}
              href={href}
              className="shop-card"
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'block',
                aspectRatio: '4 / 3',
                textDecoration: 'none',
              }}
            >
              {/* Product image */}
              <img
                src={img}
                alt={label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Dark overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.25)',
              }} />

              {/* Label overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(14px, 2.5vw, 28px)',
                color: '#fff',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}>
                {label}
              </div>

              {/* Red sublabel bottom */}
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(10px, 1.8vw, 20px)',
                color: '#ba0b20',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              }}>
                {sublabel}
              </div>
            </a>
          ))}
        </div>

      </div>

      <style>{`
        .shop-card img {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .shop-card:hover img {
          transform: scale(1.07);
        }
        @media (max-width: 600px) {
          .shop-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </section>
  )
}