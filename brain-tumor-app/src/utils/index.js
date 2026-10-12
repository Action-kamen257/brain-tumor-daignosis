/**
 * Format confidence as a percentage string
 */
export function formatConfidence(value) {
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(num)) return '—'
  // Backend returns 0–100 or 0–1; normalize to 0–100
  const pct = num > 1 ? num : num * 100
  return `${pct.toFixed(1)}%`
}

/**
 * Map raw class string from backend to a display-friendly label & color
 */
export function classifyResult(cls) {
  if (!cls) return { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' }

  const normalized = cls.toLowerCase().replace(/_/g, ' ')

  const map = {
    'glioma': {
      label: 'Glioma',
      description: 'A tumor originating in the glial cells of the brain or spine.',
      severity: 'HIGH',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      dot: '#ff3355',
    },
    'meningioma': {
      label: 'Meningioma',
      description: 'A tumor that forms on the membranes covering the brain and spinal cord.',
      severity: 'MEDIUM',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      dot: '#ffaa00',
    },
    'pituitary': {
      label: 'Pituitary Tumor',
      description: 'A growth on the pituitary gland, usually benign.',
      severity: 'MEDIUM',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      dot: '#c084fc',
    },
    'no tumor': {
      label: 'No Tumor Detected',
      description: 'No signs of tumor were detected in the MRI scan.',
      severity: 'CLEAR',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      dot: '#00ff88',
    },

  }

  return map[normalized] || {
    label: cls.charAt(0).toUpperCase() + cls.slice(1),
    description: 'Classification result from the AI model.',
    severity: 'UNKNOWN',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    dot: '#4f8ef7',
  }
}

/**
 * Convert a file to a data URL for preview
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Validate that a file is an accepted image type
 */
export function validateImageFile(file) {
  const accepted = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!accepted.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPG or PNG image.' }
  }
  if (file.size > 20 * 1024 * 1024) {
    return { valid: false, error: 'File size must be under 20MB.' }
  }
  return { valid: true }
}

/**
 * Format a timestamp as a relative time string
 */
export function relativeTime(isoString) {
  const now = Date.now()
  const then = new Date(isoString).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

/**
 * Download a canvas or image URL as a file
 */
export function downloadImage(dataUrl, filename = 'neurascan-result.png') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Blend original image with heatmap on a canvas
 * Returns a data URL
 */
export function blendHeatmapCanvas(originalSrc, heatmapSrc, alpha = 0.5) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const original = new Image()
    const heat = new Image()

    heat.crossOrigin = 'anonymous'

    original.onload = () => {
      canvas.width = original.width
      canvas.height = original.height
      ctx.drawImage(original, 0, 0)

      heat.onload = () => {
        ctx.globalAlpha = alpha
        ctx.drawImage(heat, 0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1
        resolve(canvas.toDataURL('image/png'))
      }
      heat.src = heatmapSrc
    }
    original.src = originalSrc
  })
}
