import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Activity, Info, Clock, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home', icon: Activity },
  { href: '/scan', label: 'Scan', icon: Brain },
  { href: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-cyan-DEFAULT/20 group-hover:bg-cyan-DEFAULT/30 transition-colors" />
            <Brain className="w-8 h-8 text-cyan-DEFAULT relative z-10 p-1" strokeWidth={1.5} />
          </div>
          <span className="font-display font-700 text-lg tracking-tight">
            Neura<span className="text-cyan-DEFAULT">Scan</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = location.pathname === href
            return (
              <Link
                key={href}
                to={href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-200 ${
                  active
                    ? 'text-cyan-DEFAULT bg-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-DEFAULT"
                    style={{ borderRadius: 1 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/scan"
            className="btn-primary text-sm py-2 px-5 font-display font-600"
            style={{ color: '#050810' }}
          >
            New Scan
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-slate-200"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/60 bg-abyss"
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  location.pathname === href
                    ? 'text-cyan-DEFAULT bg-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
            <Link
              to="/scan"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-sm text-center mt-2"
              style={{ color: '#ffffff' }}
            >
              New Scan
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
