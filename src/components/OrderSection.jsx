
import React, { useState, useEffect } from 'react'
import { useApiCache } from '../hooks/useApiCache'
import { getFaqs } from '../api/client'
import { SOCIAL_LINKS } from '../utils/socialLinks'

function useReveal(threshold = 0.15) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

const GLOBAL_CSS = `
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .revealed { opacity: 1; transform: translateY(0); }

  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-track {
    display: flex;
    white-space: nowrap;
    animation: ticker 18s linear infinite;
  }

  .app-icon-btn {
    transition: transform 0.2s, opacity 0.2s;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    display: block;
  }
  .app-icon-btn:hover { transform: scale(1.08); opacity: 0.85; }

  .faq-item { transition: background 0.2s; }

  .order-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
  }

  @media (max-width: 768px) {
    .order-grid {
      grid-template-columns: 1fr;
      gap: 56px;
    }
  }
`

function FAQ() {
  const [open, setOpen] = React.useState(null)
  const [faqs, setFaqs] = React.useState([])
  const ref = useReveal(0.15)

  const { data: faqsData, loading } = useApiCache(
    () => getFaqs(),
    'GET_/content/faqs',
    15 * 60 * 1000  // Cache 15 minutes
  )

  React.useEffect(() => {
    if (faqsData) {
      setFaqs(Array.isArray(faqsData) ? faqsData : [])
    }
  }, [faqsData])

  return (
    <div ref={ref} className="reveal" style={{ marginTop: 100 }}>
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 13,
        color: '#ba0b20',
        letterSpacing: '0.15em',
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'uppercase',
      }}>
        GOT A QUESTION FOR GAS PASS?
      </div>

      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(40px, 6vw, 72px)',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: '0.04em',
        marginBottom: 56,
      }}>
        FAQ
      </h2>

      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div
            key={faq.id || i}
            className="faq-item"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              overflow: 'hidden',
              background: open === i ? 'rgba(255,255,255,0.03)' : 'transparent',
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
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: '#fff', fontWeight: 500 }}>
                {faq.q}
              </span>
              <span style={{
                color: open === i ? '#9effa5' : '#ba0b20',
                fontSize: 24,
                fontWeight: 300,
                transition: 'transform 0.3s, color 0.2s',
                transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                flexShrink: 0,
                lineHeight: 1,
                display: 'block',
              }}>
                +
              </span>
            </button>
            <div style={{
              maxHeight: open === i ? '200px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: 'rgba(255,255,255,0.5)', padding: '0 24px 22px' }}>
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Icône wrapper — taille fixe + border-radius + clip strict
function IconWrapper({ src, alt, bg = 'transparent', size = 80, radius = 18, href }) {
  const inner = (
    <div style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: bg,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          flexShrink: 0,
        }}
      />
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="app-icon-btn" style={{ width: size, height: size, flexShrink: 0 }}>
        {inner}
      </a>
    )
  }

  return (
    <button className="app-icon-btn" style={{ width: size, height: size, flexShrink: 0 }}>
      {inner}
    </button>
  )
}

export default function OrderSection() {
  const titleRef = useReveal(0.2)
  const cardsRef = useReveal(0.15)

  const TICK = ' * ORDER TODAY'
  const tickStr = TICK.repeat(14)

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <section
        id="support"
        style={{
          padding: '100px 48px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: '#000',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* ── Header centré ── */}
          <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
            <div style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 12,
              color: '#ba0b20',
              letterSpacing: '0.25em',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}>
              HOW TO ORDER
            </div>
            <h2 style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(18px, 2vw, 26px)',
              color: '#fff',
              letterSpacing: '0.15em',
              fontWeight: 400,
            }}>
              ORDER TODAY <span style={{ color: '#ba0b20' }}>*</span>
            </h2>
          </div>

          {/* ── Two columns ── */}
          <div ref={cardsRef} className="reveal order-grid">

            {/* LEFT — Order Online */}
            <div>
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 11,
                color: '#ba0b20',
                letterSpacing: '0.2em',
                marginBottom: 16,
                textTransform: 'uppercase',
              }}>
                HOW TO ORDER
              </div>
              <h3 style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(32px, 3.5vw, 52px)',
                color: '#fff',
                letterSpacing: '0.04em',
                marginBottom: 28,
                fontWeight: 400,
                lineHeight: 1.1,
              }}>
                Order Online
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#fff', marginBottom: 10, fontFamily: 'var(--font-sans)' }}>
                Looking for premium flower?
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#fff', marginBottom: 36, fontFamily: 'var(--font-sans)' }}>
                Order today by contacting our Signal/Telegram with your cart order.
              </p>
              {/* Signal + Telegram */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <IconWrapper src={SOCIAL_LINKS.signal.icon}   alt="Signal"   size={80} radius={18} href={SOCIAL_LINKS.signal.url} />
                <IconWrapper src={SOCIAL_LINKS.telegram.icon} alt="Telegram" size={80} radius={18} href={SOCIAL_LINKS.telegram.url} />
              </div>
            </div>

            {/* RIGHT — Contact Us */}
            <div>
              <div style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 11,
                color: '#ba0b20',
                letterSpacing: '0.2em',
                marginBottom: 16,
                textTransform: 'uppercase',
              }}>
                NEED HELP?
              </div>
              <h3 style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'clamp(32px, 3.5vw, 52px)',
                color: '#fff',
                letterSpacing: '0.04em',
                marginBottom: 28,
                fontWeight: 400,
                lineHeight: 1.1,
              }}>
                Contact Us
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#fff', marginBottom: 10, fontFamily: 'var(--font-sans)' }}>
                Have a question to ask?
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#fff', marginBottom: 36, fontFamily: 'var(--font-sans)' }}>
                Our team will respond to you promptly.<br />
                Please message via Telegram, Signal in the links below.
              </p>
              {/* Linktree (fond blanc) + TatoTalk + Potato */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <IconWrapper src={SOCIAL_LINKS.linktree.icon}  alt="Linktree"  bg={SOCIAL_LINKS.linktree.iconBg} size={80} radius={18} href={SOCIAL_LINKS.linktree.url} />
                <IconWrapper src={SOCIAL_LINKS.tatoTalk.icon}  alt="Tato Talk" size={80} radius={18} href={SOCIAL_LINKS.tatoTalk.url} />
                <IconWrapper src={SOCIAL_LINKS.potato.icon}    alt="GasPass"   size={80} radius={18} href={SOCIAL_LINKS.potato.url} />
              </div>
            </div>

          </div>
        </div>

        {/* ── Ticker ── */}
        <div style={{
          marginTop: 100,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '14px 0',
          overflow: 'hidden',
        }}>
          <div className="ticker-track">
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(12px, 1.2vw, 15px)',
              color: '#fff',
              letterSpacing: '0.12em',
            }}>
              {tickStr}
            </span>
            <span style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(12px, 1.2vw, 15px)',
              color: '#fff',
              letterSpacing: '0.12em',
            }}>
              {tickStr}
            </span>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div id="faq" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 120 }}>
          <FAQ />
        </div>

      </section>
    </>
  )
}