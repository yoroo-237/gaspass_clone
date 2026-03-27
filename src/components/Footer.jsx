import React from 'react'

const GasPassLogo = () => (
  <svg width="28" height="28" viewBox="0 0 1024 1024" fill="none">
    <rect width="1024" height="1024" fill="#333132" rx="8"/>
    <path d="M431 574.8c-.8-7.4-6.7-8.2-10.8-10.6-13.6-7.9-27.5-15.4-41.3-23l-22.5-12.3c-8.5-4.7-17.1-9.2-25.6-14.1-10.5-6-21-11.9-31.1-18.6-18.9-12.5-33.8-29.1-46.3-48.1-8.3-12.6-14.8-26.1-19.2-40.4-6.7-21.7-10.8-44.1-7.8-66.8 1.8-14 4.6-28 9.7-41.6 7.8-20.8 19.3-38.8 34.2-54.8 9.8-10.6 21.2-19.1 33.4-26.8 14.7-9.3 30.7-15.4 47.4-19 13.8-3 28.1-4.3 42.2-4.4 89.9-.4 179.7-.3 269.6 0 12.6 0 25.5 1 37.7 4.1 24.3 6.2 45.7 18.2 63 37 11.2 12.2 20.4 25.8 25.8 41.2 7.3 20.7 12.3 42.1 6.7 64.4-2.1 8.5-2.7 17.5-6.1 25.4-4.7 10.9-10.8 21.2-17.2 31.2-8.7 13.5-20.5 24.3-34.4 32.2-10.1 5.7-21 10.2-32 14.3-18.1 6.7-37.2 5-56.1 5.2-17.2.2-34.5 0-51.7.1-1.7 0-3.4 1.2-5.1 1.9 1.3 1.8 2.1 4.3 3.9 5.3 13.5 7.8 27.2 15.4 40.8 22.9 11 6 22.3 11.7 33.2 17.9 15.2 8.5 30.2 17.4 45.3 26.1 19.3 11.1 34.8 26.4 47.8 44.3 9.7 13.3 17.2 27.9 23 43.5 6.1 16.6 9.2 33.8 10.4 51.3.6 9.1-.7 18.5-1.9 27.6-1.2 9.1-2.7 18.4-5.6 27.1-3.3 10.2-7.4 20.2-12.4 29.6-8.4 15.7-19.6 29.4-32.8 41.4-12.7 11.5-26.8 20.6-42.4 27.6-22.9 10.3-46.9 14.4-71.6 14.5-89.7.3-179.4.2-269.1-.1-12.6 0-25.5-1-37.7-3.9-24.5-5.7-45.8-18-63.3-36.4-11.6-12.3-20.2-26.5-26.6-41.9-2.7-6.4-4.1-13.5-5.4-20.4-1.5-8.1-2.8-16.3-3.1-24.5-.6-15.7 2.8-30.9 8.2-45.4 8.2-22 21.7-40.6 40.2-55.2 10-7.9 21.3-13.7 33.1-18.8 16.6-7.2 34-8.1 51.4-8.5 21.9-.5 43.9-.1 65.9-.1 1.9-.1 3.9-.3 6.2-.4z" fill="#00f782"/>
  </svg>
)

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
              <GasPassLogo />
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
