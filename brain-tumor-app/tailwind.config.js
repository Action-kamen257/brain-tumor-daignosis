/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"Fira Code"', 'monospace'],
      },
      colors: {
        // Page & section backgrounds
        void:    '#eef3fc',   // body background
        abyss:   '#ffffff',   // navbar / mobile menu
        surface: '#ffffff',   // card surface
        panel:   '#f4f7fe',   // secondary panels
        border:  '#dae2f5',   // borders

        // Override slate → dark navy text on light bg
        slate: {
          100: '#f4f7fe',
          200: '#0f1c36',  // headings
          300: '#213050',  // primary body text
          400: '#4a5d7e',  // secondary text
          500: '#8196b0',  // muted text
          600: '#b8c9de',  // very muted / labels
          700: '#d4e0ef',  // barely visible
          800: '#e8eef8',
          900: '#f2f6fd',
        },

        // Accent
        cyan: {
          DEFAULT: '#3b82f6',          // primary blue
          dim:     '#2563eb',          // hover / pressed
          glow:    'rgba(59,130,246,0.08)',
        },

        emerald: { scan: '#10b981' },
        crimson: '#ef4444',
        amber:   { warn: '#f59e0b' },
      },
      animation: {
        'scan-line':  'scanLine 5s linear infinite',
        'pulse-ring': 'pulseRing 2.5s ease-out infinite',
        'float':      'float 8s ease-in-out infinite',
        'shimmer':    'shimmer 4s linear infinite',
        'radar':      'radar 4s linear infinite',
      },
      keyframes: {
        scanLine:  { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity: '1' }, '100%': { transform: 'scale(2)', opacity: '0' } },
        float:     { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        radar:     { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
