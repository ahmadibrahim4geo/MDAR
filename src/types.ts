/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CRSType {
  GEOGRAPHIC = "GEOGRAPHIC",
  PROJECTED = "PROJECTED"
}

export enum DatumType {
  WGS84 = "WGS84",
  EGYPT1907 = "EGYPT1907",
  AIN_EL_ABD1970 = "AIN_EL_ABD1970",
  KSA_GRF17 = "KSA_GRF17",
  MTRF2000 = "MTRF2000",
  PALESTINE1923 = "PALESTINE1923",
  ED50 = "ED50",
  QND95 = "QND95",
  QATAR1948 = "QATAR1948",
  QATAR1974 = "QATAR1974",
  KGD93 = "KGD93",
  FAHUD = "FAHUD",
  NAHRAWAN1967 = "NAHRAWAN1967",
  KARBALA1979 = "KARBALA1979",
  ADINDAN = "ADINDAN",
  DEIR_EZ_ZOR = "DEIR_EZ_ZOR",
  VOIROL1875 = "VOIROL1875",
  NORD_SAHARA = "NORD_SAHARA",
  CARTHAGE = "CARTHAGE",
  MERCHICH = "MERCHICH",
  LGD2006 = "LGD2006",
  ELD79 = "ELD79",
  YEMEN_NGN96 = "YEMEN_NGN96",
  MAURITANIA1999 = "MAURITANIA1999",
  AFGOOYE = "AFGOOYE",
  GRAND_COMOROS = "GRAND_COMOROS"
}

export type CRSCategory =
  | "EGYPT_NATIONAL"
  | "GEOGRAPHIC"
  | "ARAB_REGIONAL"
  | "UTM_NORTH"
  | "UTM_SOUTH"
  | "WEB_PROJECTIONS";

export type CountryCode =
  | "ALL"
  | "EGY" // Egypt
  | "KSA" // Saudi Arabia
  | "UAE" // UAE
  | "QAT" // Qatar
  | "KWT" // Kuwait
  | "OMN" // Oman
  | "BHR" // Bahrain
  | "JOR" // Jordan
  | "PSE" // Palestine
  | "LBN" // Lebanon
  | "SYR" // Syria
  | "IRQ" // Iraq
  | "YEM" // Yemen
  | "SDN" // Sudan
  | "LBY" // Libya
  | "TUN" // Tunisia
  | "DZA" // Algeria
  | "MAR" // Morocco
  | "MRT" // Mauritania
  | "SOM" // Somalia
  | "DJI" // Djibouti
  | "COM" // Comoros
  | "GLB"; // Global / International

export interface CRSDefinition {
  id: string;
  nameAr: string;
  nameEn: string;
  epsg?: string;
  type: CRSType;
  datum: DatumType;
  category: CRSCategory;
  countryCode: CountryCode;
  countryNameAr: string;
  countryNameEn: string;
  isLocal: boolean; // true for national/local, false for global (UTM/Web Mercator/WGS84)
  ellipsoid: {
    name: string;
    a: number; // semi-major axis
    rf: number; // reciprocal of flattening (1/f)
  };
  projection?: {
    type: "TM" | "WEBMERCATOR" | "LCC" | "CASSINI";
    cm: number; // Central Meridian in degrees
    scaleFactor: number; // scale factor at central meridian (k0)
    falseEasting: number;
    falseNorthing: number;
    latOrigin: number; // Latitude of origin in degrees
  };
  proj4String?: string;
  accuracyMeters?: number;
  operationId?: string;
  areaName?: string;
  bbox?: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
}

export interface AppSettings {
  language: "ar" | "en";
  darkMode: boolean;
  metricDecimals: number;
  geoDecimals: number;
  geoOrder: "lat_lon" | "lon_lat";
  metricOrder: "e_n" | "n_e";
  boundaryWarningDistance: number; // in km
}

export enum TargetZoneMode {
  AUTO = "AUTO",
  UNIFIED_CENTER = "UNIFIED_CENTER",
  MANUAL = "MANUAL"
}

export interface BatchRow {
  id: number;
  pointId: string;
  input1: string; // X/Lon or Easting
  input2: string; // Y/Lat or Northing
  outputX?: number;
  outputY?: number;
  outputLat?: number;
  outputLon?: number;
  outputDMSLat?: string;
  outputDMSLon?: string;
  outputDMS?: string;
  outputZone?: string;
  status: "empty" | "idle" | "success" | "error";
  warnings: string[];
  errorMsg?: string;
  operationId?: string;
  accuracyMeters?: number;
}

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  tabHome: string;
  tabBatch: string;
  tabHelp: string;
  tabSettings: string;
  tabCatalog: string;
  
  // Controls
  sourceCRS: string;
  targetCRS: string;
  targetZoneMode: string;
  modeAutoPerPoint: string;
  modeUnifiedCenter: string;
  modeManual: string;
  pasteClipboard: string;
  convertData: string;
  copyMetric: string;
  copyGeographic: string;
  clearAll: string;
  addRow: string;
  
  // Single conversion
  singleTitle: string;
  singleSubtitle: string;
  inputCoords: string;
  outputCoords: string;
  latitude: string;
  longitude: string;
  easting: string;
  northing: string;
  convertBtn: string;
  copyBtn: string;
  successMsg: string;
  errorMsg: string;
  emptyMsg: string;
  
  // Table headers
  rowId: string;
  pointId: string;
  inputY: string;
  inputX: string;
  outputX: string;
  outputY: string;
  outputLat: string;
  outputLon: string;
  outputDMS: string;
  outputZone: string;
  status: string;
  warnings: string;
  
  // Batch instructions
  batchInstructionsTitle: string;
  batchInstructions: string[];
  pastePlaceholder: string;
  processBatchBtn: string;
  
  // Settings
  settingsTitle: string;
  languageLabel: string;
  languageAr: string;
  languageEn: string;
  darkModeLabel: string;
  darkModeLight: string;
  darkModeDark: string;
  metricDecimalsLabel: string;
  geoDecimalsLabel: string;
  geoOrderLabel: string;
  metricOrderLabel: string;
  warningDistanceLabel: string;
  saveSettingsBtn: string;
  
  // Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  crsName: string;
  epsgCode: string;
  ellipsoidName: string;
  centralMeridian: string;
  scaleFactor: string;
  falseEasting: string;
  falseNorthing: string;
  latOrigin: string;
  systemType: string;
  systemGeographic: string;
  systemProjected: string;
}

export interface SingleConversionResult {
  x?: number;
  y?: number;
  lat?: number;
  lon?: number;
  dms?: string;
  zone?: string;
  warnings: string[];
  operationId?: string;
  accuracyMeters?: number;
  provenance?: string;
}
