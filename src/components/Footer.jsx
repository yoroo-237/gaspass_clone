import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      background: '#1a0a0b',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '60px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: 48,
          alignItems: 'start',
          marginBottom: 60,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/logo_gaspass.png" alt="Gas Pass Logo" width="28" height="28" style={{ borderRadius: 4, display: 'block' }} />
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 9,
                color: '#fff',
                letterSpacing: '0.08em',
              }}>GAS PASS</span>
            </div>
            <p style={{
              fontSize: 13,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.35)',
              maxWidth: 280,
            }}>
              Your all access pass to premium gas. Top-shelf cannabis at wholesale scale.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 7,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.2em',
              marginBottom: 20,
            }}>
              SHOP
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Flower', '87 Regular', '89 Premium', '91 Supreme', '93 High Octane'].map(l => (
                <a key={l} href="#shop" style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >{l}</a>
              ))}
            </div>
          </div>

          {/* About links */}
          <div>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 7,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.2em',
              marginBottom: 20,
            }}>
              ABOUT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Our Story', 'Quality Standards', 'Wholesale'].map(l => (
                <a key={l} href="#about" style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >{l}</a>
              ))}
            </div>
          </div>

          {/* Follow / Support */}
          <div>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 7,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.2em',
              marginBottom: 20,
            }}>
              SUPPORT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Telegram', 'Signal', 'Contact Us'].map(l => (
                <a key={l} href="#support" style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#9effa5'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Gas Pass. All rights reserved.
          </span>
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 7,
            color: 'rgba(186,11,32,0.5)',
            letterSpacing: '0.1em',
          }}>
            YOUR ALL ACCESS PASS TO PREMIUM GAS
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}