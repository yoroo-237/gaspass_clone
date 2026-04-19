import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useCart from '../hooks/useCart'

/* ─── SVG Icons ─── */
function SearchIcon({ size = 20, dark = false }) {
  const c = dark ? '#111' : 'white'
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="6.2" stroke={c} strokeWidth="1.7"/>
      <line x1="13.1" y1="13.1" x2="18.5" y2="18.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}
function UserIcon({ size = 20, dark = false }) {
  const c = dark ? '#111' : 'white'
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.5" r="3.8" stroke={c} strokeWidth="1.7"/>
      <path d="M2 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}
function CartIcon({ size = 22, dark = false }) {
  const c = dark ? '#111' : 'white'
  return (
    <svg width={size} height={size - 2} viewBox="0 0 22 20" fill="none">
      <path d="M7 8V6a4 4 0 0 1 8 0v2" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M2.5 8h17l-1.75 9.1A1 1 0 0 1 16.77 18H5.23a1 1 0 0 1-.98-.9L2.5 8z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  )
}
function MenuIcon({ size = 20 }) {
  return (
    <svg width={size} height={size - 4} viewBox="0 0 20 14" fill="none">
      <line x1="0" y1="1" x2="20" y2="1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="0" y1="7" x2="20" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="0" y1="13" x2="20" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <line x1="2" y1="2" x2="16" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="2" y2="16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Popular items shown when cart is empty ─── */
const POPULAR_ITEMS = [
  { name: 'JUNGLE JUICE',      grade: '91 Supreme',  image: '/products/jungle-juice.jpg',      slug: 'jungle-juice' },
  { name: 'BERRY NEBULA',      grade: '91 Supreme',  image: '/products/berry-nebula.jpg',       slug: 'berry-nebula' },
  { name: 'PERMANENT MARKER',  grade: '89 Premium',  image: '/products/permanent-marker.jpg',   slug: 'permanent-marker' },
]

/* ─── Nav links ─── */
const NAV_LINKS = [
  { label: 'Shop',             to: '/shop' },
  { label: 'Order & Contact',  anchor: 'support' },
  { label: 'FAQ',              anchor: 'faq' },
]

/* ─── Payment logos ─── */
function PaymentIcons() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24 }}>
      <svg width="52" height="32" viewBox="0 0 52 32" fill="none">
        <rect width="52" height="32" rx="4" fill="#fff"/>
        <text x="8" y="22" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1a1f71">VISA</text>
      </svg>
      <svg width="46" height="32" viewBox="0 0 46 32" fill="none">
        <rect width="46" height="32" rx="4" fill="#fff"/>
        <circle cx="18" cy="16" r="9" fill="#EB001B"/>
        <circle cx="28" cy="16" r="9" fill="#F79E1B"/>
        <path d="M23 9.27a9 9 0 0 1 0 13.46A9 9 0 0 1 23 9.27z" fill="#FF5F00"/>
      </svg>
      <svg width="52" height="32" viewBox="0 0 52 32" fill="none">
        <rect width="52" height="32" rx="4" fill="#fff"/>
        <text x="6" y="21" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#231f20">DISCOVER</text>
        <circle cx="38" cy="16" r="8" fill="#F76F20"/>
      </svg>
      <svg width="46" height="32" viewBox="0 0 46 32" fill="none">
        <rect width="46" height="32" rx="4" fill="#2E77BC"/>
        <text x="5" y="21" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#fff">AMEX</text>
      </svg>
    </div>
  )
}

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [cartOpen,     setCartOpen]     = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const searchRef = useRef(null)
  const { cart, getItemCount, removeFromCart, updateQuantity, clearCart } = useCart()
  const itemCount = typeof getItemCount === 'function' ? getItemCount() : (cart?.length || 0)
  const navigate = useNavigate()
  const location = useLocation()

  // ── Scroll to anchor — works from any page ──
  const scrollToAnchor = (anchorId) => {
    setMenuOpen(false)
    const doScroll = () => {
      const el = document.getElementById(anchorId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for home page to mount then scroll
      setTimeout(doScroll, 350)
    } else {
      doScroll()
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Open cart modal when product page dispatches gp:open-cart
  useEffect(() => {
    const handler = () => { setCartOpen(true); setSearchOpen(false) }
    window.addEventListener('gp:open-cart', handler)
    return () => window.removeEventListener('gp:open-cart', handler)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!cartOpen && !searchOpen) return
    const handler = (e) => {
      if (!e.target.closest('.gp-cart-drawer') && !e.target.closest('.gp-cart-trigger')) {
        setCartOpen(false)
      }
      if (!e.target.closest('.gp-search-overlay') && !e.target.closest('.gp-search-trigger')) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [cartOpen, searchOpen])

  useEffect(() => {
    if (!menuOpen || !scrolled) return
    const handler = (e) => {
      if (!e.target.closest('.gp-pill')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen, scrolled])

  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + (item.pricePerUnit || 0) * item.quantity, 0)

  /* ── Render nav link: router Link or anchor button ── */
  const renderNavLink = (l, className, extraStyle = {}) => {
    if (l.to) {
      return (
        <Link
          key={l.label}
          to={l.to}
          className={className}
          style={extraStyle}
          onClick={() => setMenuOpen(false)}
        >
          {l.label}
        </Link>
      )
    }
    // anchor link — navigate to home then scroll
    return (
      <button
        key={l.label}
        className={className}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', ...extraStyle }}
        onClick={() => scrollToAnchor(l.anchor)}
      >
        {l.label}
      </button>
    )
  }

  return (
    <>
      <style>{`
        .gp-announce {
          width: 100%; background: #111111; color: #ffffff;
          text-align: center; padding: 9px 16px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px; font-weight: 400;
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 300; line-height: 1.4;
          transition: opacity 0.3s, transform 0.3s;
        }
        .gp-announce.hidden { opacity: 0; transform: translateY(-100%); pointer-events: none; }

        .gp-header { position: fixed; left: 0; right: 0; z-index: 200; }
        .gp-header.top { top: 36px; background: transparent; }

        .gp-inner {
          width: 100%; padding: 0 32px; height: 70px;
          display: flex; align-items: center;
          justify-content: space-between; box-sizing: border-box;
        }
        .gp-logo { display: flex; align-items: center; text-decoration: none; }
        .gp-logo img { height: 36px; width: auto; object-fit: contain; filter: drop-shadow(0 1px 4px rgba(0,0,0,0.6)); }
        .gp-right { display: flex; align-items: center; }
        .gp-nav { display: flex; align-items: center; gap: 36px; margin-right: 32px; }
        .gp-nav-link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px; font-weight: 700; color: #ffffff;
          text-decoration: none; white-space: nowrap;
          text-shadow: 0 1px 6px rgba(0,0,0,0.6);
          transition: opacity 0.2s;
        }
        .gp-nav-link:hover { opacity: 0.75; }
        .gp-icons { display: flex; align-items: center; gap: 22px; }
        .gp-icon-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          padding: 0; line-height: 0;
          filter: drop-shadow(0 1px 4px rgba(0,0,0,0.6));
          transition: opacity 0.2s; position: relative;
        }
        .gp-icon-btn:hover { opacity: 0.7; }

        .gp-header.scrolled {
          top: 0; background: transparent;
          display: flex; justify-content: flex-end;
          padding: 14px 28px;
        }
        .gp-pill {
          display: flex; align-items: center; gap: 16px;
          background: #111111; border-radius: 999px;
          padding: 10px 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.45);
          transition: all 0.25s ease;
        }
        .gp-pill-logo { text-decoration: none; display: flex; align-items: center; }
        .gp-pill-logo img { height: 30px; width: auto; object-fit: contain; }

        .gp-pill-divider { width: 1px; height: 22px; background: rgba(255,255,255,0.25); flex-shrink: 0; }

        .gp-pill-nav { display: flex; align-items: center; gap: 0; }
        .gp-pill-nav-link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px; font-weight: 600; color: #fff;
          text-decoration: none; white-space: nowrap;
          padding: 4px 16px;
          border-right: 1px solid rgba(255,255,255,0.2);
          transition: opacity 0.2s; cursor: pointer;
        }
        .gp-pill-nav-link:last-child { border-right: none; }
        .gp-pill-nav-link:hover { opacity: 0.7; }

        .gp-pill-icons { display: flex; align-items: center; gap: 20px; }
        .gp-pill-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          padding: 0; line-height: 0; transition: opacity 0.2s;
          position: relative;
        }
        .gp-pill-btn:hover { opacity: 0.7; }

        .gp-mobile-btn { display: none; background: none; border: none; cursor: pointer; padding: 4px; line-height: 0; }
        .gp-mobile-menu {
          position: fixed; inset: 0;
          background: rgba(10,4,5,0.97); z-index: 500;
          display: flex; flex-direction: column;
          padding: 64px 32px 40px; gap: 28px;
        }
        .gp-mobile-close {
          position: absolute; top: 20px; right: 24px;
          background: none; border: none; color: white;
          font-size: 32px; cursor: pointer; line-height: 1;
        }
        .gp-mobile-link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 22px; font-weight: 700; color: #ffffff; text-decoration: none;
        }

        /* ── Cart overlay ── */
        .gp-cart-overlay {
          position: fixed; inset: 0; z-index: 400;
          background: rgba(0,0,0,0.45);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .gp-cart-overlay.open { opacity: 1; pointer-events: all; }

        /* ── Cart modal (centré, comme la screenshot) ── */
        .gp-cart-drawer {
          position: fixed; top: 50%; right: 28px;
          transform: translateY(-50%) scale(0.97);
          width: 520px; max-width: calc(100vw - 40px);
          max-height: 85vh; background: #fff;
          border-radius: 20px; z-index: 401;
          box-shadow: 0 20px 80px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
          opacity: 0; pointer-events: none;
          transition: opacity 0.25s, transform 0.25s;
          overflow: hidden;
        }
        .gp-cart-drawer.open {
          opacity: 1; pointer-events: all;
          transform: translateY(-50%) scale(1);
        }
        .gp-cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 28px 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .gp-cart-title { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 600; color: #111; }
        .gp-cart-close {
          background: none; border: none; cursor: pointer;
          font-size: 24px; color: #111; line-height: 1; padding: 0;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.2s;
        }
        .gp-cart-close:hover { background: #f5f5f5; }

        .gp-cart-body { flex: 1; overflow-y: auto; padding: 0 28px 20px; }

        /* Popular (panier vide) */
        .gp-popular-title { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 600; color: #111; padding: 24px 0 16px; }
        .gp-popular-item {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 0; border-bottom: 1px solid #f0f0f0;
          cursor: pointer; transition: opacity 0.2s;
        }
        .gp-popular-item:hover { opacity: 0.75; }
        .gp-popular-item:last-child { border-bottom: none; }
        .gp-popular-img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; background: #eee; flex-shrink: 0; }
        .gp-popular-name { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: 700; color: #111; letter-spacing: 0.04em; }
        .gp-popular-grade { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #888; margin-top: 2px; }

        /* Cart items */
        .gp-cart-item {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 0; border-bottom: 1px solid #f0f0f0;
          background: #f7f7f7; border-radius: 12px;
          padding: 14px 16px; margin-bottom: 10px;
        }
        .gp-cart-item-img { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; background: #eee; flex-shrink: 0; }
        .gp-cart-item-info { flex: 1; }
        .gp-cart-item-name { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111; letter-spacing: 0.03em; margin-bottom: 4px; }
        .gp-cart-item-sub { font-size: 12px; color: #888; letter-spacing: 0.05em; text-transform: uppercase; }
        .gp-cart-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .gp-cart-item-price { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: 600; color: #111; }
        .gp-cart-item-remove {
          background: none; border: 1.5px solid #ddd; border-radius: 50%;
          width: 26px; height: 26px; cursor: pointer; color: #999; font-size: 14px;
          display: flex; align-items: center; justify-content: center; padding: 0;
          transition: border-color 0.15s, color 0.15s;
        }
        .gp-cart-item-remove:hover { border-color: #111; color: #111; }

        /* Qty controls in cart */
        .gp-cart-qty {
          display: flex; align-items: center; gap: 10px;
          border: 1.5px solid #e0e0e0; border-radius: 999px;
          padding: 4px 12px; width: fit-content;
        }
        .gp-cart-qty-btn {
          background: none; border: none; cursor: pointer;
          font-size: 16px; color: #111; padding: 0; line-height: 1;
        }
        .gp-cart-qty-btn:hover { opacity: 0.6; }
        .gp-cart-qty-num { font-size: 14px; font-weight: 500; min-width: 16px; text-align: center; }

        /* Subtotal row */
        .gp-cart-subtotal {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0 8px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px; font-weight: 600; color: #111;
          border-top: 1px solid #f0f0f0;
        }

        .gp-cart-footer { padding: 12px 28px 28px; }
        .gp-cart-explore {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 16px; border: 2px solid #111;
          border-radius: 999px; background: none;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px; font-weight: 600; color: #111;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, color 0.2s; box-sizing: border-box;
        }
        .gp-cart-explore:hover { background: #111; color: #fff; }
        .gp-cart-checkout {
          display: block; width: 100%; padding: 16px;
          border-radius: 999px; background: #c8824a; border: none;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px; font-weight: 600; color: #fff;
          cursor: pointer; text-align: center;
          transition: background 0.2s; margin-bottom: 10px;
          box-sizing: border-box;
        }
        .gp-cart-checkout:hover { background: #b06b35; }
        .gp-cart-clear {
          display: block; width: 100%; padding: 10px;
          background: none; border: none; font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px; color: #888; cursor: pointer; text-align: center;
          transition: color 0.15s; margin-bottom: 4px;
        }
        .gp-cart-clear:hover { color: #111; }

        /* Search overlay */
        .gp-search-overlay {
          position: fixed; top: 106px; left: 0; right: 0;
          z-index: 350; display: flex; justify-content: center;
          padding: 0 24px; pointer-events: none;
          opacity: 0; transform: translateY(-10px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .gp-search-overlay.open { opacity: 1; pointer-events: all; transform: translateY(0); }
        .gp-search-box {
          width: 100%; max-width: 620px; background: #fff;
          border-radius: 999px; display: flex; align-items: center;
          gap: 12px; padding: 0 20px; height: 52px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }
        .gp-search-input {
          flex: 1; border: none; outline: none;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px; color: #111; background: transparent;
        }
        .gp-search-input::placeholder { color: #aaa; }

        .gp-badge {
          position: absolute; top: -7px; right: -7px;
          background: #ba0b20; color: #fff; border-radius: 50%;
          width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: bold; z-index: 2;
        }

        @media (max-width: 900px) {
          .gp-right { display: none !important; }
          .gp-mobile-btn { display: flex !important; }
          .gp-pill { display: none !important; }
          .gp-announce { font-size: 11px; padding: 8px 12px; }
          .gp-inner { padding: 0 20px; height: 58px; }
          .gp-cart-drawer { right: 16px; left: 16px; width: auto; }
          .gp-search-overlay { top: 80px; }
        }
      `}</style>

      {/* Announcement bar */}
      <div className={`gp-announce${scrolled ? ' hidden' : ''}`}>
        Bienvenue sur le nouveau site web de GasPass. Commençons à gagner de l'argent !
      </div>

      {/* Search overlay */}
      <div className={`gp-search-overlay${searchOpen ? ' open' : ''}`}>
        <div className="gp-search-box">
          <SearchIcon size={18} dark />
          <input
            ref={searchRef}
            className="gp-search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') setSearchOpen(false)
              if (e.key === 'Enter' && searchQuery.trim()) {
                setSearchOpen(false)
                navigate('/shop')
              }
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#999', padding: 0 }}>×</button>
          )}
        </div>
      </div>

      {/* Header */}
      <header className={`gp-header ${scrolled ? 'scrolled' : 'top'}`}>

        {/* ── TOP STATE ── */}
        {!scrolled && (
          <div className="gp-inner">
            <Link to="/" className="gp-logo">
              <img src="/logo_gaspass.png" alt="GasPass" />
            </Link>
            <div className="gp-right">
              <nav className="gp-nav">
                {NAV_LINKS.map(l => renderNavLink(l, 'gp-nav-link'))}
              </nav>
              <div className="gp-icons">
                <button
                  className="gp-icon-btn gp-search-trigger"
                  aria-label="Recherche"
                  onClick={() => { setSearchOpen(o => !o); setCartOpen(false) }}
                >
                  <SearchIcon size={22} />
                </button>
                <button className="gp-icon-btn" aria-label="Compte">
                  <UserIcon size={22} />
                </button>
                <button
                  className="gp-icon-btn gp-cart-trigger"
                  aria-label="Panier"
                  onClick={() => { setCartOpen(o => !o); setSearchOpen(false) }}
                >
                  <CartIcon size={24} />
                  {itemCount > 0 && <span className="gp-badge">{itemCount}</span>}
                </button>
              </div>
            </div>
            <button onClick={() => setMenuOpen(true)} className="gp-mobile-btn" aria-label="Menu">
              <MenuIcon size={22} />
            </button>
          </div>
        )}

        {/* ── SCROLLED STATE: pill ── */}
        {scrolled && (
          <div className="gp-pill">
            {!menuOpen && (
              <>
                <Link to="/" className="gp-pill-logo">
                  <img src="/logo_gaspass.png" alt="GasPass" />
                </Link>
                <div className="gp-pill-divider" />
              </>
            )}

            {menuOpen && (
              <>
                <nav className="gp-pill-nav">
                  {NAV_LINKS.map(l => renderNavLink(l, 'gp-pill-nav-link', {
                    display: 'inline-block',
                    padding: '4px 16px',
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }))}
                </nav>
                <div className="gp-pill-divider" />
              </>
            )}

            <div className="gp-pill-icons">
              <button
                className="gp-pill-btn gp-search-trigger"
                aria-label="Recherche"
                onClick={() => { setSearchOpen(o => !o); setCartOpen(false) }}
              >
                <SearchIcon size={20} />
              </button>
              <button className="gp-pill-btn" aria-label="Compte">
                <UserIcon size={20} />
              </button>
              <button
                className="gp-pill-btn gp-cart-trigger"
                aria-label="Panier"
                onClick={() => { setCartOpen(o => !o); setSearchOpen(false) }}
                style={{ position: 'relative' }}
              >
                <CartIcon size={22} />
                {itemCount > 0 && <span className="gp-badge">{itemCount}</span>}
              </button>
              <button
                className="gp-pill-btn"
                aria-label={menuOpen ? 'Fermer menu' : 'Menu'}
                onClick={() => setMenuOpen(o => !o)}
              >
                {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Cart overlay backdrop */}
      <div
        className={`gp-cart-overlay${cartOpen ? ' open' : ''}`}
        onClick={() => setCartOpen(false)}
      />

      {/* ── Cart Modal ── */}
      <div className={`gp-cart-drawer${cartOpen ? ' open' : ''}`}>
        <div className="gp-cart-header">
          <span className="gp-cart-title">
            {cart.length === 0 ? 'Your cart is empty' : `${itemCount} item${itemCount > 1 ? 's' : ''} in cart`}
          </span>
          <button className="gp-cart-close" onClick={() => setCartOpen(false)}>×</button>
        </div>

        <div className="gp-cart-body">
          {cart.length === 0 ? (
            <>
              <div className="gp-popular-title">Popular items</div>
              {POPULAR_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="gp-popular-item"
                  onClick={() => { setCartOpen(false); navigate(`/shop/${item.slug}`) }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="gp-popular-img"
                    onError={e => { e.target.style.background = '#2a2a2a'; e.target.src = '' }}
                  />
                  <div>
                    <div className="gp-popular-name">{item.name}</div>
                    <div className="gp-popular-grade">{item.grade}</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ paddingTop: 16 }}>
              {cart.map((item) => (
                <div key={`${item.productId}-${item.weight}`} className="gp-cart-item">
                  <img
                    src={item.image || ''}
                    alt={item.name}
                    className="gp-cart-item-img"
                    onError={e => { e.target.style.background = '#2a2a2a'; e.target.src = '' }}
                  />
                  <div className="gp-cart-item-info">
                    <div className="gp-cart-item-name">{item.name}</div>
                    <div className="gp-cart-item-sub">AMOUNT: {item.weight}</div>
                    <div className="gp-cart-qty" style={{ marginTop: 8 }}>
                      <button
                        className="gp-cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, item.weight, item.quantity - 1)}
                      >−</button>
                      <span className="gp-cart-qty-num">{item.quantity}</span>
                      <button
                        className="gp-cart-qty-btn"
                        onClick={() => updateQuantity(item.productId, item.weight, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="gp-cart-item-right">
                    <button
                      className="gp-cart-item-remove"
                      onClick={() => removeFromCart(item.productId, item.weight)}
                      aria-label="Supprimer"
                    >
                      ×
                    </button>
                    <div className="gp-cart-item-price">
                      ${((item.pricePerUnit || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="gp-cart-subtotal">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="gp-cart-footer">
          {cart.length === 0 ? (
            <>
              <Link
                to="/shop"
                className="gp-cart-explore"
                onClick={() => setCartOpen(false)}
              >
                Explore all →
              </Link>
              <PaymentIcons />
            </>
          ) : (
            <>
              <button
                className="gp-cart-checkout"
                onClick={() => { setCartOpen(false); navigate('/checkout') }}
              >
                Checkout
              </button>
              <button className="gp-cart-clear" onClick={clearCart}>
                Clear cart
              </button>
              <PaymentIcons />
            </>
          )}
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      {menuOpen && !scrolled && (
        <div className="gp-mobile-menu">
          <button className="gp-mobile-close" onClick={() => setMenuOpen(false)}>×</button>
          {NAV_LINKS.map(l => renderNavLink(l, 'gp-mobile-link'))}
          <div style={{ display: 'flex', gap: 28, marginTop: 16 }}>
            <button className="gp-icon-btn" onClick={() => { setMenuOpen(false); setSearchOpen(true) }}>
              <SearchIcon size={24} />
            </button>
            <button className="gp-icon-btn"><UserIcon size={24} /></button>
            <button
              className="gp-icon-btn gp-cart-trigger"
              onClick={() => { setMenuOpen(false); setCartOpen(true) }}
              style={{ position: 'relative' }}
            >
              <CartIcon size={26} />
              {itemCount > 0 && <span className="gp-badge">{itemCount}</span>}
            </button>
          </div>
        </div>
      )}
    </>
  )
}