import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Layers, SlidersHorizontal, Download, Eye } from 'lucide-react'
import { downloadImage, blendHeatmapCanvas } from '../utils'

const VIEW_MODES = [
  { id: 'original', label: 'Original' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'overlay', label: 'Overlay' },
]

export default function GradCamViewer({ originalUrl, heatmapUrl }) {
  const [mode, setMode] = useState(heatmapUrl ? 'overlay' : 'original')
  const [opacity, setOpacity] = useState(0.5)
  const [overlayUrl, setOverlayUrl] = useState(null)
  const [downloading, setDownloading] = useState(false)

  // Rebuild canvas blend whenever opacity changes
  useEffect(() => {
    if (!originalUrl || !heatmapUrl) return
    let cancelled = false
    blendHeatmapCanvas(originalUrl, heatmapUrl, opacity).then(url => {
      if (!cancelled) setOverlayUrl(url)
    })
    return () => { cancelled = true }
  }, [originalUrl, heatmapUrl, opacity])

  const currentSrc = {
    original: originalUrl,
    heatmap: heatmapUrl,
    overlay: overlayUrl || heatmapUrl,
  }[mode]

  async function handleDownload() {
    if (!currentSrc) return
    setDownloading(true)
    downloadImage(currentSrc, `neurascan-${mode}.png`)
    setTimeout(() => setDownloading(false), 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="result-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
          <h3 className="font-display font-600 text-sm text-slate-200">Grad-CAM Visualization</h3>
        </div>
        <button
          onClick={handleDownload}
          disabled={!currentSrc || downloading}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-DEFAULT transition-colors px-3 py-1.5 rounded-lg hover:bg-cyan-glow disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Saving…' : 'Download'}
        </button>
      </div>

      {/* View mode tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-surface/50 w-fit">
        {VIEW_MODES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`px-4 py-1.5 rounded-md text-xs font-display font-600 transition-all duration-200 ${
              mode === id
                ? 'bg-cyan-DEFAULT text-void'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Image display */}
      <div className="relative rounded-xl overflow-hidden bg-black/40 border border-border/50 aspect-square max-h-72 flex items-center justify-center scan-overlay">
        {currentSrc ? (
          <motion.img
            key={mode + opacity}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={currentSrc}
            alt={`MRI ${mode}`}
            className="w-full h-full object-contain"
          />
        ) : mode === 'overlay' ? (
          <div className="text-slate-600 text-sm flex flex-col items-center gap-2">
            <Eye className="w-8 h-8" strokeWidth={1} />
            <span>Generating overlay…</span>
          </div>
        ) : (
          <div className="text-slate-600 text-sm flex flex-col items-center gap-2">
            <Eye className="w-8 h-8" strokeWidth={1} />
            <span>No heatmap available for this scan</span>
          </div>
        )}

        {/* Mode badge */}
        <div className="absolute top-3 left-3">
          <span className="tag text-xs capitalize">{mode}</span>
        </div>
      </div>

      {/* Opacity slider (overlay mode only) */}
      {mode === 'overlay' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Heatmap opacity
            </div>
            <span className="font-mono text-xs text-cyan-DEFAULT">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={opacity}
            onChange={e => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </motion.div>
      )}

      {/* Legend */}
      {(mode === 'heatmap' || mode === 'overlay') && (
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-slate-500">Activation intensity:</span>
          <div className="flex-1 h-2 rounded-full" style={{
            background: 'linear-gradient(90deg, #000080, #0000ff, #00ffff, #ffff00, #ff0000)'
          }} />
          <div className="flex gap-3 text-xs text-slate-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
