import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProducts } from '../api/client'

const GRADE_FILTERS = ['All', '87 Regular', '89 Premium', '91 Supreme', '93 High Octane']

function ProductCard({ product }) {
  const navigate = useNavigate()
  const [imgErrors, setImgErrors] = useState({})
  const [hovered, setHovered] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = product.images || []
  const total = images.length

  const handlePrev = useCallback((e) => {
    e.stopPropagation()
    setCurrentIndex(i => (i - 1 + total) % total)
  }, [total])

  const handleNext = useCallback((e) => {
    e.stopPropagation()
    setCurrentIndex(i => (i + 1) % total)
  }, [total])

  const handleDotClick = useCallback((e, idx) => {
    e.stopPropagation()
    setCurrentIndex(idx)
  }, [])

  const startingPrice = product.prices['3.5g']
  const currentImg = images[currentIndex]
  const imgFailed = imgErrors[currentIndex]

  return (
    <div
      className="scp-card"
      onClick={() => navigate(`/shop/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="scp-card-img-wrap">
        {product.isNew && <span className="scp-new-badge">New</span>}

        {/* Images strip (CSS-driven slide) */}
        <div
          className="scp-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, idx) => (
            imgErrors[idx] ? (
              <div key={idx} className="scp-carousel-slide scp-card-placeholder" />
            ) : (
              <img
                key={idx}
                src={src}
                alt={`${product.name} ${idx + 1}`}
                className="scp-carousel-slide scp-card-img"
                onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
              />
            )
          ))}
        </div>

        {/* Prev / Next arrows — visible on hover only */}
        {total > 1 && (
          <>
            <button
              className={`scp-arrow scp-arrow-left${hovered ? ' visible' : ''}`}
              onClick={handlePrev}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              className={`scp-arrow scp-arrow-right${hovered ? ' visible' : ''}`}
              onClick={handleNext}
              aria-label="Image suivante"
            >
              ›
            </button>
          </>
        )}

        {/* Dots indicator */}
        {total > 1 && (
          <div className={`scp-dots${hovered ? ' visible' : ''}`}>
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`scp-dot${idx === currentIndex ? ' active' : ''}`}
                onClick={(e) => handleDotClick(e, idx)}
                aria-label={`Aller à l'image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Info overlay (bottom) */}
        <div className={`scp-card-overlay${hovered ? ' visible' : ''}`}>
          <div className="scp-card-overlay-content">
            <span className="scp-card-overlay-thc">THC {product.thc}</span>
            <span className="scp-card-overlay-grade">{product.grade}</span>
            <span className="scp-card-overlay-cta">View Product →</span>
          </div>
        </div>
      </div>

      <div className="scp-card-body">
        <div className="scp-card-name">{product.name}</div>
        <div className="scp-card-price">From ${startingPrice}</div>
      </div>
    </div>
  )
}

export default function ShopCategoryPage() {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const params = new URLSearchParams(location.search)
  const gradeParam = params.get('grade')

  const [activeFilter, setActiveFilter] = useState(
    gradeParam && GRADE_FILTERS.includes(gradeParam) ? gradeParam : 'All'
  )

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const grade = activeFilter === 'All' ? null : activeFilter
        const data = await getProducts(grade ? { grade } : {})
        // Handle both array and { count, page, limit, products } formats
        setProducts(Array.isArray(data) ? data : (data?.products || []))
      } catch (err) {
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeFilter])

  // Sync filter from URL
  useEffect(() => {
    const p = new URLSearchParams(location.search)
    const g = p.get('grade')
    if (g && GRADE_FILTERS.includes(g)) {
      setActiveFilter(g)
    } else {
      setActiveFilter('All')
    }
  }, [location.search])

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        /* ── Hero ── */
        .scp-hero {
          position: relative; height: 580px; overflow: hidden; background: #0a0a0a;
        }
        .scp-hero-bg {
          position: absolute; inset: 0;
          background-image: url('/shopall.png');
          background-size: cover; background-position: center 30%;
          filter: brightness(0.55);
        }
        .scp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%);
        }
        .scp-hero-title {
          position: absolute; bottom: 60px; left: 0; right: 0;
          text-align: center;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(48px, 7vw, 88px); font-weight: 400;
          color: #fff; letter-spacing: -0.01em; line-height: 1;
          pointer-events: none;
        }

        /* ── Layout ── */
        .scp-layout {
          display: grid; grid-template-columns: 220px 1fr; gap: 0;
          max-width: 1540px; margin: 0 auto;
          padding: 60px 48px 120px; align-items: start;
        }
        .scp-sidebar { position: sticky; top: 100px; padding-right: 40px; }
        .scp-sidebar-title {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 22px; font-weight: 600; color: #111;
          margin-bottom: 28px; letter-spacing: -0.01em;
        }
        .scp-filter-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; }
        .scp-filter-item {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 0; border-bottom: 1px solid #e8e8e8;
          cursor: pointer; transition: color 0.15s;
        }
        .scp-filter-item:first-child { border-top: 1px solid #e8e8e8; }
        .scp-filter-dot {
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid #ccc; flex-shrink: 0;
          transition: border-color 0.15s, background 0.15s;
        }
        .scp-filter-dot.active { border-color: #111; background: #111; }
        .scp-filter-label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 15px; font-weight: 400; color: #555;
          transition: color 0.15s;
        }
        .scp-filter-label.active { color: #111; font-weight: 600; }

        /* ── Grid ── */
        .scp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 28px; }

        /* ── Card ── */
        .scp-card { cursor: pointer; transition: transform 0.2s; }
        .scp-card:hover { transform: translateY(-4px); }

        .scp-card-img-wrap {
          position: relative; width: 100%; aspect-ratio: 1 / 1;
          border-radius: 16px; overflow: hidden; background: #f0f0f0;
        }

        /* ── Carousel track ── */
        .scp-carousel-track {
          display: flex; width: 100%; height: 100%;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .scp-carousel-slide {
          flex: 0 0 100%; width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.4s;
        }
        .scp-card:hover .scp-carousel-slide { transform: scale(1.04); }
        .scp-card-placeholder {
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        }

        /* ── Arrows ── */
        .scp-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; line-height: 1; color: #111;
          cursor: pointer; z-index: 10;
          opacity: 0; pointer-events: none;
          transition: opacity 0.2s, background 0.15s;
          padding: 0;
        }
        .scp-arrow.visible { opacity: 1; pointer-events: auto; }
        .scp-arrow:hover { background: #fff; }
        .scp-arrow-left  { left: 10px; }
        .scp-arrow-right { right: 10px; }

        /* ── Dots ── */
        .scp-dots {
          position: absolute; bottom: 12px; left: 0; right: 0;
          display: flex; justify-content: center; gap: 6px; z-index: 10;
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        .scp-dots.visible { opacity: 1; pointer-events: auto; }
        .scp-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.5); border: none; cursor: pointer;
          padding: 0; transition: background 0.15s, transform 0.15s;
        }
        .scp-dot.active { background: #fff; transform: scale(1.3); }

        /* ── Info overlay ── */
        .scp-card-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: flex-end; padding: 20px;
          opacity: 0; transition: opacity 0.25s ease; border-radius: 16px;
          pointer-events: none;
        }
        .scp-card-overlay.visible { opacity: 1; }
        .scp-card-overlay-content { display: flex; flex-direction: column; gap: 4px; width: 100%; }
        .scp-card-overlay-thc {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 700; color: #9effa5;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .scp-card-overlay-grade {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); letter-spacing: 0.03em;
        }
        .scp-card-overlay-cta {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px; font-weight: 700; color: #fff; margin-top: 8px; letter-spacing: 0.02em;
        }

        /* ── Badge ── */
        .scp-new-badge {
          position: absolute; top: 14px; left: 14px;
          background: #c8a96e; color: #fff;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 600; padding: 4px 12px;
          border-radius: 999px; z-index: 2; letter-spacing: 0.02em;
        }

        /* ── Card body ── */
        .scp-card-body {
          padding: 14px 4px 0; display: flex;
          justify-content: space-between; align-items: baseline;
        }
        .scp-card-name {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 15px; font-weight: 500; color: #111;
          letter-spacing: 0.02em; line-height: 1.3;
        }
        .scp-card-price {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px; font-weight: 400; color: #777; white-space: nowrap;
        }

        /* ── Loading/Error ── */
        .scp-loading, .scp-error {
          padding: 60px 20px; text-align: center;
          font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #666;
        }
        .scp-error { color: #d32f2f; }

        /* ── Responsive ── */
        @media (max-width: 1100px) { .scp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 760px) {
          .scp-layout { grid-template-columns: 1fr; padding: 32px 20px 80px; }
          .scp-sidebar { position: static; padding-right: 0; margin-bottom: 32px; }
          .scp-filter-list { flex-direction: row; flex-wrap: wrap; gap: 8px; }
          .scp-filter-item {
            border: 1px solid #e0e0e0; border-top: 1px solid #e0e0e0;
            border-radius: 999px; padding: 8px 16px;
          }
          .scp-filter-item:first-child { border-top: 1px solid #e0e0e0; }
          .scp-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; }
          .scp-hero { height: 400px; }
          .scp-hero-title { font-size: 42px; bottom: 40px; }
          /* On mobile, arrows always visible (no hover) */
          .scp-arrow { opacity: 1; pointer-events: auto; }
          .scp-dots  { opacity: 1; pointer-events: auto; }
        }
        @media (max-width: 480px) { .scp-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {/* Hero */}
      <section className="scp-hero">
        <div className="scp-hero-bg" />
        <div className="scp-hero-overlay" />
        <h1 className="scp-hero-title">Shop All</h1>
      </section>

      {/* Layout */}
      <div className="scp-layout">
        <aside className="scp-sidebar">
          <div className="scp-sidebar-title">Shop</div>
          <ul className="scp-filter-list">
            {GRADE_FILTERS.map(f => (
              <li
                key={f}
                className="scp-filter-item"
                onClick={() => setActiveFilter(f)}
              >
                <div className={`scp-filter-dot${activeFilter === f ? ' active' : ''}`} />
                <span className={`scp-filter-label${activeFilter === f ? ' active' : ''}`}>{f}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {loading && <div className="scp-loading">Chargement des produits...</div>}
          {error && <div className="scp-error">Erreur: {error}</div>}
          {!loading && !error && (
            <div className="scp-grid">
              {products.length > 0 ? (
                products.map(product => (
                  <ProductCard key={product.id || product.slug} product={product} />
                ))
              ) : (
                <div className="scp-loading" style={{ gridColumn: '1 / -1' }}>Aucun produit trouvé</div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}