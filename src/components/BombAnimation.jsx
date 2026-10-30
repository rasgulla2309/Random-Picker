import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Realistic Royal Brass & Lacquer Pyrotechnic Cylinder Shell
export function RealisticPyrotechnicShell({ isFuseActive }) {
  return (
    <svg viewBox="0 0 240 320" style={{ height: '100%', width: 'auto', maxHeight: '270px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
      <defs>
        {/* Deep Imperial Crimson Lacquer with Cylindrical Lighting */}
        <linearGradient id="crimsonLacquer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4C0519" />
          <stop offset="15%" stopColor="#9F1239" />
          <stop offset="45%" stopColor="#E11D48" />
          <stop offset="70%" stopColor="#9F1239" />
          <stop offset="100%" stopColor="#2A020B" />
        </linearGradient>

        {/* Polished Solid Brass */}
        <linearGradient id="polishedBrass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="25%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        {/* Braided Natural Jute Fuse */}
        <linearGradient id="juteFuse" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="50%" stopColor="#A16207" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        {/* Specular Surface Glare */}
        <linearGradient id="specularGlare" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <radialGradient id="fuseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="rgba(234,88,12,0)" />
        </radialGradient>
      </defs>

      {/* Ground Pedestal Shadow */}
      <ellipse cx="120" cy="305" rx="90" ry="14" fill="rgba(0,0,0,0.75)" filter="blur(6px)" />
      <ellipse cx="120" cy="302" rx="75" ry="8" fill="rgba(255,138,36,0.15)" />

      {/* Heavy Brass Bottom Pedestal Ring */}
      <ellipse cx="120" cy="285" rx="72" ry="14" fill="url(#polishedBrass)" />
      <rect x="48" y="275" width="144" height="12" fill="url(#polishedBrass)" />
      <ellipse cx="120" cy="275" rx="72" ry="12" fill="#B45309" />

      {/* Main Crimson Shell Cylinder */}
      <rect x="52" y="105" width="136" height="170" fill="url(#crimsonLacquer)" />
      <rect x="52" y="105" width="136" height="170" fill="url(#specularGlare)" />

      {/* Royal Gold Filigree Bands */}
      <rect x="52" y="125" width="136" height="16" fill="url(#polishedBrass)" />
      <rect x="52" y="240" width="136" height="16" fill="url(#polishedBrass)" />

      {/* Geometric Brass Embossed Medallion in Center */}
      <circle cx="120" cy="190" r="32" fill="url(#polishedBrass)" />
      <circle cx="120" cy="190" r="28" fill="#4C0519" />
      <circle cx="120" cy="190" r="24" fill="url(#polishedBrass)" />
      <circle cx="120" cy="190" r="14" fill="#9F1239" />
      <circle cx="120" cy="190" r="4" fill="#FDE68A" />

      {/* Subtle Filigree Inscription Marks */}
      <line x1="70" y1="155" x2="170" y2="155" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 3" />
      <line x1="70" y1="225" x2="170" y2="225" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 3" />

      {/* Upper Brass Collar */}
      <ellipse cx="120" cy="105" rx="68" ry="14" fill="url(#polishedBrass)" />
      <rect x="72" y="80" width="96" height="26" fill="url(#polishedBrass)" />
      <ellipse cx="120" cy="80" rx="48" ry="10" fill="#78350F" />

      {/* Brass Nozzle Chamber */}
      <ellipse cx="120" cy="70" rx="30" ry="7" fill="url(#polishedBrass)" />
      <rect x="100" y="52" width="40" height="18" fill="url(#polishedBrass)" />
      <ellipse cx="120" cy="52" rx="20" ry="6" fill="#1C1917" />

      {/* Natural Braided Jute Fuse Rope */}
      <path
        d="M 120 52 C 140 32, 105 18, 120 4"
        stroke="url(#juteFuse)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Texture weaves on fuse */}
      <path
        d="M 120 52 C 140 32, 105 18, 120 4"
        stroke="#FEF08A"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Incandescent Sparking Fuse Tip */}
      {isFuseActive ? (
        <g>
          {/* Outer Heat Aura */}
          <circle cx="120" cy="4" r="28" fill="url(#fuseGlow)" opacity="0.85" />
          {/* Core White-Hot Embers */}
          <circle cx="120" cy="4" r="5" fill="#FFFFFF" />
          <circle cx="120" cy="4" r="8" fill="#FDE047" opacity="0.9" />

          {/* Micro pyrotechnic sparks */}
          {[
            { dx: -12, dy: -10, r: 2 },
            { dx: 14, dy: -8, r: 1.8 },
            { dx: -6, dy: 14, r: 1.5 },
            { dx: 18, dy: 6, r: 2.2 },
            { dx: -16, dy: 2, r: 1.4 },
          ].map((spark, idx) => (
            <circle
              key={idx}
              cx={120 + spark.dx}
              cy={4 + spark.dy}
              r={spark.r}
              fill="#FFA500"
              opacity="0.95"
            />
          ))}
        </g>
      ) : (
        <circle cx="120" cy="4" r="3.5" fill="#44403C" />
      )}
    </svg>
  );
}

function BombAnimation({ eligibleCount, onLightFuse, onSkip }) {
  const [phase, setPhase] = useState('transform');

  React.useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px',
      minHeight: 'calc(100vh - 140px)',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        <div style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontSize: 'clamp(24px, 4vw, 42px)',
          color: '#FFC857',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 900,
          textShadow: '0 0 30px rgba(255,200,87,0.5)',
          marginBottom: '8px',
        }}>
          WHO WILL BE THE LUCKY ONE?
        </div>
        <div style={{
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: '#C7C2DC',
          background: 'rgba(255,200,87,0.08)',
          padding: '8px 24px',
          borderRadius: '24px',
          display: 'inline-block',
          border: '1px solid rgba(255,200,87,0.25)',
        }}>
          🎯 <span style={{ color: '#FFC857', fontWeight: 700 }}>{eligibleCount}</span> eligible students ready in the draw pool
        </div>
      </motion.div>

      {/* Realistic Pyrotechnic Shell */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 120 }}
        style={{ position: 'relative', marginBottom: '24px' }}
      >
        {/* Soft Ambient Radial Heat Aura */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '-25px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,138,36,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={phase === 'ready' ? { y: [0, -8, 0] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <RealisticPyrotechnicShell isFuseActive={phase === 'ready'} />
        </motion.div>
      </motion.div>

      {/* Action Controls */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                fontSize: '14px',
                color: '#FF8A24',
                marginBottom: '16px',
                letterSpacing: '0.15em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              🔥 JUTE FUSE READY • IGNITE TO SELECT 🔥
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold"
                style={{
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  padding: '20px 64px',
                  borderRadius: '24px',
                  letterSpacing: '0.08em',
                  boxShadow: '0 10px 40px rgba(255,138,36,0.6)',
                }}
                onClick={onLightFuse}
              >
                🔥 LIGHT THE FUSE
              </motion.button>
              <button
                className="btn-ghost"
                style={{ fontSize: '14px', padding: '10px 28px', opacity: 0.8 }}
                onClick={onSkip}
              >
                ⚡ Instant Winner (Skip Animation)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BombAnimation;
