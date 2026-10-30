import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Maximize, Minimize, Settings } from 'lucide-react';

function Navbar({ settings, onToggleSound, onToggleMusic, onToggleFullscreen, isFullscreen, onOpenSettings }) {
  return (
    <header style={{
      width: '100%',
      maxWidth: '1440px',
      margin: '8px auto 10px',
      padding: '0 16px',
      flexShrink: 0,
    }}>
      <div className="white-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px',
        gap: '12px',
      }}>
        {/* Left: Green Diya Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Diya SVG Icon from Mockup */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#e8f5ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 36 36" width="24" height="24">
              {/* Flame */}
              <path
                d="M 18 5 C 16 11, 14 14, 14 17 C 14 20, 16 22, 18 22 C 20 22, 22 20, 22 17 C 22 14, 20 11, 18 5 Z"
                fill="#F59E0B"
              />
              <path
                d="M 18 9 C 17 13, 16 15, 16 17 C 16 19, 17 20, 18 20 C 19 20, 20 19, 20 17 C 20 15, 19 13, 18 9 Z"
                fill="#FEF08A"
              />
              {/* Green Diya Bowl */}
              <path
                d="M 8 20 C 8 27, 28 27, 28 20 Q 24 25, 18 25 Q 12 25, 8 20 Z"
                fill="#15803D"
              />
              <ellipse cx="18" cy="20" rx="10" ry="2.5" fill="#16A34A" />
            </svg>
          </div>

          <div>
            <div style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontWeight: 900,
              fontSize: '18px',
              color: '#15803D',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
            }}>
              RANDOM PICKER
            </div>
            <div style={{
              fontSize: '9px',
              color: '#64748B',
              letterSpacing: '0.12em',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginTop: '1px',
            }}>
              THE ULTIMATE CLASSROOM CHALLENGE
            </div>
          </div>
        </div>

        {/* Right Controls: Pill Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onToggleSound}
            className="btn-nav-pill"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            title="Toggle Sound Effects"
          >
            {settings.soundEffects ? <Volume2 size={14} color="#15803D" /> : <VolumeX size={14} color="#94A3B8" />}
            <span>{settings.soundEffects ? 'Sound On' : 'Sound Off'}</span>
          </button>

          <button
            onClick={onToggleMusic}
            className="btn-nav-pill"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            title="Toggle Background Music"
          >
            <Music size={14} color={settings.backgroundMusic ? '#15803D' : '#94A3B8'} />
            <span>{settings.backgroundMusic ? 'Music On' : 'Music Off'}</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="btn-nav-pill"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            <span>Fullscreen</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="btn-nav-pill"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            title="Open Settings"
          >
            <Settings size={14} color="#15803D" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
