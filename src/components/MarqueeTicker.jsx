import React, { useState, useEffect } from 'react'
import { getTickerItems } from '../api/client'

export default function MarqueeTicker() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTickerItems()
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const all = loading ? [] : [...items, ...items, ...items, ...items]
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
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            letterSpacing: '0.10em',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.85)',
            borderRadius: 999,
            padding: '14px 32px',
            marginRight: 14,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            textTransform: 'uppercase',
            height: 50,
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

        @media (max-width: 600px) {
          /* Slightly faster on mobile for better feel */
        }
      `}</style>
    </div>
  )
}