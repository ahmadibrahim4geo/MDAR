/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CRS_LIST } from "../lib/crsData";
import { convertCoordinates } from "../lib/coordinateMath";
import { parseSingleCoordinate, formatToDMS } from "../lib/parser";
import { TranslationDictionary, CRSType } from "../types";
import { HelpCircle, Copy, Check, Navigation, Info, AlertTriangle, ArrowLeftRight, BookOpen, Globe } from "lucide-react";
import FormatGuideModal from "./FormatGuideModal";
import MapModal from "./MapModal";
import CRSSelect from "./CRSSelect";
import { downloadKMLFile } from "../utils/kmlExport";
import { BatchRow } from "../types";

interface HomeTabProps {
  t: TranslationDictionary;
  lang: "ar" | "en";
  metricDecimals: number;
  geoDecimals: number;
}

export default function HomeTab({ t, lang, metricDecimals, geoDecimals }: HomeTabProps) {
  const [sourceId, setSourceId] = useState("EPSG:4326");
  const [targetId, setTargetId] = useState("EPSG:22992"); // Red Belt default
  
  // Inputs (Column 1: Longitude/Easting X, Column 2: Latitude/Northing Y)
  const [inputVal1, setInputVal1] = useState("31.235712"); // Longitude or Easting (X)
  const [inputVal2, setInputVal2] = useState("30.044420"); // Latitude or Northing (Y)
  
  // Raw parsed numeric inputs
  const [parsed1, setParsed1] = useState<number | null>(31.235712);
  const [parsed2, setParsed2] = useState<number | null>(30.044420);
  
  // Output state
  const [outVal1, setOutVal1] = useState<string>("");
  const [outVal2, setOutVal2] = useState<string>("");
  const [outDMS, setOutDMS] = useState<string>("");
  const [outZone, setOutZone] = useState<string>("");
  const [outLon, setOutLon] = useState<number | undefined>(undefined);
  const [outLat, setOutLat] = useState<number | undefined>(undefined);
  const [operationId, setOperationId] = useState<string | undefined>(undefined);
  const [accuracyMeters, setAccuracyMeters] = useState<number | undefined>(undefined);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const srcCRS = CRS_LIST.find(c => c.id === sourceId) || CRS_LIST[0];
  const tgtCRS = CRS_LIST.find(c => c.id === targetId) || CRS_LIST[1];
  
  const isSrcMetric = srcCRS.type === CRSType.PROJECTED;
  const isTgtMetric = tgtCRS.type === CRSType.PROJECTED;

  // Reparse inputs when text inputs change
  useEffect(() => {
    const val1 = parseSingleCoordinate(inputVal1);
    const val2 = parseSingleCoordinate(inputVal2);
    setParsed1(val1);
    setParsed2(val2);
  }, [inputVal1, inputVal2]);

  // Execute Conversion
  const handleConvert = () => {
    if (parsed1 === null || parsed2 === null) {
      setError(true);
      return;
    }
    
    setError(false);
    try {
      const result = convertCoordinates(
        parsed1,
        parsed2,
        srcCRS,
        tgtCRS,
        isSrcMetric,
        isTgtMetric
      );
      
      let wList = [...result.warnings];
      
      setOutLon(result.lonWGS84);
      setOutLat(result.latWGS84);
      setOperationId(result.operationId);
      setAccuracyMeters(result.accuracyMeters);
      
      // Format outputs according to configuration
      if (isTgtMetric) {
        setOutVal1(result.out1.toFixed(metricDecimals));
        setOutVal2(result.out2.toFixed(metricDecimals));
        
        // Output DMS is always for geographic WGS84
        setOutDMS(formatToDMS(result.lonWGS84, false) + " , " + formatToDMS(result.latWGS84, true));
        setOutZone(tgtCRS.projection?.cm ? `${tgtCRS.nameAr || tgtCRS.nameEn} (CM: ${tgtCRS.projection.cm}°)` : "Auto Detected");
      } else {
        setOutVal1(result.out1.toFixed(geoDecimals));
        setOutVal2(result.out2.toFixed(geoDecimals));
        setOutDMS(formatToDMS(result.out1, false) + " , " + formatToDMS(result.out2, true));
        setOutZone("Geographic Datum");
      }
      
      setWarnings(wList);
    } catch (e) {
      setError(true);
    }
  };

  // Run initial conversion
  useEffect(() => {
    handleConvert();
  }, [parsed1, parsed2, sourceId, targetId, metricDecimals, geoDecimals]);

  const copyToClipboard = () => {
    const text = isTgtMetric 
      ? `Easting (X): ${outVal1}\tNorthing (Y): ${outVal2}\tZone: ${outZone}`
      : `Longitude (X): ${outVal1}\tLatitude (Y): ${outVal2}\tDMS: ${outDMS}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapInputs = () => {
    const temp = inputVal1;
    setInputVal1(inputVal2);
    setInputVal2(temp);
  };

  return (
    <div className="space-y-6" id="home_tab_container">
      <FormatGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      {outLon !== undefined && outLat !== undefined && (
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          rows={[
            {
              id: 1,
              pointId: "PT-01",
              input1: inputVal1,
              input2: inputVal2,
              outputX: isTgtMetric ? parseFloat(outVal1) : undefined,
              outputY: isTgtMetric ? parseFloat(outVal2) : undefined,
              outputLon: outLon,
              outputLat: outLat,
              outputZone: outZone,
              status: "success",
              warnings: warnings
            }
          ]}
          lang={lang}
          metricDecimals={metricDecimals}
          geoDecimals={geoDecimals}
          formatDMS={(val, isLat) => formatToDMS(val, isLat)}
        />
      )}

      {/* Introduction Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4" id="home_intro_card">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-slate-100 font-sans">{t.singleTitle}</h2>
            <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">{t.singleSubtitle}</p>
          </div>
        </div>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/80"
        >
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === "ar" ? "دليل صيغ الإدخال والبيانات" : "Format Guide & Specs"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings & Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-6 shadow-sm space-y-6" id="single_converter_settings">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100 border-b border-neutral-100 dark:border-slate-700 pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-neutral-400 dark:text-slate-400" />
              {lang === "ar" ? "تحديد النظم والمدخلات" : "Systems & Input Setup"}
            </h3>

            {/* Systems Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CRSSelect
                label={t.sourceCRS}
                value={sourceId}
                onChange={(newId) => {
                  setSourceId(newId);
                  const crs = CRS_LIST.find(c => c.id === newId);
                  if (crs?.type === CRSType.PROJECTED) {
                    setInputVal1("615000.00");
                    setInputVal2("810000.00");
                  } else {
                    setInputVal1("31.235712");
                    setInputVal2("30.044420");
                  }
                }}
                lang={lang}
                id="home_source_crs_select"
              />

              <CRSSelect
                label={t.targetCRS}
                value={targetId}
                onChange={(newId) => setTargetId(newId)}
                lang={lang}
                id="home_target_crs_select"
              />
            </div>

            {/* Dynamic Coordinates Input Fields */}
            <div className="bg-neutral-50/70 dark:bg-slate-900/50 rounded-xl p-4 border border-neutral-200/60 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider">{t.inputCoords}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={swapInputs}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                    title={lang === "ar" ? "تبديل القيمتين X و Y" : "Swap X and Y values"}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{lang === "ar" ? "تبديل X ↔ Y" : "Swap X ↔ Y"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGuideOpen(true)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-700 text-neutral-600 dark:text-slate-300 border border-neutral-300 dark:border-slate-600 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{lang === "ar" ? "دليل صيغ الإدخال" : "Format Guide"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Field 1: Longitude / Easting (X) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
                      {isSrcMetric ? `${t.easting} (X)` : `${t.longitude} (X / Lon)`}
                    </label>
                    <span className="text-[10px] font-mono bg-neutral-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-neutral-600 dark:text-slate-300">
                      {isSrcMetric ? "Meter (X)" : "Degree (Lon)"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={inputVal1}
                    onChange={(e) => setInputVal1(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder={isSrcMetric ? "e.g., 615000" : "e.g., 31° 14' 08.56\" E"}
                  />
                  {parsed1 !== null && (
                    <span className="text-xs text-neutral-400 dark:text-slate-500 block px-1">
                      {lang === "ar" ? "القيمة الرقمية: " : "Parsed: "}
                      <strong className="font-mono text-neutral-600 dark:text-slate-300">{parsed1.toFixed(6)}</strong>
                    </span>
                  )}
                </div>

                {/* Field 2: Latitude / Northing (Y) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
                      {isSrcMetric ? `${t.northing} (Y)` : `${t.latitude} (Y / Lat)`}
                    </label>
                    <span className="text-[10px] font-mono bg-neutral-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-neutral-600 dark:text-slate-300">
                      {isSrcMetric ? "Meter (Y)" : "Degree (Lat)"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={inputVal2}
                    onChange={(e) => setInputVal2(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder={isSrcMetric ? "e.g., 810000" : "e.g., 30° 02' 39.90\" N"}
                  />
                  {parsed2 !== null && (
                    <span className="text-xs text-neutral-400 dark:text-slate-500 block px-1">
                      {lang === "ar" ? "القيمة الرقمية: " : "Parsed: "}
                      <strong className="font-mono text-neutral-600 dark:text-slate-300">{parsed2.toFixed(6)}</strong>
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{t.errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 shadow-sm overflow-hidden h-full flex flex-col" id="single_converter_results">
            {/* Header */}
            <div className="bg-neutral-800 dark:bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  {t.outputCoords}
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  {lang === "ar" ? "نتائج التحويل الهندسية" : "Conversion Results"}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  disabled={!outLon || !outLat}
                  className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 shadow-xs disabled:opacity-40"
                  title={lang === "ar" ? "معاينة النقطة على الخريطة التفاعلية وصور الأقمار الصناعية" : "View point on interactive satellite map"}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "معاينة الخريطة" : "Map View"}</span>
                </button>

                <button
                  onClick={() => {
                    if (outLon !== undefined && outLat !== undefined) {
                      const singleRow: BatchRow = {
                        id: 1,
                        pointId: "Single_Point",
                        input1: inputVal1,
                        input2: inputVal2,
                        outputX: isTgtMetric ? parseFloat(outVal1) : undefined,
                        outputY: isTgtMetric ? parseFloat(outVal2) : undefined,
                        outputLon: outLon,
                        outputLat: outLat,
                        outputZone: outZone,
                        status: "success",
                        warnings: []
                      };
                      downloadKMLFile([singleRow], metricDecimals, geoDecimals, undefined, lang);
                    }
                  }}
                  disabled={!outLon || !outLat}
                  className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 shadow-xs disabled:opacity-40"
                  title={lang === "ar" ? "تصدير النقطة إلى ملف Google Earth KML" : "Export point to Google Earth KML"}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "تصدير KML" : "KML"}</span>
                </button>

                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-neutral-700/80 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg transition-colors border border-neutral-600/50 flex items-center gap-1.5 text-xs font-semibold shrink-0 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === "ar" ? "تم النسخ!" : "Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === "ar" ? "نسخ" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Result field 1 */}
                <div className="border-b border-neutral-100 dark:border-slate-700 pb-3">
                  <span className="text-xs font-medium text-neutral-400 dark:text-slate-400 block">
                    {isTgtMetric ? `${t.easting} (X)` : `${t.longitude} (X / Lon)`}
                  </span>
                  <div className="text-2xl font-bold font-mono text-neutral-800 dark:text-slate-100 mt-1 select-all">
                    {outVal1 || "---"}
                    {isTgtMetric && <span className="text-sm text-neutral-500 dark:text-slate-400 font-sans ml-1">متر</span>}
                  </div>
                </div>

                {/* Result field 2 */}
                <div className="border-b border-neutral-100 dark:border-slate-700 pb-3">
                  <span className="text-xs font-medium text-neutral-400 dark:text-slate-400 block">
                    {isTgtMetric ? `${t.northing} (Y)` : `${t.latitude} (Y / Lat)`}
                  </span>
                  <div className="text-2xl font-bold font-mono text-neutral-800 dark:text-slate-100 mt-1 select-all">
                    {outVal2 || "---"}
                    {isTgtMetric && <span className="text-sm text-neutral-500 dark:text-slate-400 font-sans ml-1">متر</span>}
                  </div>
                </div>

                {/* DMS notation */}
                <div className="border-b border-neutral-100 dark:border-slate-700 pb-3">
                  <span className="text-xs font-medium text-neutral-400 dark:text-slate-400 block">
                    {lang === "ar" ? "الصيغة الجغرافية (DMS)" : "Geographic Format (DMS)"}
                  </span>
                  <div className="text-sm font-semibold font-mono text-neutral-700 dark:text-slate-200 mt-1">
                    {outDMS || "---"}
                  </div>
                </div>

                {/* Detected Belt / Zone */}
                <div>
                  <span className="text-xs font-medium text-neutral-400 dark:text-slate-400 block">
                    {lang === "ar" ? "الحزام / الشريحة المحتسبة" : "Computed Belt / Zone"}
                  </span>
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md inline-block border border-emerald-100 dark:border-emerald-800">
                    {outZone || "---"}
                  </div>
                </div>

                {/* Geodetic Provenance & Accuracy Badges */}
                <div className="pt-3 border-t border-neutral-100 dark:border-slate-700/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-slate-400">
                      {t.operationBadge}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                      {operationId || "EPSG Standard Transformation"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-slate-400">
                      {t.accuracyBadge}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      (accuracyMeters ?? 0) <= 0.05
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : (accuracyMeters ?? 0) <= 2.0
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                        : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                    }`}>
                      {accuracyMeters !== undefined 
                        ? (accuracyMeters === 0 
                            ? (lang === "ar" ? "تحليلي دقيق (0.00م)" : "Exact Analytical (0.00m)") 
                            : `±${accuracyMeters}m (${(accuracyMeters <= 0.05 ? (lang === "ar" ? "دقة سنتيمترية" : "Centimetric") : (accuracyMeters <= 2 ? (lang === "ar" ? "دقة مساحية معتمدة" : "Survey Grade") : (lang === "ar" ? "إزاحة تقريبية" : "Approximate Shift")))})`)
                        : "±1.2m"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings Container */}
              {warnings.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {lang === "ar" ? "تنبيهات وملاحظات جيوديسية:" : "Geodetic Warnings & Notes:"}
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-amber-700 dark:text-amber-300 pl-1">
                    {warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
