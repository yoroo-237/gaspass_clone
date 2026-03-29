
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'

function SearchIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="6.2" stroke="white" strokeWidth="1.7"/>
      <line x1="13.1" y1="13.1" x2="18.5" y2="18.5" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}

function UserIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.5" r="3.8" stroke="white" strokeWidth="1.7"/>
      <path d="M2 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}

function CartIcon({ size = 22 }) {
  return (
    <svg width={size} height={size - 2} viewBox="0 0 22 20" fill="none">
      <path d="M7 8V6a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M2.5 8h17l-1.75 9.1A1 1 0 0 1 16.77 18H5.23a1 1 0 0 1-.98-.9L2.5 8z" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/>
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


  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, getItemCount } = useCart()
  const itemCount = typeof getItemCount === 'function' ? getItemCount() : (cart?.length || 0)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Boutique', href: '#boutique' },
    { label: 'Commande et contact', href: '#contact' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <>
      <style>{`
        /* ── Announcement bar ── */
        .gp-announce {
          width: 100%;
          background: #111111;
          color: #ffffff;
          text-align: center;
          padding: 9px 16px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 300;
          line-height: 1.4;
          transition: opacity 0.3s, transform 0.3s;
          box-sizing: border-box;
        }
        .gp-announce.hidden {
          opacity: 0;
          transform: translateY(-100%);
          pointer-events: none;
        }

        /* ── Header ── */
        .gp-header {
          position: fixed;
          left: 0; right: 0;
          z-index: 200;
        }

        /* TOP state — transparent full bar */
        .gp-header.top {
          top: 36px;
          background: transparent;
        }
        .gp-inner {
          width: 100%;
          padding: 0 32px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .gp-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .gp-logo img {
          height: 36px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 1px 4px rgba(0,0,0,0.6));
        }
        .gp-right {
          display: flex;
          align-items: center;
        }
        .gp-nav {
          display: flex;
          align-items: center;
          gap: 36px;
          margin-right: 32px;
        }
        .gp-nav-link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          white-space: nowrap;
          text-shadow: 0 1px 6px rgba(0,0,0,0.6);
          transition: opacity 0.2s;
        }
        .gp-nav-link:hover { opacity: 0.75; }
        .gp-icons {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .gp-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 0;
          filter: drop-shadow(0 1px 4px rgba(0,0,0,0.6));
          transition: opacity 0.2s;
        }
        .gp-icon-btn:hover { opacity: 0.7; }

        /* SCROLLED state — desktop: pill à droite */
        .gp-header.scrolled {
          top: 0;
          background: transparent;
          display: flex;
          justify-content: flex-end;
          padding: 14px 28px;
          box-sizing: border-box;
        }

        /* Pill */
        .gp-pill {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #111111;
          border-radius: 999px;
          padding: 10px 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.45);
        }
        .gp-pill-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        .gp-pill-logo img {
          height: 30px;
          width: auto;
          object-fit: contain;
        }
        .gp-pill-divider {
          width: 1px;
          height: 26px;
          background: rgba(255,255,255,0.25);
          flex-shrink: 0;
        }
        .gp-pill-icons {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .gp-pill-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 0;
          transition: opacity 0.2s;
        }
        .gp-pill-btn:hover { opacity: 0.7; }

        /* ── Mobile hamburger ── */
        .gp-mobile-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          line-height: 0;
        }

        /* ── Mobile fullscreen menu ── */
        .gp-mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(10,4,5,0.97);
          z-index: 500;
          display: flex;
          flex-direction: column;
          padding: 64px 32px 40px;
          gap: 28px;
        }
        .gp-mobile-close {
          position: absolute;
          top: 20px; right: 24px;
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          cursor: pointer;
          line-height: 1;
        }
        .gp-mobile-link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          /* Top state */
          .gp-right { display: none !important; }
          .gp-mobile-btn { display: flex !important; }
          .gp-announce { font-size: 11px; padding: 8px 12px; }
          .gp-inner { padding: 0 20px; height: 58px; }

          /* Scrolled state: pill centrée et pleine largeur sur mobile */
          .gp-header.scrolled {
            justify-content: center;
            padding: 10px 16px;
          }
          .gp-pill {
            width: 100%;
            max-width: 100%;
            justify-content: space-between;
            box-sizing: border-box;
          }
        }
      `}</style>

      {/* Announcement bar */}
      <div className={`gp-announce${scrolled ? ' hidden' : ''}`}>
        Bienvenue sur le nouveau site web de GasPass. Commençons à gagner de l'argent !
      </div>

      {/* Header */}
      <header className={`gp-header ${scrolled ? 'scrolled' : 'top'}`}>

        {/* TOP — full transparent navbar */}
        {!scrolled && (
          <div className="gp-inner">
            <Link to="/" className="gp-logo">
              <img src="/logo_gaspass.png" alt="GasPass" />
            </Link>
            <div className="gp-right">
              <nav className="gp-nav">
                {links.map(l => (
                  <a key={l.label} href={l.href} className="gp-nav-link">{l.label}</a>
                ))}
              </nav>
              <div className="gp-icons">
                  <button className="gp-icon-btn" aria-label="Recherche"><SearchIcon size={22} /></button>
                  <button className="gp-icon-btn" aria-label="Compte"><UserIcon size={22} /></button>
                  <button className="gp-icon-btn" aria-label="Panier" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
                    <CartIcon size={24} />
                    {itemCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: -7,
                        right: -7,
                        background: '#ba0b20',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 'bold',
                        zIndex: 2
                      }}>{itemCount}</span>
                    )}
                  </button>
              </div>
            </div>
            <button onClick={() => setMenuOpen(true)} className="gp-mobile-btn" aria-label="Menu">
              <MenuIcon size={22} />
            </button>
          </div>
        )}

        {/* SCROLLED — pill (desktop: droite / mobile: centrée pleine largeur) */}
        {scrolled && (
          <div className="gp-pill">
            <Link to="/" className="gp-pill-logo">
              <img src="/logo_gaspass.png" alt="GasPass" />
            </Link>
            <div className="gp-pill-divider" />
            <div className="gp-pill-icons">
              <button className="gp-pill-btn" aria-label="Recherche"><SearchIcon size={22} /></button>
              <button className="gp-pill-btn" aria-label="Compte"><UserIcon size={22} /></button>
              <button className="gp-pill-btn" aria-label="Panier" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
                <CartIcon size={24} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -7,
                    right: -7,
                    background: '#ba0b20',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 'bold',
                    zIndex: 2
                  }}>{itemCount}</span>
                )}
              </button>
              <button className="gp-pill-btn" aria-label="Menu" onClick={() => setMenuOpen(true)}><MenuIcon size={22} /></button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="gp-mobile-menu">
          <button className="gp-mobile-close" onClick={() => setMenuOpen(false)}>×</button>
          {links.map(l => (
            <a key={l.label} href={l.href} className="gp-mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 28, marginTop: 16 }}>
            <button className="gp-icon-btn"><SearchIcon size={24} /></button>
            <button className="gp-icon-btn"><UserIcon size={24} /></button>
            <button className="gp-icon-btn" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
              <CartIcon size={26} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -7,
                  right: -7,
                  background: '#ba0b20',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 'bold',
                  zIndex: 2
                }}>{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}