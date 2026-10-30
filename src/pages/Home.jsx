import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffects from '../components/BackgroundEffects';
import Navbar from '../components/Navbar';
import RealisticGlassJar from '../components/RealisticGlassJar';
import BombAnimation, { RealisticPyrotechnicShell } from '../components/BombAnimation';
import Countdown from '../components/Countdown';
import ExplosionEffect from '../components/ExplosionEffect';
import WinnerReveal from '../components/WinnerReveal';
import WinnerHistory from '../components/WinnerHistory';
import AdminPanel from '../components/AdminPanel';
import SettingsPanel from '../components/SettingsPanel';
import { useGameState, GAME_PHASES } from '../hooks/useGameState';
import { useFullscreen } from '../hooks/useFullscreen';
import { useAudio } from '../hooks/useAudio';
import { parseExcelFile, extractNames } from '../utils/excelParser';
import { getStudentEmoji } from '../utils/nameEmoji';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Search,
  Plus,
  Edit2,
  Check,
  X,
  Users,
  CheckCircle,
  Ban,
  Settings,
  Trophy,
  Sparkles,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export default function Home() {
  const game = useGameState();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const audio = useAudio(game.settings);

  // Search & manual student states
  const [studentSearch, setStudentSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStudentName, setEditingStudentName] = useState('');

  // Modals & drawers
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDashboardResetModal, setShowDashboardResetModal] = useState(false);

  // File upload drag state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Flying chits animation state for packing
  const [flyingChits, setFlyingChits] = useState([]);

  // Admin panel shortcut Ctrl+Shift+A
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Handle direct Excel file upload
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setUploadError('Please select a valid .xlsx, .xls, or .csv file');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    try {
      const parsed = await parseExcelFile(file);
      const firstSheet = parsed.worksheets[0];
      const rows = parsed.results[firstSheet];
      const { names, duplicates } = extractNames(rows, null);
      if (names.length === 0) {
        setUploadError('No student names found in spreadsheet.');
      } else {
        game.importStudents(names, file.name, firstSheet, duplicates);
        audio.playSuccess();
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to read file');
    } finally {
      setIsUploading(false);
    }
  }, [game, audio]);

  // Pack in jar animation sequence
  const handlePackSequence = useCallback(() => {
    const ok = game.packInJar();
    if (!ok) return;

    audio.playSuccess();
    // Generate flying chits
    const chits = game.eligibleStudents.slice(0, 30).map((s, idx) => ({
      id: s.id,
      name: s.name,
      startX: (idx % 2 === 0 ? -120 : 120) + (Math.random() * 40 - 20),
      startY: Math.random() * 200 - 100,
      delay: idx * 0.04,
    }));
    setFlyingChits(chits);

    setTimeout(() => {
      setFlyingChits([]);
      game.finishPacking();
    }, 1200);
  }, [game, audio]);

  // Light fuse / start countdown
  const handleLightFuse = useCallback(() => {
    const winner = game.startCountdown();
    if (!winner) {
      alert('No eligible students left to draw!');
      return;
    }
    audio.playFuse();
  }, [game, audio]);

  // Skip countdown
  const handleSkipAnimation = useCallback(() => {
    const winner = game.startCountdown();
    if (!winner) return;
    game.skipToWinner();
    audio.stopFuse();
  }, [game, audio]);

  // Countdown tick
  const handleCountdownTick = useCallback((num) => {
    audio.playCountdown(num);
  }, [audio]);

  // Countdown complete -> explosion
  const handleCountdownComplete = useCallback(() => {
    audio.stopFuse();
    audio.playExplosion();
    game.triggerExplosion();
  }, [game, audio]);

  // Save inline edit for student
  const handleSaveInlineEdit = (id) => {
    if (editingStudentName.trim()) {
      game.editStudent(id, editingStudentName.trim());
    }
    setEditingStudentId(null);
  };

  const speedMultiplier = { slow: 0.5, normal: 1, fast: 2 }[game.settings.animationSpeed] || 1;
  const eligibleCount = game.eligibleStudents.length;
  const excludedCount = game.excludedStudents.length;

  const filteredStudents = game.students.filter(s =>
    !studentSearch.trim() || s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f0f6f2',
      color: '#1e293b',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <BackgroundEffects />

      {/* 1. Header / Navbar matching user mockup */}
      <Navbar
        settings={game.settings}
        onToggleSound={() => game.updateSettings({ soundEffects: !game.settings.soundEffects })}
        onToggleMusic={() => game.updateSettings({ backgroundMusic: !game.settings.backgroundMusic })}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main 3-Column Grid Layout - Strictly 100vh viewport fitting (No page scrolling) */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '0 16px 8px',
        display: 'grid',
        gridTemplateColumns: 'minmax(270px, 310px) 1fr minmax(270px, 310px)',
        gap: '14px',
        flex: 1,
        minHeight: 0,
        height: 'calc(100vh - 66px)',
        overflow: 'hidden',
      }}>
        {/* ================= LEFT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: 0 }}>
          {/* Card 1: Upload Student List (Compact) */}
          <div className="white-card" style={{ padding: '12px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileSpreadsheet size={16} color="#15803D" />
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Upload Student List</h3>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />

            {game.fileName ? (
              /* Compact loaded file pill */
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: '#f0fdf4',
                borderRadius: '10px',
                border: '1px solid #bbf7d0',
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#15803D',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '12px',
                  flexShrink: 0,
                }}>
                  X
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#15803d',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {game.fileName}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    {game.students.length} students loaded
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-nav-pill"
                  style={{ padding: '4px 8px', fontSize: '10px' }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Replace with another file"
                >
                  Change
                </button>
              </div>
            ) : (
              /* Compact Drop Zone */
              <div
                className={`drop-zone-light ${isDragging ? 'drag-over' : ''}`}
                style={{
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '10px',
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                  Drag & drop Excel (.xlsx, .csv)
                </div>
                <button
                  type="button"
                  className="btn-green-pill"
                  style={{
                    fontSize: '11px',
                    padding: '5px 16px',
                    boxShadow: 'none',
                  }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Browse File
                </button>
              </div>
            )}

            {uploadError && (
              <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>
                {uploadError}
              </div>
            )}
          </div>

          {/* Card 2: Student List - Flexes to fill remaining height with internal scroll */}
          <div className="white-card" style={{
            padding: '12px 14px',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="#15803D" />
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                  Student List ({game.students.length})
                </h3>
              </div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '6px' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="search"
                placeholder="Search student..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                style={{ paddingLeft: '30px', height: '30px', fontSize: '11px' }}
              />
            </div>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 65px',
              padding: '4px 6px',
              fontSize: '10px',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <span>#</span>
              <span>Student Name</span>
              <span style={{ textAlign: 'right' }}>Status</span>
            </div>

            {/* Scrollable Student Rows - Internal Scroll Only */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '2px' }}>
              {filteredStudents.length === 0 ? (
                <div style={{ padding: '24px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  {game.students.length === 0 ? 'No students imported yet' : `No students match "${studentSearch}"`}
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const emoji = getStudentEmoji(student.name, student.serialNo);
                  const isEditing = editingStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '28px 1fr 65px',
                        alignItems: 'center',
                        padding: '6px 6px',
                        borderBottom: '1px solid #f8fafc',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#64748b', fontWeight: 700, fontSize: '11px' }}>{student.serialNo}</span>

                      {/* Name with Emoji & Inline Edit */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, paddingRight: '4px' }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>{emoji}</span>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', width: '100%' }}>
                            <input
                              type="text"
                              value={editingStudentName}
                              onChange={e => setEditingStudentName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveInlineEdit(student.id);
                                if (e.key === 'Escape') setEditingStudentId(null);
                              }}
                              autoFocus
                              style={{ height: '24px', padding: '1px 6px', fontSize: '11px', fontWeight: 700 }}
                            />
                            <button
                              onClick={() => handleSaveInlineEdit(student.id)}
                              style={{ background: '#16a34a', border: 'none', color: 'white', borderRadius: '4px', padding: '2px', cursor: 'pointer' }}
                            >
                              <Check size={11} />
                            </button>
                            <button
                              onClick={() => setEditingStudentId(null)}
                              style={{ background: '#e2e8f0', border: 'none', color: '#64748b', borderRadius: '4px', padding: '2px', cursor: 'pointer' }}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                            <span
                              style={{
                                fontWeight: 700,
                                color: '#1e293b',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textDecoration: student.excluded ? 'line-through' : 'none',
                                fontSize: '12px',
                              }}
                              title={student.name}
                            >
                              {student.name.toUpperCase()}
                            </span>
                            <button
                              onClick={() => {
                                setEditingStudentId(student.id);
                                setEditingStudentName(student.name);
                              }}
                              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '1px' }}
                              title="Edit Name"
                            >
                              <Edit2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: student.selected ? '#b45309' : student.excluded ? '#b91c1c' : '#15803d',
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: student.selected ? '#f59e0b' : student.excluded ? '#ef4444' : '#22c55e',
                          }} />
                          {student.selected ? 'Drawn' : student.excluded ? 'Excluded' : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom button: + Add Student Manually */}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-light-green"
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '8px',
                fontSize: '12px',
              }}
            >
              <Plus size={14} />
              <span>Add Student Manually</span>
            </button>
          </div>
        </div>

        {/* ================= CENTER COLUMN (HERO JAR) ================= */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: 0,
          padding: '2px 0 4px',
        }}>
          {/* Main Hero Title */}
          <div style={{ textAlign: 'center', marginBottom: '8px', flexShrink: 0 }}>
            <h1 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(20px, 2.2vw, 28px)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              marginBottom: '2px',
            }}>
              {game.phase === GAME_PHASES.BOMB ? (
                <>Who Will Be the <span style={{ color: '#16a34a' }}>Lucky One?</span></>
              ) : (
                <>Pack All <span style={{ color: '#16a34a' }}>Names</span> in the Jar</>
              )}
            </h1>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              {game.phase === GAME_PHASES.BOMB
                ? 'Pyrotechnic shell loaded with all packed students — light the fuse to select!'
                : 'All student names will be packed into the jar for a random selection'}
            </p>
          </div>

          {/* Flying origami chits animation while packing */}
          <div style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            minHeight: 0,
            maxHeight: '350px',
          }}>
            <AnimatePresence>
              {flyingChits.map((chit) => (
                <motion.div
                  key={chit.id}
                  initial={{ opacity: 1, x: chit.startX, y: chit.startY, scale: 1, rotate: Math.random() * 40 - 20 }}
                  animate={{ opacity: 0, x: 0, y: 120, scale: 0.2, rotate: Math.random() * 360 }}
                  transition={{ duration: 0.8, delay: chit.delay, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  {chit.name}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Realistic Glass Jar OR Pyrotechnic Shell */}
            {game.phase === GAME_PHASES.BOMB ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                style={{ height: 'min(48vh, 350px)', maxHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <RealisticPyrotechnicShell isFuseActive={true} />
              </motion.div>
            ) : (
              <RealisticGlassJar
                slipCount={eligibleCount}
                isPacked={game.isPacked}
              />
            )}
          </div>

          {/* Stats Bar Container below Jar:
              - By default: ONLY shows Total Students (Eligible removed)
              - When enabled in Admin Panel: shows Total, Eligible, and Excluded */}
          <div style={{ flexShrink: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
            {game.settings.showDetailedStats ? (
              /* Detailed Stats Mode (Enabled from Admin Panel) */
              <div className="white-card" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                padding: '8px 20px',
                width: '100%',
                maxWidth: '440px',
                margin: '6px 0 10px',
                textAlign: 'center',
              }}>
                {/* Total Students */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Users size={15} color="#15803D" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                      {game.students.length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Total Students</div>
                  </div>
                </div>

                {/* Eligible */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckCircle size={15} color="#15803D" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#15803d', lineHeight: 1.1 }}>
                      {eligibleCount}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Eligible</div>
                  </div>
                </div>

                {/* Excluded */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ban size={15} color="#dc2626" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#dc2626', lineHeight: 1.1 }}>
                      {excludedCount}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Excluded</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Default Mode: ONLY Total Students (Clean & Private) */
              <div className="white-card" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '8px 24px',
                margin: '6px 0 10px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Users size={16} color="#15803D" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                    {game.students.length}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Students</div>
                </div>
              </div>
            )}
          </div>

          {/* Big Green Pill Action Button */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            {game.phase === GAME_PHASES.PACKED ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-green-pill"
                style={{
                  padding: '12px 46px',
                  fontSize: '16px',
                  borderRadius: '30px',
                }}
                onClick={game.prepareBomb}
              >
                <span>🧨 PREPARE THE BLAST</span>
              </motion.button>
            ) : game.phase === GAME_PHASES.BOMB ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-green-pill"
                style={{
                  padding: '12px 46px',
                  fontSize: '16px',
                  borderRadius: '30px',
                }}
                onClick={handleLightFuse}
              >
                <span>🔥 LIGHT THE FUSE</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-green-pill"
                style={{
                  padding: '12px 46px',
                  fontSize: '16px',
                  borderRadius: '30px',
                }}
                onClick={handlePackSequence}
                disabled={eligibleCount === 0 || game.phase === GAME_PHASES.PACKING}
              >
                {/* Jar Icon from Mockup */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="5" y="3" width="14" height="4" rx="1.5" />
                  <path d="M6 7 L6 19 C6 20.5 7.5 22 9 22 L15 22 C16.5 22 18 20.5 18 19 L18 7 Z" />
                </svg>
                <span>{game.phase === GAME_PHASES.PACKING ? 'PACKING NAMES...' : 'PACK IN JAR'}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: 0 }}>
          {/* Card 1: Game Settings */}
          <div className="white-card" style={{ padding: '12px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Settings size={16} color="#15803D" />
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Game Settings</h3>
            </div>

            {/* Compact Toggle Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>No Repeat Mode</span>
                <label className="toggle-switch-green">
                  <input
                    type="checkbox"
                    checked={game.settings.noRepeat}
                    onChange={() => game.updateSettings({ noRepeat: !game.settings.noRepeat })}
                  />
                  <span className="toggle-slider-green" />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Sound Effects</span>
                <label className="toggle-switch-green">
                  <input
                    type="checkbox"
                    checked={game.settings.soundEffects}
                    onChange={() => game.updateSettings({ soundEffects: !game.settings.soundEffects })}
                  />
                  <span className="toggle-slider-green" />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Background Music</span>
                <label className="toggle-switch-green">
                  <input
                    type="checkbox"
                    checked={game.settings.backgroundMusic}
                    onChange={() => game.updateSettings({ backgroundMusic: !game.settings.backgroundMusic })}
                  />
                  <span className="toggle-slider-green" />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Voice Announcement</span>
                <label className="toggle-switch-green">
                  <input
                    type="checkbox"
                    checked={game.settings.voiceAnnouncement}
                    onChange={() => game.updateSettings({ voiceAnnouncement: !game.settings.voiceAnnouncement })}
                  />
                  <span className="toggle-slider-green" />
                </label>
              </div>
            </div>

            {/* Dropdown Selects in 1 Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>Speed</span>
                <select
                  value={game.settings.animationSpeed}
                  onChange={e => game.updateSettings({ animationSpeed: e.target.value })}
                  style={{ width: '100%', height: '28px', fontSize: '11px', fontWeight: 600, padding: '2px 6px' }}
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>

              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>Countdown</span>
                <select
                  value={game.settings.countdownSeconds}
                  onChange={e => game.updateSettings({ countdownSeconds: Number(e.target.value) })}
                  style={{ width: '100%', height: '28px', fontSize: '11px', fontWeight: 600, padding: '2px 6px' }}
                >
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={10}>10 Seconds</option>
                </select>
              </div>
            </div>

            {/* Reset Game Button */}
            <button
              type="button"
              onClick={() => setShowDashboardResetModal(true)}
              style={{
                width: '100%',
                padding: '6px 10px',
                marginTop: '8px',
                borderRadius: '8px',
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Game & Clear All Data</span>
            </button>
          </div>

          {/* Card 2: Winner History (Flexes to fill) */}
          <div className="white-card" style={{
            padding: '12px 14px',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={16} color="#15803D" />
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Winner History</h3>
              </div>
              {game.history.length > 0 && (
                <button
                  onClick={() => setShowHistoryModal(true)}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  View All
                </button>
              )}
            </div>

            {/* Winner Rows */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {game.history.length === 0 ? (
                <div style={{ padding: '16px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
                  No winners drawn yet
                </div>
              ) : (
                game.history.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 0',
                      borderBottom: '1px solid #f8fafc',
                    }}
                  >
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#16a34a',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {entry.round}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {entry.name}
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 3: Ready to Begin? Festive Diya Card (Compact) */}
          <div className="white-card" style={{
            padding: '8px 12px',
            background: 'linear-gradient(135deg, #fffdf7 0%, #fefcf3 100%)',
            border: '1px solid #fef08a',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}>
            <div style={{ flexShrink: 0 }}>
              <svg viewBox="0 0 48 48" width="32" height="32">
                <defs>
                  <linearGradient id="goldDiya" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
                {/* Flame */}
                <path d="M 24 6 C 21 14, 18 18, 18 22 C 18 26, 21 28, 24 28 C 27 28, 30 26, 30 22 C 30 18, 27 14, 24 6 Z" fill="#F59E0B" />
                <path d="M 24 12 C 22 17, 21 19, 21 22 C 21 24, 22 25, 24 25 C 26 25, 27 24, 27 22 C 27 19, 26 17, 24 12 Z" fill="#FEF08A" />
                {/* Clay/Brass Bowl */}
                <path d="M 10 26 C 10 37, 38 37, 38 26 Q 32 34, 24 34 Q 16 34, 10 26 Z" fill="url(#goldDiya)" />
                <ellipse cx="24" cy="26" rx="14" ry="4" fill="#D97706" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', marginBottom: '1px' }}>
                Ready to Begin?
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.3 }}>
                Upload student list and pack names to start!
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= DYNAMIC CELEBRATION OVERLAYS ================= */}
      {/* 1. Countdown Overlay */}
      {game.phase === GAME_PHASES.COUNTDOWN && (
        <Countdown
          seconds={game.settings.countdownSeconds}
          speedMultiplier={speedMultiplier}
          onCountdownTick={handleCountdownTick}
          onComplete={handleCountdownComplete}
        />
      )}

      {/* 2. Explosion Effect */}
      {game.phase === GAME_PHASES.EXPLOSION && (
        <ExplosionEffect onReveal={game.revealWinner} />
      )}

      {/* 3. Full-Screen Winner Reveal Screen (Strictly No Page Scroll) */}
      {game.phase === GAME_PHASES.WINNER && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(240, 246, 242, 0.98)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <WinnerReveal
            winner={game.currentWinner}
            roundNumber={game.roundNumber}
            remainingCount={eligibleCount}
            totalCount={game.students.length}
            settings={game.settings}
            onPickNext={game.pickNext}
            onViewHistory={() => {
              game.pickNext();
              setShowHistoryModal(true);
            }}
            onHome={game.pickNext}
            playWinner={audio.playWinner}
            announce={audio.announce}
          />
        </div>
      )}

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="white-card"
              style={{ padding: '28px', maxWidth: '400px', width: '100%' }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Add Student</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
                Enter the full name of the student to add them to the roster.
              </p>
              <input
                type="text"
                placeholder="Student Name..."
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newStudentName.trim()) {
                    game.addStudent(newStudentName.trim());
                    setNewStudentName('');
                    setShowAddModal(false);
                  }
                }}
                autoFocus
                style={{ marginBottom: '18px', height: '42px', fontSize: '14px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-nav-pill"
                  style={{ flex: 1 }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-green-pill"
                  style={{ flex: 1, padding: '10px 20px', fontSize: '14px', borderRadius: '14px' }}
                  onClick={() => {
                    if (newStudentName.trim()) {
                      game.addStudent(newStudentName.trim());
                      setNewStudentName('');
                      setShowAddModal(false);
                    }
                  }}
                >
                  Add Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="white-card"
              style={{ padding: '28px', maxWidth: '640px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Complete Winner History</h3>
                <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <WinnerHistory history={game.history} onClear={game.clearHistory} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dashboard Reset Game Confirmation Modal */}
      <AnimatePresence>
        {showDashboardResetModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 160,
            padding: '20px',
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="white-card"
              style={{ padding: '28px', maxWidth: '380px', width: '100%', textAlign: 'center' }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <AlertTriangle size={26} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Reset Game & Clear All?
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', lineHeight: 1.4 }}>
                This will delete all imported students, remove all added names, and wipe winner history back to a clean slate.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-nav-pill"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => setShowDashboardResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    game.resetGame();
                    setShowDashboardResetModal(false);
                  }}
                >
                  Yes, Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discreet Admin Trigger - Faint, subtle, no lock emoji */}
      <button
        onClick={() => setShowAdmin(true)}
        aria-label="System Menu"
        style={{
          position: 'fixed',
          bottom: '12px',
          right: '12px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          opacity: 0.22,
          transition: 'all 0.2s ease',
          zIndex: 90,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.22'; }}
      >
        <span style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(21, 128, 61, 0.5)',
        }} />
      </button>

      {/* Admin Panel with Name Editing */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel
            isOpen={showAdmin}
            onClose={() => setShowAdmin(false)}
            students={game.students}
            history={game.history}
            settings={game.settings}
            onUpdateSettings={game.updateSettings}
            onToggleExclude={game.toggleExclude}
            onEditStudent={game.editStudent}
            onRestoreAll={game.restoreAll}
            onExcludeAll={game.excludeAll}
            onResetGame={game.resetGame}
            onResetAll={game.resetAll}
            onClearHistory={game.clearHistory}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={game.settings}
        onUpdate={game.updateSettings}
        onResetGame={game.resetGame}
      />
    </div>
  );
}
