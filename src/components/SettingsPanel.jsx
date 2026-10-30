import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, RotateCcw } from 'lucide-react';

const ANIMATION_SPEEDS = ['slow', 'normal', 'fast'];
const COUNTDOWN_OPTIONS = [3, 5, 10];
const LANGUAGES = [
  { value: 'hinglish', label: '🇮🇳 Hinglish' },
  { value: 'hindi', label: '🕉️ Hindi' },
  { value: 'english', label: '🇬🇧 English' },
];

function SettingsPanel({ isOpen, onClose, settings, onUpdate, onResetGame }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  if (!isOpen) return null;

  const toggle = (key) => onUpdate({ [key]: !settings[key] });

  const handleConfirmReset = () => {
    onResetGame?.();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: '#ffffff',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
            role="dialog"
            aria-label="Settings"
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: '#ffffff',
              zIndex: 1,
            }}>
              <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#15803d' }}>⚙️ Game Settings</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Close settings">
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Game Settings */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                  Preferences
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <ToggleRow label="No Repeat Mode" desc="Prevent selecting the same student twice" checked={settings.noRepeat} onChange={() => toggle('noRepeat')} />
                  <ToggleRow label="Sound Effects" desc="Button clicks, countdown, detonation sounds" checked={settings.soundEffects} onChange={() => toggle('soundEffects')} />
                  <ToggleRow label="Background Music" desc="Subtle festive classroom atmosphere" checked={settings.backgroundMusic} onChange={() => toggle('backgroundMusic')} />
                  <ToggleRow label="Voice Announcement" desc="Speaks winner's name via speech synthesis" checked={settings.voiceAnnouncement} onChange={() => toggle('voiceAnnouncement')} />
                  <ToggleRow label="Show Eligible & Excluded" desc="Display detailed counters next to Total Students on dashboard" checked={settings.showDetailedStats} onChange={() => toggle('showDetailedStats')} />
                </div>
              </div>

              {/* Timing */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                  Timing & Speech
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Animation Speed</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {ANIMATION_SPEEDS.map(speed => (
                        <button
                          key={speed}
                          onClick={() => onUpdate({ animationSpeed: speed })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '10px',
                            border: `1px solid ${settings.animationSpeed === speed ? '#16a34a' : '#e2e8f0'}`,
                            background: settings.animationSpeed === speed ? '#dcfce7' : '#ffffff',
                            color: settings.animationSpeed === speed ? '#15803d' : '#64748b',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                          }}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Countdown Time</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {COUNTDOWN_OPTIONS.map(secs => (
                        <button
                          key={secs}
                          onClick={() => onUpdate({ countdownSeconds: secs })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '10px',
                            border: `1px solid ${settings.countdownSeconds === secs ? '#16a34a' : '#e2e8f0'}`,
                            background: settings.countdownSeconds === secs ? '#dcfce7' : '#ffffff',
                            color: settings.countdownSeconds === secs ? '#15803d' : '#64748b',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 700,
                          }}
                        >
                          {secs}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {settings.voiceAnnouncement && (
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Announcement Language</label>
                      <select
                        value={settings.announcementLanguage}
                        onChange={e => onUpdate({ announcementLanguage: e.target.value })}
                        style={{ height: '40px', fontSize: '13px' }}
                      >
                        {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone: Reset Game & Clear All Data */}
              <div style={{
                marginTop: '10px',
                paddingTop: '20px',
                borderTop: '1px solid #fee2e2',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#dc2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <AlertTriangle size={15} color="#dc2626" />
                  Reset Game
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
                  Reset everything back to empty. All imported names, winner history, and files will be removed.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Reset Game & Clear All Data</span>
                </button>
              </div>
            </div>

            {/* Confirmation Overlay */}
            <AnimatePresence>
              {showResetConfirm && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  zIndex: 50,
                }}>
                  <div className="white-card" style={{ padding: '24px', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}>
                      <AlertTriangle size={24} color="#dc2626" />
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: '16px', marginBottom: '8px', color: '#0f172a' }}>
                      Reset Everything?
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>
                      This will remove all students, clear all rounds and winner history, and reset to an empty list.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn-nav-pill"
                        style={{ flex: 1, padding: '10px' }}
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                        onClick={handleConfirmReset}
                      >
                        Yes, Reset All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{label}</div>
        {desc && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{desc}</div>}
      </div>
      <label className="toggle-switch-green">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider-green" />
      </label>
    </div>
  );
}

export default SettingsPanel;
