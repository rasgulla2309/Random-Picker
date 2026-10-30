/**
 * storage.js - LocalStorage persistence utilities
 */

const KEYS = {
  STUDENTS: 'diwali_blast_students',
  HISTORY: 'diwali_blast_history',
  SETTINGS: 'diwali_blast_settings',
  GAME_STATE: 'diwali_blast_game_state',
  EXCLUDED: 'diwali_blast_excluded',
};

export function saveStudents(students) {
  try {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.warn('Failed to save students:', e);
  }
}

export function loadStudents() {
  try {
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveHistory(history) {
  try {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save history:', e);
  }
}

export function loadHistory() {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadSettings() {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveGameState(state) {
  try {
    localStorage.setItem(KEYS.GAME_STATE, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game state:', e);
  }
}

export function loadGameState() {
  try {
    const data = localStorage.getItem(KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function clearAll() {
  Object.values(KEYS).forEach(key => {
    try { localStorage.removeItem(key); } catch (e) {}
  });
}

export function exportHistoryCSV(history) {
  const headers = ['Round', 'Name', 'Serial No', 'Time'];
  const rows = history.map(h => [
    h.round,
    h.name,
    h.serialNo,
    new Date(h.timestamp).toLocaleString(),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diwali-blast-history-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportStudentsCSV(students) {
  const headers = ['Serial No', 'Name', 'Status', 'Excluded'];
  const rows = students.map((s, i) => [
    i + 1,
    s.name,
    s.selected ? 'Selected' : s.excluded ? 'Excluded' : 'Eligible',
    s.excluded ? 'Yes' : 'No',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diwali-blast-students-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
