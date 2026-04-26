import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  const contentRef = useRef(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    el.style.opacity = '0'
    setTimeout(() => {
      el.style.transition = 'opacity 1s ease'
      el.style.opacity = '1'
    }, 80)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .hero-section {
          width: 100%;
          height: 100vh;
          min-height: 600px;
          position: relative;
          overflow: hidden;
          display: flex;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(/hero.jpeg);
          background-size: cover;
          background-position: 60% center;
          background-repeat: no-repeat;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.18) 0%,
            rgba(0,0,0,0.05) 40%,
            transparent 65%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 116px;
          padding-left: 48px;
          padding-bottom: 56px;
          padding-right: 20px;
          width: 48%;
          min-width: 340px;
          height: 100%;
          box-sizing: border-box;
        }

        .hero-title {
          font-family: 'Press Start 2P', monospace;
          color: #ffffff;
          line-height: 1.38;
          letter-spacing: 0.02em;
          margin: 0;
          text-transform: uppercase;
          font-size: clamp(20px, 4vw, 50px);
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }

        .hero-bottom {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex-shrink: 0;
        }

        .hero-subtitle {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(13px, 1.2vw, 17px);
          color: rgba(255,255,255,0.93);
          line-height: 1.6;
          margin: 0;
          max-width: 500px;
        }

        /* CTA button */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 2px solid rgba(255,255,255,0.85);
          border-radius: 999px;
          padding: 14px 30px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          text-decoration: none;
          width: fit-content;
          transition: background 0.2s, color 0.2s;
        }
        .hero-cta:hover {
          background: rgba(255,255,255,0.15);
        }
        .hero-cta-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          flex-shrink: 0;
        }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .hero-content {
            width: 100%;
            min-width: unset;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 90px;
            padding-bottom: 40px;
            align-items: center;
            text-align: center;
          }
          .hero-title {
            font-size: clamp(22px, 7vw, 38px);
            text-align: center;
          }
          .hero-bg {
            background-position: 60% center;
          }
          .hero-subtitle {
            text-align: center;
            font-size: clamp(13px, 3.5vw, 16px);
          }
          .hero-cta {
            align-self: center;
          }
          .hero-bottom {
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding-left: 16px;
            padding-right: 16px;
            padding-top: 80px;
            padding-bottom: 32px;
          }
          .hero-title {
            font-size: clamp(18px, 6.5vw, 28px);
          }
          .hero-bg {
            background-position: 65% center;
          }
          .hero-cta {
            padding: 12px 24px;
            font-size: 14px;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content" ref={contentRef}>
          <h1 className="hero-title">
            YOUR ALL<br/>
            ACCESS PASS<br/>
            TO PREMIUM<br/>
            GAS
          </h1>

          <div className="hero-bottom">
            <p className="hero-subtitle">
              where top shelf isn't a category — it's a standard
            </p>
            <Link to="/shop" className="hero-cta">
              <span className="hero-cta-dot" />
              Shop Flower
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}