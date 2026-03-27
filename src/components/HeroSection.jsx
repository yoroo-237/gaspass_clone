import React, { useEffect, useRef } from 'react'

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
          min-height: 700px;
          position: relative;
          overflow: hidden;
          display: flex;
        }

        /* Background — personnage centré, tout visible */
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(/hero.jpeg);
          background-size: cover;
          background-position: 60% center;
          background-repeat: no-repeat;
          z-index: 0;
        }

        /* Léger dégradé gauche pour lisibilité texte */
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

        /* Contenu texte — occupe toute la hauteur, écarte titre et sous-titre */
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          /* Starts below announce bar (36px) + navbar (70px) */
          padding-top: 116px;
          padding-left: 48px;
          padding-bottom: 56px;
          padding-right: 20px;
          width: 48%;
          min-width: 340px;
          height: 100%;
          box-sizing: border-box;
        }

        /* Titre pixel — grand, espacé, remplit la hauteur disponible */
        .hero-title {
          font-family: 'Press Start 2P', monospace;
          color: #ffffff;
          line-height: 1.38;
          letter-spacing: 0.02em;
          margin: 0;
          text-transform: uppercase;
          /*
            Available height for title = 100vh - 116px top - 56px bottom - ~60px subtitle - ~32px gap
            ≈ 100vh - 264px
            At 900px screen: 636px / (8 lines × 1.38) ≈ 57px → clamp max at 54px
            At 1080px screen: 816px / (8 × 1.38) ≈ 73px → clamp max at 54px
            At 700px screen: 436px / (8 × 1.38) ≈ 39px → clamp picks vw
          */
          font-size: clamp(20px, 4vw, 50px);
        }

        /* Sous-titre — en bas, bien séparé */
        .hero-subtitle {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(13px, 1.2vw, 17px);
          color: rgba(255,255,255,0.93);
          line-height: 1.6;
          margin: 0;
          max-width: 500px;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .hero-content {
            width: 90%;
            padding-left: 24px;
            padding-top: 90px;
          }
          .hero-title {
            font-size: clamp(18px, 5.5vw, 36px);
          }
          .hero-bg {
            background-position: 70% center;
          }
        }

        @media (max-width: 600px) {
          .hero-content {
            width: 100%;
            padding-left: 18px;
            padding-right: 18px;
          }
          .hero-title {
            font-size: clamp(14px, 5vw, 28px);
          }
          .hero-bg {
            background-position: 75% center;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content" ref={contentRef}>
          <h1 className="hero-title">
            VOTRE<br/>
            PASSAGE<br/>
            D'ACCÈS<br/>
            ILLIMITÉ À<br/>
            L'ESSENCE<br/>
            DE<br/>
            PREMIÈRE<br/>
            QUALITÉ
          </h1>

          <p className="hero-subtitle">
            Là où le haut de gamme n'est pas une catégorie, mais une norme
          </p>
        </div>
      </section>
    </>
  )
}