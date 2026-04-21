import { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────
// Cache global en mémoire avec TTL + Déduplication de requêtes
// ─────────────────────────────────────────────────────────────────────
const apiCache = new Map()
const requestQueue = new Map() // Déduplication: évite 2 requêtes identiques simultanées

/**
 * Hook de cache API avec:
 * - TTL automatique (expiration)
 * - Déduplication (une seule requête en vol pour une clé donnée)
 * - Gestion d'erreur robuste
 * @param {Function} fetchFn - Fonction async retournant les données
 * @param {String} cacheKey - Clé unique pour ce cache (ex: "products_limit_3")
 * @param {Number} ttl - Temps de vie du cache en ms (défaut: 5 min)
 */
export const useApiCache = (fetchFn, cacheKey, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const fetchData = async () => {
      try {
        // 1. Vérifier le cache valide
        const cached = apiCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < ttl) {
          setData(cached.data)
          setLoading(false)
          return
        }

        // 2. Vérifier si une requête est déjà en vol pour cette clé
        if (requestQueue.has(cacheKey)) {
          // Attendre la réponse en vol
          const promise = requestQueue.get(cacheKey)
          const result = await promise
          if (isMounted.current) {
            setData(result)
            setError(null)
            setLoading(false)
          }
          return
        }

        // 3. Lancer la requête et l'ajouter à la queue
        setLoading(true)
        const requestPromise = fetchFn()
        requestQueue.set(cacheKey, requestPromise)

        try {
          const result = await requestPromise
          
          if (isMounted.current) {
            // Cacher les résultats
            apiCache.set(cacheKey, {
              data: result,
              timestamp: Date.now()
            })
            setData(result)
            setError(null)
          }
        } finally {
          // Retirer de la queue
          requestQueue.delete(cacheKey)
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message || 'Erreur API')
          setData(null)
        }
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted.current = false
    }
  }, [cacheKey])

  return { data, loading, error }
}

/**
 * Vider le cache sélectivement ou complètement
 * @param {String} pattern - Pattern optionnel pour supprimer des clés (ex: "products")
 */
export const clearApiCache = (pattern) => {
  if (pattern) {
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key)
      }
    }
  } else {
    apiCache.clear()
  }
}
