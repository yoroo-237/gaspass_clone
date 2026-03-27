import React from 'react'

const ITEMS = [
  'FAST SHIPPING',
  'SMALL BATCH EXOTICS',
  'STEALTHY PACKAGING',
  'CHEAPEST PRICING',
  'UNIQUE STRAINS',
  'QUALITY SMOKE',
]

const DOT = () => (
  <span style={{
    display: 'inline-block',
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#ba0b20',
    margin: '0 20px',
    verticalAlign: 'middle',
    flexShrink: 0,
  }}/>
)

function MarqueeRow({ reverse = false, speed = 22 }) {
  // Duplicate items for seamless loop
  const all = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        animation: `${reverse ? 'marquee-rev' : 'marquee-fwd'} ${speed}s linear infinite`,
      }}>
        {all.map((item, i) => (
          <React.Fragment key={i}>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 10,
              color: '#fff',
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
              padding: '0 4px',
            }}>
              {item}
            </span>
            <DOT/>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default function MarqueeTicker() {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.25)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '18px 0',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      <MarqueeRow reverse={false} speed={24} />

      <style>{`
        @keyframes marquee-fwd {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rev {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
