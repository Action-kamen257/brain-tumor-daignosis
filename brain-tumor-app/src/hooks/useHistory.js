import { useState, useCallback } from 'react'

const HISTORY_KEY = 'neurascan_history'
const MAX_HISTORY = 10

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addEntry = useCallback((entry) => {
    setHistory(prev => {
      const next = [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        },
        ...prev,
      ].slice(0, MAX_HISTORY)

      try {
        // Store without image data URL to save space (just metadata)
        const toStore = next.map(({ imageDataUrl, heatmapUrl, ...rest }) => ({
          ...rest,
          hasImage: !!imageDataUrl,
        }))
        localStorage.setItem(HISTORY_KEY, JSON.stringify(toStore))
      } catch {
        // Storage full — fail silently
      }

      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
  }, [])

  return { history, addEntry, clearHistory }
}
