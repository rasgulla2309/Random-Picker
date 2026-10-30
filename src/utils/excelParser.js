/**
 * excelParser.js - Parse Excel/CSV files into student name arrays
 */
import * as XLSX from 'xlsx';

/**
 * Parse an uploaded file into a list of student names
 * @param {File} file - The uploaded file
 * @returns {Promise<{students: Array, worksheets: Array, duplicates: Array, raw: Array, fileName: string}>}
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheets = workbook.SheetNames;
        const results = {};

        worksheets.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          results[sheetName] = jsonData;
        });

        resolve({
          worksheets,
          results,
          fileName: file.name,
        });
      } catch (err) {
        reject(new Error(`Failed to parse file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract student names from parsed worksheet data
 * @param {Array} rows - 2D array of cell values
 * @param {number|null} columnIndex - Column index to use (null = auto-detect)
 * @returns {{names: string[], columnIndex: number, columnName: string, duplicates: string[]}}
 */
export function extractNames(rows, columnIndex = null) {
  if (!rows || rows.length === 0) {
    return { names: [], columnIndex: 0, columnName: '', duplicates: [] };
  }

  const headerRow = rows[0];
  let detectedCol = columnIndex;

  // Auto-detect name column if not provided
  if (detectedCol === null) {
    const nameKeywords = ['name', 'student', 'naam', 'students', 'student name', 'full name', 'student_name'];
    for (let i = 0; i < headerRow.length; i++) {
      const cell = String(headerRow[i] || '').toLowerCase().trim();
      if (nameKeywords.some(kw => cell.includes(kw))) {
        detectedCol = i;
        break;
      }
    }
    // If still not found, use first non-empty column
    if (detectedCol === null) {
      for (let i = 0; i < headerRow.length; i++) {
        if (headerRow[i] && String(headerRow[i]).trim()) {
          detectedCol = i;
          break;
        }
      }
    }
    if (detectedCol === null) detectedCol = 0;
  }

  const columnName = String(headerRow[detectedCol] || `Column ${detectedCol + 1}`);

  // Extract names from data rows (skip header)
  const allNames = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const cell = row[detectedCol];
    if (cell === null || cell === undefined || String(cell).trim() === '') continue;
    const name = String(cell).trim();
    if (name) allNames.push(name);
  }

  // Find duplicates
  const seen = new Map();
  const duplicates = [];
  allNames.forEach((name, idx) => {
    const lower = name.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push({ name, index: idx + 1 });
    } else {
      seen.set(lower, idx + 1);
    }
  });

  return {
    names: allNames,
    columnIndex: detectedCol,
    columnName,
    duplicates,
  };
}

/**
 * Get available column headers from a worksheet row
 */
export function getColumnHeaders(rows) {
  if (!rows || rows.length === 0) return [];
  return rows[0].map((cell, idx) => ({
    index: idx,
    label: cell ? String(cell).trim() : `Column ${idx + 1}`,
  })).filter(col => col.label);
}
