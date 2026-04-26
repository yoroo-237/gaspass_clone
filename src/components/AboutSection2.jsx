import React from 'react'

function useReveal(threshold = 0.15) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('about-revealed'); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

const GLOBAL_CSS = `
  .about-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .about-revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .shop-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border: 1px solid rgba(255,255,255,0.45);
    border-radius: 999px;
    background: transparent;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    text-decoration: none;
    font-family: var(--font-sans);
  }
  .shop-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.8);
  }

  .about-layout {
    display: grid;
    grid-template-columns: 45% 55%;
    align-items: start;
  }

  @media (max-width: 900px) {
    .about-layout {
      grid-template-columns: 1fr;
    }
    .about-img-col {
      display: none;
    }
  }
`

export default function AboutSection() {
  const textRef = useReveal(0.15)
  const imgRef  = useReveal(0.1)

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <section
        id="about"
        style={{
          background: '#000',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="about-layout">

            {/* LEFT — Image, collée au bord gauche, pleine hauteur */}
            <div
              ref={imgRef}
              className="about-img-col about-reveal"
            >
              <img
                src="/m7h1aWDNxW3hPZbMe1z1MRzsFog.png"
                alt="GasPass"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                  maxHeight: 860,
                }}
              />
            </div>

            {/* RIGHT — Text */}
            <div
              ref={textRef}
              className="about-text-col about-reveal"
              style={{
                padding: '80px 60px 80px 48px',
              }}
            >
              {/* Label */}
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 11,
                color: '#ba0b20',
                letterSpacing: '0.22em',
                marginBottom: 20,
                textTransform: 'uppercase',
              }}>
                ONLY AT GAS PASS
              </div>

              {/* Big headline — taille exacte screenshot */}
              <h2 style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(20px, 2.8vw, 36px)',
                color: '#fff',
                lineHeight: 1.55,
                letterSpacing: '0.04em',
                marginBottom: 32,
                fontWeight: 400,
              }}>
                Your all access<br />
                pass to premium<br />
                gas
              </h2>

              {/* Body paragraphs — bold, taille screenshot */}
              {[
                'Before the apps. Before the hype. Before the "industry" had names and licenses - there was just the gas and those who knew where to find it.',
                'GasPass was founded by a small crew of friends who had been in the game for over a decade, moving quietly and consistently through the legacy market. We weren\'t out chasing trends - we were focused on doing good business, building trust, and always showing up with quality.',
                'Over the years, our circle grew - not because of marketing, but because a word of mouth.',
                'We didn\'t just sell flower - we built relationships. That trust became our backbone.',
                'As the industry shifted, we saw the opportunity to do things our way. To bring the same loyalty, care and top tier gas to a wider audience - without the middlemen, the gimmicks, or the nonsense.',
              ].map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: '#fff',
                    fontWeight: 700,
                    marginBottom: 22,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {para}
                </p>
              ))}

              {/* CTA */}
              <div style={{ marginTop: 32 }}>
                <a href="/shop" className="shop-btn">
                  Shop Flower <span>→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}