import React from 'react'

const TEXT = 'UNIQUEMENT AU PASSAGE GAZ'
const repeated = Array(20).fill(TEXT)

export default function BottomTicker() {
  return (
    <div style={{
      background: '#000000',
      padding: '10px 0',
      overflow: 'hidden',
      userSelect: 'none',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        animation: 'bottom-ticker 50s linear infinite',
      }}>
        {repeated.map((text, i) => (
          <span key={i} style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(9px, 2vw, 10px)',
            letterSpacing: '0.14em',
            color: '#7a0010',
            whiteSpace: 'nowrap',
            paddingRight: 32,
            flexShrink: 0,
            textTransform: 'uppercase',
          }}>
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes bottom-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}