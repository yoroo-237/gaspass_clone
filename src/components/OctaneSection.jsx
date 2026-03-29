import React from 'react'
import useReveal from '../hooks/useReveal.js'
import octaneImage from '../../public/WsBRqxsaJ207ntyD0XfPcrvE.png' // ← adapte le chemin de ton image

const TIERS = [
  {
    grade: '87',
    label: 'Regular',
    description: "Reliable, budget friendly, and still brings the heat. Think everyday smoke that won't break the bank.",
    spaceBeforeDesc: true,
  },
  {
    grade: '89',
    label: 'Premium',
    description: 'A step up in flavor, freshness, and consistency. Better bag appeal, smoother burn, and a more dialed in experience.',
    spaceBeforeDesc: true,
  },
  {
    grade: '91',
    label: 'Supreme',
    description: 'This is where the shelves start glowing. Loud terps, rich colors and top tier cuts that check every box.',
    spaceBeforeDesc: false,
  },
  {
    grade: '93',
    label: 'High Octane',
    description: 'The creme de la creme. Rare exotics, insane frost, full spectrum effects. For those who know the difference—and smoke like it.',
    spaceBeforeDesc: false,
  },
]

export default function OctaneSection() {
  return (
    <section style={{
      background: '#000',
      padding: '80px 0',
      overflow: 'hidden',
    }}>
      <div
        className="octane-grid"
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '52fr 48fr',
          alignItems: 'start',
          paddingLeft: 80,
          paddingRight: 0,
        }}
      >

        {/* ── LEFT COLUMN ── */}
        <div style={{ paddingRight: 48 }}>

          {/* Big title */}
          <h2 style={{
            fontSize: 'clamp(30px, 3.5vw, 50px)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            marginBottom: 20,
            fontFamily: 'inherit',
          }}>
            Fueling the Industry,<br />One Pack at a Time
          </h2>

          {/* Pick your Octane */}
          <p style={{
            fontWeight: 700,
            fontSize: 16,
            color: '#fff',
            marginBottom: 16,
          }}>
            Pick your Octane
          </p>

          {/* Intro */}
          <p style={{
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.7,
            color: '#fff',
            marginBottom: 28,
          }}>
            Not all gas is created the same. At GasPass, we grade our flower like premium fuel - because quality should be easy to spot. Each tier reflects potency, nose, structure, and overall effect.
          </p>

          {/* Tiers */}
          {TIERS.map((tier) => (
            <div key={tier.grade} style={{ marginBottom: 20 }}>
              <p style={{
                fontWeight: 700,
                fontSize: 16,
                color: '#fff',
                marginBottom: tier.spaceBeforeDesc ? 14 : 0,
              }}>
                {tier.grade} {tier.label}
              </p>
              <p style={{
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.7,
                color: '#fff',
              }}>
                {tier.description}
              </p>
            </div>
          ))}

          {/* Bottom note */}
          <p style={{
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.7,
            color: '#fff',
            marginBottom: 44,
            marginTop: 4,
          }}>
            Whether you're rolling up daily or hunting for heat, our octane system keeps it simple. The higher the number, the higher the quality. Choose&nbsp; wisely - your lungs will thank you.
          </p>

          {/* Shop Flower CTA */}
          <a
            href="#shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '15px 28px',
              border: '2px solid #fff',
              borderRadius: 999,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              background: 'transparent',
              transition: 'background 0.2s, color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#fff'
            }}
          >
            Shop Flower →
          </a>
        </div>

        {/* ── RIGHT COLUMN — sticky image ── */}
        <div
          className="octane-img-col"
          style={{
            position: 'sticky',
            top: 80,
            alignSelf: 'start',
          }}
        >
          {/* Spacer : aligne le haut de l'image avec "87 Regular" */}
          <div className="octane-img-offset" style={{ height: 230 }} />
          <div className="octane-img-wrap" style={{
            borderRadius: '16px 0 0 16px',
            overflow: 'hidden',
            lineHeight: 0,
          }}>
            <img
              src={octaneImage}
              alt="GasPass octane tiers characters"
              style={{
                width: '100%',
                height: '62vh',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .octane-grid {
            grid-template-columns: 1fr !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .octane-img-offset {
            display: none !important;
          }
          .octane-img-col {
            position: static !important;
            margin-top: 48px !important;
          }
          .octane-img-wrap {
            border-radius: 16px !important;
          }
          .octane-img-wrap img {
            height: 320px !important;
          }
        }
      `}</style>
    </section>
  )
}