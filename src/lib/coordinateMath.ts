/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import proj4 from "proj4";
import { CRSDefinition, DatumType, CRSType } from "../types";
import { getUTMCRSForLon, getETMBeltForLonLat, getMTMZoneForLon, getCRSById } from "./crsData";

// Math Constants
const PI = Math.PI;

// Molodensky-Badekas Transformation Parameters (EPSG:7697 Egypt 1907 to WGS 84)
const MB_DX = -127.535;
const MB_DY = 113.495;
const MB_DZ = -12.700;

const MB_RX_SEC = 1.603747;
const MB_RY_SEC = -0.153612;
const MB_RZ_SEC = -5.364408;

const MB_S_PPM = 5.33745;

const MB_X0 = 4854969.728;
const MB_Y0 = 2945552.013;
const MB_Z0 = 2868447.610;

// Convert seconds of arc to radians
const MB_THETA_X = (MB_RX_SEC / 3600.0) * (PI / 180.0);
const MB_THETA_Y = (MB_RY_SEC / 3600.0) * (PI / 180.0);
const MB_THETA_Z = (MB_RZ_SEC / 3600.0) * (PI / 180.0);

const MB_K_SCALE = 1.0 + MB_S_PPM * 1e-6;

/**
 * Convert degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * PI) / 180.0;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(rad: number): number {
  return (rad * 180.0) / PI;
}

/**
 * Geographic to Geocentric ECEF (X, Y, Z)
 */
export function geoToGeocentric(
  latDeg: number,
  lonDeg: number,
  h: number,
  a: number,
  rf: number
): { x: number; y: number; z: number } {
  const lat = degToRad(latDeg);
  const lon = degToRad(lonDeg);
  
  const f = 1.0 / rf;
  const e2 = 2.0 * f - f * f;
  
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);
  
  const N = a / Math.sqrt(1.0 - e2 * sinLat * sinLat);
  
  const x = (N + h) * cosLat * cosLon;
  const y = (N + h) * cosLat * sinLon;
  const z = (N * (1.0 - e2) + h) * sinLat;
  
  return { x, y, z };
}

/**
 * Geocentric ECEF to Geographic (Lat, Lon, H) using Bowring's method
 */
export function geocentricToGeo(
  x: number,
  y: number,
  z: number,
  a: number,
  rf: number
): { lat: number; lon: number; h: number } {
  const f = 1.0 / rf;
  const e2 = 2.0 * f - f * f;
  const b = a * (1.0 - f);
  const ep2 = (a * a - b * b) / (b * b);
  
  const p = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(z * a, p * b);
  
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  
  const lat = Math.atan2(
    z + ep2 * b * sinTheta * sinTheta * sinTheta,
    p - e2 * a * cosTheta * cosTheta * cosTheta
  );
  
  const lon = Math.atan2(y, x);
  
  const sinLat = Math.sin(lat);
  const N = a / Math.sqrt(1.0 - e2 * sinLat * sinLat);
  const h = p / Math.cos(lat) - N;
  
  return {
    lat: radToDeg(lat),
    lon: radToDeg(lon),
    h
  };
}

/**
 * Datum Shift: Egypt 1907 Geographic -> WGS 84 Geographic (EPSG:7697)
 */
export function transformEgypt1907ToWGS84(lat: number, lon: number): { lat: number; lon: number } {
  // 1. Egypt 1907 Geographic (Helmert 1906 Ellipsoid) -> Geocentric
  const Helmert1906_a = 6378200.0;
  const Helmert1906_rf = 298.3;
  const ecefEgy = geoToGeocentric(lat, lon, 0.0, Helmert1906_a, Helmert1906_rf);
  
  // 2. Apply Molodensky-Badekas Transformation
  const dxRaw = ecefEgy.x - MB_X0;
  const dyRaw = ecefEgy.y - MB_Y0;
  const dzRaw = ecefEgy.z - MB_Z0;
  
  // Rotations using Coordinate Frame convention
  const dxRot = dxRaw + MB_THETA_Z * dyRaw - MB_THETA_Y * dzRaw;
  const dyRot = -MB_THETA_Z * dxRaw + dyRaw + MB_THETA_X * dzRaw;
  const dzRot = MB_THETA_Y * dxRaw - MB_THETA_X * dyRaw + dzRaw;
  
  const xWgs = MB_X0 + MB_DX + MB_K_SCALE * dxRot;
  const yWgs = MB_Y0 + MB_DY + MB_K_SCALE * dyRot;
  const zWgs = MB_Z0 + MB_DZ + MB_K_SCALE * dzRot;
  
  // 3. Geocentric -> WGS 84 Geographic
  const WGS84_a = 6378137.0;
  const WGS84_rf = 298.257223563;
  const geoWgs = geocentricToGeo(xWgs, yWgs, zWgs, WGS84_a, WGS84_rf);
  
  return { lat: geoWgs.lat, lon: geoWgs.lon };
}

/**
 * Datum Shift: WGS 84 Geographic -> Egypt 1907 Geographic (Inverse EPSG:7697)
 */
export function transformWGS84ToEgypt1907(lat: number, lon: number): { lat: number; lon: number } {
  // 1. WGS 84 Geographic -> Geocentric
  const WGS84_a = 6378137.0;
  const WGS84_rf = 298.257223563;
  const ecefWgs = geoToGeocentric(lat, lon, 0.0, WGS84_a, WGS84_rf);
  
  // 2. Apply Inverse Molodensky-Badekas
  const dxScale = (ecefWgs.x - MB_X0 - MB_DX) / MB_K_SCALE;
  const dyScale = (ecefWgs.y - MB_Y0 - MB_DY) / MB_K_SCALE;
  const dzScale = (ecefWgs.z - MB_Z0 - MB_DZ) / MB_K_SCALE;
  
  // Inverse rotation (Transpose of Coordinate Frame matrix)
  const dxEgy = dxScale - MB_THETA_Z * dyScale + MB_THETA_Y * dzScale;
  const dyEgy = MB_THETA_Z * dxScale + dyScale - MB_THETA_X * dzScale;
  const dzEgy = -MB_THETA_Y * dxScale + MB_THETA_X * dyScale + dzScale;
  
  const xEgy = MB_X0 + dxEgy;
  const yEgy = MB_Y0 + dyEgy;
  const zEgy = MB_Z0 + dzEgy;
  
  // 3. Geocentric -> Egypt 1907 Geographic
  const Helmert1906_a = 6378200.0;
  const Helmert1906_rf = 298.3;
  const geoEgy = geocentricToGeo(xEgy, yEgy, zEgy, Helmert1906_a, Helmert1906_rf);
  
  return { lat: geoEgy.lat, lon: geoEgy.lon };
}

/**
 * Generic 3-parameter Geocentric Datum Shift (dX, dY, dZ)
 */
export function datumShift3Param(
  latDeg: number,
  lonDeg: number,
  fromEllipsoid: { a: number; rf: number },
  toEllipsoid: { a: number; rf: number },
  dx: number,
  dy: number,
  dz: number
): { lat: number; lon: number } {
  const ecef = geoToGeocentric(latDeg, lonDeg, 0.0, fromEllipsoid.a, fromEllipsoid.rf);
  const shiftedX = ecef.x + dx;
  const shiftedY = ecef.y + dy;
  const shiftedZ = ecef.z + dz;
  return geocentricToGeo(shiftedX, shiftedY, shiftedZ, toEllipsoid.a, toEllipsoid.rf);
}

/**
 * Convert any Geographic Datum -> WGS 84 Geographic
 */
export function transformToWGS84(
  lat: number,
  lon: number,
  datum: DatumType,
  ellipsoid: { a: number; rf: number }
): { lat: number; lon: number } {
  const wgsEllip = { a: 6378137.0, rf: 298.257223563 };
  if (datum === DatumType.WGS84 || datum === DatumType.KSA_GRF17 || datum === DatumType.QND95 || datum === DatumType.KGD93) {
    return { lat, lon };
  }
  if (datum === DatumType.EGYPT1907) {
    return transformEgypt1907ToWGS84(lat, lon);
  }
  if (datum === DatumType.AIN_EL_ABD1970) {
    // Ain el Abd 1970 -> WGS 84 (Saudi Arabia)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -143.0, -236.0, 7.0);
  }
  if (datum === DatumType.PALESTINE1923) {
    // Palestine 1923 -> WGS 84
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -275.722, -94.782, 340.894);
  }
  if (datum === DatumType.ED50) {
    // ED50 -> WGS 84
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -87.0, -98.0, -121.0);
  }
  if (datum === DatumType.FAHUD) {
    // Fahud -> WGS 84 (Oman)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -346.0, -1.0, 224.0);
  }
  if (datum === DatumType.NAHRAWAN1967) {
    // Nahrawan 1967 -> WGS 84 (UAE / Gulf)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -249.0, -156.0, -381.0);
  }
  if (datum === DatumType.KARBALA1979) {
    // Karbala 1979 -> WGS 84 (Iraq)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -384.7, 10.4, 219.8);
  }
  if (datum === DatumType.ADINDAN) {
    // Adindan -> WGS 84 (Sudan)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -166.0, -15.0, 204.0);
  }
  if (datum === DatumType.DEIR_EZ_ZOR) {
    // Deir ez Zor -> WGS 84 (Syria)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -308.7, -19.0, 277.6);
  }
  if (datum === DatumType.VOIROL1875) {
    // Voirol 1875 -> WGS 84 (Algeria)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -73.0, -247.0, 227.0);
  }
  if (datum === DatumType.MERCHICH) {
    // Merchich -> WGS 84 (Morocco)
    return datumShift3Param(lat, lon, ellipsoid, wgsEllip, -31.0, 146.0, 47.0);
  }
  return { lat, lon };
}

/**
 * Convert WGS 84 Geographic -> Target Geographic Datum
 */
export function transformFromWGS84(
  latWGS: number,
  lonWGS: number,
  targetDatum: DatumType,
  targetEllipsoid: { a: number; rf: number }
): { lat: number; lon: number } {
  const wgsEllip = { a: 6378137.0, rf: 298.257223563 };
  if (targetDatum === DatumType.WGS84 || targetDatum === DatumType.KSA_GRF17 || targetDatum === DatumType.QND95 || targetDatum === DatumType.KGD93) {
    return { lat: latWGS, lon: lonWGS };
  }
  if (targetDatum === DatumType.EGYPT1907) {
    return transformWGS84ToEgypt1907(latWGS, lonWGS);
  }
  if (targetDatum === DatumType.AIN_EL_ABD1970) {
    // WGS 84 -> Ain el Abd 1970 (Inverse)
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 143.0, 236.0, -7.0);
  }
  if (targetDatum === DatumType.PALESTINE1923) {
    // WGS 84 -> Palestine 1923
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 275.722, 94.782, -340.894);
  }
  if (targetDatum === DatumType.ED50) {
    // WGS 84 -> ED50
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 87.0, 98.0, 121.0);
  }
  if (targetDatum === DatumType.FAHUD) {
    // WGS 84 -> Fahud
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 346.0, 1.0, -224.0);
  }
  if (targetDatum === DatumType.NAHRAWAN1967) {
    // WGS 84 -> Nahrawan 1967
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 249.0, 156.0, 381.0);
  }
  if (targetDatum === DatumType.KARBALA1979) {
    // WGS 84 -> Karbala 1979
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 384.7, -10.4, -219.8);
  }
  if (targetDatum === DatumType.ADINDAN) {
    // WGS 84 -> Adindan
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 166.0, 15.0, -204.0);
  }
  if (targetDatum === DatumType.DEIR_EZ_ZOR) {
    // WGS 84 -> Deir ez Zor
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 308.7, 19.0, -277.6);
  }
  if (targetDatum === DatumType.VOIROL1875) {
    // WGS 84 -> Voirol 1875
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 73.0, 247.0, -227.0);
  }
  if (targetDatum === DatumType.MERCHICH) {
    // WGS 84 -> Merchich
    return datumShift3Param(latWGS, lonWGS, wgsEllip, targetEllipsoid, 31.0, -146.0, -47.0);
  }
  return { lat: latWGS, lon: lonWGS };
}

/**
 * Transverse Mercator Forward Projection (Geographic to Projected Easting/Northing)
 */
export function tmForward(
  latDeg: number,
  lonDeg: number,
  a: number,
  rf: number,
  cmDeg: number,
  k0: number,
  falseEasting: number,
  falseNorthing: number,
  latOriginDeg: number
): { easting: number; northing: number } {
  const lat = degToRad(latDeg);
  const lon = degToRad(lonDeg);
  const lon0 = degToRad(cmDeg);
  const lat0 = degToRad(latOriginDeg);
  
  const f = 1.0 / rf;
  const e2 = 2.0 * f - f * f;
  const ep2 = e2 / (1.0 - e2);
  
  const dLon = lon - lon0;
  
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const tanLat = Math.tan(lat);
  
  const N = a / Math.sqrt(1.0 - e2 * sinLat * sinLat);
  const T = tanLat * tanLat;
  const C = ep2 * cosLat * cosLat;
  const A = dLon * cosLat;
  
  // Meridional distance calculation
  const getM = (phi: number) => {
    return a * (
      (1.0 - e2 / 4.0 - (3.0 * e2 * e2) / 64.0 - (5.0 * e2 * e2 * e2) / 256.0) * phi -
      (3.0 * e2 / 8.0 + (3.0 * e2 * e2) / 32.0 + (45.0 * e2 * e2 * e2) / 1024.0) * Math.sin(2.0 * phi) +
      ((15.0 * e2 * e2) / 256.0 + (45.0 * e2 * e2 * e2) / 1024.0) * Math.sin(4.0 * phi) -
      ((35.0 * e2 * e2 * e2) / 3072.0) * Math.sin(6.0 * phi)
    );
  };
  
  const M = getM(lat);
  const M0 = getM(lat0);
  
  const A3 = A * A * A;
  const A5 = A3 * A * A;
  const A2 = A * A;
  const A4 = A2 * A2;
  const A6 = A4 * A2;
  
  const easting = falseEasting + k0 * N * (
    A +
    (1.0 - T + C) * (A3 / 6.0) +
    (5.0 - 18.0 * T + T * T + 72.0 * C - 58.0 * ep2) * (A5 / 120.0)
  );
  
  const northing = falseNorthing + k0 * (
    M - M0 +
    N * tanLat * (
      A2 / 2.0 +
      (5.0 - T + 9.0 * C + 4.0 * C * C) * (A4 / 24.0) +
      (61.0 - 58.0 * T + T * T + 600.0 * C - 330.0 * ep2) * (A6 / 720.0)
    )
  );
  
  return { easting, northing };
}

/**
 * Transverse Mercator Inverse Projection (Projected Easting/Northing to Geographic)
 */
export function tmInverse(
  easting: number,
  northing: number,
  a: number,
  rf: number,
  cmDeg: number,
  k0: number,
  falseEasting: number,
  falseNorthing: number,
  latOriginDeg: number
): { lat: number; lon: number } {
  const f = 1.0 / rf;
  const e2 = 2.0 * f - f * f;
  const ep2 = e2 / (1.0 - e2);
  const b = a * (1.0 - f);
  
  const lon0 = degToRad(cmDeg);
  const lat0 = degToRad(latOriginDeg);
  
  // Calculate meridional distance for origin
  const getM = (phi: number) => {
    return a * (
      (1.0 - e2 / 4.0 - (3.0 * e2 * e2) / 64.0 - (5.0 * e2 * e2 * e2) / 256.0) * phi -
      (3.0 * e2 / 8.0 + (3.0 * e2 * e2) / 32.0 + (45.0 * e2 * e2 * e2) / 1024.0) * Math.sin(2.0 * phi) +
      ((15.0 * e2 * e2) / 256.0 + (45.0 * e2 * e2 * e2) / 1024.0) * Math.sin(4.0 * phi) -
      ((35.0 * e2 * e2 * e2) / 3072.0) * Math.sin(6.0 * phi)
    );
  };
  
  const M0 = getM(lat0);
  const M1 = M0 + (northing - falseNorthing) / k0;
  
  // Calculate footprint latitude (phi1)
  const e1 = (1.0 - Math.sqrt(1.0 - e2)) / (1.0 + Math.sqrt(1.0 - e2));
  const mu = M1 / (a * (1.0 - e2 / 4.0 - (3.0 * e2 * e2) / 64.0 - (5.0 * e2 * e2 * e2) / 256.0));
  
  const phi1 = mu +
    (1.5 * e1 - (27.0 * e1 * e1 * e1) / 32.0) * Math.sin(2.0 * mu) +
    ((21.0 * e1 * e1) / 16.0 - (55.0 * e1 * e1 * e1 * e1) / 32.0) * Math.sin(4.0 * mu) +
    ((151.0 * e1 * e1 * e1) / 96.0) * Math.sin(6.0 * mu) +
    ((1097.0 * e1 * e1 * e1 * e1) / 512.0) * Math.sin(8.0 * mu);
  
  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);
  
  const N1 = a / Math.sqrt(1.0 - e2 * sinPhi1 * sinPhi1);
  const R1 = (a * (1.0 - e2)) / Math.pow(1.0 - e2 * sinPhi1 * sinPhi1, 1.5);
  const T1 = tanPhi1 * tanPhi1;
  const C1 = ep2 * cosPhi1 * cosPhi1;
  
  const D = (easting - falseEasting) / (N1 * k0);
  
  const D2 = D * D;
  const D3 = D2 * D;
  const D4 = D2 * D2;
  const D5 = D4 * D;
  const D6 = D4 * D2;
  
  const lat = phi1 - (N1 * tanPhi1 / R1) * (
    D2 / 2.0 -
    (5.0 + 3.0 * T1 + 10.0 * C1 - 4.0 * C1 * C1 - 9.0 * ep2) * (D4 / 24.0) +
    (61.0 + 90.0 * T1 + 298.0 * C1 + 45.0 * T1 * T1 - 3.0 * C1 * C1 - 252.0 * ep2) * (D6 / 720.0)
  );
  
  const lon = lon0 + (1.0 / cosPhi1) * (
    D -
    (1.0 + 2.0 * T1 + C1) * (D3 / 6.0) +
    (5.0 - 2.0 * C1 + 28.0 * T1 - 3.0 * T1 * T1 + 8.0 * C1 * C1 + 24.0 * ep2) * (D5 / 120.0)
  );
  
  return {
    lat: radToDeg(lat),
    lon: radToDeg(lon)
  };
}

/**
 * Web Mercator Forward Projection (EPSG:3857)
 */
export function webMercatorForward(latDeg: number, lonDeg: number): { easting: number; northing: number } {
  const a = 6378137.0; // Spherical Earth Radius
  const lat = degToRad(latDeg);
  const lon = degToRad(lonDeg);
  
  // Clamp lat to Web Mercator bounds (~ -85.0511 to 85.0511)
  const maxLat = 85.05112877980659;
  const latClamped = Math.max(-maxLat, Math.min(maxLat, latDeg));
  const latRad = degToRad(latClamped);
  
  const easting = a * lon;
  const northing = a * Math.log(Math.tan(PI / 4.0 + latRad / 2.0));
  
  return { easting, northing };
}

/**
 * Web Mercator Inverse Projection (EPSG:3857)
 */
export function webMercatorInverse(easting: number, northing: number): { lat: number; lon: number } {
  const a = 6378137.0; // Spherical Earth Radius
  
  const lonRad = easting / a;
  const latRad = 2.0 * Math.atan(Math.exp(northing / a)) - PI / 2.0;
  
  return {
    lat: radToDeg(latRad),
    lon: radToDeg(lonRad)
  };
}

const HELMERT1906_GEO_PROJ4 = "+proj=longlat +a=6378200 +rf=298.3 +no_defs";

/**
 * MASTER CONVERTER: Converts a coordinate point from source CRS to target CRS.
 * Integrates Proj4 for Clenshaw TM/LCC/Cassini projections and exact Molodensky-Badekas
 * for Egyptian 1907 datum shifts.
 * Consistently treats val1/out1 as Column 1 (Longitude / Easting X)
 * and val2/out2 as Column 2 (Latitude / Northing Y).
 */
export function convertCoordinates(
  val1: number, // Column 1: Longitude (Lon) if Geographic, Easting (X) if Projected
  val2: number, // Column 2: Latitude (Lat) if Geographic, Northing (Y) if Projected
  sourceCRS: CRSDefinition,
  targetCRS: CRSDefinition,
  isInputMetric: boolean = sourceCRS.type === CRSType.PROJECTED,
  isOutputMetric: boolean = targetCRS.type === CRSType.PROJECTED,
  targetMode?: CRSDefinition // Dynamic override of target belt/zone
): {
  out1: number; // Converted Column 1 (Easting/Lon)
  out2: number; // Converted Column 2 (Northing/Lat)
  latWGS84: number; // Keep WGS84 for zone checks and warnings
  lonWGS84: number;
  warnings: string[];
  operationId?: string;
  accuracyMeters?: number;
  provenance?: string;
} {
  const warnings: string[] = [];
  let operationId = "EPSG Standard Transformation";
  let accuracyMeters = 0.05;
  let provenance = "MِDAR Dual-Engine Geodetic Framework";

  // Height / 2D notice
  warnings.push("تنبيه: التحويل يفترض إحداثيات أفقية ثنائية الأبعاد (2D). الارتفاعات تتطلب نموذج جيويد ونظام إسناد رأسي مستقل.");

  // 1. Resolve AUTO Source CRS if any
  let activeSrc = sourceCRS;
  if (sourceCRS.id === "AUTO:UTM") {
    activeSrc = getUTMCRSForLon(31.0);
    warnings.push("صيغة المصدر التلقائية تتطلب مدخلات جغرافية. تم استخدام UTM Zone 36N افتراضياً.");
  } else if (sourceCRS.id === "AUTO:ETM") {
    activeSrc = getCRSById("EPSG:22992")!;
    warnings.push("صيغة المصدر التلقائية تتطلب مدخلات جغرافية. تم استخدام Red Belt افتراضياً.");
  } else if (sourceCRS.id === "AUTO:MTM") {
    activeSrc = getCRSById("CUSTOM:EGY_MTM_3")!;
    warnings.push("صيغة المصدر التلقائية تتطلب مدخلات جغرافية. تم استخدام MTM Zone 3 افتراضياً.");
  }

  // 2. Parse Source Coordinates to Intermediate WGS 84 (Lon, Lat)
  let latWGS84 = 0.0;
  let lonWGS84 = 0.0;

  if (activeSrc.datum === DatumType.EGYPT1907) {
    operationId = "EPSG:7697 (Egypt 1907 to WGS 84 via Molodensky-Badekas)";
    accuracyMeters = 1.2;
    provenance = "Egyptian Survey Authority (ESA) / EPSG:7697 official 10-parameter model";

    let latEgy = 0.0;
    let lonEgy = 0.0;

    if (activeSrc.type === CRSType.GEOGRAPHIC) {
      lonEgy = val1;
      latEgy = val2;
    } else {
      // Unproject Egyptian Grid to Egypt 1907 Geographic
      if (activeSrc.proj4String) {
        try {
          const [lonP, latP] = proj4(activeSrc.proj4String, HELMERT1906_GEO_PROJ4, [val1, val2]);
          lonEgy = lonP;
          latEgy = latP;
        } catch {
          const p = activeSrc.projection!;
          const geo = tmInverse(val1, val2, activeSrc.ellipsoid.a, activeSrc.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
          lonEgy = geo.lon;
          latEgy = geo.lat;
        }
      } else if (activeSrc.projection?.type === "TM") {
        const p = activeSrc.projection;
        const geo = tmInverse(val1, val2, activeSrc.ellipsoid.a, activeSrc.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
        lonEgy = geo.lon;
        latEgy = geo.lat;
      }
    }

    // Apply exact Molodensky-Badekas 10-parameter shift
    const wgs = transformEgypt1907ToWGS84(latEgy, lonEgy);
    latWGS84 = wgs.lat;
    lonWGS84 = wgs.lon;
  } else {
    // Non-Egypt Source CRS
    if (activeSrc.type === CRSType.GEOGRAPHIC) {
      const wgs = transformToWGS84(val2, val1, activeSrc.datum, activeSrc.ellipsoid);
      latWGS84 = wgs.lat;
      lonWGS84 = wgs.lon;
    } else {
      // Projected non-Egypt Source -> WGS 84
      if (activeSrc.proj4String) {
        try {
          const [lonP, latP] = proj4(activeSrc.proj4String, "EPSG:4326", [val1, val2]);
          lonWGS84 = lonP;
          latWGS84 = latP;
        } catch {
          if (activeSrc.projection?.type === "WEBMERCATOR") {
            const geo = webMercatorInverse(val1, val2);
            latWGS84 = geo.lat;
            lonWGS84 = geo.lon;
          } else if (activeSrc.projection?.type === "TM") {
            const p = activeSrc.projection;
            const geo = tmInverse(val1, val2, activeSrc.ellipsoid.a, activeSrc.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
            const wgs = transformToWGS84(geo.lat, geo.lon, activeSrc.datum, activeSrc.ellipsoid);
            latWGS84 = wgs.lat;
            lonWGS84 = wgs.lon;
          }
        }
      } else if (activeSrc.projection?.type === "WEBMERCATOR") {
        const geo = webMercatorInverse(val1, val2);
        latWGS84 = geo.lat;
        lonWGS84 = geo.lon;
      } else if (activeSrc.projection?.type === "TM") {
        const p = activeSrc.projection;
        const geo = tmInverse(val1, val2, activeSrc.ellipsoid.a, activeSrc.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
        const wgs = transformToWGS84(geo.lat, geo.lon, activeSrc.datum, activeSrc.ellipsoid);
        latWGS84 = wgs.lat;
        lonWGS84 = wgs.lon;
      }
    }
  }

  // Bounds validation
  if (latWGS84 < -90.0 || latWGS84 > 90.0 || lonWGS84 < -180.0 || lonWGS84 > 180.0) {
    warnings.push("الإحداثيات المحسوبة تقع خارج النطاق الجغرافي المعياري للكرة الأرضية.");
  }

  // 3. Resolve Target System
  let activeTarget = targetCRS;
  if (targetCRS.id === "AUTO:UTM") {
    activeTarget = targetMode || getUTMCRSForLon(lonWGS84, latWGS84);
  } else if (targetCRS.id === "AUTO:ETM") {
    activeTarget = targetMode || getETMBeltForLonLat(lonWGS84, latWGS84);
  } else if (targetCRS.id === "AUTO:MTM") {
    activeTarget = targetMode || getMTMZoneForLon(lonWGS84);
  }

  // 4. Convert Intermediate WGS 84 to Target CRS
  let out1 = 0.0;
  let out2 = 0.0;

  if (activeTarget.datum === DatumType.EGYPT1907) {
    operationId = "EPSG:7697 (WGS 84 to Egypt 1907 via Inverse Molodensky-Badekas)";
    accuracyMeters = 1.2;
    provenance = "Egyptian Survey Authority (ESA) / EPSG:7697 official 10-parameter model";

    const egyGeo = transformWGS84ToEgypt1907(latWGS84, lonWGS84);

    if (activeTarget.type === CRSType.GEOGRAPHIC) {
      out1 = egyGeo.lon;
      out2 = egyGeo.lat;
    } else {
      if (activeTarget.proj4String) {
        try {
          const [x, y] = proj4(HELMERT1906_GEO_PROJ4, activeTarget.proj4String, [egyGeo.lon, egyGeo.lat]);
          out1 = x;
          out2 = y;
        } catch {
          const p = activeTarget.projection!;
          const res = tmForward(egyGeo.lat, egyGeo.lon, activeTarget.ellipsoid.a, activeTarget.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
          out1 = res.easting;
          out2 = res.northing;
        }
      } else if (activeTarget.projection?.type === "TM") {
        const p = activeTarget.projection;
        const res = tmForward(egyGeo.lat, egyGeo.lon, activeTarget.ellipsoid.a, activeTarget.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
        out1 = res.easting;
        out2 = res.northing;
      }
    }
  } else {
    // Non-Egypt Target CRS
    if (activeTarget.proj4String) {
      try {
        const [x, y] = proj4("EPSG:4326", activeTarget.proj4String, [lonWGS84, latWGS84]);
        out1 = x;
        out2 = y;
      } catch {
        const tgtGeo = transformFromWGS84(latWGS84, lonWGS84, activeTarget.datum, activeTarget.ellipsoid);
        if (activeTarget.type === CRSType.GEOGRAPHIC) {
          out1 = tgtGeo.lon;
          out2 = tgtGeo.lat;
        } else if (activeTarget.projection?.type === "WEBMERCATOR") {
          const res = webMercatorForward(tgtGeo.lat, tgtGeo.lon);
          out1 = res.easting;
          out2 = res.northing;
        } else if (activeTarget.projection?.type === "TM") {
          const p = activeTarget.projection;
          const res = tmForward(tgtGeo.lat, tgtGeo.lon, activeTarget.ellipsoid.a, activeTarget.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
          out1 = res.easting;
          out2 = res.northing;
        }
      }
    } else {
      const tgtGeo = transformFromWGS84(latWGS84, lonWGS84, activeTarget.datum, activeTarget.ellipsoid);
      if (activeTarget.type === CRSType.GEOGRAPHIC) {
        out1 = tgtGeo.lon;
        out2 = tgtGeo.lat;
      } else if (activeTarget.projection?.type === "WEBMERCATOR") {
        const res = webMercatorForward(tgtGeo.lat, tgtGeo.lon);
        out1 = res.easting;
        out2 = res.northing;
      } else if (activeTarget.projection?.type === "TM") {
        const p = activeTarget.projection;
        const res = tmForward(tgtGeo.lat, tgtGeo.lon, activeTarget.ellipsoid.a, activeTarget.ellipsoid.rf, p.cm, p.scaleFactor, p.falseEasting, p.falseNorthing, p.latOrigin);
        out1 = res.easting;
        out2 = res.northing;
      }
    }
  }

  // Warning for approximate 3-parameter regional datums
  const approximateDatums = [
    DatumType.AIN_EL_ABD1970,
    DatumType.NAHRAWAN1967,
    DatumType.KARBALA1979,
    DatumType.ADINDAN,
    DatumType.DEIR_EZ_ZOR,
    DatumType.VOIROL1875,
    DatumType.MERCHICH,
    DatumType.ED50
  ];
  if (approximateDatums.includes(activeSrc.datum) || approximateDatums.includes(activeTarget.datum)) {
    warnings.push("تنبيه: يتضمن مسار التحويل إزاحة جيوديسية ثلاثية المعاملات تقريبية (دقة متوقعة ~5 إلى 15م). لا يُعتمد للمساحة القانونية الدقيقة.");
  }

  // Distance warning from central meridian for Transverse Mercator
  if (activeTarget.projection?.type === "TM" && activeTarget.projection.cm) {
    const cm = activeTarget.projection.cm;
    const distanceDegrees = Math.abs(lonWGS84 - cm);
    const approxDistanceKm = distanceDegrees * 111.0 * Math.cos(degToRad(latWGS84));
    const limitDegrees = activeTarget.projection.scaleFactor === 1.0 ? 2.0 : 3.0;
    if (distanceDegrees > limitDegrees) {
      warnings.push(`الموقع يبتعد عن خط الطول المركزي (${cm}°) بمقدار ${approxDistanceKm.toFixed(0)} كم، مما يزيد تشوه المسافات المقاسة.`);
    }
  }

  return {
    out1,
    out2,
    latWGS84,
    lonWGS84,
    warnings,
    operationId: activeTarget.operationId || operationId,
    accuracyMeters: activeTarget.accuracyMeters || accuracyMeters,
    provenance
  };
}
