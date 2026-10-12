import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Upload, X, Brain, ImageIcon, AlertCircle, Clock, ChevronRight
} from 'lucide-react'
import { predictImage, getGradCam, getOutputUrl } from '../api'
import { ProcessingSpinner } from '../components/Spinner'
import { validateImageFile, fileToDataUrl, classifyResult, relativeTime } from '../utils'
import NeuralBackground from '../components/NeuralBackground'
import HistoryPanel from '../components/HistoryPanel'
import { useHistory } from '../hooks/useHistory'

export default function ScanPage() {
  const navigate = useNavigate()
  const { history, addEntry, clearHistory } = useHistory()

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)
  const stepTimer = useRef(null)

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected?.length) {
      toast.error('Only JPG / PNG images are accepted.')
      return
    }
    if (!accepted?.length) return

    const f = accepted[0]
    const validation = validateImageFile(f)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    const url = await fileToDataUrl(f)
    setFile(f)
    setPreview(url)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxFiles: 1,
    multiple: false,
    disabled: processing,
  })

  function clearFile() {
    setFile(null)
    setPreview(null)
  }

  function startStepCycle() {
    let step = 0
    setProcessingStep(0)
    stepTimer.current = setInterval(() => {
      step++
      setProcessingStep(step)
    }, 1800)
  }

  function stopStepCycle() {
    if (stepTimer.current) clearInterval(stepTimer.current)
  }

  async function handleAnalyze() {
    if (!file || processing) return
    setProcessing(true)
    startStepCycle()

    try {
      // Run predict and gradcam in parallel
      const [predictResult, gradcamResult] = await Promise.all([
        predictImage(file),
        getGradCam(file).catch(() => null), // gradcam optional
      ])

      stopStepCycle()

      // Backend may return an error payload (e.g. not a valid MRI)
      if (predictResult?.error || !predictResult?.class) {
        const msg = predictResult?.error || 'Could not classify this image. Ensure it is a valid brain MRI scan.'
        setProcessing(false)
        toast.error(msg)
        return
      }

      // Determine heatmap URL
      let heatmapUrl = null
      if (gradcamResult?.heatmap_base64) {
        heatmapUrl = `data:image/png;base64,${gradcamResult.heatmap_base64}`
      } else if (predictResult?.heatmap) {
        heatmapUrl = getOutputUrl(predictResult.heatmap)
      }

      const resultData = {
        class: predictResult.class,
        confidence: predictResult.confidence,
        imageDataUrl: preview,
        heatmapUrl,
        filename: file.name,
      }

      addEntry(resultData)

      setProcessing(false)
      navigate('/results', { state: resultData })
    } catch (err) {
      stopStepCycle()
      setProcessing(false)

      const msg = err?.response?.data?.error || err.message || 'Analysis failed. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="relative min-h-screen pt-16">
      <NeuralBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="tag text-xs mb-4 inline-flex">
            <Brain className="w-3 h-3" />
            MRI Analysis
          </span>
          <h1 className="font-display font-800 text-4xl sm:text-5xl mb-4">
            Upload MRI Scan
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Upload a brain MRI image in JPG or PNG format. The AI will analyze it for tumor presence and type.
          </p>
        </motion.div>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {!file ? (
              /* Dropzone */
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                {...getRootProps()}
                className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden
                  ${isDragActive
                    ? 'border-cyan-DEFAULT bg-cyan-DEFAULT/5 dropzone-active'
                    : 'border-border hover:border-cyan-DEFAULT/50 hover:bg-surface/40'
                  } ${processing ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <motion.div
                    animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                    className="relative w-20 h-20 mb-6"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-cyan-DEFAULT/10 border border-cyan-DEFAULT/20" />
                    <Upload
                      className="w-20 h-20 p-5 text-cyan-DEFAULT relative z-10"
                      strokeWidth={1.5}
                    />
                    {isDragActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-cyan-DEFAULT"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  <h3 className="font-display font-600 text-xl mb-2 text-slate-200">
                    {isDragActive ? 'Drop to upload' : 'Drag & drop MRI scan'}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">or click to browse files</p>

                  <div className="flex gap-3 text-xs text-slate-600">
                    {['JPG', 'PNG', 'Max 20MB'].map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-surface border border-border font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* File preview */
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass-bright rounded-2xl overflow-hidden"
              >
                {processing ? (
                  <ProcessingSpinner step={processingStep} />
                ) : (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-display font-600 text-slate-200 truncate max-w-48">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearFile}
                        className="p-2 text-slate-500 hover:text-crimson hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image preview */}
                    <div className="relative rounded-xl overflow-hidden bg-black/40 border border-border/50 mb-6">
                      <img
                        src={preview}
                        alt="MRI preview"
                        className="w-full max-h-80 object-contain"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="tag text-xs">Preview</span>
                      </div>
                    </div>


                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mt-6"
        >
          <button
            onClick={handleAnalyze}
            disabled={!file || processing}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            style={{ color: '#ffffff' }}
          >
            {processing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full"
                />
                Analyzing…
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analyze MRI
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {history.length > 0 && !processing && (
            <button
              onClick={() => setHistoryOpen(true)}
              className="btn-ghost flex items-center gap-2 py-4 px-5"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              <span className="w-5 h-5 rounded-full bg-cyan-DEFAULT/20 text-cyan-DEFAULT text-xs flex items-center justify-center font-mono">
                {history.length}
              </span>
            </button>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { label: 'Binary Accuracy', value: '~98%' },
            { label: 'Tumor Types', value: '4' },
            { label: 'Avg. Speed', value: '<3s' },
          ].map(({ label, value }) => (
            <div key={label} className="result-card py-4">
              <p className="font-display font-700 text-xl text-cyan-DEFAULT glow-text">{value}</p>
              <p className="text-slate-500 text-xs mt-1 font-body">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <HistoryPanel
        history={history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onClear={clearHistory}
        onSelect={(entry) => navigate('/results', { state: entry })}
      />
    </div>
  )
}
