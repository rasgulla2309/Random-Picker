import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Download, Clock } from 'lucide-react';
import { exportHistoryCSV } from '../utils/storage';
import { getStudentEmoji } from '../utils/nameEmoji';

function WinnerHistory({ history, onClear }) {
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    return history.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));
  }, [history, search]);

  if (history.length === 0) {
    return (
      <div style={{ padding: '36px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>No Winners Yet</h3>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Selected students will appear here after each round.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
          {history.length} winner{history.length !== 1 ? 's' : ''} drawn
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-nav-pill" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => exportHistoryCSV(history)}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              borderRadius: '20px',
              background: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmClear && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 220,
            padding: '16px',
          }}>
            <div className="white-card" style={{ padding: '24px', maxWidth: '320px', width: '100%', textAlign: 'center' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Clear Winner History?</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>This will remove all {history.length} drawn records.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-nav-pill" style={{ flex: 1 }} onClick={() => setConfirmClear(false)}>Cancel</button>
                <button
                  className="btn-green-pill"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '13px', background: '#dc2626' }}
                  onClick={() => { onClear(); setConfirmClear(false); }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="search"
          placeholder="Filter winner history..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '34px', height: '36px', fontSize: '13px' }}
        />
      </div>

      {/* List */}
      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {filtered.map((entry) => {
          const emoji = getStudentEmoji(entry.name, entry.serialNo);

          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: '#f8faf9',
                border: '1px solid #e2ede7',
                marginBottom: '8px',
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#16a34a',
                color: 'white',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {entry.round}
              </div>

              <span style={{ fontSize: '16px' }}>{emoji}</span>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#15803D' }}>{entry.name}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Roll / Serial #{entry.serialNo}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                <Clock size={12} />
                <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WinnerHistory;
