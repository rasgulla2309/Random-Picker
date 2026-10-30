import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getStudentEmoji } from '../utils/nameEmoji';

// Photorealistic Polished 24K Championship Trophy (Scalable)
function RealisticTrophy({ width = 100, height = 110 }) {
  return (
    <svg viewBox="0 0 160 180" width={width} height={height} style={{ filter: 'drop-shadow(0 14px 30px rgba(22, 163, 74, 0.22))' }}>
      <defs>
        <linearGradient id="realGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="20%" stopColor="#D97706" />
          <stop offset="45%" stopColor="#FEF08A" />
          <stop offset="55%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        <linearGradient id="marblePedestal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="35%" stopColor="#334155" />
          <stop offset="70%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="trophySpecular" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Heavy Obsidian / Black Marble Pedestal */}
      <rect x="25" y="152" width="110" height="18" rx="4" fill="url(#marblePedestal)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <rect x="35" y="142" width="90" height="12" rx="3" fill="url(#marblePedestal)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Gold Plaque on Pedestal */}
      <rect x="48" y="155" width="64" height="12" rx="2" fill="url(#realGold)" />
      <line x1="52" y1="161" x2="108" y2="161" stroke="#451A03" strokeWidth="1" />

      {/* Polished Gold Stem */}
      <rect x="68" y="112" width="24" height="32" rx="4" fill="url(#realGold)" />
      <ellipse cx="80" cy="112" rx="18" ry="6" fill="#FDE047" />

      {/* Classical Cup Chalice */}
      <path
        d="M 32 30 Q 20 70 34 105 Q 52 122 80 122 Q 108 122 126 105 Q 140 70 128 30 Z"
        fill="url(#realGold)"
      />

      {/* Cup Rim Highlight */}
      <ellipse cx="80" cy="30" rx="48" ry="10" fill="url(#realGold)" />
      <ellipse cx="80" cy="28" rx="42" ry="7" fill="#FEF08A" opacity="0.8" />

      {/* Specular Ray Reflection */}
      <path
        d="M 44 36 Q 36 70 45 98"
        stroke="url(#trophySpecular)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Heavy Cast Sculpted Handles */}
      <path
        d="M 32 40 C 10 50, 10 85, 32 95 C 22 85, 22 55, 32 40 Z"
        fill="url(#realGold)"
      />
      <path
        d="M 128 40 C 150 50, 150 85, 128 95 C 138 85, 138 55, 128 40 Z"
        fill="url(#realGold)"
      />

      {/* Embossed Royal Star Medallion */}
      <circle cx="80" cy="74" r="18" fill="#B45309" stroke="#FEF08A" strokeWidth="1.5" />
      <circle cx="80" cy="74" r="15" fill="url(#realGold)" />
      <text x="80" y="80" textAnchor="middle" fill="#78350F" fontSize="16" fontWeight="900">★</text>
    </svg>
  );
}

function WinnerReveal({ winner, roundNumber, remainingCount, totalCount, settings, onPickNext, onViewHistory, onHome, playWinner, announce }) {
  const emoji = winner ? getStudentEmoji(winner.name, winner.serialNo) : '🎓';

  useEffect(() => {
    playWinner?.();

    if (settings?.voiceAnnouncement && winner?.name) {
      const voiceTimer = setTimeout(() => {
        announce?.(winner.name, settings.announcementLanguage || 'hinglish');
      }, 900);
      return () => clearTimeout(voiceTimer);
    }
  }, [winner, settings?.voiceAnnouncement, settings?.announcementLanguage, playWinner, announce]);

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.35 },
        colors: ['#16a34a', '#22c55e', '#eab308', '#f59e0b', '#3b82f6', '#dcfce7'],
        startVelocity: 55,
        gravity: 0.85,
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#22c55e', '#eab308', '#ffffff'],
        });
      }, 500);
      return () => clearTimeout(timer);
    } catch (e) {}
  }, []);

  if (!winner) return null;

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 16px',
      textAlign: 'center',
      position: 'relative',
      width: '100%',
    }}>
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '860px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            color: '#15803D',
            fontSize: 'clamp(13px, 1.6vw, 18px)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontFamily: 'Cinzel, Georgia, serif',
            fontWeight: 800,
          }}
        >
          ✨ AND THE LUCKY STUDENT IS... ✨
        </motion.div>

        {/* 3D Gold Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 140, delay: 0.12 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}
        >
          <RealisticTrophy width={92} height={100} />
        </motion.div>

        {/* WINNER CARD - Crisp White Glass with Emerald Green Border */}
        <motion.div
          className="winner-entrance white-card"
          style={{
            margin: '0 auto 8px',
            padding: '12px 28px',
            border: '2px solid #bbf7d0',
            boxShadow: '0 10px 30px rgba(22, 163, 74, 0.14)',
            maxWidth: '780px',
            width: '100%',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '4px',
          }}>
            <span style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', flexShrink: 0 }}>{emoji}</span>
            <div
              style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontWeight: 900,
                fontSize: 'clamp(28px, 4.8vw, 54px)',
                lineHeight: 1.15,
                color: '#15803D',
                wordBreak: 'break-word',
              }}
              className="winner-pulse"
            >
              {winner.name.toUpperCase()}
            </div>
          </div>

          <div style={{
            fontSize: '12px',
            color: '#64748b',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Roll / Serial #{winner.serialNo}
          </div>
        </motion.div>

        {/* Motivational Cheer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: 'clamp(13px, 1.8vw, 17px)',
            color: '#16a34a',
            marginBottom: '10px',
            fontWeight: 800,
            letterSpacing: '0.03em',
          }}
        >
          🌟 CONGRATULATIONS! IT'S YOUR TURN TO SHINE! 🌟
        </motion.div>

        {/* Live Counters Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '12px',
            width: '100%',
            maxWidth: '680px',
          }}
        >
          <div className="white-card" style={{ padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d', lineHeight: 1.1 }}>{winner.serialNo}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Roll No</div>
          </div>
          <div className="white-card" style={{ padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#eab308', lineHeight: 1.1 }}>{roundNumber - 1}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Round</div>
          </div>
          <div className="white-card" style={{ padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#16a34a', lineHeight: 1.1 }}>{remainingCount}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Remaining</div>
          </div>
          <div className="white-card" style={{ padding: '6px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#334155', lineHeight: 1.1 }}>{totalCount}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Class</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {remainingCount > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-green-pill"
              style={{
                fontSize: '14px',
                padding: '10px 32px',
                borderRadius: '24px',
              }}
              onClick={onPickNext}
            >
              <span>🎯 PICK NEXT STUDENT</span>
            </motion.button>
          ) : (
            <div style={{
              padding: '10px 24px',
              borderRadius: '20px',
              background: '#dcfce7',
              border: '2px solid #86efac',
              color: '#15803d',
              fontWeight: 800,
              fontSize: '14px',
            }}>
              🎉 ALL STUDENTS HAVE HAD THEIR TURN!
            </div>
          )}

          <button
            className="btn-nav-pill"
            style={{ fontSize: '12px', padding: '9px 18px', borderRadius: '20px' }}
            onClick={onViewHistory}
          >
            📜 View History
          </button>
          <button
            className="btn-nav-pill"
            style={{ fontSize: '12px', padding: '9px 18px', borderRadius: '20px' }}
            onClick={onHome}
          >
            🏠 Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default WinnerReveal;
