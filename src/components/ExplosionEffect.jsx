import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

function ExplosionEffect({ onReveal }) {
  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  });

  useEffect(() => {
    // Rich realistic celebration colors (golden foil, bronze, emerald, royal ruby)
    const realisticColors = ['#FFD700', '#FFA500', '#FF8C00', '#F59E0B', '#E11D48', '#10B981', '#FFFFFF'];

    // 1. Center high-velocity explosion
    try {
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.45 },
        colors: realisticColors,
        startVelocity: 55,
        gravity: 0.85,
        scalar: 1.2,
      });
    } catch (e) {}

    // 2. Dual cannon blast from sides
    const t1 = setTimeout(() => {
      try {
        confetti({ particleCount: 90, angle: 60, spread: 80, origin: { x: 0.05, y: 0.6 }, colors: realisticColors, startVelocity: 50 });
        confetti({ particleCount: 90, angle: 120, spread: 80, origin: { x: 0.95, y: 0.6 }, colors: realisticColors, startVelocity: 50 });
      } catch (e) {}
    }, 200);

    // 3. Guaranteed transition to Winner Reveal after 1.2s
    const revealTimer = setTimeout(() => {
      onRevealRef.current?.();
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div
      onClick={() => onRevealRef.current?.()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(45,15,60,0.96) 0%, rgba(9,8,23,0.99) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      title="Click to reveal immediately"
    >
      {/* Volumetric Optical Shockwaves */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 4.8, opacity: 0 }}
          transition={{ duration: 0.85, delay: i * 0.12, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            border: `4px solid ${['#FFE7A0', '#FFC857', '#FF8A24'][i]}`,
            boxShadow: `0 0 40px ${['#FFC857', '#FF8A24', '#E11D48'][i]}`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Center Cinematic Flash Flare */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ textAlign: 'center', userSelect: 'none', position: 'relative', zIndex: 10 }}
      >
        <div style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontWeight: 900,
          fontSize: 'clamp(54px, 12vw, 120px)',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 30%, #F59E0B 70%, #D97706 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 50px rgba(255,200,87,0.95))',
          lineHeight: 1,
          letterSpacing: '0.08em',
        }}>
          DETONATION!
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: '#FFE7A0',
            fontSize: 'clamp(14px, 2vw, 20px)',
            marginTop: '24px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 700,
            textShadow: '0 0 20px rgba(255,200,87,0.8)',
          }}
        >
          SELECTING WINNER VIA CRYPTO-RANDOM...
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ExplosionEffect;
