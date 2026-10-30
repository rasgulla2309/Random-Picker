import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, AlertTriangle, UserPlus, Upload } from 'lucide-react';

const SLIP_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98FB98','#F0E68C'];

function StudentList({ students, onAdd, onRemove, onReplaceFile, onPack, isPacked, eligibleCount }) {
  const [search, setSearch] = useState('');
  const [sortAlpha, setSortAlpha] = useState(false);
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const filtered = useMemo(() => {
    let list = [...students];
    if (search.trim()) {
      list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (sortAlpha) {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [students, search, sortAlpha]);

  const handleAdd = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName('');
    setShowAdd(false);
  }, [newName, onAdd]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px 20px 48px', width: '100%' }}>
      {/* Top Banner Card */}
      <div className="glass-card" style={{ padding: '24px 32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: '#FFC857' }}>
              Student Verification
            </h2>
            <p style={{ color: '#B8B2CC', fontSize: '14px', marginTop: '4px' }}>
              Verify your students before packing them into the blast jar.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '8px 18px', borderRadius: '24px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '14px', color: '#34D399', fontWeight: 700 }}>
              {students.length} Total
            </span>
            <span style={{ padding: '8px 18px', borderRadius: '24px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', fontSize: '14px', color: '#A78BFA', fontWeight: 700 }}>
              {eligibleCount} Eligible
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold"
              style={{ fontSize: '16px', padding: '12px 32px', borderRadius: '16px' }}
              onClick={onPack}
              disabled={eligibleCount === 0}
            >
              🫙 PACK IN JAR ({eligibleCount})
            </motion.button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#B8B2CC' }} />
          <input
            type="search"
            placeholder={`Search ${students.length} students...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '40px', fontSize: '15px', height: '44px' }}
            aria-label="Search students"
          />
        </div>
        <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: '14px', height: '44px' }} onClick={() => setSortAlpha(s => !s)}>
          {sortAlpha ? '↕ Original Order' : 'A→Z Alphabetical'}
        </button>
        <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: '14px', height: '44px' }} onClick={() => setShowAdd(s => !s)}>
          <UserPlus size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Add Student
        </button>
        <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: '14px', height: '44px' }} onClick={onReplaceFile}>
          <Upload size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Upload New File
        </button>
      </div>

      {/* Add student inline box */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-card"
            style={{ padding: '18px 24px', marginBottom: '20px', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Plus size={18} color="#8B5CF6" />
              <input
                type="text"
                placeholder="Enter student's full name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                autoFocus
                style={{ flex: 1, fontSize: '15px' }}
                aria-label="New student name"
              />
              <button className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={handleAdd} disabled={!newName.trim()}>
                Add Student
              </button>
              <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: '14px' }} onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation dialog for delete */}
      <AnimatePresence>
        {confirmRemove && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}
          >
            <div className="glass-card" style={{ padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
              <AlertTriangle size={44} color="#F59E0B" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>Remove Student?</h3>
              <p style={{ color: '#B8B2CC', marginBottom: '24px', fontSize: '14px' }}>Remove <strong>{confirmRemove.name}</strong> from the student list?</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmRemove(null)}>Cancel</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}>Remove</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-column Responsive Student Grid (Desktop & Tablet) */}
      <div className="glass-card" style={{ padding: '20px', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '56px 20px', textAlign: 'center', color: '#B8B2CC', fontSize: '16px' }}>
            {search ? `No students found matching "${search}"` : 'No students uploaded yet'}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '10px',
            maxHeight: '620px',
            overflowY: 'auto',
            paddingRight: '6px',
          }}>
            {filtered.map((student, i) => (
              <StudentCard
                key={student.id}
                student={student}
                index={i}
                onRemove={() => setConfirmRemove(student)}
                slipColor={SLIP_COLORS[student.serialNo % SLIP_COLORS.length]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '28px', textAlign: 'center' }}
      >
        <button
          className="btn-gold"
          style={{ fontSize: '20px', padding: '18px 60px', borderRadius: '22px', boxShadow: '0 8px 30px rgba(255,200,87,0.3)' }}
          onClick={onPack}
          disabled={eligibleCount === 0}
        >
          🫙 PACK IN JAR ({eligibleCount} STUDENTS)
        </button>
      </motion.div>
    </div>
  );
}

function StudentCard({ student, index, onRemove, slipColor }) {
  const statusBadge = student.selected
    ? <span className="badge badge-selected">Selected</span>
    : student.excluded
    ? <span className="badge badge-excluded">Excluded</span>
    : <span className="badge badge-eligible">Eligible</span>;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: student.excluded ? 0.45 : 1,
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: slipColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 800,
        color: '#111827',
        flexShrink: 0,
      }}>
        {student.serialNo}
      </div>
      <div style={{
        flex: 1,
        fontWeight: 600,
        fontSize: '14px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textDecoration: student.excluded ? 'line-through' : 'none',
      }} title={student.name}>
        {student.name}
      </div>
      {statusBadge}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.3)',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label={`Remove ${student.name}`}
        title={`Remove ${student.name}`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default StudentList;
