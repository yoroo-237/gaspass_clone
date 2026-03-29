import React from 'react'
import useReveal from '../hooks/useReveal.js'

const HERO_IMAGE = '/public/m7CojsTPdwZHCKQYdWtnYIDM.webp'

export default function AnnouncementSection() {
  const ref = useReveal(0.2)

  return (
    <>
      <style>{`
        .announce-section {
          padding: 56px 80px;
          width: 100%;
          box-sizing: border-box;
          background: #ffffff;
        }

        .announce-wrapper {
          position: relative;
          width: 100%;
          border-radius: 20px;
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .announce-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          display: block;
          border-radius: 20px;
          filter: brightness(1.15) saturate(1.1);
        }

        .announce-card {
          position: relative;
          z-index: 2;
          background-color: rgba(30, 20, 20, 0.30);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 16px;
          width: 58%;
          max-width: 780px;
          padding: 30px 50px 34px;
          text-align: center;
        }

        .announce-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 30px;
          color: #ffffff;
          letter-spacing: 0.06em;
          margin: 0 0 20px;
          line-height: 1.2;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0,0,0,0.35);
        }

        .announce-text {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: 400;
          font-size: 12px;
          line-height: 1.95;
          color: rgba(255,255,255,0.95);
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-shadow: 0 1px 6px rgba(0,0,0,0.4);
          margin: 0 0 14px;
        }
        .announce-text:last-child {
          margin-bottom: 0;
        }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .announce-section {
            padding: 24px 16px;
          }
          .announce-wrapper {
            height: auto;
            min-height: 480px;
            border-radius: 14px;
            padding: 20px 0;
          }
          .announce-bg {
            border-radius: 14px;
          }
          .announce-card {
            width: calc(100% - 32px);
            max-width: 100%;
            padding: 24px 20px 28px;
          }
          .announce-title {
            font-size: clamp(16px, 5vw, 24px);
            margin-bottom: 16px;
          }
          .announce-text {
            font-size: 11px;
            letter-spacing: 0.05em;
          }
        }

        @media (max-width: 480px) {
          .announce-section {
            padding: 20px 12px;
          }
          .announce-card {
            width: calc(100% - 24px);
            padding: 20px 16px 24px;
          }
          .announce-title {
            font-size: clamp(14px, 4.5vw, 20px);
          }
          .announce-text {
            font-size: 10.5px;
          }
        }
      `}</style>

      <section className="announce-section">
        <div className="announce-wrapper">
          <img
            src={HERO_IMAGE}
            alt="cannabis macro"
            className="announce-bg"
          />

          <div
            ref={ref}
            className="announce-card reveal"
          >
            <h2 className="announce-title">ANNOUNCEMENT</h2>

            <p className="announce-text">
              WE'RE PROUD TO ANNOUNCE THE OFFICIAL LAUNCH OF{' '}
              <strong style={{ fontWeight: 800 }}>GAS PASS</strong>
              {' '}, YOUR TRUSTED PARTNER FOR TOP-TIER{' '}
              <strong style={{ fontWeight: 800 }}>WHOLESALE CANNABIS</strong>.
            </p>

            <p className="announce-text">
              BUILT FOR DISPENSARIES, RETAILERS, AND SERIOUS BUYERS, GAS PASS CONNECTS YOU WITH{' '}
              <strong style={{ fontWeight: 800 }}>HIGH-GRADE FLOWER</strong>
              {' '}AT COMPETITIVE BULK PRICES — NO FLUFF, JUST FIRE.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}