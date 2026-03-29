import React from 'react'
import useReveal from '../hooks/useReveal.js'

// ← Remplace chaque chemin par le vrai path de ton image
import imgFillers        from '../../public/D4HAPGqWOKT4c47k3xfsANzc1cY.png'
import imgTrim       from '../../public/Z4v6mcKisd0CcCoQntR6EnXuuEM.png'
import imgStructure  from '../../public/oaTYU2wimJHntpknH3LAM9znY.png'
import imgHarvest    from '../../public/XAjk65kMKTQ4uS2gxSU9Jh20.png'
import imgTHC    from '../../public/CjnRABxXX87STxgV8lxYATdLg.png'
import imgRealFlower from '../../public/Ex2cJdZNIbXJqSYyK7qUcIMUs0.png'

const SPECS = [
  { label: 'THC POTENCY',      img: imgTHC },
  { label: 'TRIM STYLE',       img: imgTrim },
  { label: 'SUPERB STRUCTURE', img: imgStructure },
  { label: 'FIRST HARVEST',    img: imgHarvest },
  { label: '0% FILLERS',       img: imgFillers },
  { label: '100% REAL FLOWER', img: imgRealFlower },
]

export default function SpecsSection() {
  const titleRef = useReveal(0.15)
  const gridRef  = useReveal(0.1)

  return (
    <section style={{
      background: '#fff',
      padding: '50px 24px',
      borderBottom: '1px solid #111',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Title ── */}
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(12px, 1.6vw, 20px)',
            color: '#111',
            letterSpacing: '0.06em',
            lineHeight: 1.6,
            marginBottom: 16,
          }}>
            Gas Pass Cannabis Specs
          </h2>
          <p style={{
            fontSize: 15,
            color: '#333',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.75,
          }}>
            Your go-to source for top-shelf cannabis at wholesale scale.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div
          ref={gridRef}
          className="reveal specs-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 12,
          }}
        >
          {SPECS.map(({ label, img }) => (
            <div
              key={label}
              style={{
                border: '2px solid #111',
                borderRadius: 14,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 8px 0px',
                aspectRatio: '4 / 5',
              }}
            >
              {/* Image */}
              <div style={{
                flex: 1,
                width: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}>
                <img
                  src={img}
                  alt={label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Label */}
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(5px, 0.7vw, 8px)',
                color: '#111',
                letterSpacing: '0.1em',
                textAlign: 'center',
                lineHeight: 1.6,
                borderTop: '1px solid #111',
                width: '100%',
                paddingTop: 8,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  )
}