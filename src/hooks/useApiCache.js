import { useState, useEffect, useRef } from 'react'

// Cache simple en mémoire avec TTL
const apiCache = new Map()

export const useApiCache = (fetchFn, cacheKey, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const fetchData = async () => {
      // Vérifier le cache
      const cached = apiCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < ttl) {
        setData(cached.data)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await fetchFn()
        
        if (isMounted.current) {
          // Cacher les résultats
          apiCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          })
          setData(result)
          setError(null)
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
  }, [cacheKey, ttl])

  return { data, loading, error }
}

// Vider le cache (utile après une mutation)
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
