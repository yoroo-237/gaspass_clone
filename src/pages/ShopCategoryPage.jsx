import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ALL_PRODUCTS = [
  // 87 Regular
  { id: 1,  slug: 'gelonade-smalls',  name: 'GELONADE SMALLS',  grade: '87 Regular',     thc: '22%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 35, '7g': 65,  '28g': 200 }, images: ['/products/gelonade-smalls.jpg', '/products/gelonade-smalls-2.jpg', '/products/gelonade-smalls-3.jpg'],   isNew: true  },
  { id: 2,  slug: 'biscotti-cake',    name: 'BISCOTTI CAKE',    grade: '87 Regular',     thc: '24%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 35, '7g': 65,  '28g': 200 }, images: ['/products/biscotti-cake.jpg', '/products/biscotti-cake-2.jpg', '/products/biscotti-cake-3.jpg'],      isNew: true  },
  { id: 3,  slug: 'sunset-sherbet',   name: 'SUNSET SHERBET',   grade: '87 Regular',     thc: '21%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 35, '7g': 65,  '28g': 200 }, images: ['/products/sunset-sherbet.jpg', '/products/sunset-sherbet-2.jpg', '/products/sunset-sherbet-3.jpg'],     isNew: false },
  // 89 Premium
  { id: 4,  slug: 'purple-lemonade',  name: 'PURPLE LEMONADE',  grade: '89 Premium',     thc: '26%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 45, '7g': 85,  '28g': 260 }, images: ['public/crE5g6o6sQNSWbWVCYXUHUktB1Y.jpg', '/products/purple-lemonade-2.jpg', '/products/purple-lemonade-3.jpg'],    isNew: true  },
  { id: 5,  slug: 'sundae-driver',    name: 'SUNDAE DRIVER',    grade: '89 Premium',     thc: '27%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 45, '7g': 85,  '28g': 260 }, images: ['public/6dnHHpKmlxZ5iN3DroU9xjuMu1s.jpg', '/products/sundae-driver-2.jpg', '/products/sundae-driver-3.jpg'],    isNew: true  },
  { id: 6,  slug: 'mac-1',            name: 'MAC 1',            grade: '89 Premium',     thc: '25%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 45, '7g': 85,  '28g': 260 }, images: ['/products/mac1.jpg', '/products/mac1-2.jpg', '/products/mac1-3.jpg'],               isNew: false },
  { id: 7,  slug: 'permanent-marker', name: 'PERMANENT MARKER', grade: '89 Premium',     thc: '27%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 45, '7g': 85,  '28g': 260 }, images: ['public/EZVdTIllwqZp3jRzDmQ87WGvg.jpg', '/products/permanent-marker-2.jpg', '/products/permanent-marker-3.jpg'],   isNew: true  },
  // 91 Supreme
  { id: 8,  slug: 'hitch-hiker',      name: 'HITCH HIKER',      grade: '91 Supreme',     thc: '30%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 55, '7g': 100, '28g': 320 }, images: ['public/JZlZpcElgglkOzxiEgbXIpsYy4.jpg', '/products/hitch-hiker-2.jpg', '/products/hitch-hiker-3.jpg'],        isNew: true  },
  { id: 9,  slug: 'jealousy',         name: 'JEALOUSY',         grade: '91 Supreme',     thc: '29%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 55, '7g': 100, '28g': 320 }, images: ['/products/jealousy.jpg', '/products/jealousy-2.jpg', '/products/jealousy-3.jpg'],           isNew: false },
  { id: 10, slug: 'chemdog',          name: 'CHEMDOG',          grade: '91 Supreme',     thc: '31%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 55, '7g': 100, '28g': 320 }, images: ['/products/chemdog.jpg', '/products/chemdog-2.jpg', '/products/chemdog-3.jpg'],            isNew: true  },
  { id: 11, slug: 'berry-nebula',     name: 'BERRY NEBULA',     grade: '91 Supreme',     thc: '30%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 55, '7g': 100, '28g': 320 }, images: ['/products/berry-nebula.jpg', '/products/berry-nebula-2.jpg', '/products/berry-nebula-3.jpg'],       isNew: false },
  { id: 12, slug: 'jungle-juice',     name: 'JUNGLE JUICE',     grade: '91 Supreme',     thc: '32%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 55, '7g': 100, '28g': 320 }, images: ['/products/jungle-juice.jpg', '/products/jungle-juice-2.jpg', '/products/jungle-juice-3.jpg'],       isNew: true  },
  // 93 High Octane
  { id: 13, slug: 'runtz-og',         name: 'RUNTZ OG',         grade: '93 High Octane', thc: '34%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/runtz-og.jpg', '/products/runtz-og-2.jpg', '/products/runtz-og-3.jpg'],          isNew: true  },
  { id: 14, slug: 'exotic-zkittlez',  name: 'EXOTIC ZKITTLEZ',  grade: '93 High Octane', thc: '33%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/exotic-zkittlez.jpg', '/products/exotic-zkittlez-2.jpg', '/products/exotic-zkittlez-3.jpg'],   isNew: true  },
  { id: 15, slug: 'wedding-cake-x',   name: 'WEDDING CAKE X',   grade: '93 High Octane', thc: '35%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/wedding-cake-x.jpg', '/products/wedding-cake-x-2.jpg', '/products/wedding-cake-x-3.jpg'],    isNew: false },
  { id: 16, slug: 'gary-payton',      name: 'GARY PAYTON',      grade: '93 High Octane', thc: '33%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/gary-payton.jpg', '/products/gary-payton-2.jpg', '/products/gary-payton-3.jpg'],       isNew: true  },
  { id: 17, slug: 'purple-punch',     name: 'PURPLE PUNCH',     grade: '93 High Octane', thc: '32%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/purple-punch.jpg', '/products/purple-punch-2.jpg', '/products/purple-punch-3.jpg'],      isNew: true  },
  { id: 18, slug: 'ice-cream-cake',   name: 'ICE CREAM CAKE',   grade: '93 High Octane', thc: '34%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/ice-cream-cake.jpg', '/products/ice-cream-cake-2.jpg', '/products/ice-cream-cake-3.jpg'],    isNew: false },
  { id: 19, slug: 'cereal-milk',      name: 'CEREAL MILK',      grade: '93 High Octane', thc: '33%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 }, images: ['/products/cereal-milk.jpg', '/products/cereal-milk-2.jpg', '/products/cereal-milk-3.jpg'],       isNew: true  },
]

const FILTERS = ['All', '87 Regular', '89 Premium', '91 Supreme', '93 High Octane']

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

  const params = new URLSearchParams(location.search)
  const gradeParam = params.get('grade')

  const [activeFilter, setActiveFilter] = useState(
    gradeParam && FILTERS.includes(gradeParam) ? gradeParam : 'All'
  )

  useEffect(() => {
    const p = new URLSearchParams(location.search)
    const g = p.get('grade')
    if (g && FILTERS.includes(g)) {
      setActiveFilter(g)
    } else {
      setActiveFilter('All')
    }
  }, [location.search])

  const filtered = activeFilter === 'All'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.grade === activeFilter)

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
            {FILTERS.map(f => (
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
          <div className="scp-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}