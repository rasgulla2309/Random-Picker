import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Shield, Edit2, Check, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { exportStudentsCSV, exportHistoryCSV } from '../utils/storage';
import { getStudentEmoji } from '../utils/nameEmoji';

function AdminPanel({
  isOpen,
  onClose,
  students,
  history,
  settings,
  onUpdateSettings,
  onToggleExclude,
  onEditStudent,
  onRestoreAll,
  onExcludeAll,
  onResetGame,
  onResetAll,
  onClearHistory,
}) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const filtered = students.filter(s =>
    !search.trim() || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = students.length;
  const eligibleStudents = students.filter(s => !s.excluded && !s.selected).length;
  const excludedStudents = students.filter(s => s.excluded).length;
  const selectedStudents = students.filter(s => s.selected).length;

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.name);
  };

  const saveEdit = (id) => {
    if (editName.trim()) {
      onEditStudent(id, editName.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '540px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        role="dialog"
        aria-label="Admin Control Panel"
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8faf9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={20} color="#15803D" />
            </div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#15803D' }}>Admin Control Panel</h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Edit student names & manage eligibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Status Counter Bar */}
        <div style={{ padding: '14px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ padding: '8px', background: '#f8faf9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{totalStudents}</div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total</div>
            </div>
            <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>{eligibleStudents}</div>
              <div style={{ fontSize: '10px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Eligible</div>
            </div>
            <div style={{ padding: '8px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>{excludedStudents}</div>
              <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>Excluded</div>
            </div>
            <div style={{ padding: '8px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706' }}>{selectedStudents}</div>
              <div style={{ fontSize: '10px', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Drawn</div>
            </div>
          </div>
        </div>

        {/* Dashboard Detailed Stats Visibility Toggle */}
        <div style={{
          padding: '12px 24px',
          background: settings?.showDetailedStats ? '#f0fdf4' : '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          transition: 'background 0.2s ease',
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Show Eligible & Excluded on Dashboard</span>
              {settings?.showDetailedStats && (
                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>
                  Active
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Turn ON to display Eligible & Excluded counters next to Total Students. Turn OFF to show only Total Students.
            </div>
          </div>
          <label className="toggle-switch-green" style={{ flexShrink: 0 }}>
            <input
              type="checkbox"
              checked={Boolean(settings?.showDetailedStats)}
              onChange={() => onUpdateSettings?.({ showDetailedStats: !settings?.showDetailedStats })}
            />
            <span className="toggle-slider-green" />
          </label>
        </div>

        {/* Search & Bulk Controls */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8faf9' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="search"
              placeholder="Search & edit student name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', height: '40px', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={onRestoreAll}
              className="btn-light-green"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              Enable All
            </button>
            <button
              onClick={onExcludeAll}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                borderRadius: '20px',
                background: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fca5a5',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Exclude All
            </button>
            <button
              onClick={() => exportStudentsCSV(students)}
              className="btn-nav-pill"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setConfirmAction({ type: 'resetGame', label: 'Reset everything? This will delete all imported students, remove all added names, and clear history back to an empty slate.' })}
              className="btn-nav-pill"
              style={{ padding: '6px 14px', fontSize: '12px', color: '#dc2626' }}
            >
              <RotateCcw size={13} />
              <span>Reset Game & Clear All</span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {confirmAction && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              zIndex: 30,
            }}>
              <div className="white-card" style={{ padding: '24px', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
                <AlertTriangle size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Confirm Action</h4>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{confirmAction.label}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-nav-pill" style={{ flex: 1 }} onClick={() => setConfirmAction(null)}>Cancel</button>
                  <button
                    className="btn-green-pill"
                    style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
                    onClick={() => {
                      if (confirmAction.type === 'resetGame') onResetGame();
                      setConfirmAction(null);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Student Rows List with Inline Name Editing */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
              No students found matching "{search}"
            </div>
          ) : (
            filtered.map((student) => {
              const isEditing = editingId === student.id;
              const emoji = getStudentEmoji(student.name, student.serialNo);

              return (
                <div
                  key={student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    background: student.excluded ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    opacity: student.excluded ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Serial Number & Emoji */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#475569',
                    flexShrink: 0,
                  }}>
                    {student.serialNo}
                  </div>

                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{emoji}</span>

                  {/* Student Name: Plain or Editable Input */}
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(student.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          style={{
                            height: '32px',
                            padding: '4px 10px',
                            fontSize: '14px',
                            fontWeight: 700,
                          }}
                        />
                        <button
                          onClick={() => saveEdit(student.id)}
                          style={{
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Save Name"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: 'none',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#1e293b',
                          textDecoration: student.excluded ? 'line-through' : 'none',
                        }}>
                          {student.name}
                        </span>
                        <button
                          onClick={() => startEdit(student)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            borderRadius: '4px',
                          }}
                          title="Edit Student Name"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: student.selected ? '#fef3c7' : student.excluded ? '#fee2e2' : '#dcfce7',
                    color: student.selected ? '#b45309' : student.excluded ? '#b91c1c' : '#15803d',
                    flexShrink: 0,
                  }}>
                    {student.selected ? 'Drawn' : student.excluded ? 'Excluded' : 'Active'}
                  </span>

                  {/* Eligibility Toggle Switch */}
                  <label className="toggle-switch-green" style={{ flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={!student.excluded}
                      onChange={() => onToggleExclude(student.id)}
                      disabled={student.selected}
                    />
                    <span className="toggle-slider-green" />
                  </label>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminPanel;
