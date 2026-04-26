import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import { getProduct, getProducts } from '../api/client'
import CloudinaryImage from '../components/CloudinaryImage'

const WEIGHTS = ['3.5g', '7g', '28g']

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams()           // id = slug, e.g. "hitch-hiker"
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeImg, setActiveImg]           = useState(0)
  const [selectedWeight, setSelectedWeight] = useState('3.5g')
  const [qty, setQty]                       = useState(1)
  const [expanded, setExpanded]             = useState(false)
  const [addedToCart, setAddedToCart]       = useState(false)

  // ✅ useCallback AVANT tous les return conditionnels
  const decrement = useCallback(() => setQty((q) => Math.max(1, q - 1)), [])
  const increment = useCallback(() => setQty((q) => q + 1), [])

  const handleAddToCart = useCallback(() => {
    if (!product) return
    const productForCart = {
      ...product,
      image: product.images?.[0] || product.images?.[0],
    }
    addToCart(productForCart, selectedWeight, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    window.dispatchEvent(new CustomEvent('gp:open-cart'))
  }, [product, selectedWeight, qty, addToCart])

  // Fetch product and related products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const productData = await getProduct(id)
        setProduct(productData)
        
        // Fetch related products
        const allProductsResponse = await getProducts()
        const productList = allProductsResponse?.products || []
        const filteredRelated = productList
          .filter((p) => p.slug !== id)
          .slice(0, 4)
        setRelated(filteredRelated)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // ✅ Les return conditionnels APRÈS tous les hooks
  if (loading) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Chargement du produit...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>{error ? 'Erreur' : 'Produit non trouvé'}</h2>
        <p style={{ color: '#777', marginBottom: 24 }}>
          {error ? `Erreur: ${error}` : "Le produit que vous cherchez n'existe pas ou le lien peut être incorrect."}
        </p>
        <button
          onClick={() => navigate('/shop')}
          style={{ marginTop: 8, padding: '12px 28px', cursor: 'pointer', fontSize: 15, background: '#111', color: '#fff', border: 'none', borderRadius: 8 }}
        >
          ← Retour à la boutique
        </button>
      </div>
    )
  }

  // Get images and price from product data
  const images = product?.images ?? []
  const price = product?.pricing?.[selectedWeight] ?? product?.prices?.[selectedWeight] ?? 0

  return (
    <>
      {/* Police pixel VT323 */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
      />

      <style>{`
        .pp-root * { box-sizing: border-box; }
        .pp-root {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #111;
          background: #fff;
          min-height: 100vh;
        }

        /* ── BREADCRUMB ── */
        .pp-info-breadcrumb {
          font-size: 13px;
          color: #999;
          margin-bottom: 16px;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .pp-info-breadcrumb a,
        .pp-info-breadcrumb button {
          background: none; border: none; cursor: pointer;
          color: #999; font-size: 13px; padding: 0;
          font-family: inherit; text-decoration: none;
        }
        .pp-info-breadcrumb a:hover,
        .pp-info-breadcrumb button:hover { color: #111; }

        /* ── MAIN LAYOUT ── */
        .pp-main {
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 40px 60px;
        }

        /* ── THUMBNAILS ── */
        .pp-thumbs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 4px;
        }
        .pp-thumb {
          width: 72px; height: 72px;
          border-radius: 8px; overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
          background: #eee; flex-shrink: 0; padding: 0;
        }
        .pp-thumb.active { border-color: #111; }
        .pp-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── IMAGE PRINCIPALE ── */
        .pp-gallery {
          border-radius: 18px; overflow: hidden;
          background: #e8e0d0; aspect-ratio: 1 / 1;
        }
        .pp-gallery img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.3s; }

        /* ── PANNEAU DROIT ── */
        .pp-info { padding: 8px 0 0 16px; }
        .pp-grade-badge {
          display: inline-block;
          background: #f5f0e8;
          color: #8a6a2a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .pp-product-title {
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
          line-height: 1.1;
        }
        .pp-price {
          font-size: 18px; font-weight: 400;
          color: #111; margin-bottom: 20px;
        }
        .pp-short-desc {
          font-size: 14px; color: #333;
          margin-bottom: 6px; font-weight: 500;
        }
        .pp-readmore {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          font-size: 14px; color: #111; font-weight: 500;
          padding: 0; font-family: inherit; margin-bottom: 28px;
        }
        .pp-readmore-icon {
          font-size: 16px; line-height: 1; display: inline-block;
          transition: transform 0.2s;
        }
        .pp-readmore-icon.open { transform: rotate(45deg); }
        .pp-readmore-body {
          font-size: 13px; color: #555;
          line-height: 1.6; margin-bottom: 20px;
        }

        /* WEIGHT SELECTOR */
        .pp-amount-label {
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.05em; color: #111;
          margin-bottom: 12px;
          display: flex; gap: 8px; align-items: center;
        }
        .pp-amount-label span { font-weight: 400; color: #777; }
        .pp-amounts {
          display: flex; flex-wrap: wrap;
          gap: 8px; margin-bottom: 28px;
        }
        .pp-amount-btn {
          padding: 9px 20px;
          border-radius: 8px;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          font-size: 14px; font-weight: 500;
          cursor: pointer; color: #111;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .pp-amount-btn:hover { border-color: #999; }
        .pp-amount-btn.selected { border-color: #111; font-weight: 700; }

        /* QTY + ADD */
        .pp-actions { display: flex; gap: 12px; align-items: center; }
        .pp-qty {
          display: flex; align-items: center; gap: 16px;
          border: 1.5px solid #e0e0e0; border-radius: 50px;
          padding: 0 16px; height: 52px; min-width: 110px;
          justify-content: space-between;
        }
        .pp-qty-btn {
          background: none; border: none; cursor: pointer;
          font-size: 20px; color: #111; padding: 0;
          line-height: 1; font-family: inherit;
          width: 20px; text-align: center;
        }
        .pp-qty-btn:hover { opacity: 0.6; }
        .pp-qty-num { font-size: 16px; font-weight: 500; min-width: 20px; text-align: center; }

        .pp-add-btn {
          flex: 1; height: 52px;
          background: #111; color: #fff;
          border: none; border-radius: 50px;
          font-size: 16px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          letter-spacing: 0.01em;
          transition: background 0.2s;
          position: relative; overflow: hidden;
        }
        .pp-add-btn:hover { background: #333; }
        .pp-add-btn.added { background: #2d8c4e; }

        /* Cart success toast */
        .pp-toast {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%) translateY(120px);
          background: #111; color: #fff;
          padding: 14px 28px; border-radius: 999px;
          font-size: 15px; font-weight: 500;
          z-index: 9999;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .pp-toast.visible {
          transform: translateX(-50%) translateY(0);
        }

        /* ── DIVIDER ── */
        .pp-divider {
          max-width: 1200px; margin: 0 auto;
          padding: 0 40px; border: none;
          border-top: 1px solid #e8e8e8;
        }

        /* ── PROMO ── */
        .pp-promo {
          display: grid; grid-template-columns: 1fr 1fr;
          max-width: 1500px; margin: 0 auto;
          padding: 64px 40px 80px; gap: 60px;
          align-items: center;
        }
        .pp-promo-img-wrap {
          border-radius: 18px; overflow: hidden;
          aspect-ratio: 4 / 3; background: #1a1a2e;
        
        }
        .pp-promo-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pp-promo-text { display: flex; flex-direction: column; justify-content: center; }
        .pp-promo-heading {
          font-family: 'VT323', monospace;
          font-size: clamp(48px, 5.5vw, 74px);
          font-weight: 400; line-height: 1.05;
          color: #111; margin: 0 0 28px;
          letter-spacing: 0.01em;
          -webkit-font-smoothing: none;
        }
        .pp-promo-body { font-size: 15px; color: #555; line-height: 1.7; margin: 0; max-width: 480px; }

        /* ── BROWSE MORE ── */
        .pp-browse { max-width: 1200px; margin: 0 auto; padding: 48px 40px 80px; }
        .pp-browse-title { font-size: clamp(22px, 3vw, 32px); font-weight: 700; margin: 0 0 28px; letter-spacing: -0.01em; }
        .pp-browse-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .pp-browse-card { cursor: pointer; }
        .pp-browse-img-wrap {
          width: 100%; aspect-ratio: 1 / 1;
          border-radius: 14px; overflow: hidden;
          background: #e8e0d0; position: relative; margin-bottom: 12px;
        }
        .pp-browse-badge {
          position: absolute; top: 12px; left: 12px;
          font-size: 12px; font-weight: 500; color: #1a1a1a;
          background: #c8a96e; padding: 4px 12px;
          border-radius: 30px; z-index: 2;
        }
        .pp-browse-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          display: block; transition: transform 0.35s;
        }
        .pp-browse-card:hover .pp-browse-img-wrap img { transform: scale(1.04); }
        .pp-browse-name { font-size: 14px; font-weight: 700; letter-spacing: 0.04em; margin: 0 0 4px; color: #111; }
        .pp-browse-strain { font-size: 12px; color: #777; margin: 0; font-weight: 400; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .pp-main {
            grid-template-columns: 1fr;
            padding: 90px 16px 40px;
            gap: 16px;
          }
          .pp-thumbs { flex-direction: row; gap: 8px; padding-top: 0; }
          .pp-thumb { width: 60px; height: 60px; }
          .pp-info { padding: 0; }
          .pp-info-breadcrumb { display: none; }
          .pp-browse-grid { grid-template-columns: repeat(2, 1fr); }
          .pp-browse { padding: 32px 16px 60px; }
          .pp-divider { padding: 0 16px; }
          .pp-promo {
            grid-template-columns: 1fr;
            padding: 48px 16px 60px; gap: 32px;
          }
          .pp-promo-heading { font-size: clamp(44px, 10vw, 64px); }
        }
        @media (max-width: 480px) {
          .pp-actions { flex-direction: column; }
          .pp-add-btn { width: 100%; }
          .pp-qty { width: 100%; }
        }
      `}</style>

      {/* Cart added toast */}
      <div className={`pp-toast${addedToCart ? ' visible' : ''}`}>
        ✓ Added to cart — {product.name} ({selectedWeight})
      </div>

      <div className="pp-root">

        {/* 1 ── Main grid: thumbs | image | info */}
        <div className="pp-main">

          {/* Thumbnails */}
          <div className="pp-thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                className={`pp-thumb${activeImg === i ? ' active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <CloudinaryImage 
                  src={src} 
                  alt={`${product.name} ${i + 1}`}
                  width={150}
                  height={150}
                  crop="fill"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="pp-gallery">
            {images[activeImg] && (
              <CloudinaryImage 
                src={images[activeImg]} 
                alt={product.name} 
                key={activeImg}
                width={600}
                height={600}
                crop="limit"
                priority={true}
              />
            )}
          </div>

          {/* Info panel */}
          <div className="pp-info">
            <nav className="pp-info-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <span style={{ color: '#111' }}>{product.name}</span>
            </nav>

            {product.grade && (
              <span className="pp-grade-badge">{product.grade} · THC {product.thc}</span>
            )}

            <h1 className="pp-product-title">{product.name}</h1>
            <p className="pp-price">${price}.00 USD</p>

            <p className="pp-short-desc">{product.strain} strain — {product.grade}</p>

            <button
              className="pp-readmore"
              onClick={() => setExpanded((v) => !v)}
            >
              <span className={`pp-readmore-icon${expanded ? ' open' : ''}`}>+</span>
              Read more
            </button>

            {expanded && (
              <div className="pp-readmore-body">
                <p>
                  {product.name} is a premium {product.strain.toLowerCase()} strain from
                  the {product.grade} tier, with {product.thc} THC. Known for its
                  exceptional aroma, dense structure, and consistent quality. Every batch
                  is lab-tested, hand-trimmed, and packed with potency and flavor.
                  Perfect for both connoisseurs and everyday enthusiasts.
                </p>
              </div>
            )}

            {/* Weight selector */}
            <div className="pp-amount-label">
              WEIGHT <span>{selectedWeight}</span>
            </div>
            <div className="pp-amounts">
              {WEIGHTS.map((w) => (
                <button
                  key={w}
                  className={`pp-amount-btn${selectedWeight === w ? ' selected' : ''}`}
                  onClick={() => setSelectedWeight(w)}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Qty + Add to Cart */}
            <div className="pp-actions">
              <div className="pp-qty">
                <button className="pp-qty-btn" onClick={decrement}>−</button>
                <span className="pp-qty-num">{qty}</span>
                <button className="pp-qty-btn" onClick={increment}>+</button>
              </div>
              <button
                className={`pp-add-btn${addedToCart ? ' added' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        <hr className="pp-divider" />

        {/* 2 ── Promo section */}
        <section className="pp-promo">
          <div className="pp-promo-img-wrap">
            <img
              src="/public/Ij0OCM150ZPBqzHfngae28PyYq8.png"
              alt="GasPass premium bags rated 87, 89, 91, 93"
            />
          </div>
          <div className="pp-promo-text">
            <h2 className="pp-promo-heading">
              This Is the<br />
              Gas You've<br />
              Been Waiting<br />
              For
            </h2>
            <p className="pp-promo-body">
              When you're buying, you need more than hype — you need consistency,
              potency, and real quality you can count on. At GasPass, every batch we
              deliver is lab-tested, hand-trimmed, and packed with the kind of nose,
              stickiness, and structure that keeps customers coming back.
            </p>
          </div>
        </section>

        <hr className="pp-divider" />

        {/* 3 ── Browse more */}
        <section className="pp-browse">
          <h2 className="pp-browse-title">Browse more</h2>
          <div className="pp-browse-grid">
            {related.map((p) => (
              <div
                key={p.slug}
                className="pp-browse-card"
                onClick={() => {
                  navigate(`/shop/${p.slug}`)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <div className="pp-browse-img-wrap">
                  {p.badge && <span className="pp-browse-badge">{p.badge}</span>}
                  <CloudinaryImage 
                    src={p.images?.[0] || ''} 
                    alt={p.name}
                    width={250}
                    height={250}
                    crop="fill"
                  />
                </div>
                <p className="pp-browse-name">{p.name}</p>
                <p className="pp-browse-strain">{p.type || p.grade || ''}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}