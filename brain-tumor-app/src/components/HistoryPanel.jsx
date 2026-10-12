import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, ChevronRight, X } from 'lucide-react'
import { classifyResult, formatConfidence, relativeTime } from '../utils'

export default function HistoryPanel({ history, onClear, onSelect, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm glass-bright border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-DEFAULT" strokeWidth={1.5} />
                  <h2 className="font-display font-600 text-base">Scan History</h2>
                </div>
                <div className="flex gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={onClear}
                      className="p-1.5 text-slate-500 hover:text-crimson transition-colors rounded-lg hover:bg-red-500/10"
                      title="Clear history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors rounded-lg hover:bg-surface"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Empty state */}
              {history.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" strokeWidth={1} />
                  <p className="text-sm">No scans yet</p>
                  <p className="text-xs mt-1 opacity-60">Your scan history will appear here</p>
                </div>
              )}

              {/* History entries */}
              <div className="space-y-3">
                {history.map((entry, i) => {
                  const info = classifyResult(entry.class)
                  return (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => { onSelect?.(entry); onClose() }}
                      className="w-full text-left p-4 rounded-xl border border-border/60 hover:border-cyan-DEFAULT/30 bg-surface/40 hover:bg-surface/80 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: info.dot }}
                            />
                            <span className="font-display font-600 text-sm text-slate-200 truncate">
                              {info.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="font-mono">{formatConfidence(entry.confidence)}</span>
                            <span>·</span>
                            <span>{relativeTime(entry.timestamp)}</span>
                            {entry.hasImage && !entry.imageDataUrl && (
                              <span className="text-slate-600 italic">no image</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-DEFAULT transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
