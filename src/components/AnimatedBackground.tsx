'use client'
/* DraftCal — floating social platform icons + content pulse rings */
export default function AnimatedBackground() {
  const icons = ['📱', '📸', '🎬', '💬', '📊', '🔗', '✍️', '🎯', '📣', '⭐']
  const positions = [
    { x: '8%',  y: '15%', delay: '0s',   dur: '6s',  size: 22, op: 0.35 },
    { x: '88%', y: '10%', delay: '1s',   dur: '8s',  size: 18, op: 0.3  },
    { x: '5%',  y: '65%', delay: '2s',   dur: '7s',  size: 16, op: 0.25 },
    { x: '92%', y: '55%', delay: '3s',   dur: '9s',  size: 20, op: 0.3  },
    { x: '18%', y: '85%', delay: '1.5s', dur: '6.5s',size: 14, op: 0.2  },
    { x: '78%', y: '80%', delay: '2.5s', dur: '7.5s',size: 16, op: 0.22 },
    { x: '50%', y: '5%',  delay: '4s',   dur: '8.5s',size: 18, op: 0.28 },
    { x: '35%', y: '90%', delay: '0.5s', dur: '10s', size: 14, op: 0.18 },
    { x: '65%', y: '30%', delay: '3.5s', dur: '7s',  size: 12, op: 0.2  },
    { x: '22%', y: '45%', delay: '5s',   dur: '6s',  size: 14, op: 0.15 },
  ]
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Pink/fuchsia gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(236,72,153,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(168,85,247,0.12) 0%, transparent 60%)',
      }} />

      {/* Pulse rings */}
      {[
        { cx: '25%', cy: '30%', color: '#ec4899', delay: '0s' },
        { cx: '75%', cy: '60%', color: '#a855f7', delay: '2s' },
        { cx: '50%', cy: '80%', color: '#ec4899', delay: '4s' },
      ].map((ring, i) => (
        <div key={i} style={{
          position: 'absolute', left: ring.cx, top: ring.cy,
          transform: 'translate(-50%, -50%)',
        }}>
          {[1, 2, 3].map(j => (
            <div key={j} style={{
              position: 'absolute',
              width: `${j * 80}px`, height: `${j * 80}px`,
              border: `1px solid ${ring.color}`,
              borderRadius: '50%',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.15 / j,
              animation: `ping ${2 + j * 0.5}s ease-out infinite`,
              animationDelay: `${parseFloat(ring.delay) + j * 0.4}s`,
            }} />
          ))}
        </div>
      ))}

      {/* Floating icons */}
      {positions.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.x, top: p.y,
          fontSize: p.size, opacity: p.op,
          animation: `float ${p.dur} ease-in-out infinite`,
          animationDelay: p.delay,
        }}>{icons[i]}</div>
      ))}

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(236,72,153,0.2) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.25,
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)',
      }} />

      <div className="orb orb-1" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.2), rgba(168,85,247,0.1) 60%, transparent)', top: '-100px', left: '-80px' }} />
      <div className="orb orb-2" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)', bottom: '0', right: '-100px' }} />
    </div>
  )
}
