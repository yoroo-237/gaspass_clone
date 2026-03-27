import React from 'react'
import useReveal from '../hooks/useReveal.js'

export default function OrderSection() {
  const titleRef = useReveal(0.2)
  const cardsRef = useReveal(0.15)

  return (
    <section id="support" style={{
      padding: '100px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 70 }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: '#ba0b20',
            letterSpacing: '0.2em',
            marginBottom: 20,
          }}>
            HOW TO ORDER
          </div>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(16px, 2.5vw, 28px)',
            color: '#fff',
            lineHeight: 1.5,
            letterSpacing: '0.04em',
          }}>
            ORDER TODAY <span style={{ color: '#ba0b20' }}>*</span>
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 80,
        }}>
          {/* Order card */}
          <div style={{
            background: 'rgba(158,255,165,0.04)',
            border: '1px solid rgba(158,255,165,0.15)',
            borderRadius: 8,
            padding: '40px 32px',
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(158,255,165,0.1)',
              border: '1px solid rgba(158,255,165,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              fontFamily: 'var(--font-pixel)',
              fontSize: 14,
              color: '#9effa5',
            }}>
              1
            </div>
            <h3 style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 9,
              color: '#9effa5',
              letterSpacing: '0.1em',
              marginBottom: 16,
              lineHeight: 1.6,
            }}>
              Order Online
            </h3>
            <p style={{
              fontSize: 14,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 16,
            }}>
              Looking for premium flower?
            </p>
            <p style={{
              fontSize: 14,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.55)',
            }}>
              Order today by contacting our Signal/Telegram with your cart order.
            </p>
          </div>

          {/* Contact card */}
          <div style={{
            background: 'rgba(186,11,32,0.04)',
            border: '1px solid rgba(186,11,32,0.15)',
            borderRadius: 8,
            padding: '40px 32px',
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(186,11,32,0.1)',
              border: '1px solid rgba(186,11,32,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              fontFamily: 'var(--font-pixel)',
              fontSize: 14,
              color: '#ba0b20',
            }}>
              ?
            </div>
            <h3 style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 9,
              color: '#ba0b20',
              letterSpacing: '0.1em',
              marginBottom: 16,
              lineHeight: 1.6,
            }}>
              Contact Us
            </h3>
            <p style={{
              fontSize: 14,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 16,
            }}>
              Have a question to ask?
            </p>
            <p style={{
              fontSize: 14,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.55)',
            }}>
              Our team will respond to you promptly. Please message via Telegram or Signal.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <FAQ />
      </div>
    </section>
  )
}

const FAQS = [
  { q: 'How fast is Shipping?', a: 'We ship within 24–48 hours of order confirmation via discreet, stealthy packaging.' },
  { q: 'When will my order be fulfilled?', a: 'Orders are typically processed same day if placed before 2PM. You will receive tracking once shipped.' },
  { q: 'What mail carriers does the GasPass team use?', a: 'We use trusted carriers with full tracking. Packaging is 100% discreet with no identifiable branding.' },
]

function FAQ() {
  const [open, setOpen] = React.useState(null)
  const ref = useReveal(0.15)

  return (
    <div ref={ref} className="reveal">
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 8,
        color: '#ba0b20',
        letterSpacing: '0.2em',
        marginBottom: 32,
        textAlign: 'center',
      }}>
        GOT A QUESTION FOR GAS PASS?
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6,
              overflow: 'hidden',
              marginBottom: 8,
              background: open === i ? 'rgba(255,255,255,0.03)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: '22px 24px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                color: '#fff',
                fontWeight: 500,
              }}>
                {faq.q}
              </span>
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 10,
                color: open === i ? '#9effa5' : 'rgba(255,255,255,0.35)',
                transition: 'transform 0.3s, color 0.2s',
                transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}>
                +
              </span>
            </button>
            <div style={{
              maxHeight: open === i ? '200px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <p style={{
                fontSize: 14,
                lineHeight: 1.9,
                color: 'rgba(255,255,255,0.5)',
                padding: '0 24px 22px',
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
