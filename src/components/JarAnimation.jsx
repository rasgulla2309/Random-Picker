import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Realistic folded parchment colors (authentic paper tones with slight tints)
const PAPER_TONES = [
  { bg: '#FDFBF7', border: '#E2D9C8', text: '#292524' }, // Pure Parchment
  { bg: '#FEF9C3', border: '#EAB308', text: '#713F12' }, // Golden Parchment
  { bg: '#FFEDD5', border: '#FB923C', text: '#7C2D12' }, // Amber Tinted
  { bg: '#F1F5F9', border: '#94A3B8', text: '#0F172A' }, // Crisp White
  { bg: '#EDE9FE', border: '#A78BFA', text: '#4C1D95' }, // Regal Violet Tint
  { bg: '#DCFCE7', border: '#4ADE80', text: '#14532D' }, // Jade Tint
];

// Realistic 3D Optical Glass Jar Component
function RealisticGlassJar({ fillPercent = 0, slipCount = 0 }) {
  return (
    <svg viewBox="0 0 280 360" width="280" height="360" style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.65))' }}>
      <defs>
        {/* Realistic Polished Brass & Gold Gradients */}
        <linearGradient id="realBrass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#784A0E" />
          <stop offset="20%" stopColor="#D97706" />
          <stop offset="40%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        <linearGradient id="brassBevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#B45309" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#451A03" stopOpacity="0.9" />
        </linearGradient>

        {/* Realistic Multilayer Optical Glass */}
        <linearGradient id="glassWall" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="4%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="15%" stopColor="rgba(216,231,255,0.04)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.01)" />
          <stop offset="85%" stopColor="rgba(216,231,255,0.04)" />
          <stop offset="96%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.45)" />
        </linearGradient>

        {/* Ambient Interior Depth */}
        <linearGradient id="jarDepth" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(20,15,40,0.2)" />
          <stop offset="100%" stopColor="rgba(10,5,25,0.4)" />
        </linearGradient>

        {/* Caustic Bottom Light */}
        <radialGradient id="causticPool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,200,87,0.3)" />
          <stop offset="60%" stopColor="rgba(139,92,246,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        <clipPath id="realisticJarInterior">
          <path d="M 50 82 Q 40 330 140 330 Q 240 330 230 82 Z" />
        </clipPath>
      </defs>

      {/* Surface Ground Shadow */}
      <ellipse cx="140" cy="340" rx="100" ry="16" fill="rgba(0,0,0,0.7)" filter="blur(8px)" />
      <ellipse cx="140" cy="336" rx="85" ry="10" fill="url(#causticPool)" />

      {/* Jar Interior Shadow & Base */}
      <path d="M 50 82 Q 40 330 140 330 Q 240 330 230 82 Z" fill="url(#jarDepth)" />

      {/* Realistic Chits inside the Jar */}
      {slipCount > 0 && (
        <g clipPath="url(#realisticJarInterior)">
          {Array.from({ length: Math.min(slipCount, 32) }).map((_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const x = 70 + col * 25 + (row % 2 === 0 ? 0 : 12);
            const y = 310 - row * 22;
            const tone = PAPER_TONES[i % PAPER_TONES.length];
            const rot = ((i * 37) % 50) - 25;

            return (
              <g key={i} transform={`translate(${x}, ${y}) rotate(${rot})`}>
                {/* Chit Shadow */}
                <rect x="-13" y="-7" width="26" height="15" rx="2" fill="rgba(0,0,0,0.35)" filter="blur(2px)" />
                {/* Folded Paper Chit */}
                <rect x="-14" y="-8" width="28" height="16" rx="2" fill={tone.bg} stroke={tone.border} strokeWidth="1" />
                {/* Paper Fold Crease Line */}
                <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                <line x1="-8" y1="-8" x2="-8" y2="8" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
              </g>
            );
          })}
        </g>
      )}

      {/* Outer Curved Optical Glass Surface */}
      <path
        d="M 50 82 Q 40 330 140 330 Q 240 330 230 82 Z"
        fill="url(#glassWall)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2.5"
      />

      {/* Primary Left Specular Highlight (Linear Reflection along curvature) */}
      <path
        d="M 64 96 Q 54 280 72 315"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 80 92 Q 74 240 86 300"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Secondary Right Fresnel Rim Light */}
      <path
        d="M 218 96 Q 226 280 208 315"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Thick Solid Glass Base Ring */}
      <path
        d="M 62 318 Q 140 336 218 318 Q 140 326 62 318 Z"
        fill="rgba(255,255,255,0.25)"
      />

      {/* Glass Neck Collar */}
      <rect x="65" y="58" width="150" height="26" rx="8" fill="url(#glassWall)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M 72 64 L 72 78" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />

      {/* Polished Heavy Brass Lid */}
      {/* Lower Lid Bevel */}
      <ellipse cx="140" cy="58" rx="82" ry="14" fill="url(#realBrass)" />
      <ellipse cx="140" cy="58" rx="82" ry="14" fill="url(#brassBevel)" />
      
      {/* Main Cap Cylinder */}
      <rect x="58" y="32" width="164" height="22" fill="url(#realBrass)" />
      <rect x="58" y="32" width="164" height="22" fill="url(#brassBevel)" />

      {/* Engraved Knurled Grips on Cap */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(idx => (
        <line
          key={idx}
          x1={68 + idx * 12}
          y1="34"
          x2={68 + idx * 12}
          y2="52"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1.5"
        />
      ))}

      {/* Top Cap Dome */}
      <ellipse cx="140" cy="32" rx="82" ry="14" fill="url(#realBrass)" />
      <ellipse cx="140" cy="30" rx="76" ry="10" fill="#FEF3C7" opacity="0.6" />

      {/* Solid Brass Top Knob Handle */}
      <ellipse cx="140" cy="20" rx="28" ry="8" fill="url(#realBrass)" />
      <ellipse cx="140" cy="18" rx="22" ry="6" fill="#FEF3C7" opacity="0.75" />
    </svg>
  );
}

function JarAnimation({ students, eligibleStudents, onComplete }) {
  const [phase, setPhase] = useState('initial');
  const [packedCount, setPackedCount] = useState(0);
  const [flyingSlips, setFlyingSlips] = useState([]);
  const totalEligible = eligibleStudents.length;
  const timerRef = useRef(null);

  const startPacking = () => {
    setPhase('packing');
    const slips = eligibleStudents.slice(0, Math.min(eligibleStudents.length, 50)).map((s, i) => {
      const tone = PAPER_TONES[i % PAPER_TONES.length];
      return {
        id: s.id,
        name: s.name,
        bg: tone.bg,
        border: tone.border,
        color: tone.text,
        delay: i * 35,
        startX: (Math.random() * 80 - 40) + '%',
        startY: (Math.random() * 60 + 10) + '%',
      };
    });
    setFlyingSlips(slips);

    let count = 0;
    const interval = setInterval(() => {
      count += Math.ceil(totalEligible / 35);
      setPackedCount(Math.min(count, totalEligible));
      if (count >= totalEligible) {
        clearInterval(interval);
        setTimeout(() => setPhase('packed'), 600);
      }
    }, 60);
    timerRef.current = interval;
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fillPercent = Math.round((packedCount / Math.max(1, totalEligible)) * 100);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 20px',
      position: 'relative',
      minHeight: 'calc(100vh - 140px)',
      justifyContent: 'center',
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '24px' }}
      >
        <h2 style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          fontWeight: 900,
          marginBottom: '8px',
        }} className="gradient-text">
          CRYSTAL GLASS JAR
        </h2>
        <p style={{ color: '#C7C2DC', fontSize: '16px' }}>
          {phase === 'packed'
            ? '✨ All student name chits are securely sealed inside the glass chamber!'
            : `${totalEligible} authentic folded chits ready to be deposited`}
        </p>
      </motion.div>

      {/* Flying realistic folded paper chits */}
      <AnimatePresence>
        {phase === 'packing' && flyingSlips.map((slip) => (
          <motion.div
            key={slip.id}
            initial={{ opacity: 1, left: slip.startX, top: slip.startY, scale: 1, rotate: Math.random() * 40 - 20 }}
            animate={{ opacity: 0, left: '50%', top: '48%', scale: 0.25, rotate: Math.random() * 360 }}
            transition={{ duration: 0.7, delay: slip.delay / 1000, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              background: slip.bg,
              border: `1px solid ${slip.border}`,
              color: slip.color,
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              maxWidth: '130px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              zIndex: 10,
              pointerEvents: 'none',
              boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
            }}
          >
            {slip.name}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Realistic 3D Glass Jar with gentle physical settling vibration on finish */}
      <motion.div
        animate={phase === 'packed' ? { y: [0, -6, 2, -2, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 5, marginBottom: '20px' }}
      >
        <RealisticGlassJar fillPercent={fillPercent} slipCount={packedCount} />

        {/* Realistic Golden Micro-dust particles */}
        {phase === 'packed' && (
          <>
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  x: Math.cos((i / 14) * Math.PI * 2) * (110 + (i % 3) * 20),
                  y: Math.sin((i / 14) * Math.PI * 2) * (110 + (i % 3) * 20),
                }}
                transition={{ duration: 1.1, delay: i * 0.04 }}
                style={{
                  position: 'absolute',
                  top: '55%',
                  left: '50%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FFE7A0',
                  boxShadow: '0 0 12px #FFC857',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Packing Progress */}
      {phase === 'packing' && (
        <div style={{ width: '100%', maxWidth: '360px', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#B8B2CC', fontWeight: 600 }}>
            <span>Depositing chits...</span>
            <span style={{ color: '#FFC857' }}>{packedCount} / {totalEligible}</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 0.1 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #D97706, #FFC857)', borderRadius: '4px' }}
            />
          </div>
        </div>
      )}

      {/* Packed Success State */}
      <AnimatePresence>
        {phase === 'packed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', maxWidth: '640px' }}
          >
            <div style={{
              padding: '16px',
              borderRadius: '18px',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#34D399' }}>
                ✓ ALL {totalEligible} CHITS SEALED INSIDE JAR
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
              <StatPill label="Total Chits" value={totalEligible} color="#34D399" />
              <StatPill label="Eligible" value={eligibleStudents.length} color="#A78BFA" />
              <StatPill label="Excluded" value={students.length - eligibleStudents.length} color="#F87171" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold"
                style={{
                  fontSize: 'clamp(18px, 2.5vw, 22px)',
                  padding: '18px 56px',
                  borderRadius: '22px',
                  boxShadow: '0 8px 30px rgba(255,200,87,0.45)',
                }}
                onClick={onComplete}
              >
                PREPARE PYROTECHNIC SHELL ➔
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start packing button */}
      {phase === 'initial' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: '16px', textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
            style={{ fontSize: '20px', padding: '18px 52px', borderRadius: '20px' }}
            onClick={startPacking}
          >
            DEPOSIT CHITS IN JAR ({totalEligible})
          </motion.button>
          <p style={{ color: '#B8B2CC', marginTop: '12px', fontSize: '14px' }}>
            Click to drop folded parchment chits into the optical glass chamber
          </p>
        </motion.div>
      )}
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '14px 10px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 900, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#B8B2CC', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export default JarAnimation;
