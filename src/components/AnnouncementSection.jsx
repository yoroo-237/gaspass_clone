import React from 'react'
import useReveal from '../hooks/useReveal.js'

export default function AnnouncementSection() {
  const ref = useReveal(0.2)

  return (
    <section style={{
      padding: '100px 24px',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <div ref={ref} className="reveal" style={{ textAlign: 'center' }}>
        {/* Label */}
        <div style={{
          display: 'inline-block',
          fontFamily: 'var(--font-pixel)',
          fontSize: 8,
          color: '#ba0b20',
          letterSpacing: '0.25em',
          border: '1px solid rgba(186,11,32,0.4)',
          padding: '8px 16px',
          borderRadius: 2,
          marginBottom: 40,
        }}>
          ANNOUNCEMENT
        </div>

        <p style={{
          fontSize: 18,
          lineHeight: 1.9,
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'var(--font-sans)',
          maxWidth: 700,
          margin: '0 auto 32px',
        }}>
          We're proud to announce the official launch of{' '}
          <span style={{ color: '#9effa5', fontWeight: 600 }}>Gas Pass</span>
          , your trusted partner for top-tier{' '}
          <span style={{ color: '#cab171' }}>wholesale cannabis</span>
          . Built for dispensaries, retailers, and serious buyers, Gas Pass connects you with{' '}
          <span style={{ color: '#9effa5' }}>high-grade flower</span>
          {' '}at competitive bulk prices—no fluff, just fire.
        </p>

        {/* Badges row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
          marginTop: 40,
        }}>
          {['ONLY AT GAS PASS', 'SHOP FLOWER'].map(badge => (
            <span key={badge} style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 8,
              color: '#9effa5',
              border: '1px solid rgba(158,255,165,0.3)',
              padding: '10px 20px',
              borderRadius: 2,
              letterSpacing: '0.15em',
            }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
