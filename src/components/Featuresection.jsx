import React from 'react'

const FEATURES = [
  { icon: '/bus.png',  label: 'Fast Turnaround Times' },
  { icon: '/lock.png', label: 'Exclusive Strain Access' },
  { icon: '/wand.png', label: 'Consistent Quality Control' },
  { icon: '/flag.png', label: 'Best Quality for Price' },
]

export default function FeaturesSection() {
  return (
    <>
      <style>{`
        .features-section {
          background: #f0f0f0;
          width: 100%;
          padding: 72px 40px;
          box-sizing: border-box;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
        }

        .feature-icon {
          width: 68px;
          height: 68px;
          object-fit: contain;
          display: block;
        }

        .feature-label {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 20px;
          font-weight: 400;
          color: #111111;
          line-height: 1.35;
          margin: 0;
          letter-spacing: -0.01em;
        }

        @media (max-width: 900px) {
          .features-section {
            padding: 52px 24px;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 48px 24px;
          }
          .feature-label {
            font-size: 17px;
          }
        }

        @media (max-width: 480px) {
          .features-section {
            padding: 40px 16px;
          }
          .features-grid {
            gap: 40px 12px;
          }
          .feature-label {
            font-size: 15px;
          }
        }
      `}</style>

      <section className="features-section">
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-item">
              <img
                src={f.icon}
                alt={f.label}
                className="feature-icon"
              />
              <p className="feature-label">{f.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}