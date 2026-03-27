import React from 'react'
import useReveal from '../hooks/useReveal.js'

export default function AboutSection() {
  const titleRef = useReveal(0.2)
  const p1Ref = useReveal(0.15)
  const p2Ref = useReveal(0.15)
  const p3Ref = useReveal(0.15)
  const p4Ref = useReveal(0.15)

  return (
    <section id="about" style={{
      padding: '120px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        right: -100,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(186,11,32,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

        {/* Left: title + tagline */}
        <div ref={titleRef} className="reveal">
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: '#ba0b20',
            letterSpacing: '0.2em',
            marginBottom: 28,
          }}>
            OUR STORY
          </div>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(16px, 2.5vw, 28px)',
            color: '#fff',
            lineHeight: 1.6,
            letterSpacing: '0.04em',
            marginBottom: 40,
          }}>
            FUELING THE INDUSTRY,<br/>
            <span style={{ color: '#9effa5' }}>ONE PACK AT A TIME</span>
          </h2>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { num: '10+', label: 'Years in the game' },
              { num: '100%', label: 'Word of mouth' },
              { num: '0', label: 'Middlemen' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 22,
                  color: '#9effa5',
                  marginBottom: 6,
                }}>
                  {stat.num}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.05em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: story paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p ref={p1Ref} className="reveal" style={{
            fontSize: 15,
            lineHeight: 1.95,
            color: 'rgba(255,255,255,0.7)',
          }}>
            Before the apps. Before the hype. Before the "industry" had names and licenses — there was just the gas and those who knew where to find it.
          </p>
          <p ref={p2Ref} className="reveal" style={{ transitionDelay: '100ms',
            fontSize: 15, lineHeight: 1.95, color: 'rgba(255,255,255,0.7)',
          }}>
            GasPass was founded by a small crew of friends who had been in the game for over a decade, moving quietly and consistently through the legacy market. We weren't out chasing trends — we were focused on doing good business, building trust, and always showing up with quality.
          </p>
          <p ref={p3Ref} className="reveal" style={{ transitionDelay: '150ms',
            fontSize: 15, lineHeight: 1.95, color: 'rgba(255,255,255,0.7)',
          }}>
            Over the years, our circle grew — not because of marketing, but because a word of mouth. We didn't just sell flower — we built relationships. That trust became our backbone.
          </p>
          <p ref={p4Ref} className="reveal" style={{ transitionDelay: '200ms',
            fontSize: 15, lineHeight: 1.95, color: 'rgba(255,255,255,0.55)',
            borderLeft: '2px solid rgba(186,11,32,0.5)',
            paddingLeft: 20,
            fontStyle: 'italic',
          }}>
            As the industry shifted, we saw the opportunity to do things our way. To bring the same loyalty, care and top tier gas to a wider audience — without the middlemen, the gimmicks, or the nonsense.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
