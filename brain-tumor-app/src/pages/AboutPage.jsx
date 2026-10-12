import { motion } from 'framer-motion'
import {
  Brain, Layers, Zap, Database, GitBranch,
  BarChart3, Shield, ChevronRight, Eye
} from 'lucide-react'
import NeuralBackground from '../components/NeuralBackground'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

const pipeline = [
  {
    step: '01',
    title: 'Image Input',
    desc: 'MRI scan uploaded as JPG/PNG. Resized to 224×224 and normalized using ImageNet statistics.',
    icon: Database,
    color: '#4f8ef7',
  },
  {
    step: '02',
    title: 'Binary Classification',
    desc: 'ResNet-18 model determines whether tumor is present (Tumor vs. No Tumor). Trained on a balanced binary dataset.',
    icon: GitBranch,
    color: '#00ff88',
  },
  {
    step: '03',
    title: 'Tumor Classification',
    desc: 'If tumor detected, ResNet-50 classifies the type: Glioma, Meningioma, or Pituitary tumor.',
    icon: Brain,
    color: '#c084fc',
  },
  {
    step: '04',
    title: 'Grad-CAM',
    desc: 'Gradient-weighted Class Activation Mapping highlights regions that most influenced the prediction.',
    icon: Layers,
    color: '#ffaa00',
  },
  {
    step: '05',
    title: 'Result Output',
    desc: 'Diagnosis, confidence score, tumor type, and heatmap overlay returned to the user.',
    icon: Zap,
    color: '#ff3355',
  },
]

const models = [
  {
    name: 'Binary Classifier',
    arch: 'ResNet-18',
    task: 'Tumor vs. No Tumor',
    accuracy: '100%',
    classes: 2,
    color: '#10b981',
  },
  {
    name: 'Tumor Classifier',
    arch: 'ResNet-50',
    task: 'Glioma / Meningioma / Pituitary / None',
    accuracy: '97%',
    classes: 4,
    color: '#3b82f6',
  },
]

const tumorDetails = [
  {
    name: 'Glioma',
    color: '#ef4444',
    severity: 'HIGH RISK',
    freq: '~33% of brain tumors',
    description: 'Gliomas originate in the glial cells — the supportive tissue of the brain and spinal cord. They are the most common type of primary brain tumor and vary widely in aggressiveness.',
    symptoms: ['Persistent headaches', 'Seizures or convulsions', 'Memory and cognitive changes', 'Vision or speech difficulties', 'Weakness in limbs'],
    types: 'Includes astrocytoma, oligodendroglioma, and glioblastoma (GBM). GBM is the most aggressive form with a median survival of 14–16 months.',
    treatment: 'Surgical resection, radiation therapy, and chemotherapy (Temozolomide). Bevacizumab may be used for recurrent GBM.',
    prognosis: 'Highly variable. Low-grade gliomas can be managed for years; high-grade (Grade IV GBM) remains challenging with ~5% five-year survival.',
  },
  {
    name: 'Meningioma',
    color: '#f59e0b',
    severity: 'MODERATE',
    freq: '~37% of brain tumors',
    description: 'Meningiomas arise from the meninges — the three-layered membrane surrounding the brain and spinal cord. They are the most common primary intracranial tumor overall.',
    symptoms: ['Gradual onset headaches', 'Vision changes or double vision', 'Hearing loss or tinnitus', 'Weakness in arms/legs', 'Memory problems'],
    types: 'Classified Grade I (benign, 80%), Grade II (atypical), and Grade III (malignant). Most are slow-growing and discovered incidentally on imaging.',
    treatment: 'Small asymptomatic tumors may be monitored (watch-and-wait). Surgical removal is the primary treatment; stereotactic radiosurgery (Gamma Knife) for unresectable cases.',
    prognosis: 'Generally favorable. Grade I: >90% ten-year survival. Grade II–III carry higher recurrence rates and require adjuvant radiation.',
  },
  {
    name: 'Pituitary Tumor',
    color: '#8b5cf6',
    severity: 'MODERATE',
    freq: '~15% of brain tumors',
    description: 'Pituitary adenomas develop on the pituitary gland at the base of the skull. They are almost always benign and often produce excess hormones that cause systemic effects.',
    symptoms: ['Headaches behind the eyes', 'Visual field loss (bitemporal hemianopia)', "Hormonal imbalances (acromegaly, Cushing's, infertility)", 'Fatigue and weight changes', 'Galactorrhea or erectile dysfunction'],
    types: 'Micro-adenomas (<10 mm) vs. Macro-adenomas (≥10 mm). Functional (hormone-secreting) vs. non-functional. Prolactinomas are the most common subtype.',
    treatment: 'Dopamine agonists (bromocriptine, cabergoline) for prolactinomas. Transsphenoidal surgical resection for most others. Radiation for residual or recurrent disease.',
    prognosis: 'Excellent. Most pituitary adenomas are curable with surgery or medication. Recurrence rates are low with appropriate follow-up.',
  },
  {
    name: 'No Tumor',
    color: '#10b981',
    severity: 'CLEAR',
    freq: 'Normal finding',
    description: 'No abnormal mass or lesion detected in the MRI scan. Both the binary and tumor classifier models confirm normal brain tissue architecture with no evidence of neoplastic growth.',
    symptoms: ['No tumor-related symptoms expected', 'Normal cognitive function', 'Regular brain tissue signal on MRI'],
    types: 'Scan may still show benign incidental findings (e.g., arachnoid cysts, normal variants) that are non-pathological and require no treatment.',
    treatment: 'No treatment required. If symptoms persist, further clinical evaluation with a neurologist is recommended.',
    prognosis: 'Normal life expectancy. Routine follow-up is advisable if symptoms led to the scan.',
  },
]

function StatCard({ value, label, color = '#4f8ef7' }) {
  return (
    <div className="result-card text-center py-5">
      <p className="font-display font-800 text-3xl mb-1" style={{ color, textShadow: `0 0 20px ${color}50` }}>
        {value}
      </p>
      <p className="text-slate-500 text-xs font-body">{label}</p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-16">
      <NeuralBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="tag text-xs mb-4 inline-flex">
            <Brain className="w-3 h-3" />
            Technical Overview
          </span>
          <h1 className="font-display font-800 text-4xl sm:text-5xl mb-5">
            How It Works
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            NeuraScan uses a two-stage deep learning pipeline to detect and classify brain tumors
            from MRI images, with Grad-CAM visualization for interpretability.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
        >
          {[
            { value: '100%', label: 'Binary Accuracy', color: '#10b981' },
            { value: '97%',  label: 'Tumor Accuracy',  color: '#3b82f6' },
            { value: '4',    label: 'Tumor Classes',   color: '#8b5cf6' },
            { value: 'ResNet', label: 'Architecture',  color: '#f59e0b' },
          ].map(s => (
            <motion.div key={s.label} variants={fadeUp}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Models */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display font-700 text-2xl mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-DEFAULT" strokeWidth={1.5} />
            Model Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {models.map((m) => (
              <div
                key={m.name}
                className="result-card"
                style={{ borderColor: `${m.color}25` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-700 text-base mb-0.5" style={{ color: m.color }}>
                      {m.name}
                    </h3>
                    <span className="tag text-xs">{m.arch}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-800 text-2xl" style={{ color: m.color }}>
                      {m.accuracy}
                    </p>
                    <p className="text-slate-600 text-xs">accuracy</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Task</span>
                    <span className="text-slate-300 font-mono text-xs">{m.task}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Output classes</span>
                    <span className="text-slate-300 font-mono">{m.classes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Input size</span>
                    <span className="text-slate-300 font-mono">224 × 224</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pretrained</span>
                    <span className="text-slate-300 font-mono">ImageNet</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Pipeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display font-700 text-2xl mb-6 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-DEFAULT" strokeWidth={1.5} />
            Inference Pipeline
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-cyan-DEFAULT/40 via-border to-transparent hidden sm:block" />

            <div className="space-y-4">
              {pipeline.map(({ step, title, desc, icon: Icon, color }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 items-start"
                >
                  {/* Step dot */}
                  <div
                    className="relative w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center z-10"
                    style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="result-card flex-1 py-4 px-5">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-mono text-xs" style={{ color }}>{step}</span>
                      <h3 className="font-display font-600 text-sm text-slate-200">{title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* What is Grad-CAM */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display font-700 text-2xl mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-DEFAULT" strokeWidth={1.5} />
            What is Grad-CAM?
          </h2>
          <div className="glass-bright rounded-2xl p-8">
            <p className="text-slate-300 text-base leading-relaxed mb-5">
              <strong className="text-cyan-DEFAULT">Gradient-weighted Class Activation Mapping (Grad-CAM)</strong> is
              an explainability technique that produces a visual heatmap showing which regions of the input image
              the neural network "looked at" when making its prediction.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              It works by computing the gradients of the class score with respect to the feature maps
              in the final convolutional layer. These gradients are globally averaged to obtain
              importance weights, which are then used to create a weighted combination of the feature maps.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Red regions', desc: 'High activation — most influential to the prediction', color: '#ff3355' },
                { label: 'Yellow/Green', desc: 'Moderate activation — some influence', color: '#ffaa00' },
                { label: 'Blue regions', desc: 'Low activation — minimal influence on result', color: '#0066ff' },
              ].map(({ label, desc, color }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${color}0a`, border: `1px solid ${color}25` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="font-display font-600 text-sm" style={{ color }}>{label}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tumor types detail */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display font-700 text-2xl mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-DEFAULT" strokeWidth={1.5} />
            Tumor Types
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {tumorDetails.map(({ name, color, severity, freq, description, symptoms, types, treatment, prognosis }) => (
              <motion.div
                key={name}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
                className="result-card"
                style={{ borderColor: `${color}25` }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <h3 className="font-display font-700 text-lg" style={{ color }}>{name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color, backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
                    {severity}
                  </span>
                  <span className="ml-auto text-xs text-slate-500 font-mono">{freq}</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4">{description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Symptoms */}
                  <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                    <h4 className="font-display font-600 text-xs mb-2.5" style={{ color }}>Common Symptoms</h4>
                    <ul className="space-y-1.5">
                      {symptoms.map(s => (
                        <li key={s} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment & Prognosis */}
                  <div className="space-y-3">
                    <div className="rounded-xl p-3" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                      <h4 className="font-display font-600 text-xs mb-1.5" style={{ color }}>Classification</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{types}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                      <h4 className="font-display font-600 text-xs mb-1.5" style={{ color }}>Treatment</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{treatment}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                      <h4 className="font-display font-600 text-xs mb-1.5" style={{ color }}>Prognosis</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{prognosis}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  )
}
