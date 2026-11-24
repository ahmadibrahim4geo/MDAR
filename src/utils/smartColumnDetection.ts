/**
 * مدار – MDAR | Smart Column Detection Engine
 * Performs multi-layered heuristic analysis (header synonyms, data types,
 * numerical value ranges, coordinate patterns, uniqueness) to intelligently
 * map tabular columns without requiring external AI APIs or network connections.
 */

export type ColumnRole =
  | "X"           // Longitude / Easting
  | "Y"           // Latitude / Northing
  | "Z"           // Elevation / Height
  | "ID"          // Point ID / Number
  | "NAME"        // Station / Feature Name
  | "CRS"         // Source or Target CRS / EPSG
  | "DATUM"       // Geodetic Datum
  | "ZONE"        // UTM Zone / Hemisphere
  | "DESCRIPTION" // Notes / Description / Category
  | "ATTRIBUTE"   // Extra attribute to preserve
  | "IGNORE";     // Do not import

export interface DetectedColumn {
  index: number;
  originalHeader: string;
  suggestedRole: ColumnRole;
  confidence: number; // 0 - 100 indicative score
  inferredType: "number" | "string" | "dms" | "empty";
  sampleValues: string[];
  warnings: string[];
  isLocked?: boolean;
}

// Extensible bilingual synonym dictionary
export const COLUMN_SYNONYMS: Record<ColumnRole, { en: string[]; ar: string[] }> = {
  X: {
    en: [
      "x", "easting", "east", "e", "longitude", "lon", "long", "coord_x",
      "coord_e", "x_coord", "x_coordinate", "easting_m", "lon_dd", "x_pos"
    ],
    ar: [
      "الشرقيات", "شرقيات", "الاحداثي السيني", "الإحداثي السيني", "السيني", "سيني",
      "خط الطول", "خط طول", "شرق", "الشرق", "س"
    ]
  },
  Y: {
    en: [
      "y", "northing", "north", "n", "latitude", "lat", "coord_y",
      "coord_n", "y_coord", "y_coordinate", "northing_m", "lat_dd", "y_pos"
    ],
    ar: [
      "الشماليات", "شماليات", "الاحداثي الصادي", "الإحداثي الصادي", "الصادي", "صادي",
      "دائرة العرض", "خط العرض", "عرض", "شمال", "الشمال", "ص"
    ]
  },
  Z: {
    en: [
      "z", "elevation", "height", "altitude", "level", "rl", "elev", "h",
      "z_coord", "elev_m", "orthometric_h", "ellipsoidal_h"
    ],
    ar: [
      "الارتفاع", "ارتفاع", "المنسوب", "منسوب", "المنسوب التقريبي", "ع", "عيني"
    ]
  },
  ID: {
    en: [
      "id", "point_id", "point_no", "point_number", "number", "ptno", "pnt",
      "station_id", "objectid", "fid", "pt_id", "code", "index", "pt"
    ],
    ar: [
      "رقم النقطة", "كود النقطة", "المعرف", "معرف", "رقم", "الرقم", "نقطة", "كود"
    ]
  },
  NAME: {
    en: [
      "name", "point_name", "station_name", "label", "site", "site_name",
      "marker_name", "title"
    ],
    ar: [
      "اسم النقطة", "اسم المحطة", "اسم الموقع", "الاسم", "اسم", "الموقع", "التسمية"
    ]
  },
  CRS: {
    en: ["crs", "epsg", "srid", "projection", "coordinate_system", "system"],
    ar: ["النظام الاحداثي", "النظام الإحداثي", "نظام الاسقاط", "نظام الإسقاط", "المسقط"]
  },
  DATUM: {
    en: ["datum", "reference_frame", "geodetic_datum", "ellipsoid"],
    ar: ["المرجع", "المرجع الجيوديسي", "مسند الاسناد", "المجسم"]
  },
  ZONE: {
    en: ["zone", "utm_zone", "hemisphere", "belt", "zone_no"],
    ar: ["الشريحة", "شريحة", "النطاق", "الحزام", "نصف الكرة"]
  },
  DESCRIPTION: {
    en: ["description", "notes", "category", "type", "remarks", "comment", "desc"],
    ar: ["الوصف", "وصف", "الملاحظات", "ملاحظات", "التصنيف", "النوع", "ملاحظة"]
  },
  ATTRIBUTE: {
    en: [],
    ar: []
  },
  IGNORE: {
    en: [],
    ar: []
  }
};

/**
 * Normalizes text for matching by removing special characters, diacritics, and spaces.
 */
export function normalizeToken(token: string): string {
  return token
    .trim()
    .toLowerCase()
    .replace(/[\s\-_.:/\\()\[\]]/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove Arabic tashkeel
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

/**
 * Parses numeric value supporting both US dot decimal (123.45) and European comma decimal (123,45).
 */
export function parseFlexibleNumber(val: string): number | null {
  if (!val || typeof val !== "string") return null;
  const cleaned = val.trim().replace(/\s/g, "");
  if (!cleaned) return null;

  // Check if standard dot decimal
  if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  // Check if comma decimal (e.g. 31,235)
  if (/^-?\d+(,\d+)?$/.test(cleaned)) {
    const num = parseFloat(cleaned.replace(",", "."));
    return isNaN(num) ? null : num;
  }

  // Check thousand separators with decimal (e.g. 1,000,000.50 or 1.000.000,50)
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) {
    const num = parseFloat(cleaned.replace(/,/g, ""));
    return isNaN(num) ? null : num;
  }
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) {
    const num = parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
    return isNaN(num) ? null : num;
  }

  return null;
}

/**
 * Detects whether a string looks like a DMS coordinate (e.g., 31°14'08.5"E or 30 02 40 N).
 */
export function isDMSFormat(val: string): boolean {
  if (!val) return false;
  return /[\d]+[°\s\-dD]+[\d]+['\s\-mM]+[\d.]+["]?[\s]*[NSEWnsew]?/.test(val) ||
         /^[NSEWnsew]?[\s]*[\d]+[°\s]+[\d]+['\s]+[\d.]+["]?/.test(val);
}

/**
 * Analyses an array of columns and suggests the best mapping for each column.
 */
export function detectColumns(
  headers: string[],
  rowsSample: string[][]
): DetectedColumn[] {
  const detected: DetectedColumn[] = [];
  const assignedRoles = new Set<ColumnRole>();

  for (let c = 0; c < headers.length; c++) {
    const originalHeader = headers[c] || `Column_${c + 1}`;
    const normHeader = normalizeToken(originalHeader);
    const sampleValues: string[] = [];

    let numericCount = 0;
    let dmsCount = 0;
    let emptyCount = 0;
    const sampledNumbers: number[] = [];

    // Collect sample values
    const limit = Math.min(rowsSample.length, 50);
    for (let r = 0; r < limit; r++) {
      const cell = rowsSample[r] && rowsSample[r][c] !== undefined ? String(rowsSample[r][c]).trim() : "";
      if (cell) {
        sampleValues.push(cell);
        const parsedNum = parseFlexibleNumber(cell);
        if (parsedNum !== null) {
          numericCount++;
          sampledNumbers.push(parsedNum);
        } else if (isDMSFormat(cell)) {
          dmsCount++;
        }
      } else {
        emptyCount++;
      }
    }

    // Determine inferred type
    let inferredType: "number" | "string" | "dms" | "empty" = "string";
    if (sampleValues.length === 0) {
      inferredType = "empty";
    } else if (dmsCount > sampleValues.length * 0.5) {
      inferredType = "dms";
    } else if (numericCount > sampleValues.length * 0.7) {
      inferredType = "number";
    }

    // Heuristic Role Scoring
    let bestRole: ColumnRole = "ATTRIBUTE";
    let bestConfidence = 15;
    const warnings: string[] = [];

    // 1. Header Name Match Score
    const headerScores: { role: ColumnRole; score: number }[] = [];
    for (const [role, lists] of Object.entries(COLUMN_SYNONYMS) as [ColumnRole, { en: string[]; ar: string[] }][]) {
      const matches = [...lists.en, ...lists.ar].some((syn) => {
        const normSyn = normalizeToken(syn);
        return normHeader === normSyn || normHeader.includes(normSyn) || normSyn.includes(normHeader);
      });
      if (matches) {
        const exactMatch = [...lists.en, ...lists.ar].some((syn) => normalizeToken(syn) === normHeader);
        headerScores.push({ role, score: exactMatch ? 75 : 55 });
      }
    }

    // 2. Data Geometry & Range Checks
    let isLikelyLat = false;
    let isLikelyLon = false;
    let isLikelyMetricEasting = false;
    let isLikelyMetricNorthing = false;
    let isLikelyElevation = false;

    if (sampledNumbers.length > 0) {
      const minVal = Math.min(...sampledNumbers);
      const maxVal = Math.max(...sampledNumbers);

      // Geographic checks
      if (minVal >= -90 && maxVal <= 90) {
        isLikelyLat = true;
      }
      if (minVal >= -180 && maxVal <= 180) {
        isLikelyLon = true;
      }

      // Projected Metric checks (UTM / National Grids)
      // Easting usually 100,000 to 900,000
      if (minVal >= 100000 && maxVal <= 950000) {
        isLikelyMetricEasting = true;
      }
      // Northing usually 500,000 to 10,000,000
      if (minVal >= 400000 && maxVal <= 10000000) {
        isLikelyMetricNorthing = true;
      }
      // Elevation usually -500m to 9000m
      if (minVal >= -450 && maxVal <= 8848 && sampledNumbers.every((n) => Math.abs(n) < 10000)) {
        isLikelyElevation = true;
      }
    }

    // Combine Header & Geometric Confidence
    if (headerScores.length > 0) {
      headerScores.sort((a, b) => b.score - a.score);
      const topHeader = headerScores[0];
      bestRole = topHeader.role;
      bestConfidence = topHeader.score;

      // Validate header against actual data
      if (bestRole === "X" && isLikelyLon) bestConfidence = Math.min(98, bestConfidence + 25);
      if (bestRole === "X" && isLikelyMetricEasting) bestConfidence = Math.min(98, bestConfidence + 25);
      if (bestRole === "Y" && isLikelyLat) bestConfidence = Math.min(98, bestConfidence + 25);
      if (bestRole === "Y" && isLikelyMetricNorthing) bestConfidence = Math.min(98, bestConfidence + 25);
      if (bestRole === "Z" && isLikelyElevation) bestConfidence = Math.min(95, bestConfidence + 20);

      // Check for potential X/Y inversion warning
      if (bestRole === "X" && isLikelyLat && !isLikelyLon && sampledNumbers.length > 0) {
        warnings.push("تحذير: العمود مسجل كـ X ولكن قيمه تقع في نطاق دوائر العرض [-90, 90].");
      }
      if (bestRole === "Y" && isLikelyMetricEasting && !isLikelyMetricNorthing && sampledNumbers.length > 0) {
        warnings.push("تحذير: العمود مسجل كـ Y ولكن قيمه تقع في نطاق الشرقيات المترية.");
      }
    } else {
      // No header match: infer purely from values & position
      if (inferredType === "number" || inferredType === "dms") {
        if (isLikelyMetricEasting && !assignedRoles.has("X")) {
          bestRole = "X";
          bestConfidence = 65;
        } else if (isLikelyMetricNorthing && !assignedRoles.has("Y")) {
          bestRole = "Y";
          bestConfidence = 65;
        } else if (isLikelyLat && !assignedRoles.has("Y") && (c === 1 || c === 2)) {
          bestRole = "Y";
          bestConfidence = 60;
        } else if (isLikelyLon && !assignedRoles.has("X") && (c === 0 || c === 1)) {
          bestRole = "X";
          bestConfidence = 60;
        }
      } else if (inferredType === "string") {
        if (!assignedRoles.has("ID") && c === 0) {
          bestRole = "ID";
          bestConfidence = 50;
        } else {
          bestRole = "DESCRIPTION";
          bestConfidence = 40;
        }
      }
    }

    if (inferredType === "empty") {
      bestRole = "IGNORE";
      bestConfidence = 90;
      warnings.push("العمود فارغ تمامًا في العينة.");
    }

    assignedRoles.add(bestRole);

    detected.push({
      index: c,
      originalHeader,
      suggestedRole: bestRole,
      confidence: bestConfidence,
      inferredType,
      sampleValues: sampleValues.slice(0, 5),
      warnings
    });
  }

  // Cross-column post-validation
  validateColumnSet(detected);

  return detected;
}

/**
 * Validates the detected set of columns and checks for duplicate key assignments.
 */
export function validateColumnSet(columns: DetectedColumn[]): void {
  const xCols = columns.filter((col) => col.suggestedRole === "X");
  const yCols = columns.filter((col) => col.suggestedRole === "Y");

  if (xCols.length > 1) {
    xCols.forEach((col, idx) => {
      if (idx > 0) {
        col.warnings.push("تنبيه: تم تعيين أكثر من عمود كإحداثي X. يرجى مراجعة التعيين.");
      }
    });
  }

  if (yCols.length > 1) {
    yCols.forEach((col, idx) => {
      if (idx > 0) {
        col.warnings.push("تنبيه: تم تعيين أكثر من عمود كإحداثي Y. يرجى مراجعة التعيين.");
      }
    });
  }
}
