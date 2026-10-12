import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Upload, Zap, Shield, ChevronRight,
  Scan, Activity, Layers, ArrowRight, CheckCircle
} from 'lucide-react'
import NeuralBackground from '../components/NeuralBackground'

const features = [
  {
    icon: Upload,
    title: 'Upload MRI',
    desc: 'Upload a brain MRI scan securely in JPG or PNG format.',
    color: '#3b82f6',
  },
  {
    icon: Brain,
    title: 'AI Preprocessing',
    desc: 'Enhancing and preparing the MRI image for analysis.',
    color: '#8b5cf6',
  },
  {
    icon: Layers,
    title: 'Deep Learning Analysis',
    desc: 'Deep learning model analyses MRI to identify tumors.',
    color: '#06b6d4',
  },
  {
    icon: Activity,
    title: 'Diagnosis Results',
    desc: 'Receive instant prediction with confidence and Grad-CAM heatmap.',
    color: '#10b981',
  },
]

const tumorTypes = [
  { name: 'Glioma',      color: '#ef4444', desc: 'Most common primary brain tumor; arises from glial cells.' },
  { name: 'Meningioma',  color: '#f59e0b', desc: 'Forms on brain membranes, usually benign and slow-growing.' },
  { name: 'Pituitary',   color: '#8b5cf6', desc: 'Grows on pituitary gland; affects hormone regulation.' },
  { name: 'No Tumor',    color: '#10b981', desc: 'Clear MRI scan — no detectable tumor present.' },
]

const stats = [
  { value: '100%',  label: 'Binary Accuracy' },
  { value: '97%',   label: 'Tumor Accuracy' },
  { value: '< 3s',  label: 'Analysis Speed' },
  { value: '4',     label: 'Tumor Classes' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <NeuralBackground />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex items-center pt-16 px-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left copy */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="mb-6">
              <span className="tag text-xs">
                <Activity className="w-3 h-3" />
                AI-Powered Neuroimaging
              </span>
            </motion.div>

            <motion.h1 variants={item} className="font-display font-800 text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
              AI-Powered Brain<br />
              Tumor Detection{' '}
              <span className="text-cyan-DEFAULT">with AI</span>
            </motion.h1>

            <motion.p variants={item} className="text-slate-400 text-lg mb-4 leading-relaxed max-w-lg">
              Upload your MRI scan and get instant multi-class results
            </motion.p>

            {/* Tumor type pills */}
            <motion.div variants={item} className="flex flex-wrap gap-2 mb-8">
              {tumorTypes.map(t => (
                <span
                  key={t.name}
                  className="text-xs px-3 py-1 rounded-full font-display font-600 border"
                  style={{ color: t.color, borderColor: `${t.color}40`, background: `${t.color}10` }}
                >
                  {t.name}
                </span>
              ))}
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/scan"
                className="btn-primary flex items-center gap-2 py-3 px-7"
                style={{ color: '#ffffff' }}
              >
                <Upload className="w-4 h-4" />
                Try Demo
              </Link>
              <Link to="/about" className="btn-ghost flex items-center gap-2 py-3 px-7">
                Learn More
              </Link>
            </motion.div>

            {/* Quick stats row */}
            <motion.div variants={item} className="grid grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="result-card py-3 text-center">
                  <p className="font-display font-700 text-lg text-cyan-DEFAULT">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — brain image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg animate-float">
              <img
                src="/hero-brain.png"
                alt="3D Brain AI Visualization"
                className="w-full h-auto drop-shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="relative z-10 py-24 px-6 bg-white/60 border-y border-border/60">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-700 text-3xl sm:text-4xl mb-3">How It Works</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Upload your MRI scan and get instant multi-class results
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} variants={item} className="result-card group relative">
                <span
                  className="absolute top-4 right-4 text-xs font-mono font-600 opacity-30"
                  style={{ color }}
                >
                  0{i + 1}
                </span>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color }} />
                </div>
                <h3 className="font-display font-600 text-sm mb-1.5">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tumor Types ──────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-700 text-3xl sm:text-4xl mb-3">Tumor Types</h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">
              The model classifies MRI scans into four categories with high accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tumorTypes.map(({ name, color, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="result-card"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}
                >
                  <Brain className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                </div>
                <h4 className="font-display font-600 text-sm mb-1" style={{ color }}>{name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial / Info Banner ─────────────── */}
      <section className="relative z-10 py-16 px-6 bg-white/60 border-y border-border/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Doctor image + quote */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-5 items-start"
          >
            <img
              src="/doctor.png"
              alt="Medical professional"
              className="w-20 h-20 rounded-2xl object-cover border border-border shadow-sm flex-shrink-0"
            />
            <div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3 italic">
                "This tool has revolutionized our diagnostic process. It's reliable, fast, and incredibly accurate. A huge help to our practice!"
              </p>
              <p className="font-display font-600 text-sm text-slate-300">Dr. Sarah Mitchell</p>
              <p className="text-xs text-slate-500">Neuro-Oncologist</p>
            </div>
          </motion.div>

          {/* Info checklist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {[
              'State-of-the-art ResNet models ensure precise tumor classification',
              'Get results within seconds of uploading your MRI scan',
              'Grad-CAM heatmaps provide visual AI explainability',
              'All processing happens locally — your scans stay private',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-cyan-DEFAULT flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-slate-400 text-sm">{point}</p>
              </div>
            ))}
            <div className="pt-2">
              <Link
                to="/scan"
                className="btn-primary inline-flex items-center gap-2 py-2.5 px-6 text-sm"
                style={{ color: '#ffffff' }}
              >
                Upload MRI Scan for Free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-bright rounded-3xl p-12">
            <Scan className="w-12 h-12 text-cyan-DEFAULT mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-display font-700 text-3xl mb-3">Ready to analyze?</h2>
            <p className="text-slate-400 mb-8 text-base">
              Upload your MRI scan and get instant AI analysis with Grad-CAM heatmaps.
            </p>
            <Link
              to="/scan"
              className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-10"
              style={{ color: '#ffffff' }}
            >
              Start Scanning
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="relative z-10 border-t border-border py-8 px-6 text-center bg-white/40">
        <p className="text-slate-500 text-sm font-mono">
          NeuraScan — AI-Powered Brain Tumor Detection System
        </p>
      </footer>
    </div>
  )
}
