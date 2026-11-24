/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, X, FileSpreadsheet, Check, FileText, Settings2, Table, Copy, Globe } from "lucide-react";
import { BatchRow } from "../types";
import { downloadKMLFile } from "../utils/kmlExport";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: BatchRow[];
  selectedRowIds: Set<number>;
  lang: "ar" | "en";
  metricDecimals: number;
  geoDecimals: number;
  formatDMS: (val: number | undefined, isLat: boolean) => string;
}

export default function ExportModal({
  isOpen,
  onClose,
  rows,
  selectedRowIds,
  lang,
  metricDecimals,
  geoDecimals,
  formatDMS,
}: ExportModalProps) {
  if (!isOpen) return null;

  const isAr = lang === "ar";

  // Export State Options
  const [exportFormat, setExportFormat] = useState<"excel" | "csv_comma" | "csv_semicolon" | "kml">("excel");
  const [headerType, setHeaderType] = useState<"bilingual" | "ar" | "en">("bilingual");
  const [scope, setScope] = useState<"all" | "selected">(selectedRowIds.size > 0 ? "selected" : "all");
  const [copied, setCopied] = useState(false);

  const targetRows = scope === "selected" && selectedRowIds.size > 0
    ? rows.filter((r) => selectedRowIds.has(r.id))
    : rows;

  const getHeaders = () => {
    if (headerType === "ar") {
      return [
        "اسم_النقطة",
        "X_الإدخال",
        "Y_الإدخال",
        "الشرقي_X_متر",
        "الشمالي_Y_متر",
        "المنطقة_الحزام",
        "خط_الطول_درجات",
        "خط_العرض_درجات",
        "خط_الطول_DMS",
        "خط_العرض_DMS",
        "الحالة"
      ];
    } else if (headerType === "en") {
      return [
        "Point_ID",
        "Input_X",
        "Input_Y",
        "Easting_X_m",
        "Northing_Y_m",
        "Zone_Belt",
        "Longitude_X_deg",
        "Latitude_Y_deg",
        "Lon_DMS",
        "Lat_DMS",
        "Status"
      ];
    } else {
      // Bilingual - Clear for both Arabic and English Excel users
      return [
        "اسم النقطة (Point ID)",
        "X الإدخال (Input X)",
        "Y الإدخال (Input Y)",
        "الشرقي X - متر (Easting X m)",
        "الشمالي Y - متر (Northing Y m)",
        "المنطقة / الحزام (Zone/Belt)",
        "خط الطول (Longitude °)",
        "خط العرض (Latitude °)",
        "خط الطول DMS",
        "خط العرض DMS",
        "الحالة (Status)"
      ];
    }
  };

  const handleCopyToClipboard = () => {
    if (targetRows.length === 0) return;
    const headers = getHeaders();
    
    // TAB separated values paste directly into Excel cells cleanly
    const headerStr = headers.join("\t");
    const rowsStr = targetRows.map((r) => {
      const pId = r.pointId || "";
      const in1 = r.input1 || "";
      const in2 = r.input2 || "";
      const outX = r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "";
      const outY = r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "";
      const zone = r.outputZone || "";
      const lon = r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "";
      const lat = r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "";
      const dmsLon = r.outputDMSLon || formatDMS(r.outputLon, false);
      const dmsLat = r.outputDMSLat || formatDMS(r.outputLat, true);
      const status = r.status === "success" ? (isAr ? "نجاح" : "Success") : r.status === "error" ? (isAr ? "خطأ" : "Error") : (isAr ? "فارغ" : "Empty");

      return [pId, in1, in2, outX, outY, zone, lon, lat, dmsLon, dmsLat, status].join("\t");
    }).join("\n");

    const fullTableText = `${headerStr}\n${rowsStr}`;
    navigator.clipboard.writeText(fullTableText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleExecuteExport = () => {
    if (targetRows.length === 0) return;

    if (exportFormat === "kml") {
      downloadKMLFile(targetRows, metricDecimals, geoDecimals, formatDMS, lang);
      onClose();
      return;
    }

    const headers = getHeaders();
    const dateStr = new Date().toISOString().slice(0, 10);

    if (exportFormat === "excel") {
      // Generate Native Excel HTML/XML Spreadsheet table (.xls)
      const isRtlStr = isAr ? 'dir="rtl"' : 'dir="ltr"';
      const headerHtml = headers
        .map((h) => `<th style="background-color: #047857; color: #ffffff; font-weight: bold; border: 1px solid #065f46; padding: 8px; text-align: center;">${h}</th>`)
        .join("");

      const rowsHtml = targetRows
        .map((r) => {
          const pId = r.pointId || "";
          const in1 = r.input1 || "";
          const in2 = r.input2 || "";
          const outX = r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "";
          const outY = r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "";
          const zone = r.outputZone || "";
          const lon = r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "";
          const lat = r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "";
          const dmsLon = r.outputDMSLon || formatDMS(r.outputLon, false);
          const dmsLat = r.outputDMSLat || formatDMS(r.outputLat, true);
          const status = r.status === "success" ? (isAr ? "نجاح" : "Success") : r.status === "error" ? (isAr ? "خطأ" : "Error") : (isAr ? "فارغ" : "Empty");

          const cells = [pId, in1, in2, outX, outY, zone, lon, lat, dmsLon, dmsLat, status]
            .map((val) => `<td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; mso-number-format:'\\@';">${val}</td>`)
            .join("");

          return `<tr>${cells}</tr>`;
        })
        .join("\n");

      const excelTemplate = `
        <html xmlns:o="urn:schemas-microsoft-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>Coordinates</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                      ${isAr ? "<x:DisplayRightToLeft/>" : ""}
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook>
            </xml>
            <![endif]-->
          </head>
          <body ${isRtlStr}>
            <table border="1">
              <thead>
                <tr>${headerHtml}</tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const blob = new Blob(["\uFEFF" + excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Egypt_Coordinates_Batch_${dateStr}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else {
      // CSV Export (Comma or Semicolon)
      const delimiter = exportFormat === "csv_semicolon" ? ";" : ",";

      const escapeCell = (val: string | number | undefined) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/\r?\n/g, " ");
        return `"${str.replace(/"/g, '""')}"`;
      };

      const lines = targetRows.map((r) => {
        const pId = escapeCell(r.pointId);
        const in1 = escapeCell(r.input1);
        const in2 = escapeCell(r.input2);
        const outX = r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "";
        const outY = r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "";
        const zone = escapeCell(r.outputZone || "");
        const lon = r.outputLon !== undefined ? r.outputLon.toFixed(geoDecimals) : "";
        const lat = r.outputLat !== undefined ? r.outputLat.toFixed(geoDecimals) : "";
        const dmsLon = escapeCell(r.outputDMSLon || formatDMS(r.outputLon, false));
        const dmsLat = escapeCell(r.outputDMSLat || formatDMS(r.outputLat, true));
        const status = escapeCell(r.status === "success" ? (isAr ? "نجاح" : "Success") : r.status === "error" ? (isAr ? "خطأ" : "Error") : (isAr ? "فارغ" : "Empty"));

        return [
          pId,
          in1,
          in2,
          outX,
          outY,
          zone,
          lon,
          lat,
          dmsLon,
          dmsLat,
          status,
        ].join(delimiter);
      });

      const headerLine = headers.map((h) => escapeCell(h)).join(delimiter);

      // Force separator directive + BOM
      const content = "\uFEFF" + `sep=${delimiter}\r\n` + [headerLine, ...lines].join("\r\n");

      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Egypt_Coordinates_Batch_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-emerald-700 dark:bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-800 dark:border-slate-700">
          <div className="flex items-center gap-2.5 font-bold text-base">
            <Download className="w-5 h-5 text-emerald-300" />
            <span>{isAr ? "تصدير البيانات إلى جدول Excel / CSV" : "Export Data to Excel / CSV Table"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-neutral-700 dark:text-slate-200">
          {/* Explanation Banner */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-start gap-3">
            <Table className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                {isAr ? "ضمان فصل الأوردة والأعمدة تلقائياً في برنامج Excel" : "Guaranteed Excel Multi-Column Splitting"}
              </span>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {isAr
                  ? "تم تحديث أداة التصدير لتوجيه برنامج Excel بتوزيع النتائج تلقائياً في أعمدة منفصلة (A, B, C...) ومنع تجميعها في عمود واحد، مع ترميز UTF-8 لدعم اللغة العربية بدقة عالية."
                  : "Export updated with automatic Excel column separation directives (sep=) and UTF-8 BOM, ensuring all data opens cleanly across separate columns."}
              </p>
            </div>
          </div>

          {/* Option 1: File Format */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-800 dark:text-slate-100 block">
              {isAr ? "1. صيغة ونوع الملف المُصدَّر (Export Format):" : "1. Export File Format:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat("excel")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  exportFormat === "excel"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px]">{isAr ? "جدول Excel مباشر (.xls)" : "Native Excel (.xls)"}</span>
                <span className="text-[10px] opacity-80 font-semibold text-emerald-700 dark:text-emerald-300">
                  {isAr ? "المُفضَّل للإكسل (أعمدة)" : "Direct Multi-Column"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("kml")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  exportFormat === "kml"
                    ? "bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-xs ring-1 ring-amber-500/30"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400"
                }`}
              >
                <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-[11px]">{isAr ? "Google Earth (.kml)" : "Google Earth (.kml)"}</span>
                <span className="text-[10px] opacity-80 font-semibold text-amber-700 dark:text-amber-300">
                  {isAr ? "نقاط ودبابيس الخرائط" : "GIS & Google Earth"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("csv_comma")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  exportFormat === "csv_comma"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400"
                }`}
              >
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px]">{isAr ? "ملف CSV قياسي (.csv)" : "Standard CSV (.csv)"}</span>
                <span className="text-[10px] opacity-75 font-mono">{isAr ? "فاصلة (,)" : "Comma (,)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("csv_semicolon")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  exportFormat === "csv_semicolon"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px]">{isAr ? "ملف CSV عربي (.csv)" : "Arabic CSV (.csv)"}</span>
                <span className="text-[10px] opacity-75 font-mono">{isAr ? "فاصلة منقوطة (;)" : "Semicolon (;)"}</span>
              </button>
            </div>
          </div>

          {/* Option 2: Header Language */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-800 dark:text-slate-100 block">
              {isAr ? "2. لغة عناوين الأعمدة (Header Titles):" : "2. Column Header Language:"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setHeaderType("bilingual")}
                className={`py-2 px-3 rounded-lg border text-center transition-all font-medium ${
                  headerType === "bilingual"
                    ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-slate-300"
                }`}
              >
                {isAr ? "مزدوج (عربي / EN)" : "Bilingual"}
              </button>
              <button
                type="button"
                onClick={() => setHeaderType("ar")}
                className={`py-2 px-3 rounded-lg border text-center transition-all font-medium ${
                  headerType === "ar"
                    ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-slate-300"
                }`}
              >
                {isAr ? "عربي فقط" : "Arabic Only"}
              </button>
              <button
                type="button"
                onClick={() => setHeaderType("en")}
                className={`py-2 px-3 rounded-lg border text-center transition-all font-medium ${
                  headerType === "en"
                    ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                    : "bg-neutral-50 dark:bg-slate-900 border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-slate-300"
                }`}
              >
                {isAr ? "إنجليزي (GIS/CAD)" : "English"}
              </button>
            </div>
          </div>

          {/* Option 3: Export Scope */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-800 dark:text-slate-100 block">
              {isAr ? "3. نطاق الصفوف المُراد تصديرها:" : "3. Rows to Export:"}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                <input
                  type="radio"
                  name="export_scope"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isAr ? `جميع الصفوف في الجدول (${rows.length})` : `All Rows (${rows.length})`}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                <input
                  type="radio"
                  name="export_scope"
                  checked={scope === "selected"}
                  onChange={() => setScope("selected")}
                  disabled={selectedRowIds.size === 0}
                  className="text-emerald-600 focus:ring-emerald-500 disabled:opacity-40"
                />
                <span className={selectedRowIds.size === 0 ? "opacity-40" : ""}>
                  {isAr ? `الصفوف المحددة فقط (${selectedRowIds.size})` : `Selected Rows Only (${selectedRowIds.size})`}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-neutral-50 dark:bg-slate-900 px-6 py-4 border-t border-neutral-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 dark:bg-slate-700 hover:bg-neutral-300 dark:hover:bg-slate-600 text-neutral-700 dark:text-slate-200 rounded-xl font-bold transition-colors"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyToClipboard}
              disabled={targetRows.length === 0}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
                copied
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700"
                  : "bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 text-neutral-700 dark:text-slate-200 border-neutral-300 dark:border-slate-600"
              }`}
              title={isAr ? "نسخ البيانات بتنسيق الخلايا للصقها في إكسل فوراً" : "Copy tabular data directly into Excel/Sheets clipboard"}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
              <span>{copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ الجدول لإكسل" : "Copy to Clipboard")}</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteExport}
              disabled={targetRows.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md shadow-emerald-900/20 disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? `تنزيل الملف (${targetRows.length} صف)` : `Download File (${targetRows.length} rows)`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
