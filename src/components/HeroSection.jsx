import React, { useEffect, useRef } from 'react'

export default function HeroSection() {
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    const els = [titleRef.current, subRef.current, btnRef.current]
    els.forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(32px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 200 + i * 150)
    })
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        height: 700,
        background: 'radial-gradient(circle, rgba(186,11,32,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}/>

      {/* Small label */}
      <div ref={subRef} style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 9,
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.2em',
        marginBottom: 32,
        position: 'relative',
        zIndex: 1,
      }}>
        where top shelf isn't a category — it's a standard
      </div>

      {/* Main headline */}
      <h1 ref={titleRef} style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(22px, 5vw, 52px)',
        color: '#fff',
        lineHeight: 1.4,
        letterSpacing: '0.04em',
        maxWidth: 900,
        marginBottom: 48,
        position: 'relative',
        zIndex: 1,
      }}>
        YOUR ALL ACCESS PASS<br/>
        <span style={{ color: '#9effa5' }}>TO PREMIUM GAS</span>
      </h1>

      {/* CTA button */}
      <div ref={btnRef} style={{ position: 'relative', zIndex: 1 }}>
        <a
          href="#shop"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-pixel)',
            fontSize: 10,
            color: '#000',
            background: '#9effa5',
            padding: '18px 40px',
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.1em',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 0 0 rgba(158,255,165,0)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(158,255,165,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 0 0 rgba(158,255,165,0)'
          }}
        >
          Shop Flower
        </a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: 0.3,
        animation: 'bounce 2s ease-in-out infinite',
      }}>
        <div style={{ width: 1, height: 48, background: '#fff' }}/>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
        `}</style>
      </div>
    </section>
  )
}
