import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { useApiCache } from '../hooks/useApiCache.js'
import { getCategories } from '../api/client'

export default function AboutSection() {
  const titleRef = useReveal(0.2)
  const gridRef  = useReveal(0.15)
  const navigate = useNavigate()
  
  const [categories, setCategories] = useState([])
  const { data: categoriesData, loading } = useApiCache(
    () => getCategories(),
    'GET_/categories',
    15 * 60 * 1000  // Cache 15 minutes
  )

  useEffect(() => {
    if (categoriesData) {
      const categoryList = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || [])
      const formattedData = categoryList.map((cat) => ({
        id: cat.id,
        label: `Shop ${cat.name}`,
        sublabel: cat.name?.toUpperCase(),
        grade: cat.name,
        image: cat.image || null,
      }))
      setCategories(formattedData.slice(0, 4))
    }
  }, [categoriesData])

  return (
    <section id="about" style={{
      padding: '80px 24px',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <div ref={titleRef} className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(10px, 1.2vw, 14px)',
            color: '#ba0b20',
            letterSpacing: '0.2em',
            marginBottom: 16,
          }}>
            ONLY GAS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: '#111',
            lineHeight: 1.3,
            letterSpacing: '0.04em',
          }}>
            Shop Gas Pass
          </h2>
        </div>

        <div
          ref={gridRef}
          className="reveal shop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              Chargement des catégories...
            </div>
          ) : (
            categories.map(({ id, label, sublabel, grade, image }) => (
              <div
                key={id || label}
                className="shop-card"
                onClick={() => navigate(`/shop?grade=${encodeURIComponent(grade)}`)}
                style={{
                  position: 'relative',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'block',
                  aspectRatio: '4 / 3',
                  cursor: 'pointer',
                  background: image ? 'transparent' : '#e8e0d0',
                }}
              >
                {image && (
                  <img
                    src={image}
                    alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 'clamp(14px, 2.5vw, 28px)',
                  color: '#fff', letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}>
                  {label}
                </div>
                <div style={{
                  position: 'absolute', bottom: 16, left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 'clamp(10px, 1.8vw, 20px)',
                  color: '#ba0b20', letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              }}>
                {sublabel}
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .shop-card img {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .shop-card:hover img { transform: scale(1.07); }
        @media (max-width: 600px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>
    </section>
  )
}