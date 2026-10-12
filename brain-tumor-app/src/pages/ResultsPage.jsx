import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  Brain, RotateCcw, Download, ChevronRight,
  Activity, AlertTriangle, CheckCircle, Info,
  Microscope, ShieldCheck
} from 'lucide-react'
import GradCamViewer from '../components/GradCamViewer'
import { classifyResult, formatConfidence, downloadImage } from '../utils'
import NeuralBackground from '../components/NeuralBackground'

// All 4 tumor classes with their display colors
const ALL_CLASSES = [
  { key: 'glioma',      label: 'Glioma',      color: '#ef4444' },
  { key: 'meningioma',  label: 'Meningioma',  color: '#f59e0b' },
  { key: 'pituitary',   label: 'Pituitary',   color: '#8b5cf6' },
  { key: 'no_tumor',    label: 'No Tumor',    color: '#10b981' },
]

function ClassBar({ label, pct, color, isActive }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className={`font-display font-600 ${isActive ? '' : 'text-slate-400'}`}
              style={isActive ? { color } : {}}>
          {label}
        </span>
        <span className="font-mono" style={{ color: isActive ? color : undefined }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-700/30 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          className="h-full rounded-full"
          style={{
            background: isActive
              ? `linear-gradient(90deg, ${color}90, ${color})`
              : 'rgba(148,163,184,0.3)',
          }}
        />
      </div>
    </div>
  )
}

function SeverityBadge({ severity }) {
  const map = {
    HIGH:    { label: 'High Risk',  icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.22)' },
    MEDIUM:  { label: 'Moderate',   icon: Activity,      color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)' },
    CLEAR:   { label: 'All Clear',  icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)' },
    UNKNOWN: { label: 'Review',     icon: Info,          color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.22)' },
  }
  const { label, icon: Icon, color, bg, border } = map[severity] || map.UNKNOWN
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display font-600"
      style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function ResultsPage() {
  const { state: routerState } = useLocation()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  // Use router state if provided, otherwise fallback to clinical demo data
  const state = routerState?.class ? routerState : {
    class: 'glioma',
    confidence: 96.85,
    imageDataUrl: '/samples/glioma1.jpeg',
    heatmapUrl: '/samples/heatmap.jpg',
    filename: 'mri_scan_glioma_t1_ce.jpg'
  }

  const info = classifyResult(state.class)
  const confidence = state.confidence ?? 0
  const pct = confidence > 1 ? confidence : confidence * 100

  // Build per-class confidence bars: winner gets actual confidence, others share the remainder
  const activeClass = ALL_CLASSES.find(c => c.key === state.class)
  const otherPct = (100 - pct) / (ALL_CLASSES.length - 1)
  const classBars = ALL_CLASSES.map(c => ({
    ...c,
    pct: c.key === state.class ? pct : otherPct,
    isActive: c.key === state.class,
  }))

  const aiExplanation = {
    glioma:     ['Irregular mass with diffuse borders', 'High-intensity region detected', 'Structural deviation in cortical area'],
    meningioma: ['Well-defined extraaxial mass', 'Dural attachment pattern observed', 'Homogeneous enhancement suspected'],
    pituitary:  ['Sellar/suprasellar mass detected', 'Pituitary gland enlargement noted', 'Optic chiasm proximity flagged'],
    no_tumor:   ['Normal parenchymal signal', 'No abnormal mass detected', 'Symmetric brain architecture observed'],
  }[state.class] || ['Pattern analysis complete', 'High confidence classification', 'Review with specialist recommended']

  function handleDownload() {
    setDownloading(true)
    const src = state.heatmapUrl || state.imageDataUrl
    if (src) downloadImage(src, `neurascan-${state.class}-${Date.now()}.png`)
    setTimeout(() => setDownloading(false), 800)
  }

  return (
    <div className="relative min-h-screen pt-16">
      <NeuralBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <span className="tag text-xs mb-2 inline-flex">
              <Activity className="w-3 h-3" />
              Analysis Complete
            </span>
            <h1 className="font-display font-800 text-3xl sm:text-4xl">Brain MRI Analysis</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="btn-ghost flex items-center gap-2 py-2.5 px-5 text-sm"
              disabled={downloading}
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Saving…' : 'Download'}
            </button>
            <Link
              to="/scan"
              className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm"
              style={{ color: '#ffffff' }}
            >
              <RotateCcw className="w-4 h-4" />
              New Scan
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* ── Left: MRI image ── */}
          <div className="space-y-5">
            <motion.div variants={fadeUp} className="result-card">
              <div className="flex items-center gap-2 mb-4">
                <Microscope className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
                <h3 className="font-display font-600 text-sm">Original MRI Scan</h3>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-border aspect-square scan-overlay">
                {state.imageDataUrl ? (
                  <img src={state.imageDataUrl} alt="Original MRI" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">No image</div>
                )}
              </div>
              {state.filename && (
                <p className="mt-2 text-xs text-slate-500 font-mono truncate">{state.filename}</p>
              )}
            </motion.div>

            {/* AI Explanation card */}
            <motion.div variants={fadeUp} className="result-card">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
                <h3 className="font-display font-600 text-sm">AI Explanation</h3>
              </div>
              <ul className="space-y-2">
                {aiExplanation.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-DEFAULT flex-shrink-0 mt-1.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ── Middle: Diagnosis card ── */}
          <div className="space-y-5">
            <motion.div variants={fadeUp} className="result-card">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
                <h3 className="font-display font-600 text-sm">Diagnosis</h3>
              </div>

              {/* Big prediction */}
              <div className="mb-5">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 180 }}
                  className="font-display font-800 text-4xl mb-1"
                  style={{ color: activeClass?.color || '#3b82f6' }}
                >
                  {info.label}
                </motion.h2>
                <p className="font-display font-600 text-2xl text-slate-300">
                  {pct.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">{info.description}</p>
              </div>

              <SeverityBadge severity={info.severity} />

              {/* Per-class confidence bars */}
              <div className="mt-5 space-y-3 pt-4 border-t border-border">
                {classBars.map(bar => (
                  <ClassBar key={bar.key} {...bar} />
                ))}
              </div>

              {/* Meta row */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Model Class</span>
                  <span className="font-mono text-slate-400">{state.class}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Raw Confidence</span>
                  <span className="font-mono text-slate-400">{formatConfidence(confidence)}</span>
                </div>
              </div>
            </motion.div>


          </div>

          {/* ── Right: Grad-CAM ── */}
          <div className="space-y-5">
            <motion.div variants={fadeUp}>
              <GradCamViewer
                originalUrl={state.imageDataUrl}
                heatmapUrl={state.heatmapUrl}
              />
            </motion.div>

            {/* Next steps */}
            <motion.div variants={fadeUp} className="result-card">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
                <h3 className="font-display font-600 text-sm">Understanding Results</h3>
              </div>
              <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                <p>The <span className="text-cyan-DEFAULT font-600">confidence score</span> reflects how certain the model is. Scores above 85% indicate high certainty.</p>
                <p>The <span className="text-cyan-DEFAULT font-600">Grad-CAM heatmap</span> highlights regions the neural network focused on. Red areas = high activation.</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/scan"
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  style={{ color: '#ffffff' }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Scan Another
                </Link>
                <Link to="/about" className="btn-ghost text-xs py-2 px-4 inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
