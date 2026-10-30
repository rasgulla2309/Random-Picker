/**
 * useGameState.js - Central game state management hook
 */
import { useState, useCallback, useEffect } from 'react';
import { cryptoRandomPick } from '../utils/randomPicker';
import {
  saveStudents, loadStudents,
  saveHistory, loadHistory,
  saveSettings, loadSettings,
} from '../utils/storage';

export const GAME_PHASES = {
  IDLE: 'idle',           // Dashboard default state
  PACKING: 'packing',     // Chit fly-in animation
  PACKED: 'packed',       // Jar is full, ready to prepare blast
  BOMB: 'bomb',           // Pyrotechnic shell ready
  COUNTDOWN: 'countdown', // 3, 2, 1 fuse burn
  EXPLOSION: 'explosion', // Golden flash detonation
  WINNER: 'winner',       // Trophy reveal
  DONE: 'done',           // All students drawn
};

const DEFAULT_SETTINGS = {
  noRepeat: true,
  soundEffects: true,
  backgroundMusic: true,
  voiceAnnouncement: true,
  animationSpeed: 'normal',
  countdownSeconds: 3,
  autoSave: true,
  announcementLanguage: 'hinglish',
  musicVolume: 0.3,
  sfxVolume: 0.7,
  fuseVolume: 0.6,
  explosionVolume: 0.8,
  announcementVolume: 0.9,
  showDetailedStats: false, // Default is false: only show Total Students on dashboard
};

export function useGameState() {
  const [phase, setPhase] = useState(GAME_PHASES.IDLE);
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isPacked, setIsPacked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [fileName, setFileName] = useState('');
  const [worksheetName, setWorksheetName] = useState('');
  const [duplicates, setDuplicates] = useState([]);

  // Load persisted data on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) setSettings(s => ({ ...DEFAULT_SETTINGS, ...savedSettings }));

    const savedStudents = loadStudents();
    if (savedStudents?.length > 0) {
      setStudents(savedStudents);
    }

    const savedHistory = loadHistory();
    if (savedHistory?.length > 0) {
      setHistory(savedHistory);
      const maxRound = Math.max(...savedHistory.map(h => h.round), 0);
      setRoundNumber(maxRound + 1);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (settings.autoSave) {
      saveStudents(students);
    }
  }, [students, settings.autoSave]);

  useEffect(() => {
    if (settings.autoSave) {
      saveHistory(history);
    }
  }, [history, settings.autoSave]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const importStudents = useCallback((names, filename, worksheet, dupes) => {
    const newStudents = names.map((name, idx) => ({
      id: `student-${idx}-${Date.now()}`,
      name,
      serialNo: idx + 1,
      excluded: false,
      selected: false,
    }));
    setStudents(newStudents);
    setFileName(filename);
    setWorksheetName(worksheet);
    setDuplicates(dupes || []);
    setIsPacked(false);
    setPhase(GAME_PHASES.IDLE);
  }, []);

  const addStudent = useCallback((name) => {
    if (!name || !name.trim()) return;
    setStudents(prev => {
      const newStudent = {
        id: `student-manual-${Date.now()}`,
        name: name.trim(),
        serialNo: prev.length + 1,
        excluded: false,
        selected: false,
      };
      return [...prev, newStudent];
    });
    setIsPacked(false);
  }, []);

  const editStudent = useCallback((id, newName) => {
    if (!newName || !newName.trim()) return;
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, name: newName.trim() } : s
    ));
  }, []);

  const removeStudent = useCallback((id) => {
    setStudents(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, i) => ({ ...s, serialNo: i + 1 }));
    });
    setIsPacked(false);
  }, []);

  const toggleExclude = useCallback((id) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, excluded: !s.excluded } : s
    ));
    setIsPacked(false);
  }, []);

  const excludeStudent = useCallback((id) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, excluded: true } : s
    ));
    setIsPacked(false);
  }, []);

  const restoreStudent = useCallback((id) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, excluded: false } : s
    ));
    setIsPacked(false);
  }, []);

  const excludeAll = useCallback(() => {
    setStudents(prev => prev.map(s => ({ ...s, excluded: true })));
    setIsPacked(false);
  }, []);

  const restoreAll = useCallback(() => {
    setStudents(prev => prev.map(s => ({ ...s, excluded: false })));
    setIsPacked(false);
  }, []);

  const packInJar = useCallback(() => {
    const eligible = students.filter(s => !s.excluded && (!settings.noRepeat || !s.selected));
    if (eligible.length === 0) return false;
    setPhase(GAME_PHASES.PACKING);
    return true;
  }, [students, settings.noRepeat]);

  const finishPacking = useCallback(() => {
    setIsPacked(true);
    setPhase(GAME_PHASES.PACKED);
  }, []);

  const prepareBomb = useCallback(() => {
    setPhase(GAME_PHASES.BOMB);
  }, []);

  const startCountdown = useCallback(() => {
    if (isAnimating) return null;

    const eligiblePool = students.filter(s => {
      if (s.excluded) return false;
      if (settings.noRepeat && s.selected) return false;
      return true;
    });

    if (eligiblePool.length === 0) return null;

    const winner = cryptoRandomPick(eligiblePool);
    setCurrentWinner(winner);
    setIsAnimating(true);
    setPhase(GAME_PHASES.COUNTDOWN);
    return winner;
  }, [students, settings.noRepeat, isAnimating]);

  const triggerExplosion = useCallback(() => {
    setPhase(GAME_PHASES.EXPLOSION);
  }, []);

  const revealWinner = useCallback(() => {
    if (!currentWinner) return;

    setStudents(prev => prev.map(s =>
      s.id === currentWinner.id ? { ...s, selected: true } : s
    ));

    const historyEntry = {
      id: `history-${Date.now()}`,
      round: roundNumber,
      name: currentWinner.name,
      serialNo: currentWinner.serialNo,
      timestamp: Date.now(),
    };

    setHistory(prev => [historyEntry, ...prev]);
    setRoundNumber(r => r + 1);
    setIsAnimating(false);
    setPhase(GAME_PHASES.WINNER);
  }, [currentWinner, roundNumber]);

  const skipToWinner = useCallback(() => {
    triggerExplosion();
    setTimeout(() => revealWinner(), 400);
  }, [triggerExplosion, revealWinner]);

  const pickNext = useCallback(() => {
    const remainingEligible = students.filter(s => {
      if (s.excluded) return false;
      if (settings.noRepeat && s.selected) return false;
      return true;
    });

    if (remainingEligible.length === 0) {
      setPhase(GAME_PHASES.DONE);
      return;
    }

    setCurrentWinner(null);
    setPhase(GAME_PHASES.IDLE);
    setIsPacked(false);
  }, [students, settings.noRepeat]);

  const resetGame = useCallback(() => {
    setStudents([]);
    setHistory([]);
    setCurrentWinner(null);
    setRoundNumber(1);
    setPhase(GAME_PHASES.IDLE);
    setIsPacked(false);
    setIsAnimating(false);
    setFileName('');
    setWorksheetName('');
    setDuplicates([]);
    saveStudents([]);
    saveHistory([]);
    try {
      localStorage.removeItem('diwali_blast_students');
      localStorage.removeItem('diwali_blast_history');
      localStorage.removeItem('diwali_blast_game_state');
      localStorage.removeItem('diwali_blast_excluded');
    } catch (e) {}
  }, []);

  const resetAll = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const goToPhase = useCallback((newPhase) => {
    setPhase(newPhase);
  }, []);

  const eligibleStudents = students.filter(s => {
    if (s.excluded) return false;
    if (settings.noRepeat && s.selected) return false;
    return true;
  });

  const excludedStudents = students.filter(s => s.excluded);
  const selectedStudents = students.filter(s => s.selected);

  return {
    phase, setPhase: goToPhase,
    students, setStudents,
    history,
    currentWinner,
    roundNumber,
    isPacked,
    isAnimating, setIsAnimating,
    settings, updateSettings,
    fileName, worksheetName,
    duplicates,
    eligibleStudents,
    excludedStudents,
    selectedStudents,
    // Actions
    importStudents,
    addStudent, editStudent, removeStudent,
    toggleExclude, excludeStudent, restoreStudent,
    excludeAll, restoreAll,
    packInJar, finishPacking,
    prepareBomb,
    startCountdown,
    triggerExplosion,
    revealWinner,
    skipToWinner,
    pickNext,
    resetGame, resetAll,
    clearHistory,
    GAME_PHASES,
  };
}
