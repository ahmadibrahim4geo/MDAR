/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CRSDefinition, CRSType, DatumType, CRSCategory, CountryCode } from "../types";

export const ELLIPSOID_WGS84 = {
  name: "WGS 84",
  a: 6378137.0,
  rf: 298.257223563
};

export const ELLIPSOID_HELMERT1906 = {
  name: "Helmert 1906",
  a: 6378200.0,
  rf: 298.3
};

export const ELLIPSOID_INTERNATIONAL1924 = {
  name: "International 1924 (Hayford)",
  a: 6378388.0,
  rf: 297.0
};

export const ELLIPSOID_CLARK1880 = {
  name: "Clarke 1880 (IGN / RGS)",
  a: 6378249.145,
  rf: 293.465
};

export const ELLIPSOID_GRS80 = {
  name: "GRS 1980",
  a: 6378137.0,
  rf: 298.257222101
};

export interface CountryFilterItem {
  code: CountryCode;
  nameAr: string;
  nameEn: string;
  flag: string;
}

export const ARAB_COUNTRIES: CountryFilterItem[] = [
  { code: "ALL", nameAr: "جميع الدول والمناطق العربية", nameEn: "All Countries", flag: "🌐" },
  { code: "EGY", nameAr: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
  { code: "KSA", nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "UAE", nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", flag: "🇦🇪" },
  { code: "QAT", nameAr: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "KWT", nameAr: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
  { code: "OMN", nameAr: "سلطنة عُمان", nameEn: "Oman", flag: "🇴🇲" },
  { code: "BHR", nameAr: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
  { code: "JOR", nameAr: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
  { code: "PSE", nameAr: "فلسطين", nameEn: "Palestine", flag: "🇵🇸" },
  { code: "IRQ", nameAr: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
  { code: "SYR", nameAr: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
  { code: "LBN", nameAr: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
  { code: "YEM", nameAr: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
  { code: "SDN", nameAr: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
  { code: "LBY", nameAr: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
  { code: "TUN", nameAr: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
  { code: "DZA", nameAr: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
  { code: "MAR", nameAr: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
  { code: "MRT", nameAr: "موريتانيا", nameEn: "Mauritania", flag: "🇲🇷" },
  { code: "SOM", nameAr: "الصومال", nameEn: "Somalia", flag: "🇸🇴" },
  { code: "DJI", nameAr: "جيبوتي", nameEn: "Djibouti", flag: "🇩🇯" },
  { code: "COM", nameAr: "جزر القمر", nameEn: "Comoros", flag: "🇰🇲" },
  { code: "GLB", nameAr: "أنظمة عالمية (UTM / Mercator)", nameEn: "Global Systems", flag: "🌍" }
];

export interface CRSCategoryGroup {
  key: CRSCategory;
  titleAr: string;
  titleEn: string;
  badgeColor: string;
}

export const CRS_CATEGORIES: CRSCategoryGroup[] = [
  {
    key: "EGYPT_NATIONAL",
    titleAr: "النظم القومية المصرية (ETM & MTM)",
    titleEn: "Egyptian National Grids (ETM & MTM)",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800"
  },
  {
    key: "ARAB_REGIONAL",
    titleAr: "النظم القومية للدول العربية (National Arab Grids)",
    titleEn: "Arab National Grids & Datums",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
  },
  {
    key: "GEOGRAPHIC",
    titleAr: "النظم الجغرافية (Geographic Datums)",
    titleEn: "Geographic Systems (Datums)",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800"
  },
  {
    key: "UTM_NORTH",
    titleAr: "نظم UTM العالمية - نصف الكرة الشمالي (UTM North 1N - 60N)",
    titleEn: "Global UTM North (Zones 1N - 60N)",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
  },
  {
    key: "UTM_SOUTH",
    titleAr: "نظم UTM العالمية - نصف الكرة الجنوبي (UTM South 1S - 60S)",
    titleEn: "Global UTM South (Zones 1S - 60S)",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
  },
  {
    key: "WEB_PROJECTIONS",
    titleAr: "أنظمة الإسقاط العالمية المترية (Web Mercator & Global Metric)",
    titleEn: "Global Metric Projections (Web Mercator)",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
  }
];

// Egyptian National Grids
const EGYPT_NATIONAL_SYSTEMS: CRSDefinition[] = [
  {
    id: "EPSG:22992",
    nameAr: "Egypt 1907 / Red Belt (الحزام الأحمر)",
    nameEn: "Egypt 1907 / Red Belt",
    epsg: "22992",
    type: CRSType.PROJECTED,
    datum: DatumType.EGYPT1907,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    projection: {
      type: "TM",
      cm: 31.0,
      scaleFactor: 1.0,
      falseEasting: 615000.0,
      falseNorthing: 810000.0,
      latOrigin: 30.0
    },
    proj4String: "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +a=6378200 +rf=298.3 +units=m +no_defs",
    operationId: "EPSG:7697",
    accuracyMeters: 1.2
  },
  {
    id: "CUSTOM:EGY_ETM_SOUTH_RED",
    nameAr: "Egypt 1907 / South Red Belt (الحزام الأحمر الجنوبي)",
    nameEn: "Egypt 1907 / South Red Belt (Custom)",
    type: CRSType.PROJECTED,
    datum: DatumType.EGYPT1907,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    projection: {
      type: "TM",
      cm: 31.0,
      scaleFactor: 1.0,
      falseEasting: 615000.0,
      falseNorthing: 1810000.0,
      latOrigin: 30.0
    },
    proj4String: "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=1810000 +a=6378200 +rf=298.3 +units=m +no_defs",
    operationId: "EPSG:7697",
    accuracyMeters: 1.2
  },
  {
    id: "EPSG:22991",
    nameAr: "Egypt 1907 / Blue Belt (الحزام الأزرق)",
    nameEn: "Egypt 1907 / Blue Belt",
    epsg: "22991",
    type: CRSType.PROJECTED,
    datum: DatumType.EGYPT1907,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    projection: {
      type: "TM",
      cm: 35.0,
      scaleFactor: 1.0,
      falseEasting: 300000.0,
      falseNorthing: 1100000.0,
      latOrigin: 30.0
    },
    proj4String: "+proj=tmerc +lat_0=30 +lon_0=35 +k=1 +x_0=300000 +y_0=1100000 +a=6378200 +rf=298.3 +units=m +no_defs",
    operationId: "EPSG:7697",
    accuracyMeters: 1.2
  },
  {
    id: "EPSG:22993",
    nameAr: "Egypt 1907 / Purple Belt (الحزام البنفسجي)",
    nameEn: "Egypt 1907 / Purple Belt",
    epsg: "22993",
    type: CRSType.PROJECTED,
    datum: DatumType.EGYPT1907,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    projection: {
      type: "TM",
      cm: 27.0,
      scaleFactor: 1.0,
      falseEasting: 700000.0,
      falseNorthing: 200000.0,
      latOrigin: 30.0
    },
    proj4String: "+proj=tmerc +lat_0=30 +lon_0=27 +k=1 +x_0=700000 +y_0=200000 +a=6378200 +rf=298.3 +units=m +no_defs",
    operationId: "EPSG:7697",
    accuracyMeters: 1.2
  },
  {
    id: "EPSG:22994",
    nameAr: "Egypt 1907 / Extended Purple Belt (الممتد)",
    nameEn: "Egypt 1907 / Extended Purple Belt",
    epsg: "22994",
    type: CRSType.PROJECTED,
    datum: DatumType.EGYPT1907,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    projection: {
      type: "TM",
      cm: 27.0,
      scaleFactor: 1.0,
      falseEasting: 700000.0,
      falseNorthing: 1200000.0,
      latOrigin: 30.0
    },
    proj4String: "+proj=tmerc +lat_0=30 +lon_0=27 +k=1 +x_0=700000 +y_0=1200000 +a=6378200 +rf=298.3 +units=m +no_defs",
    operationId: "EPSG:7697",
    accuracyMeters: 1.2
  },
  {
    id: "AUTO:ETM",
    nameAr: "Egypt 1907 / ETM Auto Belt (تلقائي)",
    nameEn: "Egypt 1907 / ETM Auto Belt (Automatic)",
    type: CRSType.PROJECTED,
    datum: DatumType.EGYPT1907,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906
  },
  {
    id: "CUSTOM:EGY_MTM_1",
    nameAr: "Egypt MTM Zone 1 (شريحة 1 - CM 25.5°)",
    nameEn: "Egypt MTM Zone 1 (CM 25.5°)",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm: 25.5,
      scaleFactor: 0.9999,
      falseEasting: 300000.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=25.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "CUSTOM:EGY_MTM_2",
    nameAr: "Egypt MTM Zone 2 (شريحة 2 - CM 28.5°)",
    nameEn: "Egypt MTM Zone 2 (CM 28.5°)",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm: 28.5,
      scaleFactor: 0.9999,
      falseEasting: 300000.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=28.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "CUSTOM:EGY_MTM_3",
    nameAr: "Egypt MTM Zone 3 (شريحة 3 - CM 31.5°)",
    nameEn: "Egypt MTM Zone 3 (CM 31.5°)",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm: 31.5,
      scaleFactor: 0.9999,
      falseEasting: 300000.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=31.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "CUSTOM:EGY_MTM_4",
    nameAr: "Egypt MTM Zone 4 (شريحة 4 - CM 34.5°)",
    nameEn: "Egypt MTM Zone 4 (CM 34.5°)",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm: 34.5,
      scaleFactor: 0.9999,
      falseEasting: 300000.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=34.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "CUSTOM:EGY_MTM_5",
    nameAr: "Egypt MTM Zone 5 (شريحة 5 - CM 37.5°)",
    nameEn: "Egypt MTM Zone 5 (CM 37.5°)",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm: 37.5,
      scaleFactor: 0.9999,
      falseEasting: 300000.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=37.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "AUTO:MTM",
    nameAr: "Egypt MTM Auto Zone (تلقائي)",
    nameEn: "Egypt MTM Auto Zone (Automatic)",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "EGYPT_NATIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84
  }
];

// Geographic Systems (Datums)
const GEOGRAPHIC_SYSTEMS: CRSDefinition[] = [
  {
    id: "EPSG:4326",
    nameAr: "WGS 84 Geographic (عالمي)",
    nameEn: "WGS 84 Geographic (Global)",
    epsg: "4326",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.WGS84,
    category: "GEOGRAPHIC",
    countryCode: "GLB",
    countryNameAr: "عالمي",
    countryNameEn: "Global",
    isLocal: false,
    ellipsoid: ELLIPSOID_WGS84,
    proj4String: "+proj=longlat +datum=WGS84 +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "EPSG:4229",
    nameAr: "Egypt 1907 Geographic (جمهورية مصر العربية)",
    nameEn: "Egypt 1907 Geographic (Egypt)",
    epsg: "4229",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.EGYPT1907,
    category: "GEOGRAPHIC",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    proj4String: "+proj=longlat +a=6378200 +rf=298.3 +no_defs",
    operationId: "EPSG:7697",
    accuracyMeters: 1.2
  },
  {
    id: "EPSG:4204",
    nameAr: "Ain el Abd 1970 Geographic (السعودية / عين العبد)",
    nameEn: "Ain el Abd 1970 Geographic (Saudi Arabia)",
    epsg: "4204",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.AIN_EL_ABD1970,
    category: "GEOGRAPHIC",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    proj4String: "+proj=longlat +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +no_defs",
    operationId: "EPSG:1107",
    accuracyMeters: 18.0
  },
  {
    id: "EPSG:9333",
    nameAr: "KSA-GRF17 Geographic (الإطار المرجعي السعودي الحديث)",
    nameEn: "KSA-GRF17 Geographic (Saudi Arabia SANSER)",
    epsg: "9333",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.KSA_GRF17,
    category: "GEOGRAPHIC",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    proj4String: "+proj=longlat +ellps=GRS80 +no_defs",
    operationId: "ITRF2014 / Epoch 2017.0",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:4614",
    nameAr: "QND95 / Qatar National Datum Geographic (دولة قطر)",
    nameEn: "QND95 Geographic (Qatar)",
    epsg: "4614",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.QND95,
    category: "GEOGRAPHIC",
    countryCode: "QAT",
    countryNameAr: "قطر",
    countryNameEn: "Qatar",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    proj4String: "+proj=longlat +ellps=intl +towgs84=-119.425,-303.909,-11.445,0,0,0,0 +no_defs",
    operationId: "EPSG:1951",
    accuracyMeters: 1.0
  },
  {
    id: "EPSG:4319",
    nameAr: "KGD93 / Kuwait Geodetic Datum Geographic (دولة الكويت)",
    nameEn: "KGD93 / Kuwait Geodetic Datum Geographic",
    epsg: "4319",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.KGD93,
    category: "GEOGRAPHIC",
    countryCode: "KWT",
    countryNameAr: "الكويت",
    countryNameEn: "Kuwait",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    proj4String: "+proj=longlat +ellps=GRS80 +no_defs",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:4232",
    nameAr: "Fahud Datum Geographic (سلطنة عُمان)",
    nameEn: "Fahud Datum Geographic (Oman)",
    epsg: "4232",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.FAHUD,
    category: "GEOGRAPHIC",
    countryCode: "OMN",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80 +towgs84=-346,-1,224,0,0,0,0 +no_defs",
    operationId: "EPSG:1603",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:4270",
    nameAr: "Nahrwan 1967 Geographic (الإمارات وعُمان والخليج)",
    nameEn: "Nahrwan 1967 Geographic (UAE & Gulf)",
    epsg: "4270",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.NAHRAWAN1967,
    category: "GEOGRAPHIC",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80 +towgs84=-249,-156,-381,0,0,0,0 +no_defs",
    operationId: "EPSG:1578",
    accuracyMeters: 15.0
  },
  {
    id: "EPSG:4281",
    nameAr: "Palestine 1923 Geographic (فلسطين)",
    nameEn: "Palestine 1923 Geographic (Palestine)",
    epsg: "4281",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.PALESTINE1923,
    category: "GEOGRAPHIC",
    countryCode: "PSE",
    countryNameAr: "فلسطين",
    countryNameEn: "Palestine",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80 +towgs84=-275.722,-94.782,340.894,-8.001,-4.42,-11.821,1 +no_defs",
    operationId: "EPSG:1174",
    accuracyMeters: 2.0
  },
  {
    id: "EPSG:4230",
    nameAr: "ED50 Geographic (النظام الأوروبي / الأردن وسوريا والخليج)",
    nameEn: "ED50 Geographic (European Datum 1950)",
    epsg: "4230",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.ED50,
    category: "GEOGRAPHIC",
    countryCode: "JOR",
    countryNameAr: "الأردن",
    countryNameEn: "Jordan",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    proj4String: "+proj=longlat +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +no_defs",
    operationId: "EPSG:1618",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:4743",
    nameAr: "Karbala 1979 Geographic (جمهورية العراق)",
    nameEn: "Karbala 1979 Geographic (Iraq)",
    epsg: "4743",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.KARBALA1979,
    category: "GEOGRAPHIC",
    countryCode: "IRQ",
    countryNameAr: "العراق",
    countryNameEn: "Iraq",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80 +towgs84=-384.7,10.4,219.8,0,0,0,0 +no_defs",
    operationId: "EPSG:1177",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:4201",
    nameAr: "Adindan Geographic (السودان)",
    nameEn: "Adindan Geographic (Sudan)",
    epsg: "4201",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.ADINDAN,
    category: "GEOGRAPHIC",
    countryCode: "SDN",
    countryNameAr: "السودان",
    countryNameEn: "Sudan",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +no_defs",
    operationId: "EPSG:1102",
    accuracyMeters: 12.0
  },
  {
    id: "EPSG:4227",
    nameAr: "Deir ez Zor Geographic (الجمهورية العربية السورية)",
    nameEn: "Deir ez Zor Geographic (Syria)",
    epsg: "4227",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.DEIR_EZ_ZOR,
    category: "GEOGRAPHIC",
    countryCode: "SYR",
    countryNameAr: "سوريا",
    countryNameEn: "Syria",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    proj4String: "+proj=longlat +ellps=clrk80 +towgs84=-308.7,-19,277.6,0,0,0,0 +no_defs",
    operationId: "EPSG:1127",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:4304",
    nameAr: "Voirol 1875 Geographic (الجزائر)",
    nameEn: "Voirol 1875 Geographic (Algeria)",
    epsg: "4304",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.VOIROL1875,
    category: "GEOGRAPHIC",
    countryCode: "DZA",
    countryNameAr: "الجزائر",
    countryNameEn: "Algeria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80ign +towgs84=-73,-247,227,0,0,0,0 +no_defs",
    operationId: "EPSG:1133",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:4307",
    nameAr: "Nord Sahara 1959 Geographic (الجزائر / شمال الصحراء)",
    nameEn: "Nord Sahara 1959 Geographic (Algeria)",
    epsg: "4307",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.NORD_SAHARA,
    category: "GEOGRAPHIC",
    countryCode: "DZA",
    countryNameAr: "الجزائر",
    countryNameEn: "Algeria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80ign +towgs84=-186,-252,-281,0,0,0,0 +no_defs",
    operationId: "EPSG:1134",
    accuracyMeters: 8.0
  },
  {
    id: "EPSG:4223",
    nameAr: "Carthage Geographic (الجمهورية التونسية)",
    nameEn: "Carthage Geographic (Tunisia)",
    epsg: "4223",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.CARTHAGE,
    category: "GEOGRAPHIC",
    countryCode: "TUN",
    countryNameAr: "تونس",
    countryNameEn: "Tunisia",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80ign +towgs84=-263,6,431,0,0,0,0 +no_defs",
    operationId: "EPSG:1123",
    accuracyMeters: 5.0
  },
  {
    id: "EPSG:4261",
    nameAr: "Merchich Geographic (المملكة المغربية)",
    nameEn: "Merchich Geographic (Morocco)",
    epsg: "4261",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.MERCHICH,
    category: "GEOGRAPHIC",
    countryCode: "MAR",
    countryNameAr: "المغرب",
    countryNameEn: "Morocco",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=clrk80ign +towgs84=-31,146,47,0,0,0,0 +no_defs",
    operationId: "EPSG:1159",
    accuracyMeters: 8.0
  },
  {
    id: "EPSG:4702",
    nameAr: "Mauritania 1999 Geographic (الجمهورية الإسلامية الموريتانية)",
    nameEn: "Mauritania 1999 Geographic",
    epsg: "4702",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.MAURITANIA1999,
    category: "GEOGRAPHIC",
    countryCode: "MRT",
    countryNameAr: "موريتانيا",
    countryNameEn: "Mauritania",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    proj4String: "+proj=longlat +ellps=GRS80 +no_defs",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:4163",
    nameAr: "Yemen NGN96 Geographic (الجمهورية اليمنية)",
    nameEn: "Yemen NGN96 Geographic",
    epsg: "4163",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.YEMEN_NGN96,
    category: "GEOGRAPHIC",
    countryCode: "YEM",
    countryNameAr: "اليمن",
    countryNameEn: "Yemen",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    proj4String: "+proj=longlat +ellps=WGS84 +no_defs",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:4205",
    nameAr: "Afgooye Geographic (جمهورية الصومال الفيدرالية)",
    nameEn: "Afgooye Geographic (Somalia)",
    epsg: "4205",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.AFGOOYE,
    category: "GEOGRAPHIC",
    countryCode: "SOM",
    countryNameAr: "الصومال",
    countryNameEn: "Somalia",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    proj4String: "+proj=longlat +ellps=krass +towgs84=-43,-163,45,0,0,0,0 +no_defs",
    operationId: "EPSG:1109",
    accuracyMeters: 20.0
  },
  {
    id: "EPSG:4618",
    nameAr: "Djibouti WGS 84 Geographic (جمهورية جيبوتي)",
    nameEn: "Djibouti Geographic / WGS 84",
    epsg: "4326",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.WGS84,
    category: "GEOGRAPHIC",
    countryCode: "DJI",
    countryNameAr: "جيبوتي",
    countryNameEn: "Djibouti",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    proj4String: "+proj=longlat +datum=WGS84 +no_defs",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:4646",
    nameAr: "Grand Comoros Geographic (الاتحاد القمري)",
    nameEn: "Grand Comoros Geographic",
    epsg: "4646",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.GRAND_COMOROS,
    category: "GEOGRAPHIC",
    countryCode: "COM",
    countryNameAr: "جزر القمر",
    countryNameEn: "Comoros",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    proj4String: "+proj=longlat +ellps=intl +no_defs",
    accuracyMeters: 10.0
  }
];

// Arab & Regional National Systems (Projected Grids)
const ARAB_REGIONAL_SYSTEMS: CRSDefinition[] = [
  // KSA (Saudi Arabia) - Official Modern Reference Frame SANSER / KSA-GRF17
  {
    id: "EPSG:9356",
    nameAr: "KSA-GRF17 / UTM Zone 36N (السعودية - تبوك والساحل الشمالي الغربي)",
    nameEn: "KSA-GRF17 / UTM Zone 36N (Tabuk & NW Coast)",
    epsg: "9356",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 33.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=36 +ellps=GRS80 +units=m +no_defs",
    operationId: "ITRF2014 / Epoch 2017.0",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:9357",
    nameAr: "KSA-GRF17 / UTM Zone 37N (السعودية - المدينة المنورة، جدة ومكة المكرمة)",
    nameEn: "KSA-GRF17 / UTM Zone 37N (Madinah, Jeddah & Makkah)",
    epsg: "9357",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=37 +ellps=GRS80 +units=m +no_defs",
    operationId: "ITRF2014 / Epoch 2017.0",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:9358",
    nameAr: "KSA-GRF17 / UTM Zone 38N (السعودية - الرياض والوسطى والقصيم)",
    nameEn: "KSA-GRF17 / UTM Zone 38N (Riyadh & Central Region)",
    epsg: "9358",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +ellps=GRS80 +units=m +no_defs",
    operationId: "ITRF2014 / Epoch 2017.0",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:9359",
    nameAr: "KSA-GRF17 / UTM Zone 39N (السعودية - الدمام والمنطقة الشرقية)",
    nameEn: "KSA-GRF17 / UTM Zone 39N (Dammam & Eastern Province)",
    epsg: "9359",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=39 +ellps=GRS80 +units=m +no_defs",
    operationId: "ITRF2014 / Epoch 2017.0",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:9360",
    nameAr: "KSA-GRF17 / UTM Zone 40N (السعودية - أقصى الحدود الشرقية والربع الخالي)",
    nameEn: "KSA-GRF17 / UTM Zone 40N (Eastern Border & Rub' al Khali)",
    epsg: "9360",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 57.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=40 +ellps=GRS80 +units=m +no_defs",
    operationId: "ITRF2014 / Epoch 2017.0",
    accuracyMeters: 0.05
  },

  // KSA Historic Ain el Abd 1970
  {
    id: "EPSG:20437",
    nameAr: "Ain el Abd 1970 / Saudi UTM Zone 37N (السعودية - الغربية التاريخي)",
    nameEn: "Ain el Abd 1970 / Saudi UTM Zone 37N",
    epsg: "20437",
    type: CRSType.PROJECTED,
    datum: DatumType.AIN_EL_ABD1970,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=37 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1107",
    accuracyMeters: 18.0
  },
  {
    id: "EPSG:20438",
    nameAr: "Ain el Abd 1970 / Saudi UTM Zone 38N (السعودية - الوسطى التاريخي)",
    nameEn: "Ain el Abd 1970 / Saudi UTM Zone 38N",
    epsg: "20438",
    type: CRSType.PROJECTED,
    datum: DatumType.AIN_EL_ABD1970,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1107",
    accuracyMeters: 18.0
  },
  {
    id: "EPSG:20439",
    nameAr: "Ain el Abd 1970 / Saudi UTM Zone 39N (السعودية - الشرقية التاريخي)",
    nameEn: "Ain el Abd 1970 / Saudi UTM Zone 39N",
    epsg: "20439",
    type: CRSType.PROJECTED,
    datum: DatumType.AIN_EL_ABD1970,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=39 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1107",
    accuracyMeters: 18.0
  },

  // UAE (الإمارات العربية المتحدة)
  {
    id: "EPSG:3997",
    nameAr: "Dubai Local Transverse Mercator / DLTM (إمارة دبي)",
    nameEn: "Dubai Local Transverse Mercator / DLTM (Dubai)",
    epsg: "3997",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 55.33333333333333, scaleFactor: 1.0, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=55.33333333333333 +k=1 +x_0=500000 +y_0=0 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:27039",
    nameAr: "Nahrwan 1967 / UTM Zone 39N (الإمارات - أبوظبي والمنطقة الغربية)",
    nameEn: "Nahrwan 1967 / UTM Zone 39N (Abu Dhabi)",
    epsg: "27039",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=39 +ellps=clrk80 +towgs84=-249,-156,-381,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1578",
    accuracyMeters: 15.0
  },
  {
    id: "EPSG:27040",
    nameAr: "Nahrwan 1967 / UTM Zone 40N (الإمارات - دبي، الشارقة والإمارات الشمالية)",
    nameEn: "Nahrwan 1967 / UTM Zone 40N (Northern Emirates)",
    epsg: "27040",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 57.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=40 +ellps=clrk80 +towgs84=-249,-156,-381,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1578",
    accuracyMeters: 15.0
  },

  // QATAR (دولة قطر)
  {
    id: "EPSG:2932",
    nameAr: "QND95 / Qatar National Grid - QNG95 (شبكة قطر الوطنية الحديثة)",
    nameEn: "QND95 / Qatar National Grid (QNG95)",
    epsg: "2932",
    type: CRSType.PROJECTED,
    datum: DatumType.QND95,
    category: "ARAB_REGIONAL",
    countryCode: "QAT",
    countryNameAr: "قطر",
    countryNameEn: "Qatar",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "CASSINI", cm: 51.2166666666667, scaleFactor: 1.0, falseEasting: 200000.0, falseNorthing: 300000.0, latOrigin: 24.45 },
    proj4String: "+proj=cass +lat_0=24.45 +lon_0=51.2166666666667 +x_0=200000 +y_0=300000 +ellps=intl +towgs84=-119.425,-303.909,-11.445,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1951",
    accuracyMeters: 1.0
  },
  {
    id: "EPSG:28600",
    nameAr: "Qatar 1948 / Qatar National Grid (شبكة قطر القديمة 1948)",
    nameEn: "Qatar 1948 / Qatar National Grid",
    epsg: "28600",
    type: CRSType.PROJECTED,
    datum: DatumType.QATAR1948,
    category: "ARAB_REGIONAL",
    countryCode: "QAT",
    countryNameAr: "قطر",
    countryNameEn: "Qatar",
    isLocal: true,
    ellipsoid: ELLIPSOID_HELMERT1906,
    projection: { type: "CASSINI", cm: 51.2166666666667, scaleFactor: 1.0, falseEasting: 200000.0, falseNorthing: 300000.0, latOrigin: 24.45 },
    proj4String: "+proj=cass +lat_0=24.45 +lon_0=51.2166666666667 +x_0=200000 +y_0=300000 +a=6378200 +rf=298.3 +towgs84=-128,-283,-22,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1777",
    accuracyMeters: 5.0
  },

  // KUWAIT (دولة الكويت)
  {
    id: "EPSG:3889",
    nameAr: "KGD93 / Kuwait Utility Grid - KTM (شبكة المرافق الكويتية الحديثة)",
    nameEn: "KGD93 / Kuwait Utility Grid (KTM)",
    epsg: "3889",
    type: CRSType.PROJECTED,
    datum: DatumType.KGD93,
    category: "ARAB_REGIONAL",
    countryCode: "KWT",
    countryNameAr: "الكويت",
    countryNameEn: "Kuwait",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 48.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=48 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
    accuracyMeters: 0.05
  },
  {
    id: "EPSG:28800",
    nameAr: "Kuwait PWD / British Grid (شبكة الأشغال العامة القديمة)",
    nameEn: "Kuwait PWD / Kuwait British Grid",
    epsg: "28800",
    type: CRSType.PROJECTED,
    datum: DatumType.AIN_EL_ABD1970,
    category: "ARAB_REGIONAL",
    countryCode: "KWT",
    countryNameAr: "الكويت",
    countryNameEn: "Kuwait",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 48.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=48 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1107",
    accuracyMeters: 18.0
  },

  // OMAN (سلطنة عمان)
  {
    id: "EPSG:3440",
    nameAr: "PSD93 / Oman National Grid - ON-TM (الشبكة القومية العُمانية)",
    nameEn: "PSD93 / Oman National Grid (ON-TM)",
    epsg: "3440",
    type: CRSType.PROJECTED,
    datum: DatumType.FAHUD,
    category: "ARAB_REGIONAL",
    countryCode: "OMN",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 57.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=57 +k=0.9996 +x_0=500000 +y_0=0 +ellps=clrk80 +towgs84=-346,-1,224,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1603",
    accuracyMeters: 10.0
  },

  // BAHRAIN (مملكة البحرين)
  {
    id: "EPSG:25882",
    nameAr: "Ain el Abd 1970 / Bahrain State Grid (شبكة مملكة البحرين)",
    nameEn: "Ain el Abd 1970 / Bahrain State Grid",
    epsg: "25882",
    type: CRSType.PROJECTED,
    datum: DatumType.AIN_EL_ABD1970,
    category: "ARAB_REGIONAL",
    countryCode: "BHR",
    countryNameAr: "البحرين",
    countryNameEn: "Bahrain",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 50.55, scaleFactor: 1.0, falseEasting: 200000.0, falseNorthing: 200000.0, latOrigin: 26.0 },
    proj4String: "+proj=tmerc +lat_0=26 +lon_0=50.55 +k=1 +x_0=200000 +y_0=200000 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1107",
    accuracyMeters: 18.0
  },

  // PALESTINE & JORDAN (فلسطين والأردن)
  {
    id: "EPSG:28191",
    nameAr: "Palestine 1923 / Palestine Grid - Cassini (شبكة فلسطين الوطنية)",
    nameEn: "Palestine 1923 / Palestine Grid (Cassini)",
    epsg: "28191",
    type: CRSType.PROJECTED,
    datum: DatumType.PALESTINE1923,
    category: "ARAB_REGIONAL",
    countryCode: "PSE",
    countryNameAr: "فلسطين",
    countryNameEn: "Palestine",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "CASSINI", cm: 35.2120805555556, scaleFactor: 1.0, falseEasting: 170000.0, falseNorthing: 1126863.0, latOrigin: 31.7340969444444 },
    proj4String: "+proj=cass +lat_0=31.7340969444444 +lon_0=35.2120805555556 +x_0=170000 +y_0=1126863 +ellps=clrk80 +towgs84=-275.722,-94.782,340.894,-8.001,-4.42,-11.821,1 +units=m +no_defs",
    operationId: "EPSG:1174",
    accuracyMeters: 2.0
  },
  {
    id: "EPSG:28193",
    nameAr: "Jordan Transverse Mercator / JTM (شبكة المملكة الأردنية الهاشمية)",
    nameEn: "Jordan Transverse Mercator / JTM",
    epsg: "28193",
    type: CRSType.PROJECTED,
    datum: DatumType.ED50,
    category: "ARAB_REGIONAL",
    countryCode: "JOR",
    countryNameAr: "الأردن",
    countryNameEn: "Jordan",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 37.0, scaleFactor: 0.9998, falseEasting: 500000.0, falseNorthing: 3000000.0, latOrigin: 0.0 },
    proj4String: "+proj=tmerc +lat_0=0 +lon_0=37 +k=0.9998 +x_0=500000 +y_0=3000000 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1618",
    accuracyMeters: 10.0
  },

  // IRAQ (جمهورية العراق)
  {
    id: "EPSG:3891",
    nameAr: "Nahrwan 1967 / Iraq UTM Zone 37N (العراق - الأنبار والمنطقة الغربية)",
    nameEn: "Nahrwan 1967 / Iraq UTM Zone 37N",
    epsg: "3891",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "IRQ",
    countryNameAr: "العراق",
    countryNameEn: "Iraq",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=37 +ellps=clrk80 +towgs84=-249,-156,-381,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1578",
    accuracyMeters: 15.0
  },
  {
    id: "EPSG:3892",
    nameAr: "Nahrwan 1967 / Iraq UTM Zone 38N (العراق - بغداد والوسط والجنوب)",
    nameEn: "Nahrwan 1967 / Iraq UTM Zone 38N",
    epsg: "3892",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "IRQ",
    countryNameAr: "العراق",
    countryNameEn: "Iraq",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +ellps=clrk80 +towgs84=-249,-156,-381,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1578",
    accuracyMeters: 15.0
  },

  // SYRIA & LEBANON (سوريا ولبنان)
  {
    id: "EPSG:22770",
    nameAr: "Deir ez Zor / Syria Lambert (الجمهورية العربية السورية - لامبرت)",
    nameEn: "Deir ez Zor / Syria Lambert (LCC)",
    epsg: "22770",
    type: CRSType.PROJECTED,
    datum: DatumType.DEIR_EZ_ZOR,
    category: "ARAB_REGIONAL",
    countryCode: "SYR",
    countryNameAr: "سوريا",
    countryNameEn: "Syria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: 37.35, scaleFactor: 0.999625769, falseEasting: 300000.0, falseNorthing: 300000.0, latOrigin: 34.65 },
    proj4String: "+proj=lcc +lat_1=34.65 +lat_0=34.65 +lon_0=37.35 +k_0=0.999625769 +x_0=300000 +y_0=300000 +ellps=clrk80 +towgs84=-308.7,-19,277.6,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1127",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:22700",
    nameAr: "Deir ez Zor / Levant Zone (لبنان والساحل الشامي)",
    nameEn: "Deir ez Zor / Levant Zone (Lebanon & Levant)",
    epsg: "22700",
    type: CRSType.PROJECTED,
    datum: DatumType.DEIR_EZ_ZOR,
    category: "ARAB_REGIONAL",
    countryCode: "SYR",
    countryNameAr: "سوريا",
    countryNameEn: "Syria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: 35.84, scaleFactor: 0.99953484, falseEasting: 200000.0, falseNorthing: 150000.0, latOrigin: 34.3916666666667 },
    proj4String: "+proj=lcc +lat_1=34.3916666666667 +lat_0=34.3916666666667 +lon_0=35.84 +k_0=0.99953484 +x_0=200000 +y_0=150000 +ellps=clrk80 +towgs84=-308.7,-19,277.6,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1127",
    accuracyMeters: 10.0
  },

  // SUDAN (جمهورية السودان)
  {
    id: "EPSG:20135",
    nameAr: "Adindan / Sudan UTM Zone 35N (السودان - الخرطوم والوسط)",
    nameEn: "Adindan / Sudan UTM Zone 35N (Khartoum)",
    epsg: "20135",
    type: CRSType.PROJECTED,
    datum: DatumType.ADINDAN,
    category: "ARAB_REGIONAL",
    countryCode: "SDN",
    countryNameAr: "السودان",
    countryNameEn: "Sudan",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 27.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=35 +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1102",
    accuracyMeters: 12.0
  },
  {
    id: "EPSG:20136",
    nameAr: "Adindan / Sudan UTM Zone 36N (السودان - بورتسودان والشرق)",
    nameEn: "Adindan / Sudan UTM Zone 36N (Port Sudan)",
    epsg: "20136",
    type: CRSType.PROJECTED,
    datum: DatumType.ADINDAN,
    category: "ARAB_REGIONAL",
    countryCode: "SDN",
    countryNameAr: "السودان",
    countryNameEn: "Sudan",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 33.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=36 +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1102",
    accuracyMeters: 12.0
  },

  // MOROCCO (المملكة المغربية)
  {
    id: "EPSG:26191",
    nameAr: "Merchich / Nord Maroc Lambert Zone 1 (المملكة المغربية - شمال)",
    nameEn: "Merchich / Nord Maroc Lambert Zone 1 (North)",
    epsg: "26191",
    type: CRSType.PROJECTED,
    datum: DatumType.MERCHICH,
    category: "ARAB_REGIONAL",
    countryCode: "MAR",
    countryNameAr: "المغرب",
    countryNameEn: "Morocco",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: -5.4, scaleFactor: 0.999615596, falseEasting: 500000.0, falseNorthing: 300000.0, latOrigin: 33.3 },
    proj4String: "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=-5.4 +k_0=0.999615596 +x_0=500000 +y_0=300000 +ellps=clrk80ign +towgs84=-31,146,47,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1159",
    accuracyMeters: 8.0
  },
  {
    id: "EPSG:26192",
    nameAr: "Merchich / Sud Maroc Lambert Zone 2 (المملكة المغربية - جنوب)",
    nameEn: "Merchich / Sud Maroc Lambert Zone 2 (South)",
    epsg: "26192",
    type: CRSType.PROJECTED,
    datum: DatumType.MERCHICH,
    category: "ARAB_REGIONAL",
    countryCode: "MAR",
    countryNameAr: "المغرب",
    countryNameEn: "Morocco",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: -5.4, scaleFactor: 0.999615596, falseEasting: 500000.0, falseNorthing: 300000.0, latOrigin: 29.7 },
    proj4String: "+proj=lcc +lat_1=29.7 +lat_0=29.7 +lon_0=-5.4 +k_0=0.999615596 +x_0=500000 +y_0=300000 +ellps=clrk80ign +towgs84=-31,146,47,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1159",
    accuracyMeters: 8.0
  },

  // TUNISIA (الجمهورية التونسية)
  {
    id: "EPSG:22391",
    nameAr: "Carthage / Nord Tunisie Lambert Zone 1 (تونس - شمال)",
    nameEn: "Carthage / Nord Tunisie Lambert Zone 1",
    epsg: "22391",
    type: CRSType.PROJECTED,
    datum: DatumType.CARTHAGE,
    category: "ARAB_REGIONAL",
    countryCode: "TUN",
    countryNameAr: "تونس",
    countryNameEn: "Tunisia",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: 10.125, scaleFactor: 0.999625544, falseEasting: 500000.0, falseNorthing: 300000.0, latOrigin: 36.0 },
    proj4String: "+proj=lcc +lat_1=36 +lat_0=36 +lon_0=10.125 +k_0=0.999625544 +x_0=500000 +y_0=300000 +ellps=clrk80ign +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1123",
    accuracyMeters: 5.0
  },
  {
    id: "EPSG:22392",
    nameAr: "Carthage / Sud Tunisie Lambert Zone 2 (تونس - جنوب)",
    nameEn: "Carthage / Sud Tunisie Lambert Zone 2",
    epsg: "22392",
    type: CRSType.PROJECTED,
    datum: DatumType.CARTHAGE,
    category: "ARAB_REGIONAL",
    countryCode: "TUN",
    countryNameAr: "تونس",
    countryNameEn: "Tunisia",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: 10.125, scaleFactor: 0.999625544, falseEasting: 500000.0, falseNorthing: 300000.0, latOrigin: 33.3 },
    proj4String: "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=10.125 +k_0=0.999625544 +x_0=500000 +y_0=300000 +ellps=clrk80ign +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1123",
    accuracyMeters: 5.0
  },

  // ALGERIA (الجمهورية الجزائرية)
  {
    id: "EPSG:22301",
    nameAr: "Voirol 1875 / Nord Algérie Lambert (الجزائر - شمال)",
    nameEn: "Voirol 1875 / Nord Algérie Lambert",
    epsg: "22301",
    type: CRSType.PROJECTED,
    datum: DatumType.VOIROL1875,
    category: "ARAB_REGIONAL",
    countryCode: "DZA",
    countryNameAr: "الجزائر",
    countryNameEn: "Algeria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "LCC", cm: 2.7, scaleFactor: 0.999625544, falseEasting: 500000.0, falseNorthing: 300000.0, latOrigin: 36.0 },
    proj4String: "+proj=lcc +lat_1=36 +lat_0=36 +lon_0=2.7 +k_0=0.999625544 +x_0=500000 +y_0=300000 +ellps=clrk80ign +towgs84=-73,-247,227,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1133",
    accuracyMeters: 10.0
  },
  {
    id: "EPSG:30731",
    nameAr: "Nord Sahara 1959 / UTM Zone 31N (الجزائر - الصحراء)",
    nameEn: "Nord Sahara 1959 / UTM Zone 31N",
    epsg: "30731",
    type: CRSType.PROJECTED,
    datum: DatumType.NORD_SAHARA,
    category: "ARAB_REGIONAL",
    countryCode: "DZA",
    countryNameAr: "الجزائر",
    countryNameEn: "Algeria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 3.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=31 +ellps=clrk80ign +towgs84=-186,-252,-281,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1134",
    accuracyMeters: 8.0
  },

  // LIBYA (دولة ليبيا)
  {
    id: "EPSG:2085",
    nameAr: "ED50 / Libya Zone 6 (ليبيا - طرابلس والساحل الغربي)",
    nameEn: "ED50 / Libya Zone 6 (Tripoli & West)",
    epsg: "2085",
    type: CRSType.PROJECTED,
    datum: DatumType.ED50,
    category: "ARAB_REGIONAL",
    countryCode: "LBY",
    countryNameAr: "ليبيا",
    countryNameEn: "Libya",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 15.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=33 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
    operationId: "EPSG:1618",
    accuracyMeters: 10.0
  },

  // MAURITANIA (الجمهورية الإسلامية الموريتانية)
  {
    id: "EPSG:24313",
    nameAr: "Mauritania 1999 / UTM Zone 28N (موريتانيا - نواكشوط والغرب)",
    nameEn: "Mauritania 1999 / UTM Zone 28N",
    epsg: "24313",
    type: CRSType.PROJECTED,
    datum: DatumType.MAURITANIA1999,
    category: "ARAB_REGIONAL",
    countryCode: "MRT",
    countryNameAr: "موريتانيا",
    countryNameEn: "Mauritania",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: -15.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=28 +ellps=GRS80 +units=m +no_defs",
    accuracyMeters: 0.05
  },

  // YEMEN (الجمهورية اليمنية)
  {
    id: "EPSG:2091",
    nameAr: "Yemen NGN96 / UTM Zone 38N (الجمهورية اليمنية - صنعاء وعدن والوسط)",
    nameEn: "Yemen NGN96 / UTM Zone 38N",
    epsg: "2091",
    type: CRSType.PROJECTED,
    datum: DatumType.YEMEN_NGN96,
    category: "ARAB_REGIONAL",
    countryCode: "YEM",
    countryNameAr: "اليمن",
    countryNameEn: "Yemen",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +ellps=WGS84 +units=m +no_defs",
    accuracyMeters: 0.05
  },

  // SOMALIA (الصومال)
  {
    id: "EPSG:32638_SOM",
    nameAr: "Somalia / UTM Zone 38N (الصومال - مقديشو والوسط)",
    nameEn: "Somalia / UTM Zone 38N",
    epsg: "32638",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "SOM",
    countryNameAr: "الصومال",
    countryNameEn: "Somalia",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "EPSG:32639_SOM",
    nameAr: "Somalia / UTM Zone 39N (الصومال - القرن الأفريقي والشرق)",
    nameEn: "Somalia / UTM Zone 39N",
    epsg: "32639",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "SOM",
    countryNameAr: "الصومال",
    countryNameEn: "Somalia",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },

  // DJIBOUTI (جيبوتي)
  {
    id: "EPSG:32638_DJI",
    nameAr: "CSG 1967 / Djibouti UTM Zone 38N (جمهورية جيبوتي)",
    nameEn: "CSG 1967 / Djibouti UTM Zone 38N",
    epsg: "32638",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "DJI",
    countryNameAr: "جيبوتي",
    countryNameEn: "Djibouti",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },

  // COMOROS (جزر القمر)
  {
    id: "EPSG:32738_COM",
    nameAr: "Comoros / UTM Zone 38S (أرخبيل جزر القمر - موروني)",
    nameEn: "Comoros / UTM Zone 38S",
    epsg: "32738",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "COM",
    countryNameAr: "جزر القمر",
    countryNameEn: "Comoros",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 10000000.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=38 +south +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },

  // EGYPT WGS84 UTM ZONES (35N, 36N, 37N)
  {
    id: "EPSG:32635_EGY",
    nameAr: "WGS 84 / UTM Zone 35N (مصر - الصحراء الغربية ومطروح والحدود الغربية)",
    nameEn: "WGS 84 / UTM Zone 35N (Western Egypt & Matrouh)",
    epsg: "32635",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 27.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "EPSG:32636_EGY",
    nameAr: "WGS 84 / UTM Zone 36N (مصر - القاهرة، الدلتا، الصعيد وسيناء الغربية)",
    nameEn: "WGS 84 / UTM Zone 36N (Cairo, Delta & West Sinai)",
    epsg: "32636",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 33.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  },
  {
    id: "EPSG:32637_EGY",
    nameAr: "WGS 84 / UTM Zone 37N (مصر - شرق سيناء، طابا، شلاين، حلايب وشلاتين والشرق)",
    nameEn: "WGS 84 / UTM Zone 37N (East Sinai, Taba & Red Sea)",
    epsg: "32637",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "EGY",
    countryNameAr: "مصر",
    countryNameEn: "Egypt",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 },
    proj4String: "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs",
    accuracyMeters: 0.0
  }
];

// Global UTM North (1N to 60N)
const UTM_AUTO_HEADER: CRSDefinition = {
  id: "AUTO:UTM",
  nameAr: "WGS 84 / UTM Auto Zone (تحديد تلقائي حسب خط الطول)",
  nameEn: "WGS 84 / UTM Auto Zone (Automatic)",
  type: CRSType.PROJECTED,
  datum: DatumType.WGS84,
  category: "UTM_NORTH",
  countryCode: "GLB",
  countryNameAr: "عالمي",
  countryNameEn: "Global",
  isLocal: false,
  ellipsoid: ELLIPSOID_WGS84
};

const UTM_NORTH_ZONES: CRSDefinition[] = Array.from({ length: 60 }, (_, i) => {
  const zone = i + 1;
  const cm = (zone - 1) * 6 - 180 + 3;
  const epsg = (32600 + zone).toString();

  // Highlight specific Arab countries intersecting UTM zones
  let countryCode: CountryCode = "GLB";
  let countryNameAr = "عالمي";
  let countryNameEn = "Global";

  if (zone === 35 || zone === 36) {
    countryCode = "EGY";
    countryNameAr = "مصر / عالمي";
    countryNameEn = "Egypt / Global";
  } else if (zone === 37) {
    countryCode = "EGY";
    countryNameAr = "مصر / السعودية / عالمي";
    countryNameEn = "Egypt / KSA / Global";
  } else if (zone === 38 || zone === 39) {
    countryCode = "KSA";
    countryNameAr = "السعودية / عالمي";
    countryNameEn = "KSA / Global";
  } else if (zone === 40) {
    countryCode = "UAE";
    countryNameAr = "الإمارات / عُمان / عالمي";
    countryNameEn = "UAE / Oman / Global";
  }

  return {
    id: `EPSG:${epsg}`,
    nameAr: `WGS 84 / UTM Zone ${zone}N (خط المركز: ${cm}°)`,
    nameEn: `WGS 84 / UTM Zone ${zone}N (CM: ${cm}°)`,
    epsg,
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "UTM_NORTH",
    countryCode,
    countryNameAr,
    countryNameEn,
    isLocal: false,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm,
      scaleFactor: 0.9996,
      falseEasting: 500000.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`,
    accuracyMeters: 0.0
  };
});

// Global UTM South (1S to 60S)
const UTM_SOUTH_ZONES: CRSDefinition[] = Array.from({ length: 60 }, (_, i) => {
  const zone = i + 1;
  const cm = (zone - 1) * 6 - 180 + 3;
  const epsg = (32700 + zone).toString();
  return {
    id: `EPSG:${epsg}`,
    nameAr: `WGS 84 / UTM Zone ${zone}S (خط المركز: ${cm}°)`,
    nameEn: `WGS 84 / UTM Zone ${zone}S (CM: ${cm}°)`,
    epsg,
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "UTM_SOUTH",
    countryCode: "GLB",
    countryNameAr: "عالمي",
    countryNameEn: "Global",
    isLocal: false,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm,
      scaleFactor: 0.9996,
      falseEasting: 500000.0,
      falseNorthing: 10000000.0,
      latOrigin: 0.0
    },
    proj4String: `+proj=utm +zone=${zone} +south +datum=WGS84 +units=m +no_defs`,
    accuracyMeters: 0.0
  };
});

// Web & Map Projections
const WEB_PROJECTIONS: CRSDefinition[] = [
  {
    id: "EPSG:3857",
    nameAr: "Web Mercator / EPSG:3857 (نظام إسقاط متري عالمي - Google / ESRI / OSM)",
    nameEn: "Web Mercator / EPSG:3857 (Global Metric Projection)",
    epsg: "3857",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "WEB_PROJECTIONS",
    countryCode: "GLB",
    countryNameAr: "عالمي",
    countryNameEn: "Global",
    isLocal: false,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "WEBMERCATOR",
      cm: 0.0,
      scaleFactor: 1.0,
      falseEasting: 0.0,
      falseNorthing: 0.0,
      latOrigin: 0.0
    },
    proj4String: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs",
    accuracyMeters: 0.0
  }
];

export const CRS_LIST: CRSDefinition[] = [
  ...EGYPT_NATIONAL_SYSTEMS,
  ...ARAB_REGIONAL_SYSTEMS,
  ...GEOGRAPHIC_SYSTEMS,
  UTM_AUTO_HEADER,
  ...UTM_NORTH_ZONES,
  ...UTM_SOUTH_ZONES,
  ...WEB_PROJECTIONS
];

export function getCRSById(id: string): CRSDefinition | undefined {
  return CRS_LIST.find((crs) => crs.id === id);
}

// Helpers for automatic zone determination based on longitude and latitude
export function getUTMZone(lon: number): number {
  let zone = Math.floor((lon + 180) / 6) + 1;
  if (zone > 60) zone = 60;
  if (zone < 1) zone = 1;
  return zone;
}

export function getUTMCRSForLon(lon: number, lat: number = 30): CRSDefinition {
  const zone = getUTMZone(lon);
  const isSouth = lat < 0;
  const epsgCode = isSouth ? 32700 + zone : 32600 + zone;
  const id = `EPSG:${epsgCode}`;

  const existing = getCRSById(id);
  if (existing) return existing;

  const hemi = isSouth ? "S" : "N";
  const cm = (zone - 1) * 6 - 180 + 3;
  return {
    id,
    nameAr: `WGS 84 / UTM Zone ${zone}${hemi} (خط المركز: ${cm}°)`,
    nameEn: `WGS 84 / UTM Zone ${zone}${hemi} (CM: ${cm}°)`,
    epsg: `${epsgCode}`,
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: isSouth ? "UTM_SOUTH" : "UTM_NORTH",
    countryCode: "GLB",
    countryNameAr: "عالمي",
    countryNameEn: "Global",
    isLocal: false,
    ellipsoid: ELLIPSOID_WGS84,
    projection: {
      type: "TM",
      cm,
      scaleFactor: 0.9996,
      falseEasting: 500000.0,
      falseNorthing: isSouth ? 10000000.0 : 0.0,
      latOrigin: 0.0
    },
    proj4String: `+proj=utm +zone=${zone} ${isSouth ? "+south " : ""}+datum=WGS84 +units=m +no_defs`,
    accuracyMeters: 0.0
  };
}

export function getETMBeltForLonLat(lon: number, lat: number): CRSDefinition {
  if (lon < 29.0) {
    if (lat < 25.0) {
      return getCRSById("EPSG:22994")!; // Extended Purple Belt
    }
    return getCRSById("EPSG:22993")!; // Purple Belt
  } else if (lon >= 33.0) {
    return getCRSById("EPSG:22991")!; // Blue Belt
  } else {
    if (lat < 25.0) {
      return getCRSById("CUSTOM:EGY_ETM_SOUTH_RED")!; // South Red Belt
    }
    return getCRSById("EPSG:22992")!; // Red Belt
  }
}

export function getMTMZoneForLon(lon: number): CRSDefinition {
  if (lon < 27.0) return getCRSById("CUSTOM:EGY_MTM_1")!;
  if (lon < 30.0) return getCRSById("CUSTOM:EGY_MTM_2")!;
  if (lon < 33.0) return getCRSById("CUSTOM:EGY_MTM_3")!;
  if (lon < 36.0) return getCRSById("CUSTOM:EGY_MTM_4")!;
  return getCRSById("CUSTOM:EGY_MTM_5")!;
}
