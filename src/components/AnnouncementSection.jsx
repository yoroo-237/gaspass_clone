import React from 'react'
import useReveal from '../hooks/useReveal.js'

const HERO_IMAGE = '/public/m7CojsTPdwZHCKQYdWtnYIDM.webp'

export default function AnnouncementSection() {
  const ref = useReveal(0.2)

  return (
    <section style={{
      padding: '56px 80px 56px',
      width: '100%',
      boxSizing: 'border-box',
      background: '#ffffff',
    }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 20,
          height: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Image de fond */}
        <img
          src={HERO_IMAGE}
          alt="cannabis macro"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            display: 'block',
            borderRadius: 20,
            filter: 'brightness(1.15) saturate(1.1)',
          }}
        />

        {/* Card glassmorphism */}
        <div
          ref={ref}
          className="reveal"
          style={{
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(30, 20, 20, 0.30)',   // ← on voit l'image derrière
            backdropFilter: 'blur(16px)',                  // ← effet verre bien présent
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 16,
            width: '58%',           // ← ni trop large ni trop étroite
            maxWidth: 780,
            padding: '30px 50px 34px',
            textAlign: 'center',
          }}
        >
          {/* Titre ANNONCE */}
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 30,
            color: '#ffffff',
            letterSpacing: '0.06em',
            margin: '0 0 20px',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.35)',
          }}>
            ANNONCE
          </h2>

          {/* Paragraphe 1 */}
          <p style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.95,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            margin: '0 0 14px',
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
          }}>
            NOUS SOMMES FIERS D'ANNONCER LE LANCEMENT OFFICIEL DE{' '}
            <strong style={{ fontWeight: 800 }}>GAS PASS</strong>
            {' '}, VOTRE PARTENAIRE DE CONFIANCE POUR L'{' '}
            <strong style={{ fontWeight: 800 }}>
              APPROVISIONNEMENT EN CANNABIS DE GROS
            </strong>
            {' '}HAUT DE GAMME .
          </p>

          {/* Paragraphe 2 */}
          <p style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.95,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            margin: 0,
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
          }}>
            CONÇU POUR LES DISPENSAIRES, LES DÉTAILLANTS ET LES ACHETEURS
            EXIGEANTS, GAS PASS VOUS DONNE ACCÈS À{' '}
            <strong style={{ fontWeight: 800 }}>
              DES FLEURS DE QUALITÉ SUPÉRIEURE
            </strong>
            {' '}À DES PRIX DE GROS COMPÉTITIFS : QUE DU BON CANNABIS, SANS
            SUPERFLU.
          </p>

        </div>
      </div>
    </section>
  )
}