import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')

    if (!adminToken) {
      setIsAuthorized(false)
      return
    }

    // Valider le token basiquement (vérifier la structure JWT)
    try {
      const parts = adminToken.split('.')
      if (parts.length !== 3) {
        // Token invalide
        localStorage.removeItem('adminToken')
        setIsAuthorized(false)
        return
      }

      // Décoder la partie payload (sans vérification cryptographique côté client)
      const payload = JSON.parse(atob(parts[1]))

      // Vérifier l'expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Token expiré
        localStorage.removeItem('adminToken')
        setIsAuthorized(false)
        return
      }

      setIsAuthorized(true)
    } catch (err) {
      // Token invalide
      console.error('Token validation error:', err)
      localStorage.removeItem('adminToken')
      setIsAuthorized(false)
    }
  }, [])

  // En attente de validation
  if (isAuthorized === null) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Vérification...</div>
  }

  // Non autorisé
  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
