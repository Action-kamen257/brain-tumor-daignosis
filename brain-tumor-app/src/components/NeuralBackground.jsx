export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div className="absolute inset-0 neural-bg" />

      {/* Grid */}
      <div className="absolute inset-0 scan-grid opacity-60" />

      {/* Floating orbs */}
      <div
        className="absolute w-96 h-96 rounded-full animate-float"
        style={{
          top: '10%',
          right: '15%',
          background: 'radial-gradient(circle, rgba(79,142,247,0.05) 0%, transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full animate-float"
        style={{
          bottom: '20%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(79,142,247,0.03) 0%, transparent 70%)',
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full animate-float"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)',
          animationDelay: '-1.5s',
        }}
      />

      {/* Subtle horizontal lines */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${15 + i * 18}%`,
            background: `linear-gradient(90deg, transparent, rgba(79,142,247,${0.02 + i * 0.004}), transparent)`,
          }}
        />
      ))}
    </div>
  )
}
