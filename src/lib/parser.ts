/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Standardizes Arabic-Indic numerals to Standard Latin (0-9) digits,
 * and normalizes symbols like commas, degree circles, etc.
 */
export function normalizeTextDigits(text: string): string {
  if (!text) return "";
  
  // Mapping of Arabic-Indic digits (٠-٩) and Persian (۰-۹)
  const map: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9"
  };
  
  let normalized = text.replace(/[٠-٩۰-۹]/g, (char) => map[char] || char);
  
  // Replace Arabic comma (،) with decimal point or standard comma depending on context
  normalized = normalized.replace(/،/g, ",");
  
  return normalized.trim();
}

/**
 * Parse a string representing a single coordinate value (either latitude or longitude)
 * into a decimal number. Supports: DD, DMS, and DDM formats, with prefix/suffix directions (N,S,E,W, شرق, غرب, شمال, جنوب).
 */
export function parseSingleCoordinate(text: string): number | null {
  const cleanText = normalizeTextDigits(text).trim();
  if (!cleanText) return null;

  // Detect direction from text (N, S, E, W, or Arabic equivalent)
  let isNegative = false;
  let hasDirection = false;
  let workingText = cleanText;

  // Check for negative signs
  if (workingText.startsWith("-")) {
    isNegative = true;
    workingText = workingText.substring(1);
  }

  // Regex for hemisphere indicators
  const westSouthRegex = /(^|\s|°|'|")([SWsw]|غرب|غرباً|غربا|جنوب|جنوباً|جنوبا)(\s|°|'|"|$)/i;
  const eastNorthRegex = /(^|\s|°|'|")([NEne]|شرق|شرقاً|شرقا|شمال|شمالاً|شمالا)(\s|°|'|"|$)/i;

  if (westSouthRegex.test(workingText)) {
    isNegative = true;
    hasDirection = true;
    workingText = workingText.replace(westSouthRegex, " ");
  } else if (eastNorthRegex.test(workingText)) {
    hasDirection = true;
    workingText = workingText.replace(eastNorthRegex, " ");
  }

  // Extract all number components (integers or floats)
  const numbers = workingText
    .replace(/[°'":dmsDMS”’]/g, " ")
    .trim()
    .split(/\s+/)
    .map(n => parseFloat(n))
    .filter(n => !isNaN(n));

  if (numbers.length === 0) return null;

  let decimal = 0;
  if (numbers.length === 1) {
    // Single number: Decimal Degrees (e.g. 31.235712 or 615000)
    decimal = Math.abs(numbers[0]);
    if (numbers[0] < 0) isNegative = true;
  } else if (numbers.length === 2) {
    // Two numbers: Degrees Decimal Minutes (e.g. 31° 14.142')
    const deg = Math.abs(numbers[0]);
    const min = numbers[1];
    decimal = deg + min / 60.0;
    if (numbers[0] < 0) isNegative = true;
  } else if (numbers.length >= 3) {
    // Three or more numbers: Degrees Minutes Seconds (e.g. 31° 14' 08.56")
    const deg = Math.abs(numbers[0]);
    const min = numbers[1];
    const sec = numbers[2];
    decimal = deg + min / 60.0 + sec / 3600.0;
    if (numbers[0] < 0) isNegative = true;
  }

  return isNegative ? -decimal : decimal;
}

/**
 * Splits a single-cell combined coordinate string (e.g., "30.044,31.235" or "30 2 N, 31 14 E")
 * into two separate coordinate strings.
 */
export function splitPairedCoordinates(text: string): [string, string] | null {
  const cleanText = normalizeTextDigits(text).trim();
  if (!cleanText) return null;

  // Delimiters could be comma, tab, semicolon or slash, or multiple spaces between letter hemispheres
  // Examples:
  // "30.044, 31.235" -> Comma separator
  // "30°02'39.9\"N 31°14'08.6\"E" -> Hemisphere space separator
  
  let separator = "";
  if (cleanText.includes("\t")) separator = "\t";
  else if (cleanText.includes(",")) separator = ",";
  else if (cleanText.includes(";")) separator = ";";
  else if (cleanText.includes("/")) separator = "/";
  else {
    // Try to split on space separating coordinate hemispheres (N/S/E/W)
    const spaceMatch = cleanText.match(/([NSEWnsew])\s+([0-9-٠-٩])/);
    if (spaceMatch) {
      const idx = cleanText.indexOf(spaceMatch[1]) + 1;
      return [cleanText.substring(0, idx).trim(), cleanText.substring(idx).trim()];
    }
    // Try to split on space between two decimals, e.g. "30.044420 31.235712"
    const decimalSpaceMatch = cleanText.match(/^([0-9.-]+)\s+([0-9.-]+)$/);
    if (decimalSpaceMatch) {
      return [decimalSpaceMatch[1], decimalSpaceMatch[2]];
    }
  }

  if (separator) {
    const parts = cleanText.split(separator);
    if (parts.length >= 2) {
      return [parts[0].trim(), parts[1].trim()];
    }
  }

  return null;
}

/**
 * Formats decimal degrees into a standard elegant DMS string:
 * 30° 02' 39.91" N or 31° 14' 08.56" E
 */
export function formatToDMS(decimal: number, isLat: boolean): string {
  const isNegative = decimal < 0;
  const absVal = Math.abs(decimal);
  
  const deg = Math.floor(absVal);
  const minVal = (absVal - deg) * 60.0;
  const min = Math.floor(minVal);
  const sec = (minVal - min) * 60.0;
  
  // Format padding
  const degStr = deg.toString();
  const minStr = min.toString().padStart(2, "0");
  const secStr = sec.toFixed(2).padStart(5, "0");
  
  let dir = "";
  if (isLat) {
    dir = isNegative ? "S" : "N";
  } else {
    dir = isNegative ? "W" : "E";
  }
  
  return `${degStr}° ${minStr}' ${secStr}" ${dir}`;
}
