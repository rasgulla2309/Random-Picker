import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTDOWN_MESSAGES = {
  3: { text: 'THREE', color: '#EF4444' },
  2: { text: 'TWO', color: '#F59E0B' },
  1: { text: 'ONE', color: '#10B981' },
};

function Countdown({ seconds = 3, onComplete, onCountdownTick, speedMultiplier = 1 }) {
  const [current, setCurrent] = useState(seconds);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const onCountdownTickRef = useRef(onCountdownTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onCountdownTickRef.current = onCountdownTick;
  });

  const duration = Math.max(400, (1000 / speedMultiplier));

  useEffect(() => {
    // Start countdown after short fuse ignite delay
    const startTimer = setTimeout(() => {
      onCountdownTickRef.current?.(seconds);
      
      intervalRef.current = setInterval(() => {
        setCurrent(prev => {
          const next = prev - 1;
          if (next > 0) {
            onCountdownTickRef.current?.(next);
            return next;
          } else {
            clearInterval(intervalRef.current);
            // Immediately trigger explosion when countdown finishes
            onCompleteRef.current?.();
            return 0;
          }
        });
      }, duration);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [seconds, duration]);

  const info = COUNTDOWN_MESSAGES[current] || { text: 'GET READY', color: '#FFC857' };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(ellipse at center, rgba(30,15,60,0.96) 0%, rgba(9,8,23,0.98) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      zIndex: 50,
      padding: '24px',
    }}>
      {/* Animated sparkling fuse progress bar */}
      <div style={{ marginBottom: '40px', width: '100%', maxWidth: '360px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: '#FF8A24', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            🔥 FUSE BURNING...
          </span>
          <span style={{ fontSize: '12px', color: '#B8B2CC' }}>{current}s remaining</span>
        </div>
        <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: (seconds + 0.5) / speedMultiplier, ease: 'linear' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FF3B30, #FF8A24, #FFC857)',
              borderRadius: '6px',
            }}
          />
        </div>
      </div>

      {/* Countdown Number with cinematic scale */}
      <AnimatePresence mode="wait">
        {current > 0 && (
          <motion.div
            key={current}
            initial={{ scale: 2.2, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.4, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 14, stiffness: 220 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: 'clamp(120px, 22vw, 220px)',
              fontFamily: 'Cinzel, Georgia, serif',
              fontWeight: 900,
              color: info.color,
              lineHeight: 0.9,
              textShadow: `0 0 50px ${info.color}90, 0 0 100px ${info.color}50`,
              userSelect: 'none',
            }}>
              {current}
            </div>
            <div style={{
              fontSize: 'clamp(20px, 4vw, 36px)',
              color: info.color,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontFamily: 'Cinzel, Georgia, serif',
              fontWeight: 700,
              opacity: 0.9,
              marginTop: '12px',
              textShadow: `0 0 20px ${info.color}80`,
            }}>
              {info.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button for teacher convenience */}
      <button
        onClick={() => onCompleteRef.current?.()}
        className="btn-ghost"
        style={{
          marginTop: '48px',
          fontSize: '13px',
          padding: '8px 20px',
          opacity: 0.7,
        }}
      >
        Skip Countdown ⚡
      </button>
    </div>
  );
}

export default Countdown;
