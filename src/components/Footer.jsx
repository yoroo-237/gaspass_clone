import React from 'react'
import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '../utils/socialLinks'

const FOOTER_CSS = `
  .footer-link {
    font-size: clamp(18px, 2vw, 24px);
    color: #fff;
    text-decoration: none;
    font-family: var(--font-sans);
    font-weight: 400;
    line-height: 1.2;
    transition: color 0.2s;
    display: block;
  }
  .footer-link:hover { color: rgba(255,255,255,0.55); }

  .footer-col-title {
    font-family: var(--font-sans);
    font-size: clamp(14px, 1.4vw, 17px);
    color: #ba0b20;
    font-weight: 500;
    margin-bottom: 28px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 0;
    width: 100%;
  }

  .footer-logo-col {
    padding: 40px 60px 40px 0;
    display: flex;
    align-items: flex-start;
  }

  .footer-divider {
    background: rgba(255,255,255,0.1);
    align-self: stretch;
  }

  .footer-nav-col {
    padding: 40px 0 40px 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 60px;
    align-items: start;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .ig-btn {
    background: none;
    border: 1.5px solid rgba(255,255,255,0.7);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    padding: 0;
    text-decoration: none;
  }
  .ig-btn:hover {
    border-color: #fff;
    background: rgba(255,255,255,0.05);
  }

  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr; }
    .footer-divider { display: none; }
    .footer-logo-col {
      padding: 40px 0 0 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 32px;
    }
    .footer-nav-col {
      padding: 32px 0 40px 0;
      grid-template-columns: 1fr 1fr;
      gap: 0 32px;
    }
  }

  @media (max-width: 480px) {
    .footer-nav-col { grid-template-columns: 1fr; gap: 40px 0; }
  }
`

const SHOP_LINKS = [
  { label: 'All',             to: '/shop' },
  { label: '87 Regular',     to: '/shop?grade=87 Regular' },
  { label: '89 Premium',     to: '/shop?grade=89 Premium' },
  { label: '91 Supreme',     to: '/shop?grade=91 Supreme' },
  { label: '93 High Octane', to: '/shop?grade=93 High Octane' },
]

const GAS_PASS_LINKS = [
  { label: 'About',   href: '#about' },
  { label: 'Support', href: '#support' },
]

function InstagramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="#fff" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '0 48px 40px',
      }}
    >
      <style>{FOOTER_CSS}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="footer-grid">

          <div className="footer-logo-col">
            <img
              src="/logo_gaspass.png"
              alt="Gas Pass"
              style={{ height: 48, width: 'auto', display: 'block' }}
            />
          </div>

          <div className="footer-divider" />

          <div className="footer-nav-col">

            <div>
              <div className="footer-col-title">Shop</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 52 }}>
                {SHOP_LINKS.map(function(item) {
                  return (
                    <Link key={item.label} to={item.to} className="footer-link">
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              <div className="footer-col-title">Follow</div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="ig-btn"
              >
                <InstagramIcon />
              </a>
            </div>

            <div>
              <div className="footer-col-title">Gas Pass</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {GAS_PASS_LINKS.map(function(item) {
                  return (
                    <a key={item.label} href={item.href} className="footer-link">
                      {item.label}
                    </a>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        <div className="footer-bottom">
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>|</span>
        </div>
      </div>
    </footer>
  )
}