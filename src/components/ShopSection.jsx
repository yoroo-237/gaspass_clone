import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'

const PRODUCTS = [
  {
    name: 'HITCH HIKER',
    slug: 'hitch-hiker',
    badge: 'New',
    images: [
      'public/JZlZpcElgglkOzxiEgbXIpsYy4.jpg',
      'public/JZlZpcElgglkOzxiEgbXIpsYy4_2.jpg',
      'public/JZlZpcElgglkOzxiEgbXIpsYy4_3.jpg',
    ],
  },
  {
    name: 'PURPLE LEMONADE',
    slug: 'purple-lemonade',
    badge: 'New',
    images: [
      'public/crE5g6o6sQNSWbWVCYXUHUktB1Y.jpg',
      'public/crE5g6o6sQNSWbWVCYXUHUktB1Y_2.jpg',
      'public/crE5g6o6sQNSWbWVCYXUHUktB1Y_3.jpg',
    ],
  },
  {
    name: 'SUNDAE DRIVER',
    slug: 'sundae-driver',
    badge: 'New',
    images: [
      'public/6dnHHpKmlxZ5iN3DroU9xjuMu1s.jpg',
      'public/6dnHHpKmlxZ5iN3DroU9xjuMu1s_2.jpg',
      'public/6dnHHpKmlxZ5iN3DroU9xjuMu1s_3.jpg',
    ],
  },
  {
    name: 'GELONADE SMALLS',
    slug: 'gelonade-smalls',
    badge: 'New',
    images: [
      'public/uFSQWKnoF44CCyIUJwJAUYSQxs.jpg',
      'public/uFSQWKnoF44CCyIUJwJAUYSQxs_2.jpg',
      'public/uFSQWKnoF44CCyIUJwJAUYSQxs_3.jpg',
    ],
  },
  {
    name: 'PERMANENT MARKER',
    slug: 'permanent-marker',
    badge: 'New',
    images: [
      'public/EZVdTIllwqZp3jRzDmQ87WGvg.jpg',
      'public/EZVdTIllwqZp3jRzDmQ87WGvg_2.jpg',
      'public/EZVdTIllwqZp3jRzDmQ87WGvg_3.jpg',
    ],
  },
  {
    name: 'BISCOTTI CAKE',
    slug: 'biscotti-cake',
    badge: 'New',
    images: [
      'public/IvRrxhETfI0kGllqcnEKrKgKdQE.jpg',
      'public/IvRrxhETfI0kGllqcnEKrKgKdQE_2.jpg',
      'public/IvRrxhETfI0kGllqcnEKrKgKdQE_3.jpg',
    ],
  },
]

function ProductCarousel({ images }) {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(
    (e) => {
      e.stopPropagation()
      setCurrent((c) => (c - 1 + images.length) % images.length)
    },
    [images.length]
  )

  const next = useCallback(
    (e) => {
      e.stopPropagation()
      setCurrent((c) => (c + 1) % images.length)
    },
    [images.length]
  )

  return (
    <div className="carousel-root">
      <div className="carousel-track">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="carousel-img"
            style={{
              transform: `translateX(${(i - current) * 100}%)`,
              opacity: i === current ? 1 : 0,
              transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s',
            }}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel-btn carousel-btn--prev" onClick={prev} aria-label="Précédent">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="carousel-btn carousel-btn--next" onClick={next} aria-label="Suivant">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ProductCard({ product, index }) {
  const ref = useReveal(0.1)
  const navigate = useNavigate()

  return (
    <div
      ref={ref}
      className="reveal product-card"
      style={{ transitionDelay: `${index * 80}ms`, cursor: 'pointer' }}
      onClick={() => navigate(`/shop/${product.slug}`)}
    >
      <div className="product-image-wrapper">
        <div className="product-badge">{product.badge}</div>
        <ProductCarousel images={product.images} />
      </div>
      <div style={{ padding: '10px 4px 4px' }}>
        <h3 className="product-name">{product.name}</h3>
      </div>
    </div>
  )
}

export default function ShopSection() {
  const titleRef = useReveal(0.2)
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        .shop-section {
          padding: 48px 32px 80px;
          background: #ffffff;
          min-height: 100vh;
        }
        .shop-inner { max-width: 1100px; margin: 0 auto; }
        .shop-header {
          display: flex; align-items: baseline;
          justify-content: space-between;
          margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
        }
        .shop-title {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: clamp(14px, 2.8vw, 32px);
          color: #111; letter-spacing: 0.04em; line-height: 1.2;
          margin: 0; font-weight: 700;
        }
        .shop-explore-link {
          font-family: var(--font-sans, 'Helvetica Neue', Arial, sans-serif);
          font-size: 18px; font-weight: 600; color: #111;
          text-decoration: none; letter-spacing: 0; white-space: nowrap;
          cursor: pointer; background: none; border: none; padding: 0;
        }
        .shop-explore-link:hover { text-decoration: underline; }

        .shop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .product-image-wrapper {
          width: 100%; aspect-ratio: 1 / 1;
          position: relative; border-radius: 14px;
          overflow: hidden; background: #d4c9b0;
        }
        .product-badge {
          position: absolute; top: 12px; left: 12px;
          font-family: var(--font-sans, 'Helvetica Neue', Arial, sans-serif);
          font-size: 13px; font-weight: 500; color: #1a1a1a;
          background: #c8a96e; padding: 5px 14px;
          border-radius: 30px; z-index: 10;
        }
        .product-name {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 11px; font-weight: 500; color: #111;
          letter-spacing: 0.03em; line-height: 1.5; margin: 0;
        }

        .carousel-root { position: relative; width: 100%; height: 100%; }
        .carousel-track { position: relative; width: 100%; height: 100%; overflow: hidden; }
        .carousel-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; display: block; will-change: transform, opacity;
        }
        .carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
          background: rgba(255,255,255,0.85); border: none; border-radius: 50%;
          width: 32px; height: 32px; display: flex; align-items: center;
          justify-content: center; cursor: pointer; color: #111; opacity: 0;
          transition: opacity 0.2s, background 0.2s; padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .product-image-wrapper:hover .carousel-btn { opacity: 1; }
        .carousel-btn:hover { background: rgba(255,255,255,1); }
        .carousel-btn--prev { left: 8px; }
        .carousel-btn--next { right: 8px; }
        .carousel-dots {
          position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 5px; z-index: 10;
        }
        .carousel-dot {
          width: 6px; height: 6px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.5); cursor: pointer; padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .carousel-dot.active { background: #fff; transform: scale(1.3); }

        @media (max-width: 900px) {
          .shop-section { padding: 32px 16px 60px; }
          .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .shop-title { font-size: clamp(12px, 3.5vw, 20px); }
          .shop-explore-link { font-size: 15px; }
          .shop-header { margin-bottom: 20px; }
          .product-badge { font-size: 11px; padding: 4px 10px; top: 10px; left: 10px; }
          .product-name { font-size: 9px; }
          .carousel-btn { opacity: 1; width: 26px; height: 26px; }
          .carousel-btn--prev { left: 6px; }
          .carousel-btn--next { right: 6px; }
        }
        @media (max-width: 480px) {
          .shop-section { padding: 24px 12px 48px; }
          .shop-grid { gap: 10px; }
        }
      `}</style>

      <section className="shop-section" id="shop">
        <div className="shop-inner">
          <div ref={titleRef} className="shop-header reveal">
            <h2 className="shop-title">FLOWER SHOP</h2>
            {/* ← Clic → page /shop avec tous les produits */}
            <button
              className="shop-explore-link"
              onClick={() => navigate('/shop')}
            >
              Explore the shop →
            </button>
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