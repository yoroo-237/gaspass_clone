import React from 'react'
import useReveal from '../hooks/useReveal.js'

const SPECS = [
  { label: 'THC POTENCY', value: 'Lab Tested' },
  { label: 'TRIM STYLE', value: 'Hand Trim' },
  { label: 'SUPERB STRUCTURE', value: 'A+ Buds' },
  { label: 'FIRST HARVEST', value: 'Fresh Cut' },
  { label: '0% FILLERS', value: 'Pure' },
  { label: '100% REAL FLOWER', value: 'No trim runs' },
  { label: 'ONLY GAS', value: 'Guaranteed' },
]

const FEATURES = [
  { icon: '⚡', label: 'Fast Turnaround Times' },
  { icon: '🔒', label: 'Exclusive Strain Access' },
  { icon: '✓', label: 'Consistent Quality Control' },
  { icon: '$', label: 'Best Quality for Price' },
]

export default function SpecsSection() {
  const titleRef = useReveal(0.15)
  const gridRef = useReveal(0.1)
  const featRef = useReveal(0.1)

  return (
    <section style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Title */}
        <div ref={titleRef} className="reveal" style={{ marginBottom: 70, textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(14px, 2.5vw, 26px)',
            color: '#fff',
            letterSpacing: '0.06em',
            lineHeight: 1.6,
            marginBottom: 16,
          }}>
            Gas Pass Cannabis Specs
          </h2>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            Your go-to source for top-shelf cannabis at wholesale scale.
          </p>
        </div>

        {/* Feature badges */}
        <div ref={featRef} className="reveal" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          marginBottom: 70,
        }}>
          {FEATURES.map(f => (
            <div key={f.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: '14px 22px',
              transition: 'border-color 0.2s, background 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(158,255,165,0.2)'
              e.currentTarget.style.background = 'rgba(158,255,165,0.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
            >
              <span style={{ fontSize: 16 }}>{f.icon}</span>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 500,
              }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Specs grid */}
        <div ref={gridRef} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1,
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {SPECS.map((spec, i) => (
            <div key={spec.label} style={{
              padding: '28px 24px',
              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 7,
                color: '#ba0b20',
                letterSpacing: '0.18em',
                marginBottom: 10,
              }}>
                {spec.label}
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 500,
              }}>
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 60,
        }}>
          {[
            { label: 'Shop Gas Pass', primary: true },
            { label: 'Shop 87', primary: false },
            { label: 'Shop 89 — PREMIUM', primary: false },
            { label: 'Shop 91 — SUPREME', primary: false },
            { label: 'Shop 93 — HIGH OCTANE', primary: false },
          ].map(btn => (
            <a key={btn.label} href="#shop" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-pixel)',
              fontSize: 7,
              letterSpacing: '0.1em',
              padding: btn.primary ? '13px 28px' : '11px 20px',
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'all 0.2s',
              color: btn.primary ? '#000' : '#9effa5',
              background: btn.primary ? '#9effa5' : 'transparent',
              border: btn.primary ? 'none' : '1px solid rgba(158,255,165,0.3)',
            }}
            onMouseEnter={e => {
              if (btn.primary) {
                e.currentTarget.style.opacity = '0.85'
                e.currentTarget.style.transform = 'translateY(-2px)'
              } else {
                e.currentTarget.style.background = 'rgba(158,255,165,0.08)'
                e.currentTarget.style.borderColor = 'rgba(158,255,165,0.6)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = btn.primary ? '#9effa5' : 'transparent'
              e.currentTarget.style.borderColor = 'rgba(158,255,165,0.3)'
            }}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
