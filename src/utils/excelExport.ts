/**
 * مدار – MDAR | Genuine XLSX Export & Spreadsheet Security Engine
 * Generates true Office Open XML (.xlsx) workbooks with formula injection defense,
 * typed numeric cells, and geodetic metadata.
 */

import writeXlsxFile, { Row, Sheet, SheetData } from "write-excel-file/browser";
import { BatchRow } from "../types";

/**
 * Defends against CSV / Spreadsheet Formula Injection (CWE-1236).
 * Any text beginning with =, +, -, @, \t, or \r is prefixed with a single quote.
 */
export function sanitizeCellValue(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

export interface ExportXLSXOptions {
  rows: BatchRow[];
  headers: string[];
  lang: "ar" | "en";
  metricDecimals: number;
  geoDecimals: number;
  formatDMS: (val: number | undefined, isLat: boolean) => string;
  sourceCRSName?: string;
  targetCRSName?: string;
  operationId?: string;
  accuracyMeters?: number;
}

export async function exportBatchToXLSX(options: ExportXLSXOptions): Promise<void> {
  const {
    rows,
    headers,
    lang,
    metricDecimals,
    geoDecimals,
    formatDMS,
    sourceCRSName,
    targetCRSName,
    operationId,
    accuracyMeters
  } = options;

  const isAr = lang === "ar";
  const dateStr = new Date().toISOString().slice(0, 10);

  // 1. Build Header Row with Emerald Geodetic Styling
  const headerRow: Row = headers.map((h) => ({
    value: sanitizeCellValue(h),
    fontWeight: "bold",
    textColor: "#FFFFFF",
    backgroundColor: "#047857",
    borderColor: "#065F46",
    align: "center",
    fontSize: 11
  }));

  // 2. Build Data Rows with explicit typed numbers
  const dataRows: Row[] = rows.map((r, idx) => {
    const isEven = idx % 2 === 0;
    const rowBg = isEven ? "#F8FAFC" : "#FFFFFF";

    return [
      // 0. Point ID
      {
        value: sanitizeCellValue(r.pointId || `PT-${idx + 1}`),
        align: "center",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 1. Input X
      {
        value: sanitizeCellValue(r.input1),
        align: "center",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 2. Input Y
      {
        value: sanitizeCellValue(r.input2),
        align: "center",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 3. Output Easting X (m)
      {
        value: r.outputX !== undefined ? Number(r.outputX.toFixed(metricDecimals)) : null,
        type: Number,
        format: `0.${"0".repeat(metricDecimals)}`,
        align: "right",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 4. Output Northing Y (m)
      {
        value: r.outputY !== undefined ? Number(r.outputY.toFixed(metricDecimals)) : null,
        type: Number,
        format: `0.${"0".repeat(metricDecimals)}`,
        align: "right",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 5. Zone / Belt
      {
        value: sanitizeCellValue(r.outputZone || ""),
        align: "center",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 6. Longitude (DD)
      {
        value: r.outputLon !== undefined ? Number(r.outputLon.toFixed(geoDecimals)) : null,
        type: Number,
        format: `0.${"0".repeat(geoDecimals)}`,
        align: "right",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 7. Latitude (DD)
      {
        value: r.outputLat !== undefined ? Number(r.outputLat.toFixed(geoDecimals)) : null,
        type: Number,
        format: `0.${"0".repeat(geoDecimals)}`,
        align: "right",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 8. DMS Lon
      {
        value: sanitizeCellValue(r.outputDMSLon || formatDMS(r.outputLon, false)),
        align: "center",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 9. DMS Lat
      {
        value: sanitizeCellValue(r.outputDMSLat || formatDMS(r.outputLat, true)),
        align: "center",
        backgroundColor: rowBg,
        fontSize: 10
      },
      // 10. Status
      {
        value: r.status === "success" 
          ? (isAr ? "ناجح" : "Success") 
          : r.status === "error" 
          ? (isAr ? "خطأ" : "Error") 
          : (isAr ? "فارغ" : "Empty"),
        align: "center",
        textColor: r.status === "success" ? "#047857" : r.status === "error" ? "#B91C1C" : "#64748B",
        backgroundColor: rowBg,
        fontWeight: "bold",
        fontSize: 10
      }
    ];
  });

  const coordinatesSheet: Sheet<any> = {
    sheet: isAr ? "الإحداثيات" : "Coordinates",
    rightToLeft: isAr,
    data: [headerRow, ...dataRows],
    columns: [
      { width: 16 }, // Point ID
      { width: 18 }, // Input 1
      { width: 18 }, // Input 2
      { width: 18 }, // Easting
      { width: 18 }, // Northing
      { width: 26 }, // Zone/Belt
      { width: 18 }, // Lon DD
      { width: 18 }, // Lat DD
      { width: 22 }, // Lon DMS
      { width: 22 }, // Lat DMS
      { width: 14 }  // Status
    ]
  };

  // 3. Build Geodetic Metadata Sheet
  const metadataRows: Row[] = [
    [
      {
        value: "مدار – MDAR | Geodetic Transformation Metadata & Provenance",
        fontWeight: "bold",
        fontSize: 13,
        textColor: "#FFFFFF",
        backgroundColor: "#065F46"
      },
      { value: "", backgroundColor: "#065F46" }
    ],
    [
      { value: isAr ? "تاريخ المعالجة والتصدير" : "Processing Date", fontWeight: "bold" },
      { value: dateStr }
    ],
    [
      { value: isAr ? "نظام الإحداثيات المصدر" : "Source CRS", fontWeight: "bold" },
      { value: sanitizeCellValue(sourceCRSName || "WGS 84 Geographic") }
    ],
    [
      { value: isAr ? "نظام الإحداثيات الهدف" : "Target CRS", fontWeight: "bold" },
      { value: sanitizeCellValue(targetCRSName || "Projected Metric") }
    ],
    [
      { value: isAr ? "مسار التحويل الجيوديسي" : "Geodetic Operation", fontWeight: "bold" },
      { value: sanitizeCellValue(operationId || "EPSG Standard Transformation") }
    ],
    [
      { value: isAr ? "الدقة الاسمية للتحويل" : "Nominal Accuracy", fontWeight: "bold" },
      { value: accuracyMeters !== undefined ? `±${accuracyMeters} m` : "±1.2 m" }
    ],
    [
      { value: isAr ? "إجمالي النقاط المعالجة" : "Total Points Processed", fontWeight: "bold" },
      { value: rows.length, type: Number }
    ],
    [
      { value: isAr ? "النقاط الناجحة" : "Successful Points", fontWeight: "bold" },
      { value: rows.filter((r) => r.status === "success").length, type: Number }
    ],
    [
      { value: isAr ? "النقاط غير الناجحة" : "Failed / Empty Points", fontWeight: "bold" },
      { value: rows.filter((r) => r.status !== "success").length, type: Number }
    ],
    [
      { value: isAr ? "ملاحظة أمان وتوافق" : "Security Notice", fontWeight: "bold" },
      { value: isAr ? "تم إنتاج هذا الملف بصيغة Office Open XML القياسية (.xlsx) وخالي من أي ماكرو." : "Generated as standard Office Open XML (.xlsx) with zero macros." }
    ]
  ];

  const metadataSheet: Sheet<any> = {
    sheet: isAr ? "بيانات التحويل" : "Metadata",
    rightToLeft: isAr,
    data: metadataRows,
    columns: [
      { width: 30 },
      { width: 45 }
    ]
  };

  // 4. Download genuine .xlsx file directly in the browser
  await writeXlsxFile([coordinatesSheet, metadataSheet]).toFile(
    `MDAR_Batch_Coordinates_${dateStr}.xlsx`
  );
}
