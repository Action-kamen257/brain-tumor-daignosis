import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const steps = [
  'Preprocessing image...',
  'Running binary classifier...',
  'Analyzing tumor markers...',
  'Generating Grad-CAM...',
  'Compiling results...',
]

export function ProcessingSpinner({ step = 0 }) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      {/* Radar ring animation */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-DEFAULT/40"
            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
        <div className="w-14 h-14 rounded-full bg-cyan-glow border border-cyan-DEFAULT/40 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="w-6 h-6 text-cyan-DEFAULT" strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* Step label */}
      <div className="text-center">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-cyan-DEFAULT font-mono text-sm"
        >
          {steps[step % steps.length]}
        </motion.p>
        <p className="text-slate-500 text-xs mt-1 font-mono">
          AI model inference in progress
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            animate={{
              backgroundColor: i <= step ? '#4f8ef7' : '#1e2438',
              scale: i === step ? 1.4 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}

export function InlineSpinner({ size = 16 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="rounded-full border-2 border-transparent"
      style={{
        width: size,
        height: size,
        borderTopColor: '#4f8ef7',
        borderRightColor: 'rgba(79,142,247,0.25)',
      }}
    />
  )
}
