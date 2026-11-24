/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CRS_LIST, getUTMCRSForLon, getETMBeltForLonLat, getMTMZoneForLon } from "../lib/crsData";
import { convertCoordinates } from "../lib/coordinateMath";
import { parseSingleCoordinate, splitPairedCoordinates } from "../lib/parser";
import { TranslationDictionary, CRSType, TargetZoneMode, BatchRow, DatumType } from "../types";
import { Copy, Clipboard, Check, Trash2, FileSpreadsheet, Play, Plus, X, BookOpen, Download, ChevronDown, ChevronUp, Globe } from "lucide-react";
import FormatGuideModal from "./FormatGuideModal";
import ExportModal from "./ExportModal";
import MapModal from "./MapModal";
import CRSSelect from "./CRSSelect";
import ScopeHelpCard from "./ScopeHelpCard";
import { downloadKMLFile } from "../utils/kmlExport";

interface BatchTabProps {
  t: TranslationDictionary;
  lang: "ar" | "en";
  metricDecimals: number;
  geoDecimals: number;
  geoOrder: "lat_lon" | "lon_lat";
  metricOrder: "e_n" | "n_e";
}

export default function BatchTab({
  t,
  lang,
  metricDecimals,
  geoDecimals,
}: BatchTabProps) {
  const [sourceId, setSourceId] = useState("EPSG:4326");
  const [targetId, setTargetId] = useState("EPSG:22992"); // Default target Red Belt
  const [zoneMode, setZoneMode] = useState<TargetZoneMode>(TargetZoneMode.AUTO);
  const [manualTargetId, setManualTargetId] = useState("EPSG:32636"); // Default manual UTM 36N
  
  const [rawText, setRawText] = useState("");
  const [isRawPanelOpen, setIsRawPanelOpen] = useState(false);
  const [rows, setRows] = useState<BatchRow[]>([
    { id: 1, pointId: "PT-01", input1: "31.235712", input2: "30.044420", status: "empty", warnings: [] },
    { id: 2, pointId: "PT-02", input1: "29.918200", input2: "31.200100", status: "empty", warnings: [] },
    { id: 3, pointId: "PT-03", input1: "31.183300", input2: "27.180000", status: "empty", warnings: [] },
  ]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedSelected, setCopiedSelected] = useState(false);
  const [copiedMetric, setCopiedMetric] = useState(false);
  const [copiedGeo, setCopiedGeo] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Drag & Cell Selection state for Excel / Google Sheets interaction
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState<{ row: number; col: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ row: number; col: number } | null>(null);

  // Context Menu state (Right Click)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    rIdx: number;
    cIdx: number;
  }>({ visible: false, x: 0, y: 0, rIdx: 0, cIdx: 0 });

  // Global listeners to clear context menu and mouse down dragging
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };
    const handleWindowClick = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleCellMouseDown = (rIdx: number, cIdx: number) => {
    setIsMouseDown(true);
    setDragStart({ row: rIdx, col: cIdx });
    setDragCurrent({ row: rIdx, col: cIdx });

    if (rows[rIdx]) {
      const nextSet = new Set<number>();
      nextSet.add(rows[rIdx].id);
      setSelectedRowIds(nextSet);
    }
  };

  const handleCellMouseEnter = (rIdx: number, cIdx: number) => {
    if (!isMouseDown || !dragStart) return;
    setDragCurrent({ row: rIdx, col: cIdx });

    const minR = Math.min(dragStart.row, rIdx);
    const maxR = Math.max(dragStart.row, rIdx);
    const nextSet = new Set<number>();
    for (let i = minR; i <= maxR; i++) {
      if (rows[i]) nextSet.add(rows[i].id);
    }
    setSelectedRowIds(nextSet);
  };

  // Right-click context menu handler
  const handleContextMenu = (e: React.MouseEvent, rIdx: number, cIdx: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isCellSelected(rIdx, cIdx)) {
      setDragStart({ row: rIdx, col: cIdx });
      setDragCurrent({ row: rIdx, col: cIdx });
      if (rows[rIdx]) {
        setSelectedRowIds(new Set([rows[rIdx].id]));
      }
    }

    const x = Math.min(e.clientX, window.innerWidth - 230);
    const y = Math.min(e.clientY, window.innerHeight - 340);

    setContextMenu({
      visible: true,
      x: Math.max(10, x),
      y: Math.max(10, y),
      rIdx,
      cIdx
    });
  };

  const isCellSelected = (rIdx: number, cIdx: number) => {
    if (!dragStart || !dragCurrent) return false;
    const minR = Math.min(dragStart.row, dragCurrent.row);
    const maxR = Math.max(dragStart.row, dragCurrent.row);
    const minC = Math.min(dragStart.col, dragCurrent.col);
    const maxC = Math.max(dragStart.col, dragCurrent.col);
    return rIdx >= minR && rIdx <= maxR && cIdx >= minC && cIdx <= maxC;
  };

  const getCellClassName = (rIdx: number, cIdx: number, baseClass: string) => {
    const selected = isCellSelected(rIdx, cIdx);
    if (selected) {
      const isAnchor = dragStart && dragStart.row === rIdx && dragStart.col === cIdx;
      return `${baseClass} bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 outline-2 outline-emerald-600 dark:outline-emerald-400 -outline-offset-2 relative z-10 font-bold ${
        isAnchor ? "ring-2 ring-emerald-500/50" : ""
      }`;
    }
    return baseClass;
  };

  // Helper to parse a single line into component fields
  const parseLineComponents = (line: string, fallbackId: number) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    let cells: string[] = [];
    if (trimmed.includes("\t")) {
      cells = trimmed.split("\t");
    } else if (trimmed.includes(",")) {
      cells = trimmed.split(",");
    } else if (trimmed.includes(";")) {
      cells = trimmed.split(";");
    } else {
      cells = trimmed.split(/\s+/);
    }

    cells = cells.map(c => c.trim()).filter(c => c.length > 0);
    if (cells.length === 0) return null;

    let pointId = `PT-${fallbackId < 10 ? "0" + fallbackId : fallbackId}`;
    let input1 = "";
    let input2 = "";

    if (cells.length === 1) {
      const pair = splitPairedCoordinates(cells[0]);
      if (pair) {
        input1 = pair[0];
        input2 = pair[1];
      } else {
        input1 = cells[0];
      }
    } else if (cells.length === 2) {
      // 2 items: Coordinates only (X/Lon, Y/Lat) - Assign default point ID
      input1 = cells[0];
      input2 = cells[1];
    } else if (cells.length === 3) {
      // 3 items: Point ID/Name + Coord 1 + Coord 2
      pointId = cells[0];
      input1 = cells[1];
      input2 = cells[2];
    } else if (cells.length >= 4) {
      // 4 or more items: Point Number + Point Name + Coord 1 + Coord 2
      const coords1 = cells[cells.length - 2];
      const coords2 = cells[cells.length - 1];
      const nameParts = cells.slice(0, cells.length - 2);
      pointId = nameParts.join(" ");
      input1 = coords1;
      input2 = coords2;
    }

    return { pointId, input1, input2 };
  };

  // Extract text representation of any cell index
  const getCellText = (r: BatchRow, c: number): string => {
    switch (c) {
      case 0: return r.pointId;
      case 1: return r.pointId;
      case 2: return r.pointId;
      case 3: return r.input1;
      case 4: return r.input2;
      case 5: return r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "";
      case 6: return r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "";
      case 7: return r.outputZone || "";
      case 8: return r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "";
      case 9: return r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "";
      case 10: return r.outputDMSLon || formatDMS(r.outputLon, false);
      case 11: return r.outputDMSLat || formatDMS(r.outputLat, true);
      case 12: return r.status === "success" ? (lang === "ar" ? "ناجح" : "Success") : r.status === "error" ? (lang === "ar" ? "خطأ" : "Error") : (lang === "ar" ? "انتظار" : "Pending");
      default: return "";
    }
  };

  // Copy selected cell range
  const handleCopySelectedCells = () => {
    if (!dragStart || !dragCurrent) return;
    const minR = Math.min(dragStart.row, dragCurrent.row);
    const maxR = Math.max(dragStart.row, dragCurrent.row);
    const minC = Math.min(dragStart.col, dragCurrent.col);
    const maxC = Math.max(dragStart.col, dragCurrent.col);

    const lines: string[] = [];
    for (let r = minR; r <= maxR; r++) {
      const rowData = rows[r];
      if (!rowData) continue;
      const rowCells: string[] = [];
      for (let c = minC; c <= maxC; c++) {
        rowCells.push(getCellText(rowData, c));
      }
      lines.push(rowCells.join("\t"));
    }

    if (lines.length > 0) {
      navigator.clipboard.writeText(lines.join("\n"));
      setCopiedSelected(true);
      setTimeout(() => setCopiedSelected(false), 2000);
    }
  };

  // Copy entire row
  const handleCopyRow = (rIdx: number) => {
    const r = rows[rIdx];
    if (!r) return;
    const rowDataStr = [
      r.pointId,
      r.input1,
      r.input2,
      r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "",
      r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "",
      r.outputZone || "",
      r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "",
      r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "",
      r.outputDMSLon || formatDMS(r.outputLon, false),
      r.outputDMSLat || formatDMS(r.outputLat, true),
      r.status
    ].join("\t");

    navigator.clipboard.writeText(rowDataStr);
    setCopiedSelected(true);
    setTimeout(() => setCopiedSelected(false), 2000);
  };

  // Paste into grid starting from target cell
  const handlePasteContext = async (startRIdx: number, startCIdx: number) => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return;

      setRows(prevRows => {
        const nextRows = [...prevRows];
        lines.forEach((line, rOffset) => {
          const targetR = startRIdx + rOffset;
          if (targetR >= nextRows.length) {
            nextRows.push({
              id: nextRows.length > 0 ? Math.max(...nextRows.map(r => r.id)) + 1 : 1,
              pointId: `PT-${(nextRows.length + 1).toString().padStart(2, "0")}`,
              input1: "",
              input2: "",
              status: "idle",
              warnings: []
            });
          }

          const cells = line.split(/\t|,/);
          cells.forEach((cellVal, cOffset) => {
            const targetC = startCIdx + cOffset;
            const trimmedVal = cellVal.trim();
            
            if (targetC === 2) {
              nextRows[targetR].pointId = trimmedVal;
            } else if (targetC === 3) {
              nextRows[targetR].input1 = trimmedVal;
            } else if (targetC === 4) {
              nextRows[targetR].input2 = trimmedVal;
            } else if (targetC === 0 || targetC === 1) {
              if (cOffset === 0) nextRows[targetR].pointId = trimmedVal;
              else if (cOffset === 1) nextRows[targetR].input1 = trimmedVal;
              else if (cOffset === 2) nextRows[targetR].input2 = trimmedVal;
            }
          });
        });
        return nextRows;
      });
    } catch (err) {
      console.error("Paste context error:", err);
    }
  };

  // Clear selected editable input cells
  const handleClearSelectedCells = () => {
    if (!dragStart || !dragCurrent) return;
    const minR = Math.min(dragStart.row, dragCurrent.row);
    const maxR = Math.max(dragStart.row, dragCurrent.row);
    const minC = Math.min(dragStart.col, dragCurrent.col);
    const maxC = Math.max(dragStart.col, dragCurrent.col);

    setRows(prevRows => {
      const nextRows = [...prevRows];
      for (let r = minR; r <= maxR; r++) {
        if (!nextRows[r]) continue;
        for (let c = minC; c <= maxC; c++) {
          if (c === 2) nextRows[r].pointId = "";
          if (c === 3) nextRows[r].input1 = "";
          if (c === 4) nextRows[r].input2 = "";
        }
        nextRows[r].status = "idle";
        nextRows[r].outputX = undefined;
        nextRows[r].outputY = undefined;
        nextRows[r].outputLon = undefined;
        nextRows[r].outputLat = undefined;
        nextRows[r].outputZone = undefined;
        nextRows[r].outputDMSLon = undefined;
        nextRows[r].outputDMSLat = undefined;
      }
      return nextRows;
    });
  };

  // Insert row above or below
  const handleInsertRow = (rIdx: number, position: "above" | "below") => {
    setRows(prevRows => {
      const nextRows = [...prevRows];
      const newId = nextRows.length > 0 ? Math.max(...nextRows.map(r => r.id)) + 1 : 1;
      const insertIndex = position === "above" ? rIdx : rIdx + 1;
      const newRow: BatchRow = {
        id: newId,
        pointId: `PT-${(insertIndex + 1).toString().padStart(2, "0")}`,
        input1: "",
        input2: "",
        status: "idle",
        warnings: []
      };
      nextRows.splice(insertIndex, 0, newRow);
      return nextRows;
    });
  };

  // Delete row from context menu
  const handleDeleteRowContext = (rIdx: number) => {
    setRows(prevRows => {
      if (!prevRows[rIdx]) return prevRows;
      return prevRows.filter((_, i) => i !== rIdx);
    });
  };

  // View row on interactive satellite map
  const handleViewRowMap = (rIdx: number) => {
    const row = rows[rIdx];
    if (row) {
      setSelectedRowIds(new Set([row.id]));
      setIsMapModalOpen(true);
    }
  };

  // Keyboard shortcut listener for Excel-like operations (Arrow keys navigation, Ctrl+C, Delete)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C / Cmd+C for selection copy
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        const activeEl = document.activeElement;
        if (activeEl && activeEl.tagName === "INPUT") {
          const inputEl = activeEl as HTMLInputElement;
          if (inputEl.selectionStart !== inputEl.selectionEnd) {
            return;
          }
        }
        handleCopySelectedCells();
        return;
      }

      // Keyboard Arrow Key Navigation across spreadsheet cells
      if (!dragStart) return;
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && activeEl.tagName === "INPUT";

      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (isInputFocused && e.key !== "ArrowDown" && e.key !== "ArrowUp") {
          return;
        }

        e.preventDefault();
        const curR = dragCurrent ? dragCurrent.row : dragStart.row;
        const curC = dragCurrent ? dragCurrent.col : dragStart.col;

        let nextR = curR;
        let nextC = curC;

        if (e.key === "ArrowDown") nextR = Math.min(rows.length - 1, curR + 1);
        if (e.key === "ArrowUp") nextR = Math.max(0, curR - 1);
        if (e.key === "ArrowRight") nextC = Math.min(12, curC + 1);
        if (e.key === "ArrowLeft") nextC = Math.max(0, curC - 1);

        if (e.shiftKey) {
          setDragCurrent({ row: nextR, col: nextC });
        } else {
          setDragStart({ row: nextR, col: nextC });
          setDragCurrent({ row: nextR, col: nextC });
        }

        if (rows[nextR]) {
          setSelectedRowIds(new Set([rows[nextR].id]));
        }
      } else if (e.key === "Delete" && !isInputFocused) {
        handleClearSelectedCells();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dragStart, dragCurrent, rows, metricDecimals, geoDecimals]);

  // Pagination for DOM performance
  const [visibleCount, setVisibleCount] = useState(250);

  const srcCRS = CRS_LIST.find(c => c.id === sourceId) || CRS_LIST[0];
  const tgtCRS = CRS_LIST.find(c => c.id === targetId) || CRS_LIST[1];
  
  const isSrcMetric = srcCRS.type === CRSType.PROJECTED;
  const isTgtMetric = tgtCRS.type === CRSType.PROJECTED;

  // Format decimal to DMS string
  const formatDMS = (val: number | undefined, isLat: boolean) => {
    if (val === undefined || isNaN(val)) return "---";
    const absVal = Math.abs(val);
    const deg = Math.floor(absVal);
    const minFloat = (absVal - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = (minFloat - min) * 60;
    
    if (lang === "ar") {
      const dirAr = isLat ? (val >= 0 ? "شمالاً" : "جنوباً") : (val >= 0 ? "شرقاً" : "غرباً");
      return `${deg}° ${min}' ${sec.toFixed(2)}" ${dirAr}`;
    } else {
      const dirEn = isLat ? (val >= 0 ? "N" : "S") : (val >= 0 ? "E" : "W");
      return `${deg}° ${min}' ${sec.toFixed(2)}" ${dirEn}`;
    }
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedRowIds.size === rows.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(rows.map(r => r.id)));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Handle clipboard direct paste
  const handlePasteFromClipboard = async () => {
    try {
      setPasteError(null);
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawText(text);
        parseRawTextToGrid(text, false);
      } else {
        setPasteError(lang === "ar" ? "الحافظة فارغة." : "Clipboard is empty.");
      }
    } catch (err) {
      setPasteError(
        lang === "ar" 
          ? "يرجى استخدام اختصار الكيبورد (Ctrl+V) مباشرة داخل خلايا الجدول للصق البيانات." 
          : "Please use keyboard shortcut (Ctrl+V) directly inside table cells."
      );
    }
  };

  // Parses raw TSV or text into interactive rows
  const parseRawTextToGrid = (text: string, append = false) => {
    const lines = text.split(/\r?\n/);
    const parsedRows: BatchRow[] = append ? [...rows] : [];
    let startId = append ? (rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1) : 1;

    for (const line of lines) {
      const parsed = parseLineComponents(line, startId);
      if (!parsed) continue;

      parsedRows.push({
        id: startId++,
        pointId: parsed.pointId,
        input1: parsed.input1,
        input2: parsed.input2,
        status: "empty",
        warnings: []
      });
    }

    if (parsedRows.length > 0) {
      setRows(parsedRows);
      setSelectedRowIds(new Set());
      setVisibleCount(250);
    }
  };

  const handleClearAll = () => {
    setRawText("");
    setRows([]);
    setSelectedRowIds(new Set());
    setPasteError(null);
  };

  const handleAddRow = () => {
    const nextId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    const newRow: BatchRow = {
      id: nextId,
      pointId: `PT-${nextId < 10 ? '0' + nextId : nextId}`,
      input1: "",
      input2: "",
      status: "empty",
      warnings: []
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (id: number) => {
    setRows(prev => prev.filter(r => r.id !== id));
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedRowIds.size === 0) return;
    setRows(prev => prev.filter(r => !selectedRowIds.has(r.id)));
    setSelectedRowIds(new Set());
  };

  const handleCellEdit = (
    id: number,
    field: "pointId" | "input1" | "input2",
    value: string
  ) => {
    setRows(prevRows =>
      prevRows.map(r => {
        if (r.id === id) {
          return { ...r, [field]: value, status: "empty" };
        }
        return r;
      })
    );
  };

  // Intercept paste inside grid cells to auto-expand rows smoothly from Excel
  const handleCellPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    startRowIdx: number,
    targetField: "pointId" | "input1" | "input2"
  ) => {
    const pasteData = e.clipboardData.getData("text");
    if (!pasteData) return;

    const lines = pasteData.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    // If it's a single value without tab or newline, allow standard browser paste
    if (lines.length <= 1 && !pasteData.includes("\t")) {
      return;
    }

    // Intercept multi-row or multi-column paste
    e.preventDefault();

    setRows(prevRows => {
      const updatedRows = [...prevRows];
      let maxId = updatedRows.length > 0 ? Math.max(...updatedRows.map(r => r.id)) : 0;

      lines.forEach((line, i) => {
        const targetIdx = startRowIdx + i;
        const parsed = parseLineComponents(line, maxId + 1);

        // Auto-add new row if target index exceeds current array length
        if (targetIdx >= updatedRows.length) {
          maxId++;
          updatedRows.push({
            id: maxId,
            pointId: `PT-${maxId < 10 ? '0' + maxId : maxId}`,
            input1: "",
            input2: "",
            status: "empty",
            warnings: []
          });
        }

        const currentRow = { ...updatedRows[targetIdx], status: "empty" as const };

        if (parsed) {
          if (targetField === "pointId") {
            currentRow.pointId = parsed.pointId;
            currentRow.input1 = parsed.input1;
            currentRow.input2 = parsed.input2;
          } else if (targetField === "input1") {
            currentRow.input1 = parsed.input1;
            if (parsed.input2) currentRow.input2 = parsed.input2;
          } else if (targetField === "input2") {
            currentRow.input2 = parsed.input1;
          }
        }

        updatedRows[targetIdx] = currentRow;
      });

      return updatedRows;
    });
  };

  // Convert Mapped Data
  const handleConvertBatch = () => {
    if (rows.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const parsedCoordinates = rows.map(r => {
          const val1 = parseSingleCoordinate(r.input1);
          const val2 = parseSingleCoordinate(r.input2);
          return { id: r.id, val1, val2 };
        });

        let unifiedTargetOverride: any = undefined;
        if (zoneMode === TargetZoneMode.UNIFIED_CENTER) {
          let sumLat = 0;
          let sumLon = 0;
          let validCount = 0;

          parsedCoordinates.forEach(item => {
            if (item.val1 === null || item.val2 === null) return;
            
            let latWGS = 0;
            let lonWGS = 0;
            if (srcCRS.type === CRSType.GEOGRAPHIC) {
              if (srcCRS.datum === DatumType.EGYPT1907) {
                const wgs = convertCoordinates(item.val1, item.val2, srcCRS, CRS_LIST[0], false, false);
                latWGS = wgs.latWGS84;
                lonWGS = wgs.lonWGS84;
              } else {
                latWGS = item.val1;
                lonWGS = item.val2;
              }
            } else {
              const wgs = convertCoordinates(item.val1, item.val2, srcCRS, CRS_LIST[0], true, false);
              latWGS = wgs.latWGS84;
              lonWGS = wgs.lonWGS84;
            }

            sumLat += latWGS;
            sumLon += lonWGS;
            validCount++;
          });

          if (validCount > 0) {
            const centerLat = sumLat / validCount;
            const centerLon = sumLon / validCount;
            
            if (targetId === "AUTO:UTM") {
              unifiedTargetOverride = getUTMCRSForLon(centerLon);
            } else if (targetId === "AUTO:ETM") {
              unifiedTargetOverride = getETMBeltForLonLat(centerLon, centerLat);
            } else if (targetId === "AUTO:MTM") {
              unifiedTargetOverride = getMTMZoneForLon(centerLon);
            } else {
              unifiedTargetOverride = tgtCRS;
            }
          }
        } else if (zoneMode === TargetZoneMode.MANUAL) {
          if (targetId.startsWith("AUTO:")) {
            unifiedTargetOverride = CRS_LIST.find(c => c.id === manualTargetId) || CRS_LIST.find(c => c.id === "EPSG:32636");
          } else {
            unifiedTargetOverride = tgtCRS;
          }
        }

        let prevCoords: { x?: number; y?: number; lat?: number; lon?: number } | null = null;

        const updatedRows = rows.map((r, idx) => {
          const coords = parsedCoordinates[idx];
          if (coords.val1 === null || coords.val2 === null) {
            return {
              ...r,
              status: "error" as const,
              errorMsg: lang === "ar" ? "خطأ في تحليل الأرقام" : "Number parsing error"
            };
          }

          try {
            const res = convertCoordinates(
              coords.val1,
              coords.val2,
              srcCRS,
              tgtCRS,
              isSrcMetric,
              isTgtMetric,
              unifiedTargetOverride
            );

            let outX: number | undefined;
            let outY: number | undefined;
            let outLat: number | undefined;
            let outLon: number | undefined;
            let outZoneStr = "";

            if (isTgtMetric) {
              outX = res.out1;
              outY = res.out2;
              outLat = res.latWGS84;
              outLon = res.lonWGS84;
              
              const activeTgt = unifiedTargetOverride || (targetId === "AUTO:UTM" ? getUTMCRSForLon(res.lonWGS84) : (targetId === "AUTO:ETM" ? getETMBeltForLonLat(res.lonWGS84, res.latWGS84) : (targetId === "AUTO:MTM" ? getMTMZoneForLon(res.lonWGS84) : tgtCRS)));
              outZoneStr = activeTgt.nameAr || activeTgt.nameEn;
            } else {
              outLat = res.out1;
              outLon = res.out2;
              outZoneStr = tgtCRS.nameAr || tgtCRS.nameEn;
            }

            const outDMSLatStr = formatDMS(outLat, true);
            const outDMSLonStr = formatDMS(outLon, false);

            return {
              ...r,
              outputX: outX,
              outputY: outY,
              outputLat: outLat,
              outputLon: outLon,
              outputDMSLat: outDMSLatStr,
              outputDMSLon: outDMSLonStr,
              outputDMS: `${outDMSLatStr} , ${outDMSLonStr}`,
              outputZone: outZoneStr,
              status: "success" as const,
              warnings: res.warnings,
              operationId: res.operationId,
              accuracyMeters: res.accuracyMeters
            };
          } catch (err) {
            return {
              ...r,
              status: "error" as const,
              errorMsg: lang === "ar" ? "فشل الحساب الجيوديسي" : "Geodetic computation failed"
            };
          }
        });

        setRows(updatedRows);
      } catch (err) {
        console.error("Batch processing error", err);
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  };

  // Copy selected rows to clipboard formatted as TSV with headers
  const handleCopySelectedRows = () => {
    const targetRows = selectedRowIds.size > 0 
      ? rows.filter(r => selectedRowIds.has(r.id))
      : rows;

    if (targetRows.length === 0) return;

    const headers = [
      lang === "ar" ? "اسم / رقم النقطة" : "Point ID",
      isSrcMetric ? "Input Easting X (m)" : "Input Lon X (°)",
      isSrcMetric ? "Input Northing Y (m)" : "Input Lat Y (°)",
      "Output Easting X (m)",
      "Output Northing Y (m)",
      lang === "ar" ? "المنطقة / الحزام" : "Zone / Belt",
      "Output Lon X (°)",
      "Output Lat Y (°)",
      "Output Lon DMS",
      "Output Lat DMS"
    ];

    const lines = targetRows.map(r => [
      r.pointId,
      r.input1,
      r.input2,
      r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "",
      r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "",
      r.outputZone || "",
      r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "",
      r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "",
      r.outputDMSLon || formatDMS(r.outputLon, false),
      r.outputDMSLat || formatDMS(r.outputLat, true)
    ].join("\t"));

    const tsvText = [headers.join("\t"), ...lines].join("\n");
    navigator.clipboard.writeText(tsvText);
    setCopiedSelected(true);
    setTimeout(() => setCopiedSelected(false), 2000);
  };

  // Copy Specific Group Results to Clipboard as tab-separated columns
  const copyGroupResults = (mode: "metric" | "geographic") => {
    const targetRows = selectedRowIds.size > 0 
      ? rows.filter(r => selectedRowIds.has(r.id))
      : rows;

    if (targetRows.length === 0) return;
    
    let header = "";
    let lines = [];

    if (mode === "metric") {
      header = `${lang === "ar" ? "رمز النقطة" : "Point ID"}\tEasting (X)\tNorthing (Y)\tZone`;
      lines = targetRows.map(r => {
        if (r.status !== "success") return `${r.pointId}\tERROR\tERROR\t`;
        return `${r.pointId}\t${r.outputX?.toFixed(metricDecimals) || ""}\t${r.outputY?.toFixed(metricDecimals) || ""}\t${r.outputZone || ""}`;
      });
    } else {
      header = `${lang === "ar" ? "رمز النقطة" : "Point ID"}\tLongitude (DD)\tLatitude (DD)\tLon DMS\tLat DMS`;
      lines = targetRows.map(r => {
        if (r.status !== "success") return `${r.pointId}\tERROR\tERROR\tERROR\tERROR`;
        return `${r.pointId}\t${r.outputLon?.toFixed(geoDecimals) || ""}\t${r.outputLat?.toFixed(geoDecimals) || ""}\t${r.outputDMSLon || formatDMS(r.outputLon, false)}\t${r.outputDMSLat || formatDMS(r.outputLat, true)}`;
      });
    }

    const tsvText = [header, ...lines].join("\n");
    navigator.clipboard.writeText(tsvText);

    if (mode === "metric") {
      setCopiedMetric(true);
      setTimeout(() => setCopiedMetric(false), 2000);
    } else {
      setCopiedGeo(true);
      setTimeout(() => setCopiedGeo(false), 2000);
    }
  };

  // Export full table as CSV / Excel
  const handleExportCSV = () => {
    setIsExportModalOpen(true);
  };

  // Direct Quick KML Download
  const handleExportKML = () => {
    const targetRows = selectedRowIds.size > 0 ? rows.filter(r => selectedRowIds.has(r.id)) : rows;
    downloadKMLFile(targetRows, metricDecimals, geoDecimals, formatDMS, lang);
  };

  return (
    <div className="space-y-6" id="batch_tab_container">
      <FormatGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        rows={rows}
        selectedRowIds={selectedRowIds}
        lang={lang}
        metricDecimals={metricDecimals}
        geoDecimals={geoDecimals}
        formatDMS={formatDMS}
        sourceCRSName={srcCRS.nameAr || srcCRS.nameEn}
        targetCRSName={tgtCRS.nameAr || tgtCRS.nameEn}
      />
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        rows={rows}
        selectedRowIds={selectedRowIds}
        lang={lang}
        metricDecimals={metricDecimals}
        geoDecimals={geoDecimals}
        formatDMS={formatDMS}
      />

      {/* Configuration Controls Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-6 shadow-sm space-y-4" id="batch_controls">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CRSSelect
            label={t.sourceCRS}
            value={sourceId}
            onChange={(newId) => setSourceId(newId)}
            lang={lang}
            id="batch_source_crs_select"
          />

          <CRSSelect
            label={t.targetCRS}
            value={targetId}
            onChange={(newId) => setTargetId(newId)}
            lang={lang}
            id="batch_target_crs_select"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-slate-300 mb-1.5 block">{t.targetZoneMode}</label>
            <select
              value={zoneMode}
              onChange={(e) => setZoneMode(e.target.value as TargetZoneMode)}
              className="w-full h-[46px] rounded-xl border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
            >
              <option value={TargetZoneMode.AUTO}>{t.modeAutoPerPoint}</option>
              <option value={TargetZoneMode.UNIFIED_CENTER}>{t.modeUnifiedCenter}</option>
              <option value={TargetZoneMode.MANUAL}>{t.modeManual}</option>
            </select>
          </div>
        </div>

        {/* Conditional Manual Zone Override Dropdown */}
        {zoneMode === TargetZoneMode.MANUAL && targetId.startsWith("AUTO:") && (
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800/60 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                {lang === "ar" ? "اختر النطاق / الحزام الفرعي الموحد يدوياً:" : "Select Manual Override Zone:"}
              </span>
              <p className="text-[11px] text-sky-700 dark:text-sky-300">
                {lang === "ar"
                  ? "سيتم فرض هذا النطاق إجبارياً على جميع النقاط في هذا الجدول."
                  : "All points in this table will be strictly projected into this selected zone."}
              </p>
            </div>
            <select
              value={manualTargetId}
              onChange={(e) => setManualTargetId(e.target.value)}
              className="h-10 rounded-lg border border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-sky-950 dark:text-sky-100 focus:outline-none focus:border-sky-500"
            >
              <option value="EPSG:32635">UTM Zone 35N (EPSG:32635)</option>
              <option value="EPSG:32636">UTM Zone 36N - مصر / الشرق الأوسط (EPSG:32636)</option>
              <option value="EPSG:32637">UTM Zone 37N (EPSG:32637)</option>
              <option value="EPSG:22992">ETM Red Belt - الحزام الأحمر المصرية (EPSG:22992)</option>
              <option value="EPSG:22993">ETM Purple Belt - الحزام البنفسجي (EPSG:22993)</option>
              <option value="EPSG:22994">ETM Extended Purple Belt - البنفسجي الممتد (EPSG:22994)</option>
              <option value="EPSG:22991">ETM Blue Belt - الحزام الأزرق (EPSG:22991)</option>
            </select>
          </div>
        )}

        {/* Scope Clarification & Guidance Card */}
        <ScopeHelpCard
          lang={lang}
          activeMode={zoneMode}
          onSelectMode={(mode) => setZoneMode(mode)}
        />

        {/* Primary Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100 dark:border-slate-700">
          <button
            onClick={handleConvertBatch}
            disabled={rows.length === 0 || isProcessing}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{t.convertData}</span>
          </button>

          <button
            onClick={handlePasteFromClipboard}
            className="px-3.5 py-2 bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 text-neutral-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-neutral-300/60 dark:border-slate-600"
            title={lang === "ar" ? "لصق الحافظة كجدول" : "Paste Clipboard"}
          >
            <Clipboard className="w-4 h-4 text-neutral-500 dark:text-slate-400" />
            <span>{t.pasteClipboard}</span>
          </button>

          <button
            onClick={() => setIsRawPanelOpen(!isRawPanelOpen)}
            className="px-3.5 py-2 bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 text-neutral-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-neutral-300/60 dark:border-slate-600"
          >
            <FileSpreadsheet className="w-4 h-4 text-neutral-500 dark:text-slate-400" />
            <span>{lang === "ar" ? "إدخال / لصق نصي" : "Raw Text Input"}</span>
            {isRawPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleAddRow}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800"
          >
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.addRow}</span>
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === "ar" ? "دليل الصيغ" : "Format Guide"}</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={rows.length === 0}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-rose-200/50 dark:border-rose-800/50 ml-auto disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clearAll}</span>
          </button>
        </div>

        {pasteError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs rounded-lg">
            {pasteError}
          </div>
        )}

        {/* Optional Collapsible Raw Text Panel */}
        {isRawPanelOpen && (
          <div className="pt-3 border-t border-neutral-200 dark:border-slate-700 space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-slate-400">
              <span className="font-semibold text-neutral-700 dark:text-slate-300">
                {lang === "ar" ? "إدخال نصي مباشر (معالجة النص وتوزيعه):" : "Raw Text Entry & Parsing:"}
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-slate-400">
                {lang === "ar" 
                  ? "يدعم الإدخال: [اسم النقطة, X/خط طول, Y/دايرة عرض]" 
                  : "Supports: [Point Name, X/Lon, Y/Lat]"}
              </span>
            </div>
            
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={t.pastePlaceholder}
              className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 p-3 font-mono text-xs text-neutral-700 dark:text-slate-200 placeholder-neutral-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 bg-neutral-50/50 dark:bg-slate-900/50"
            ></textarea>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => parseRawTextToGrid(rawText, false)}
                disabled={!rawText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "معالجة واستبدال جدول البيانات" : "Process & Replace Table"}</span>
              </button>

              <button
                onClick={() => parseRawTextToGrid(rawText, true)}
                disabled={!rawText.trim()}
                className="px-4 py-2 bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 text-neutral-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 border border-neutral-300/70 dark:border-slate-600"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "ar" ? "إضافة النقاط المكتوبة للجدول الحالي" : "Process & Append to Table"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Table Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col" id="batch_spreadsheet_grid">
        
        {/* Table Selection & Export Action Header */}
        <div className="bg-neutral-50 dark:bg-slate-900/70 px-6 py-3 border-b border-neutral-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-neutral-800 dark:text-slate-100">
              {lang === "ar" ? `جدول البيانات (${rows.length} صف)` : `Data Table (${rows.length} Rows)`}
            </span>

            {selectedRowIds.size > 0 && (
              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                {lang === "ar" ? `محدد (${selectedRowIds.size})` : `Selected (${selectedRowIds.size})`}
              </span>
            )}
          </div>

          {/* Quick Selection Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySelectedRows}
              disabled={rows.length === 0}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40 shadow-xs"
              title={lang === "ar" ? "نسخ النقاط المحددة أو الكل إلى الحافظة" : "Copy selected or all rows"}
            >
              {copiedSelected ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{lang === "ar" ? `نسخ المحددة ${selectedRowIds.size > 0 ? `(${selectedRowIds.size})` : "(الكل)"}` : `Copy Selected (${selectedRowIds.size > 0 ? selectedRowIds.size : "All"})`}</span>
            </button>

            <button
              onClick={() => copyGroupResults("metric")}
              disabled={rows.length === 0 || !rows.some(r => r.status === "success")}
              className="px-3 py-1.5 bg-neutral-800 dark:bg-slate-900 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              {copiedMetric ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{lang === "ar" ? "نسخ المترية" : "Copy Metric"}</span>
            </button>

            <button
              onClick={() => copyGroupResults("geographic")}
              disabled={rows.length === 0 || !rows.some(r => r.status === "success")}
              className="px-3 py-1.5 bg-neutral-800 dark:bg-slate-900 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              {copiedGeo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{lang === "ar" ? "نسخ الجغرافية" : "Copy Geographic"}</span>
            </button>

            <button
              onClick={() => setIsMapModalOpen(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              title={lang === "ar" ? "عرض النقاط المحولة على الخريطة التفاعلية والأقمار الصناعية" : "View points on interactive satellite map"}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "معاينة النقاط على الخريطة" : "View on Map"}</span>
            </button>

            <button
              onClick={handleExportKML}
              disabled={rows.length === 0}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              title={lang === "ar" ? "تصدير النقاط إلى ملف KML لبرنامج Google Earth" : "Export points to Google Earth KML"}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "تصدير KML (Google Earth)" : "Export KML"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={rows.length === 0}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 text-neutral-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-neutral-300/60 dark:border-slate-600 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-slate-400" />
              <span>{lang === "ar" ? "تصدير الجدول (Excel/CSV)" : "Export Table"}</span>
            </button>

            {selectedRowIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? `حذف (${selectedRowIds.size})` : `Delete (${selectedRowIds.size})`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Excel Spreadsheet Table Container */}
        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-slate-700 shadow-2xs">
          <table className="w-full text-center border-collapse min-w-[1300px]">
            <thead>
              {/* Group Super Headers */}
              <tr className="bg-neutral-200/90 dark:bg-slate-900 text-neutral-700 dark:text-slate-300 font-sans text-[11px] font-bold border-b border-neutral-300 dark:border-slate-700 select-none">
                <th colSpan={3} className="px-3 py-2 text-center border-r border-neutral-300 dark:border-slate-700 bg-neutral-200 dark:bg-slate-900 whitespace-nowrap">
                  {lang === "ar" ? "بيانات النقطة" : "Point Reference"}
                </th>
                <th colSpan={2} className="px-3 py-2 text-center border-r border-neutral-300 dark:border-slate-700 bg-amber-100/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 whitespace-nowrap">
                  {lang === "ar" ? "أعمدة الإدخال المصدرية (Source Input)" : "Source Input Columns"}
                </th>
                <th colSpan={3} className="px-3 py-2 text-center border-r border-neutral-300 dark:border-slate-700 bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 whitespace-nowrap">
                  {lang === "ar" ? "النتائج المترية المسقطة (Metric Projected)" : "Projected Metric Output"}
                </th>
                <th colSpan={4} className="px-3 py-2 text-center border-r border-neutral-300 dark:border-slate-700 bg-sky-100/80 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 whitespace-nowrap">
                  {lang === "ar" ? "النتائج الجغرافية (Geographic WGS84)" : "Geographic Output (WGS 84)"}
                </th>
                <th colSpan={2} className="px-3 py-2 text-center bg-neutral-200 dark:bg-slate-900 whitespace-nowrap">
                  {lang === "ar" ? "الحالة والتحكم" : "Status & Actions"}
                </th>
              </tr>

              {/* Individual Column Headers */}
              <tr className="bg-neutral-100 dark:bg-slate-800/90 text-neutral-600 dark:text-slate-300 font-sans uppercase text-[11px] font-bold border-b border-neutral-300 dark:border-slate-700 select-none">
                {/* Select All Checkbox */}
                <th className="px-2 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 w-10 min-w-[40px]">
                  <input
                    type="checkbox"
                    checked={rows.length > 0 && selectedRowIds.size === rows.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    title={lang === "ar" ? "تحديد جميع الصفوف" : "Select all rows"}
                  />
                </th>

                {/* Index # */}
                <th className="px-2 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 w-12 min-w-[48px]">#</th>
                
                {/* Point ID */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 min-w-[130px] whitespace-nowrap">{t.pointId}</th>
                
                {/* Input 1 */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 min-w-[150px] whitespace-nowrap">
                  {isSrcMetric ? `${t.easting} (X) - م` : `${t.longitude} (X/Lon)`}
                </th>

                {/* Input 2 */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 min-w-[150px] whitespace-nowrap">
                  {isSrcMetric ? `${t.northing} (Y) - م` : `${t.latitude} (Y/Lat)`}
                </th>

                {/* Output Easting X */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 min-w-[140px] whitespace-nowrap">
                  {lang === "ar" ? "الشرقي X (متر)" : "Easting X (m)"}
                </th>

                {/* Output Northing Y */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 min-w-[140px] whitespace-nowrap">
                  {lang === "ar" ? "الشمالي Y (متر)" : "Northing Y (m)"}
                </th>

                {/* Output Zone */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-emerald-900 dark:text-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/30 min-w-[160px] max-w-[220px] whitespace-nowrap">
                  {lang === "ar" ? "المنطقة / الحزام" : "Zone / Belt"}
                </th>

                {/* Output Lon Decimal */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-sky-800 dark:text-sky-300 bg-sky-50/50 dark:bg-sky-950/30 min-w-[130px] whitespace-nowrap">
                  {lang === "ar" ? "خط الطول Lon (°)" : "Longitude (°)"}
                </th>

                {/* Output Lat Decimal */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-sky-800 dark:text-sky-300 bg-sky-50/50 dark:bg-sky-950/30 min-w-[130px] whitespace-nowrap">
                  {lang === "ar" ? "خط العرض Lat (°)" : "Latitude (°)"}
                </th>

                {/* Separate Lon DMS Column */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-sky-900 dark:text-sky-200 bg-sky-50/30 dark:bg-sky-950/20 min-w-[150px] whitespace-nowrap">
                  {lang === "ar" ? "خط الطول (DMS - X)" : "Lon DMS (X)"}
                </th>

                {/* Separate Lat DMS Column */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 text-sky-900 dark:text-sky-200 bg-sky-50/30 dark:bg-sky-950/20 min-w-[150px] whitespace-nowrap">
                  {lang === "ar" ? "خط العرض (DMS - Y)" : "Lat DMS (Y)"}
                </th>

                {/* Status */}
                <th className="px-3 py-2.5 text-center border-r border-neutral-200 dark:border-slate-700 min-w-[90px] whitespace-nowrap">{t.status}</th>
                
                {/* Actions */}
                <th className="px-2 py-2.5 text-center min-w-[44px]"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-slate-700 font-mono text-xs text-neutral-700 dark:text-slate-200">
              {rows.slice(0, visibleCount).map((r, idx) => {
                const isSelected = selectedRowIds.has(r.id);

                let statusBadge = null;
                if (r.status === "success") {
                  statusBadge = (
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-full font-sans text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800/60 whitespace-nowrap">
                      {lang === "ar" ? "ناجح" : "Success"}
                    </span>
                  );
                } else if (r.status === "error") {
                  statusBadge = (
                    <span className="inline-block px-2 py-0.5 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded-full font-sans text-[10px] font-bold border border-red-200/60 dark:border-red-800/60 whitespace-nowrap" title={r.errorMsg}>
                      {lang === "ar" ? "خطأ" : "Error"}
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 dark:bg-slate-700 text-neutral-500 dark:text-slate-400 rounded-full font-sans text-[10px] font-bold whitespace-nowrap">
                      {lang === "ar" ? "انتظار" : "Pending"}
                    </span>
                  );
                }

                return (
                  <tr
                    key={r.id}
                    className={`transition-colors select-text ${
                      isSelected
                        ? "bg-emerald-50/70 dark:bg-emerald-950/40"
                        : idx % 2 === 0
                        ? "bg-white dark:bg-slate-900 hover:bg-neutral-50 dark:hover:bg-slate-800/60"
                        : "bg-neutral-50/40 dark:bg-slate-800/30 hover:bg-neutral-100/60 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 0)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 0)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 0)}
                      className={getCellClassName(idx, 0, "px-2 py-1.5 text-center border-r border-neutral-200 dark:border-slate-700")}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(r.id)}
                        className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* Row Index */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 1)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 1)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 1)}
                      className={getCellClassName(idx, 1, "px-2 py-1.5 text-center border-r border-neutral-200 dark:border-slate-700 bg-neutral-50/50 dark:bg-slate-900/30 text-neutral-400 dark:text-slate-500 font-sans cursor-pointer")}
                    >
                      {idx + 1}
                    </td>
                    
                    {/* Editable Point ID Cell */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 2)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 2)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 2)}
                      className={getCellClassName(idx, 2, "p-0 border-r border-neutral-200 dark:border-slate-700")}
                    >
                      <input
                        type="text"
                        value={r.pointId}
                        onChange={(e) => handleCellEdit(r.id, "pointId", e.target.value)}
                        onPaste={(e) => handleCellPaste(e, idx, "pointId")}
                        className="w-full h-full text-center bg-transparent px-3 py-2 font-semibold text-neutral-800 dark:text-slate-100 border-none outline-none focus:outline-none focus:bg-emerald-50/60 dark:focus:bg-emerald-950/50"
                      />
                    </td>

                    {/* Editable Input 1 Cell */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 3)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 3)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 3)}
                      className={getCellClassName(idx, 3, "p-0 border-r border-neutral-200 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-950/10")}
                    >
                      <input
                        type="text"
                        value={r.input1}
                        onChange={(e) => handleCellEdit(r.id, "input1", e.target.value)}
                        onPaste={(e) => handleCellPaste(e, idx, "input1")}
                        placeholder={isSrcMetric ? "Easting (X)" : "Longitude (X/Lon)"}
                        className="w-full h-full text-center bg-transparent px-3 py-2 text-neutral-800 dark:text-slate-100 border-none outline-none focus:outline-none focus:bg-amber-100/60 dark:focus:bg-amber-900/40 font-mono"
                      />
                    </td>

                    {/* Editable Input 2 Cell */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 4)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 4)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 4)}
                      className={getCellClassName(idx, 4, "p-0 border-r border-neutral-200 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-950/10")}
                    >
                      <input
                        type="text"
                        value={r.input2}
                        onChange={(e) => handleCellEdit(r.id, "input2", e.target.value)}
                        onPaste={(e) => handleCellPaste(e, idx, "input2")}
                        placeholder={isSrcMetric ? "Northing (Y)" : "Latitude (Y/Lat)"}
                        className="w-full h-full text-center bg-transparent px-3 py-2 text-neutral-800 dark:text-slate-100 border-none outline-none focus:outline-none focus:bg-amber-100/60 dark:focus:bg-amber-900/40 font-mono"
                      />
                    </td>

                    {/* Computed Output Easting X */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 5)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 5)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 5)}
                      className={getCellClassName(idx, 5, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 bg-emerald-50/10 font-bold select-all whitespace-nowrap cursor-pointer")}
                    >
                      {r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "---"}
                    </td>

                    {/* Computed Output Northing Y */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 6)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 6)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 6)}
                      className={getCellClassName(idx, 6, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 bg-emerald-50/10 font-bold select-all whitespace-nowrap cursor-pointer")}
                    >
                      {r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "---"}
                    </td>

                    {/* Computed Output Zone */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 7)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 7)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 7)}
                      className={getCellClassName(idx, 7, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 font-sans text-neutral-700 dark:text-slate-200 text-xs truncate max-w-[200px] cursor-pointer")}
                      title={r.outputZone}
                    >
                      {r.outputZone || "---"}
                    </td>

                    {/* Computed Output Lon Decimal */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 8)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 8)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 8)}
                      className={getCellClassName(idx, 8, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 text-sky-800 dark:text-sky-300 bg-sky-50/10 select-all whitespace-nowrap cursor-pointer")}
                    >
                      {r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "---"}
                    </td>

                    {/* Computed Output Lat Decimal */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 9)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 9)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 9)}
                      className={getCellClassName(idx, 9, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 text-sky-800 dark:text-sky-300 bg-sky-50/10 select-all whitespace-nowrap cursor-pointer")}
                    >
                      {r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "---"}
                    </td>

                    {/* Separate Lon DMS Cell */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 10)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 10)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 10)}
                      className={getCellClassName(idx, 10, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 text-[11px] text-sky-900 dark:text-sky-200 font-mono select-all whitespace-nowrap cursor-pointer")}
                      title={r.outputDMSLon || formatDMS(r.outputLon, false)}
                    >
                      {r.outputDMSLon || formatDMS(r.outputLon, false)}
                    </td>

                    {/* Separate Lat DMS Cell */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 11)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 11)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 11)}
                      className={getCellClassName(idx, 11, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700 text-[11px] text-sky-900 dark:text-sky-200 font-mono select-all whitespace-nowrap cursor-pointer")}
                      title={r.outputDMSLat || formatDMS(r.outputLat, true)}
                    >
                      {r.outputDMSLat || formatDMS(r.outputLat, true)}
                    </td>

                    {/* Status */}
                    <td
                      onMouseDown={() => handleCellMouseDown(idx, 12)}
                      onMouseEnter={() => handleCellMouseEnter(idx, 12)}
                      onContextMenu={(e) => handleContextMenu(e, idx, 12)}
                      className={getCellClassName(idx, 12, "px-3 py-2 text-center border-r border-neutral-200 dark:border-slate-700")}
                    >
                      {statusBadge}
                    </td>

                    {/* Row Remove Action */}
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => handleRemoveRow(r.id)}
                        className="text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1 rounded"
                        title={lang === "ar" ? "حذف هذا الصف" : "Delete row"}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Load More & Add Row Bar */}
        <div className="bg-neutral-50 dark:bg-slate-900/50 p-4 border-t border-neutral-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleAddRow}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg shadow-sm border border-neutral-300 dark:border-slate-600 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addRow}</span>
          </button>

          {rows.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(prev => prev + 500)}
              className="px-4 py-1.5 bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 text-neutral-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-sm border border-neutral-300 dark:border-slate-600 transition-colors"
            >
              {lang === "ar" ? `تحميل 500 صف إضافي (المعروض: ${visibleCount} من ${rows.length})` : `Load 500 More Rows (Showing ${visibleCount} of ${rows.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Excel/Sheets Floating Context Menu (Right Click) */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl shadow-2xl py-1.5 min-w-[220px] text-xs font-sans text-neutral-800 dark:text-slate-100 divide-y divide-neutral-100 dark:divide-slate-700/60 animate-fadeIn"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400 dark:text-slate-500 tracking-wider">
            {lang === "ar" ? "خيارات الخلية والجدول" : "Cell & Table Options"}
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                handleCopySelectedCells();
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-slate-700/80 flex items-center gap-2 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "ar" ? "نسخ الخلايا المحددة (Ctrl+C)" : "Copy Selected Cells"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleCopyRow(contextMenu.rIdx);
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-slate-700/80 flex items-center gap-2 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "ar" ? "نسخ الصف بالكامل" : "Copy Entire Row"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handlePasteContext(contextMenu.rIdx, contextMenu.cIdx);
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-slate-700/80 flex items-center gap-2 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === "ar" ? "لصق من الحافظة (Ctrl+V)" : "Paste from Clipboard"}</span>
            </button>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                handleClearSelectedCells();
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-slate-700/80 flex items-center gap-2 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5 text-neutral-500" />
              <span>{lang === "ar" ? "مسح محتوى الخلية (Delete)" : "Clear Cell Content"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleInsertRow(contextMenu.rIdx, "above");
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-slate-700/80 flex items-center gap-2 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lang === "ar" ? "إدراج صف للأعلى" : "Insert Row Above"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleInsertRow(contextMenu.rIdx, "below");
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-slate-700/80 flex items-center gap-2 text-neutral-700 dark:text-slate-200 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lang === "ar" ? "إدراج صف للأسفل" : "Insert Row Below"}</span>
            </button>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                handleViewRowMap(contextMenu.rIdx);
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-sky-50 dark:hover:bg-slate-700/80 flex items-center gap-2 text-sky-700 dark:text-sky-300 font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lang === "ar" ? "معاينة النقطة على الخريطة" : "View Point on Map"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleDeleteRowContext(contextMenu.rIdx);
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
              className="w-full text-start px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "حذف هذا الصف" : "Delete Row"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
