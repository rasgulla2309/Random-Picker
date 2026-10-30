import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { parseExcelFile, extractNames, getColumnHeaders } from '../utils/excelParser';

function ExcelUploader({ onImport }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedCol, setSelectedCol] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setError('Please upload a valid Excel or CSV file (.xlsx, .xls, .csv)');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await parseExcelFile(file);
      const firstSheet = result.worksheets[0];
      setParsed(result);
      setSelectedSheet(firstSheet);
      setSelectedCol(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleConfirm = useCallback(() => {
    if (!parsed || !selectedSheet) return;
    const rows = parsed.results[selectedSheet];
    const { names, duplicates, columnIndex, columnName } = extractNames(rows, selectedCol);
    if (names.length === 0) {
      setError('No student names found in this column. Please check your sheet or select a different column.');
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      onImport(names, parsed.fileName, selectedSheet, duplicates);
    }, 1200);
  }, [parsed, selectedSheet, selectedCol, onImport]);

  const sheetRows = parsed && selectedSheet ? parsed.results[selectedSheet] : [];
  const colHeaders = getColumnHeaders(sheetRows);
  const preview = extractNames(sheetRows, selectedCol);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, marginBottom: '8px' }}
          className="gradient-text"
        >
          IMPORT ROSTER
        </motion.div>
        <p style={{ color: '#C7C2DC', fontSize: '15px' }}>Upload your official classroom spreadsheet to begin the challenge</p>
      </div>

      <AnimatePresence>
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', padding: '48px', borderRadius: '24px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)' }}
          >
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: 2, duration: 0.4 }}>
              <CheckCircle size={64} color="#34D399" />
            </motion.div>
            <div style={{ marginTop: '16px', fontSize: '22px', color: '#34D399', fontWeight: 800 }}>Roster Verified!</div>
            <div style={{ color: '#C7C2DC', marginTop: '8px', fontSize: '16px' }}>{preview.names.length} students loaded & verified</div>
          </motion.div>
        ) : (
          <motion.div key="uploader" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Pure Real Drag & Drop Zone */}
            {!parsed && (
              <div
                className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
                style={{ padding: '52px 24px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px' }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload Excel file"
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
                  <FileSpreadsheet size={60} color="#FFC857" />
                </motion.div>
                <div style={{ marginTop: '18px', fontSize: '19px', fontWeight: 700, color: '#fff' }}>
                  {isDragging ? '📂 Drop your spreadsheet here' : 'Drag & Drop your classroom Excel or CSV file'}
                </div>
                <div style={{ color: '#B8B2CC', marginTop: '6px', fontSize: '14px' }}>or click to browse from your device</div>
                <div style={{ marginTop: '18px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['.xlsx', '.xls', '.csv'].map(ext => (
                    <span key={ext} style={{ padding: '5px 14px', borderRadius: '20px', background: 'rgba(255,200,87,0.12)', border: '1px solid rgba(255,200,87,0.25)', fontSize: '12px', color: '#FFC857', fontWeight: 600 }}>{ext}</span>
                  ))}
                </div>
                <button className="btn-primary" style={{ marginTop: '24px', fontSize: '15px', padding: '12px 28px' }} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  <Upload size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Browse File
                </button>
              </div>
            )}

            {isLoading && (
              <div style={{ textAlign: 'center', padding: '36px', color: '#C7C2DC' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>
                  <Upload size={32} color="#FFC857" />
                </motion.div>
                <div style={{ marginTop: '14px', fontSize: '15px' }}>Reading spreadsheet records...</div>
              </div>
            )}

            {parsed && !isLoading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* File info */}
                <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileSpreadsheet size={24} color="#34D399" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{parsed.fileName}</div>
                      <div style={{ fontSize: '12px', color: '#B8B2CC' }}>{parsed.worksheets.length} worksheet{parsed.worksheets.length !== 1 ? 's' : ''} detected</div>
                    </div>
                  </div>
                  <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => setParsed(null)}>
                    <X size={14} style={{ display: 'inline', marginRight: '4px' }} />Change File
                  </button>
                </div>

                {/* Sheet selector */}
                <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', color: '#C7C2DC', display: 'block', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Select Worksheet
                  </label>
                  <select value={selectedSheet} onChange={(e) => { setSelectedSheet(e.target.value); setSelectedCol(null); }}>
                    {parsed.worksheets.map(ws => <option key={ws} value={ws}>{ws}</option>)}
                  </select>
                </div>

                {/* Column selector */}
                {colHeaders.length > 1 && (
                  <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', color: '#C7C2DC', display: 'block', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Student Name Column
                      <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '8px', color: '#FFC857', fontSize: '11px' }}>Auto-detected</span>
                    </label>
                    <select value={selectedCol ?? preview.columnIndex} onChange={(e) => setSelectedCol(Number(e.target.value))}>
                      {colHeaders.map(col => <option key={col.index} value={col.index}>{col.label}</option>)}
                    </select>
                  </div>
                )}

                {/* Preview stats */}
                {preview.names.length > 0 && (
                  <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      <StatMini label="Total Students" value={preview.names.length} color="#FFC857" />
                      <StatMini label="Unique Names" value={preview.names.length - preview.duplicates.length} color="#34D399" />
                      <StatMini label="Duplicates" value={preview.duplicates.length} color={preview.duplicates.length > 0 ? '#F59E0B' : '#34D399'} />
                    </div>

                    {preview.duplicates.length > 0 && (
                      <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: 700, marginBottom: '6px' }}>
                          <AlertTriangle size={16} />
                          <span>{preview.duplicates.length} Duplicate Name{preview.duplicates.length !== 1 ? 's' : ''} Detected</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#C7C2DC', marginBottom: '8px' }}>
                          Students with identical names will be preserved with unique serial numbers. You can review them in the student roster.
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: '12px', color: '#B8B2CC', marginBottom: '8px', fontWeight: 600 }}>Roster Sample Preview:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {preview.names.slice(0, 8).map((name, i) => (
                        <span key={i} style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', color: '#FFF' }}>{name}</span>
                      ))}
                      {preview.names.length > 8 && <span style={{ fontSize: '13px', color: '#B8B2CC', padding: '4px 8px' }}>+{preview.names.length - 8} more</span>}
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#F87171', display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setParsed(null)}>← Back</button>
                  <button
                    className="btn-gold"
                    style={{ flex: 2, fontSize: '16px' }}
                    onClick={handleConfirm}
                    disabled={preview.names.length === 0}
                  >
                    Confirm & Load {preview.names.length} Students
                  </button>
                </div>
              </motion.div>
            )}

            {error && !parsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#F87171', display: 'flex', gap: '8px', marginTop: '12px' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                {error}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatMini({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ fontSize: '26px', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#B8B2CC', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

export default ExcelUploader;
