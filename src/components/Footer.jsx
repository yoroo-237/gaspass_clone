import React from 'react'

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

  /* Instagram icon */
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
  }
  .ig-btn:hover {
    border-color: #fff;
    background: rgba(255,255,255,0.05);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .footer-grid {
      grid-template-columns: 1fr;
    }
    .footer-divider {
      display: none;
    }
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
    .footer-nav-col {
      grid-template-columns: 1fr;
      gap: 40px 0;
    }
  }
`

export default function Footer() {
  return (
    <footer style={{
      background: '#000',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '0 48px 40px',
    }}>
      <style>{FOOTER_CSS}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="footer-grid">

          {/* ── LEFT — Logo ── */}
          <div className="footer-logo-col">
            <img
              src="/logo_gaspass.png"
              alt="Gas Pass"
              style={{ height: 48, width: 'auto', display: 'block' }}
            />
          </div>

          {/* ── Vertical divider ── */}
          <div className="footer-divider" />

          {/* ── RIGHT — Nav columns ── */}
          <div className="footer-nav-col">

            {/* Shop + Follow */}
            <div>
              <div className="footer-col-title">Shop</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 52 }}>
                {['All', '87 Regular', '89 Premium', '91 Supreme', '93 High Octane'].map(l => (
                  <a key={l} href="#shop" className="footer-link">{l}</a>
                ))}
              </div>

              {/* Follow */}
              <div className="footer-col-title">Follow</div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="ig-btn"
                style={{ textDecoration: 'none' }}
              >
                {/* Instagram SVG icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="#fff" stroke="none"/>
                </svg>
              </a>
            </div>

            {/* Gas Pass */}
            <div>
              <div className="footer-col-title">Gas Pass</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {['About', 'Support'].map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`} className="footer-link">{l}</a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            |
          </span>
        </div>

      </div>
    </footer>
  )
}