import React from 'react'
import useReveal from '../hooks/useReveal.js'

const PRODUCTS = [
  { name: 'HITCH HIKER',        slug: 'hitch-hiker',      badge: 'New', image: 'public/JZlZpcElgglkOzxiEgbXIpsYy4.jpg' },
  { name: 'PURPLE LEMONADE',    slug: 'purple-lemonade',  badge: 'New', image: 'public/crE5g6o6sQNSWbWVCYXUHUktB1Y.jpg' },
  { name: 'SUNDAE DRIVER',      slug: 'sundae-driver',    badge: 'New', image: 'public/6dnHHpKmlxZ5iN3DroU9xjuMu1s.jpg' },
  { name: 'GELONADE SMALLS',    slug: 'gelonade-smalls',  badge: 'New', image: 'public/uFSQWKnoF44CCyIUJwJAUYSQxs.jpg' },
  { name: 'PERMANENT MARKER',   slug: 'permanent-marker', badge: 'New', image: 'public/EZVdTIllwqZp3jRzDmQ87WGvg.jpg' },
  { name: 'BISCOTTI CAKE',      slug: 'biscotti-cake',    badge: 'New', image: 'public/IvRrxhETfI0kGllqcnEKrKgKdQE.jpg' },
]

function ProductCard({ product, index }) {
  const ref = useReveal(0.1)

  return (
    <div
      ref={ref}
      className="reveal product-card"
      style={{ transitionDelay: `${index * 80}ms`, cursor: 'pointer' }}
    >
      <div className="product-image-wrapper">
        {/* Badge */}
        <div className="product-badge">
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

      <div style={{ padding: '10px 4px 4px' }}>
        <h3 className="product-name">
          {product.name}
        </h3>
      </div>
    </div>
  )
}

export default function ShopSection() {
  const titleRef = useReveal(0.2)

  return (
    <>
      <style>{`
        .shop-section {
          padding: 48px 32px 80px;
          background: #ffffff;
          min-height: 100vh;
        }

        .shop-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .shop-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .shop-title {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: clamp(14px, 2.8vw, 32px);
          color: #111;
          letter-spacing: 0.04em;
          line-height: 1.2;
          margin: 0;
          font-weight: 700;
        }

        .shop-explore-link {
          font-family: var(--font-sans, 'Helvetica Neue', Arial, sans-serif);
          font-size: 18px;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .shop-explore-link:hover { text-decoration: underline; }

        /* Grid — 3 cols desktop, 2 cols mobile (comme screenshot) */
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .product-image-wrapper {
          width: 100%;
          aspect-ratio: 1 / 1;
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #d4c9b0;
        }

        .product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: var(--font-sans, 'Helvetica Neue', Arial, sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          background: #c8a96e;
          padding: 5px 14px;
          border-radius: 30px;
          z-index: 2;
          letter-spacing: 0;
        }

        .product-name {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 11px;
          font-weight: 500;
          color: #111;
          letter-spacing: 0.03em;
          line-height: 1.5;
          margin: 0;
        }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .shop-section {
            padding: 32px 16px 60px;
          }
          /* 2 colonnes sur mobile comme dans les screenshots */
          .shop-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .shop-title {
            font-size: clamp(12px, 3.5vw, 20px);
          }
          .shop-explore-link {
            font-size: 15px;
          }
          .shop-header {
            margin-bottom: 20px;
          }
          .product-badge {
            font-size: 11px;
            padding: 4px 10px;
            top: 10px;
            left: 10px;
          }
          .product-name {
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .shop-section {
            padding: 24px 12px 48px;
          }
          .shop-grid {
            gap: 10px;
          }
        }
      `}</style>

      <section className="shop-section" id="shop">
        <div className="shop-inner">
          <div ref={titleRef} className="shop-header reveal">
            <h2 className="shop-title">FLOWER SHOP</h2>
            <a
              href="#"
              className="shop-explore-link"
            >
              Explore the shop →
            </a>
          </div>

          <div className="shop-grid">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.name} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}