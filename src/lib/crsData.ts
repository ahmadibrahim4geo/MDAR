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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    ellipsoid: ELLIPSOID_WGS84
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
    ellipsoid: ELLIPSOID_HELMERT1906
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
    ellipsoid: ELLIPSOID_INTERNATIONAL1924
  },
  {
    id: "EPSG:9236",
    nameAr: "KSA-GRF17 / SANSER Geographic (الإطار المرجعي السعودي الحديث)",
    nameEn: "KSA-GRF17 / SANSER Geographic (Saudi Arabia)",
    epsg: "9236",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.KSA_GRF17,
    category: "GEOGRAPHIC",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80
  },
  {
    id: "EPSG:4286",
    nameAr: "QND95 / Qatar National Datum Geographic (دولة قطر)",
    nameEn: "QND95 / Qatar National Datum Geographic",
    epsg: "4286",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.QND95,
    category: "GEOGRAPHIC",
    countryCode: "QAT",
    countryNameAr: "قطر",
    countryNameEn: "Qatar",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924
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
    ellipsoid: ELLIPSOID_GRS80
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
    ellipsoid: ELLIPSOID_CLARK1880
  },
  {
    id: "EPSG:4270",
    nameAr: "Nahrawan 1967 Geographic (الإمارات وعُمان والخليج)",
    nameEn: "Nahrawan 1967 Geographic (UAE & Gulf)",
    epsg: "4270",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.NAHRAWAN1967,
    category: "GEOGRAPHIC",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880
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
    ellipsoid: ELLIPSOID_CLARK1880
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
    ellipsoid: ELLIPSOID_INTERNATIONAL1924
  },
  {
    id: "EPSG:4257",
    nameAr: "Karbala 1979 Geographic (جمهورية العراق)",
    nameEn: "Karbala 1979 Geographic (Iraq)",
    epsg: "4257",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.KARBALA1979,
    category: "GEOGRAPHIC",
    countryCode: "IRQ",
    countryNameAr: "العراق",
    countryNameEn: "Iraq",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880
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
    ellipsoid: ELLIPSOID_CLARK1880
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
    ellipsoid: ELLIPSOID_INTERNATIONAL1924
  },
  {
    id: "EPSG:30791",
    nameAr: "Voirol 1875 Geographic (الجزائر)",
    nameEn: "Voirol 1875 Geographic (Algeria)",
    epsg: "30791",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.VOIROL1875,
    category: "GEOGRAPHIC",
    countryCode: "DZA",
    countryNameAr: "الجزائر",
    countryNameEn: "Algeria",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880
  },
  {
    id: "EPSG:4261_MAR",
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
    ellipsoid: ELLIPSOID_CLARK1880
  },
  {
    id: "EPSG:4269_MRT",
    nameAr: "Leigon / Mauritania Datum (الجمهورية الإسلامية الموريتانية)",
    nameEn: "Leigon / Mauritania Datum",
    epsg: "4269",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.WGS84,
    category: "GEOGRAPHIC",
    countryCode: "MRT",
    countryNameAr: "موريتانيا",
    countryNameEn: "Mauritania",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880
  },
  {
    id: "EPSG:4205",
    nameAr: "Afgooye / Somalia Geographic Datum (جمهورية الصومال الفيدرالية)",
    nameEn: "Afgooye / Somalia Geographic Datum",
    epsg: "4205",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.WGS84,
    category: "GEOGRAPHIC",
    countryCode: "SOM",
    countryNameAr: "الصومال",
    countryNameEn: "Somalia",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880
  },
  {
    id: "EPSG:4618",
    nameAr: "CSG 1967 / Djibouti Geographic Datum (جمهورية جيبوتي)",
    nameEn: "CSG 1967 / Djibouti Geographic Datum",
    epsg: "4618",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.WGS84,
    category: "GEOGRAPHIC",
    countryCode: "DJI",
    countryNameAr: "جيبوتي",
    countryNameEn: "Djibouti",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880
  },
  {
    id: "EPSG:4617",
    nameAr: "Combani 1950 / Comoros Geographic Datum (الاتحاد القمري)",
    nameEn: "Combani 1950 / Comoros Geographic Datum",
    epsg: "4617",
    type: CRSType.GEOGRAPHIC,
    datum: DatumType.WGS84,
    category: "GEOGRAPHIC",
    countryCode: "COM",
    countryNameAr: "جزر القمر",
    countryNameEn: "Comoros",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924
  }
];

// Arab & Regional National Systems (Projected Grids)
const ARAB_REGIONAL_SYSTEMS: CRSDefinition[] = [
  // KSA (Saudi Arabia)
  {
    id: "EPSG:20437",
    nameAr: "Ain el Abd 1970 / Saudi UTM Zone 37N (السعودية - الغربية)",
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
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:20438",
    nameAr: "Ain el Abd 1970 / Saudi UTM Zone 38N (السعودية - الوسطى)",
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
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:20439",
    nameAr: "Ain el Abd 1970 / Saudi UTM Zone 39N (السعودية - الشرقية)",
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
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:9237",
    nameAr: "KSA-GRF17 / Saudi National Grid Zone 37N (النظام الحديث SANSER)",
    nameEn: "KSA-GRF17 / Saudi Grid Zone 37N",
    epsg: "9237",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:9238",
    nameAr: "KSA-GRF17 / Saudi National Grid Zone 38N (النظام الحديث SANSER)",
    nameEn: "KSA-GRF17 / Saudi Grid Zone 38N",
    epsg: "9238",
    type: CRSType.PROJECTED,
    datum: DatumType.KSA_GRF17,
    category: "ARAB_REGIONAL",
    countryCode: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // UAE (الإمارات)
  {
    id: "CUSTOM:UAE_DLTM",
    nameAr: "Dubai Transverse Mercator / DLTM (الإمارات / دبي)",
    nameEn: "Dubai Transverse Mercator / DLTM",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: 55.333333333, scaleFactor: 0.99999, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:29100",
    nameAr: "Nahrawan 1967 / UTM Zone 39N (الإمارات أبوظبي)",
    nameEn: "Nahrawan 1967 / UTM Zone 39N (Abu Dhabi)",
    epsg: "29100",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:29120",
    nameAr: "Nahrawan 1967 / UTM Zone 40N (الإمارات دبي والشارقة والجبال)",
    nameEn: "Nahrawan 1967 / UTM Zone 40N (Northern Emirates)",
    epsg: "29120",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "UAE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 57.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // QATAR (قطر)
  {
    id: "EPSG:28600",
    nameAr: "Qatar National Grid / QNG 1995 (شبكة قطر الوطنية)",
    nameEn: "Qatar National Grid / QNG 1995",
    epsg: "28600",
    type: CRSType.PROJECTED,
    datum: DatumType.QND95,
    category: "ARAB_REGIONAL",
    countryCode: "QAT",
    countryNameAr: "قطر",
    countryNameEn: "Qatar",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 51.216666666, scaleFactor: 0.99999, falseEasting: 200000.0, falseNorthing: 300000.0, latOrigin: 24.45 }
  },

  // KUWAIT (الكويت)
  {
    id: "EPSG:3889",
    nameAr: "Kuwait Utility Grid / KTM (الشبكة القومية للكويت)",
    nameEn: "Kuwait Utility Grid / KTM",
    epsg: "3889",
    type: CRSType.PROJECTED,
    datum: DatumType.KGD93,
    category: "ARAB_REGIONAL",
    countryCode: "KWT",
    countryNameAr: "الكويت",
    countryNameEn: "Kuwait",
    isLocal: true,
    ellipsoid: ELLIPSOID_GRS80,
    projection: { type: "TM", cm: 48.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // OMAN (عمان)
  {
    id: "EPSG:3406",
    nameAr: "Oman National Grid / ON-TM (الشبكة القومية العُمانية)",
    nameEn: "Oman National Grid / ON-TM",
    epsg: "3406",
    type: CRSType.PROJECTED,
    datum: DatumType.FAHUD,
    category: "ARAB_REGIONAL",
    countryCode: "OMN",
    countryNameAr: "سلطنة عُمان",
    countryNameEn: "Oman",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 57.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // BAHRAIN (البحرين)
  {
    id: "EPSG:25882",
    nameAr: "Ain el Abd 1970 / Bahrain Grid (شبكة مملكة البحرين)",
    nameEn: "Ain el Abd 1970 / Bahrain Grid",
    epsg: "25882",
    type: CRSType.PROJECTED,
    datum: DatumType.AIN_EL_ABD1970,
    category: "ARAB_REGIONAL",
    countryCode: "BHR",
    countryNameAr: "البحرين",
    countryNameEn: "Bahrain",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 50.55, scaleFactor: 1.0, falseEasting: 200000.0, falseNorthing: 200000.0, latOrigin: 26.0 }
  },

  // PALESTINE & JORDAN (فلسطين والأردن)
  {
    id: "EPSG:28191",
    nameAr: "Palestine 1923 / Palestine Grid (شبكة فلسطين الوطنية)",
    nameEn: "Palestine 1923 / Palestine Grid",
    epsg: "28191",
    type: CRSType.PROJECTED,
    datum: DatumType.PALESTINE1923,
    category: "ARAB_REGIONAL",
    countryCode: "PSE",
    countryNameAr: "فلسطين",
    countryNameEn: "Palestine",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 35.212080555, scaleFactor: 1.0, falseEasting: 170000.0, falseNorthing: 1126863.0, latOrigin: 31.734096944 }
  },
  {
    id: "EPSG:3140",
    nameAr: "Jordan Transverse Mercator / JTM (شبكة المملكة الأردنية)",
    nameEn: "Jordan Transverse Mercator / JTM",
    epsg: "3140",
    type: CRSType.PROJECTED,
    datum: DatumType.ED50,
    category: "ARAB_REGIONAL",
    countryCode: "JOR",
    countryNameAr: "الأردن",
    countryNameEn: "Jordan",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 37.0, scaleFactor: 0.9998, falseEasting: 500000.0, falseNorthing: 3000000.0, latOrigin: 0.0 }
  },

  // IRAQ (العراق)
  {
    id: "EPSG:29037",
    nameAr: "Nahrwan 1967 / Iraq UTM Zone 37N (العراق - الغربية)",
    nameEn: "Nahrwan 1967 / Iraq UTM Zone 37N",
    epsg: "29037",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "IRQ",
    countryNameAr: "العراق",
    countryNameEn: "Iraq",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:29038",
    nameAr: "Nahrwan 1967 / Iraq UTM Zone 38N (العراق - بغداد والوسط)",
    nameEn: "Nahrwan 1967 / Iraq UTM Zone 38N",
    epsg: "29038",
    type: CRSType.PROJECTED,
    datum: DatumType.NAHRAWAN1967,
    category: "ARAB_REGIONAL",
    countryCode: "IRQ",
    countryNameAr: "العراق",
    countryNameEn: "Iraq",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // SYRIA & LEBANON (سوريا ولبنان)
  {
    id: "EPSG:22700",
    nameAr: "Deir ez Zor / Levant Zone 36N (الجمهورية العربية السورية)",
    nameEn: "Deir ez Zor / Levant Zone 36N (Syria)",
    epsg: "22700",
    type: CRSType.PROJECTED,
    datum: DatumType.DEIR_EZ_ZOR,
    category: "ARAB_REGIONAL",
    countryCode: "SYR",
    countryNameAr: "سوريا",
    countryNameEn: "Syria",
    isLocal: true,
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 36.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // SUDAN (السودان)
  {
    id: "EPSG:20135",
    nameAr: "Adindan / Sudan UTM Zone 35N (السودان - الخرطوم والوسط)",
    nameEn: "Adindan / Sudan UTM Zone 35N",
    epsg: "20135",
    type: CRSType.PROJECTED,
    datum: DatumType.ADINDAN,
    category: "ARAB_REGIONAL",
    countryCode: "SDN",
    countryNameAr: "السودان",
    countryNameEn: "Sudan",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 27.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:20136",
    nameAr: "Adindan / Sudan UTM Zone 36N (السودان - الشرق والبحر الأحمر)",
    nameEn: "Adindan / Sudan UTM Zone 36N",
    epsg: "20136",
    type: CRSType.PROJECTED,
    datum: DatumType.ADINDAN,
    category: "ARAB_REGIONAL",
    countryCode: "SDN",
    countryNameAr: "السودان",
    countryNameEn: "Sudan",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 33.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },

  // MOROCCO (المغرب)
  {
    id: "EPSG:26191",
    nameAr: "Merchich / Nord Maroc Lambert Zone 1 (المملكة المغربية)",
    nameEn: "Merchich / Nord Maroc Lambert Zone 1",
    epsg: "26191",
    type: CRSType.PROJECTED,
    datum: DatumType.MERCHICH,
    category: "ARAB_REGIONAL",
    countryCode: "MAR",
    countryNameAr: "المغرب",
    countryNameEn: "Morocco",
    isLocal: true,
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: -5.4, scaleFactor: 0.9996156, falseEasting: 500000.0, falseNorthing: 300000.0, latOrigin: 33.3 }
  },

  // MAURITANIA (موريتانيا)
  {
    id: "EPSG:32628_MRT",
    nameAr: "Mauritania / UTM Zone 28N (موريتانيا - نواكشوط والغرب)",
    nameEn: "Mauritania / UTM Zone 28N",
    epsg: "32628",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "MRT",
    countryNameAr: "موريتانيا",
    countryNameEn: "Mauritania",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: -15.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
  },
  {
    id: "EPSG:32629_MRT",
    nameAr: "Mauritania / UTM Zone 29N (موريتانيا - النعمة والشرق)",
    nameEn: "Mauritania / UTM Zone 29N",
    epsg: "32629",
    type: CRSType.PROJECTED,
    datum: DatumType.WGS84,
    category: "ARAB_REGIONAL",
    countryCode: "MRT",
    countryNameAr: "موريتانيا",
    countryNameEn: "Mauritania",
    isLocal: true,
    ellipsoid: ELLIPSOID_WGS84,
    projection: { type: "TM", cm: -9.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    projection: { type: "TM", cm: 51.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    ellipsoid: ELLIPSOID_CLARK1880,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    ellipsoid: ELLIPSOID_INTERNATIONAL1924,
    projection: { type: "TM", cm: 45.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 10000000.0, latOrigin: 0.0 }
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
    projection: { type: "TM", cm: 27.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    projection: { type: "TM", cm: 33.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    projection: { type: "TM", cm: 39.0, scaleFactor: 0.9996, falseEasting: 500000.0, falseNorthing: 0.0, latOrigin: 0.0 }
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
    }
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
    }
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
    }
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
    }
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
