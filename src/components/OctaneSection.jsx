import React, { useState } from 'react'
import useReveal from '../hooks/useReveal.js'

const TIERS = [
  {
    grade: '87',
    label: 'Regular',
    color: 'rgba(255,255,255,0.55)',
    accent: 'rgba(255,255,255,0.15)',
    description: "Reliable, budget friendly, and still brings the heat. Think everyday smoke that won't break the bank.",
    shopLabel: 'Shop 87',
  },
  {
    grade: '89',
    label: 'Premium',
    color: '#cab171',
    accent: 'rgba(202,177,113,0.15)',
    description: 'A step up in flavor, freshness, and consistency. Better bag appeal, smoother burn, and a more dialed in experience.',
    shopLabel: 'Shop 89',
  },
  {
    grade: '91',
    label: 'Supreme',
    color: '#9effa5',
    accent: 'rgba(158,255,165,0.12)',
    description: 'This is where the shelves start glowing. Loud terps, rich colors and top tier cuts that check every box.',
    shopLabel: 'Shop 91',
  },
  {
    grade: '93',
    label: 'High Octane',
    color: '#ba0b20',
    accent: 'rgba(186,11,32,0.15)',
    description: 'The creme de la creme. Rare exotics, insane frost, full spectrum effects. For those who know the difference—and smoke like it.',
    shopLabel: 'Shop 93',
  },
]

function TierCard({ tier, index, active, onClick }) {
  const ref = useReveal(0.1)

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        onClick={onClick}
        style={{
          background: active ? tier.accent : 'rgba(255,255,255,0.02)',
          border: `1px solid ${active ? tier.color + '60' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 8,
          padding: '32px 28px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.borderColor = `${tier.color}35`
            e.currentTarget.style.background = `${tier.accent}`
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
          }
        }}
      >
        {/* Grade number */}
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(36px, 6vw, 56px)',
          color: tier.color,
          lineHeight: 1,
          marginBottom: 12,
          opacity: active ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}>
          {tier.grade}
        </div>

        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 8,
          color: tier.color,
          letterSpacing: '0.15em',
          marginBottom: 20,
          opacity: active ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}>
          {tier.label.toUpperCase()}
        </div>

        {/* Description (shown when active) */}
        <div style={{
          fontSize: 14,
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.65)',
          maxHeight: active ? '120px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.3s',
          opacity: active ? 1 : 0,
          marginBottom: active ? 24 : 0,
        }}>
          {tier.description}
        </div>

        {/* Shop button */}
        <div style={{
          maxHeight: active ? '60px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <a href="#shop" style={{
            display: 'inline-block',
            fontFamily: 'var(--font-pixel)',
            fontSize: 7,
            color: tier.color,
            border: `1px solid ${tier.color}55`,
            padding: '10px 18px',
            borderRadius: 2,
            textDecoration: 'none',
            letterSpacing: '0.1em',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${tier.color}18`}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {tier.shopLabel} →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function OctaneSection() {
  const [active, setActive] = useState(2) // Default: 91 Supreme
  const titleRef = useReveal(0.2)
  const bottomRef = useReveal(0.2)

  return (
    <section style={{
      padding: '100px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={titleRef} className="reveal" style={{ marginBottom: 70, maxWidth: 600 }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: '#ba0b20',
            letterSpacing: '0.2em',
            marginBottom: 20,
          }}>
            ONLY AT GAS PASS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(18px, 3vw, 34px)',
            color: '#fff',
            lineHeight: 1.5,
            letterSpacing: '0.04em',
            marginBottom: 24,
          }}>
            PICK YOUR OCTANE
          </h2>
          <p style={{
            fontSize: 15,
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.55)',
          }}>
            Not all gas is created the same. At GasPass, we grade our flower like premium fuel — because quality should be easy to spot.
          </p>
        </div>

        {/* Tier grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 60,
        }}>
          {TIERS.map((tier, i) => (
            <TierCard
              key={tier.grade}
              tier={tier}
              index={i}
              active={active === i}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div ref={bottomRef} className="reveal" style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 40,
          fontSize: 14,
          lineHeight: 1.9,
          color: 'rgba(255,255,255,0.4)',
          maxWidth: 700,
          fontStyle: 'italic',
        }}>
          Whether you're rolling up daily or hunting for heat, our octane system keeps it simple. The higher the number, the higher the quality. Choose wisely — your lungs will thank you.
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tier-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
