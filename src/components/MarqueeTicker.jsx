import React from 'react'

const ITEMS = [
  'SOUCHES UNIQUES',
  'FUMÉE DE QUALITÉ',
  'LIVRAISON RAPIDE',
  'PETITS LOTS EXOTIQUES',
  'EMBALLAGE DISCRET',
  'PRIX LES PLUS BAS',
]

const all = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

export default function MarqueeTicker() {
  return (
    <div style={{
      background: '#000000',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '12px 0',
      overflow: 'hidden',
      userSelect: 'none',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        animation: 'marquee-fwd 55s linear infinite',
      }}>
        {all.map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '0.10em',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.85)',
            borderRadius: 999,
            padding: '16px 40px',
            marginRight: 18,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            textTransform: 'uppercase',
            height: 54,
            boxSizing: 'border-box',
          }}>
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-fwd {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}