/**
 * مدار – MDAR | Smart Import Engine
 * Comprehensive client-side parser for XLSX, XLS, CSV, TSV, and TXT files.
 * Automatically discovers encoding, delimiters, sheet names, headers, data start rows,
 * and column mappings with zero telemetry and 100% in-browser offline execution.
 */

import readXlsxFile from "read-excel-file/universal";
import { detectColumns, DetectedColumn, parseFlexibleNumber } from "./smartColumnDetection";

export interface SmartImportResult {
  fileName: string;
  fileType: "xlsx" | "csv" | "tsv" | "txt";
  encoding: string;
  delimiter: string;
  sheetNames: string[];
  selectedSheet: string;
  headerRowIndex: number; // 0-based index or -1 if no header
  dataStartRowIndex: number;
  headers: string[];
  allRows: string[][]; // complete parsed string matrix
  previewRows: string[][]; // top 20 rows for wizard preview
  totalRows: number;
  totalCols: number;
  detectedColumns: DetectedColumn[];
  decimalSeparator: "." | ",";
  warnings: string[];
}

/**
 * Detects the delimiter of a text string by evaluating column count consistency.
 */
export function detectDelimiter(text: string): string {
  const candidates = [",", "\t", ";", "|"];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(0, 20);

  if (lines.length === 0) return ",";

  let bestDelimiter = ",";
  let bestConsistencyScore = -1;

  for (const delim of candidates) {
    const counts = lines.map((l) => l.split(delim).length);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    if (avg <= 1) continue;

    // Standard deviation of column counts
    const variance = counts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / counts.length;
    // High avg count and low variance indicates strong delimiter
    const score = avg / (variance + 1);

    if (score > bestConsistencyScore) {
      bestConsistencyScore = score;
      bestDelimiter = delim;
    }
  }

  // Fallback to whitespace if no standard delimiter scored well
  if (bestConsistencyScore <= 1) {
    const spaceCounts = lines.map((l) => l.split(/\s+/).length);
    const spaceAvg = spaceCounts.reduce((a, b) => a + b, 0) / spaceCounts.length;
    if (spaceAvg > 1.5) return " ";
  }

  return bestDelimiter;
}

/**
 * Detects encoding from ArrayBuffer (BOM detection and byte pattern analysis).
 */
export function detectEncoding(buffer: ArrayBuffer): { encoding: string; text: string } {
  const bytes = new Uint8Array(buffer);

  // 1. Check BOM
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    const decoder = new TextDecoder("utf-8");
    return { encoding: "UTF-8 (BOM)", text: decoder.decode(bytes.slice(3)) };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    const decoder = new TextDecoder("utf-16le");
    return { encoding: "UTF-16 LE", text: decoder.decode(bytes.slice(2)) };
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    const decoder = new TextDecoder("utf-16be");
    return { encoding: "UTF-16 BE", text: decoder.decode(bytes.slice(2)) };
  }

  // 2. Default UTF-8 decode
  try {
    const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
    return { encoding: "UTF-8", text: utf8Decoder.decode(bytes) };
  } catch {
    // 3. Fallback to Windows-1256 (Arabic ANSI) if UTF-8 fails
    try {
      const winDecoder = new TextDecoder("windows-1256");
      return { encoding: "Windows-1256 (Arabic)", text: winDecoder.decode(bytes) };
    } catch {
      const latinDecoder = new TextDecoder("iso-8859-1");
      return { encoding: "ISO-8859-1", text: latinDecoder.decode(bytes) };
    }
  }
}

/**
 * Parses raw text lines into a 2D string matrix using the given delimiter.
 */
export function parseDelimitedText(text: string, delimiter: string): string[][] {
  const rawLines = text.split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of rawLines) {
    if (!line.trim()) continue; // skip blank lines

    let tokens: string[];
    if (delimiter === " ") {
      tokens = line.trim().split(/\s+/);
    } else {
      // Basic CSV parsing respecting quoted strings
      tokens = [];
      let inQuotes = false;
      let cur = "";

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          tokens.push(cur.trim().replace(/^["']|["']$/g, ""));
          cur = "";
        } else {
          cur += char;
        }
      }
      tokens.push(cur.trim().replace(/^["']|["']$/g, ""));
    }

    if (tokens.some((t) => t.length > 0)) {
      rows.push(tokens);
    }
  }

  return rows;
}

/**
 * Automatically identifies if the first rows contain column headers.
 */
export function detectHeaderRow(rows: string[][]): {
  headerRowIndex: number;
  dataStartRowIndex: number;
  headers: string[];
} {
  if (rows.length === 0) {
    return { headerRowIndex: -1, dataStartRowIndex: 0, headers: [] };
  }

  const firstRow = rows[0];
  const secondRow = rows.length > 1 ? rows[1] : null;

  // Check if first row is non-numeric strings
  const firstRowNumeric = firstRow.filter((c) => parseFlexibleNumber(c) !== null).length;
  const secondRowNumeric = secondRow
    ? secondRow.filter((c) => parseFlexibleNumber(c) !== null).length
    : 0;

  // If first row has fewer numbers than second row, it's likely a header row
  if (firstRowNumeric < firstRow.length * 0.5 && (secondRowNumeric > 0 || rows.length === 1)) {
    return {
      headerRowIndex: 0,
      dataStartRowIndex: 1,
      headers: firstRow.map((h, i) => h.trim() || `Column_${i + 1}`)
    };
  }

  // No obvious header row: generate synthetic Column_1, Column_2...
  const colCount = Math.max(...rows.slice(0, 10).map((r) => r.length));
  const headers = Array.from({ length: colCount }, (_, i) => `Column_${i + 1}`);

  return {
    headerRowIndex: -1,
    dataStartRowIndex: 0,
    headers
  };
}

/**
 * Detects whether numbers predominantly use decimal dot or decimal comma.
 */
export function detectDecimalSeparator(rows: string[][]): "." | "," {
  let dotCount = 0;
  let commaCount = 0;

  for (const row of rows.slice(0, 50)) {
    for (const cell of row) {
      if (/^-?\d+\.\d+$/.test(cell)) dotCount++;
      if (/^-?\d+,\d+$/.test(cell)) commaCount++;
    }
  }

  return commaCount > dotCount ? "," : ".";
}

/**
 * Main Smart Import function: inspects and parses File or ArrayBuffer.
 */
export async function smartImportFile(
  file: File | { name: string; buffer: ArrayBuffer },
  options?: { sheetName?: string }
): Promise<SmartImportResult> {
  const fileName = file.name;
  const lowerName = fileName.toLowerCase();
  const warnings: string[] = [];

  let fileType: "xlsx" | "csv" | "tsv" | "txt" = "csv";
  if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
    fileType = "xlsx";
  } else if (lowerName.endsWith(".tsv")) {
    fileType = "tsv";
  } else if (lowerName.endsWith(".txt")) {
    fileType = "txt";
  }

  let allRows: string[][] = [];
  let sheetNames: string[] = [];
  let selectedSheet = options?.sheetName || "Sheet1";
  let encoding = "UTF-8";
  let delimiter = ",";

  if (fileType === "xlsx") {
    try {
      // In browser File or ArrayBuffer
      const input = "buffer" in file ? file.buffer : file;
      const readResult = (await (readXlsxFile as any)(input, {
        sheet: options?.sheetName
      })) as any;

      // If array of sheets was returned
      if (Array.isArray(readResult) && readResult.length > 0 && "sheet" in readResult[0]) {
        const multi = readResult as Array<{ sheet: string; data: any[][] }>;
        sheetNames = multi.map((s) => s.sheet);
        selectedSheet = options?.sheetName && sheetNames.includes(options.sheetName)
          ? options.sheetName
          : (sheetNames[0] || "Sheet1");
        const matched = multi.find((s) => s.sheet === selectedSheet) || multi[0];
        const sheetData = matched?.data || [];
        allRows = sheetData.map((row) => row.map((cell) => (cell === null || cell === undefined ? "" : String(cell))));
      } else if (Array.isArray(readResult)) {
        // Single sheet 2D array
        const rawGrid = readResult as any[][];
        allRows = rawGrid.map((row) => row.map((cell) => (cell === null || cell === undefined ? "" : String(cell))));
        sheetNames = [selectedSheet];
      }
    } catch (err: any) {
      warnings.push(`خطأ في قراءة ملف Excel: ${err.message}`);
    }
  } else {
    // Delimited Text File (CSV, TSV, TXT)
    let buffer: ArrayBuffer;
    if ("buffer" in file) {
      buffer = file.buffer;
    } else {
      buffer = await file.arrayBuffer();
    }

    const decoded = detectEncoding(buffer);
    encoding = decoded.encoding;

    if (fileType === "tsv") {
      delimiter = "\t";
    } else {
      delimiter = detectDelimiter(decoded.text);
    }

    allRows = parseDelimitedText(decoded.text, delimiter);
  }

  // Header and Data Row Discovery
  const headerInfo = detectHeaderRow(allRows);
  const dataRows = headerInfo.dataStartRowIndex < allRows.length
    ? allRows.slice(headerInfo.dataStartRowIndex)
    : [];

  const decimalSeparator = detectDecimalSeparator(dataRows);

  // Smart Column Detection
  const detectedColumns = detectColumns(headerInfo.headers, dataRows);

  return {
    fileName,
    fileType,
    encoding,
    delimiter,
    sheetNames,
    selectedSheet,
    headerRowIndex: headerInfo.headerRowIndex,
    dataStartRowIndex: headerInfo.dataStartRowIndex,
    headers: headerInfo.headers,
    allRows,
    previewRows: allRows.slice(0, 25),
    totalRows: allRows.length,
    totalCols: headerInfo.headers.length,
    detectedColumns,
    decimalSeparator,
    warnings
  };
}
