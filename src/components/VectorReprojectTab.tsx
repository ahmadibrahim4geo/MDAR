/**
 * مدار – MDAR | GIS Vector File Reprojection Tab
 * Reprojects Shapefiles (ZIP), GeoJSON, and KML files with high precision and client-side privacy.
 */

import React, { useState, useRef } from "react";
import { CRS_LIST } from "../lib/crsData";
import { CRSDefinition, TranslationDictionary } from "../types";
import CRSSelect from "./CRSSelect";
import {
  reprojectFeatureCollection,
  parseKMLToGeoJSON,
  parseShapefileZip,
  featureCollectionToKML,
  downloadFile,
  ReprojectionStats
} from "../utils/vectorReprojection";
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  Download,
  Layers,
  Globe,
  RefreshCw,
  FileCheck
} from "lucide-react";

interface VectorReprojectTabProps {
  t: TranslationDictionary;
  lang: "ar" | "en";
}

export default function VectorReprojectTab({ lang }: VectorReprojectTabProps) {
  const isAr = lang === "ar";

  const [sourceId, setSourceId] = useState("EPSG:4326");
  const [targetId, setTargetId] = useState("EPSG:22992"); // Red Belt default

  const [file, setFile] = useState<File | null>(null);
  const [originalFC, setOriginalFC] = useState<any | null>(null);
  const [reprojectedFC, setReprojectedFC] = useState<any | null>(null);
  const [stats, setStats] = useState<ReprojectionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const srcCRS = CRS_LIST.find((c) => c.id === sourceId) || CRS_LIST[0];
  const tgtCRS = CRS_LIST.find((c) => c.id === targetId) || CRS_LIST[1];

  const handleFileUpload = async (uploadedFile: File) => {
    setErrorMsg(null);
    setLoading(true);
    setFile(uploadedFile);
    setOriginalFC(null);
    setReprojectedFC(null);
    setStats(null);

    const fileName = uploadedFile.name.toLowerCase();

    try {
      if (fileName.endsWith(".geojson") || fileName.endsWith(".json")) {
        const text = await uploadedFile.text();
        const json = JSON.parse(text);
        if (json.type !== "FeatureCollection" && json.type !== "Feature") {
          throw new Error(isAr ? "الملف ليس بصيغة GeoJSON صالحة." : "Invalid GeoJSON structure.");
        }
        const fc = json.type === "Feature" ? { type: "FeatureCollection", features: [json] } : json;
        setOriginalFC(fc);
      } else if (fileName.endsWith(".kml")) {
        const text = await uploadedFile.text();
        const fc = parseKMLToGeoJSON(text);
        setOriginalFC(fc);
      } else if (fileName.endsWith(".zip")) {
        const buffer = await uploadedFile.arrayBuffer();
        const fc = await parseShapefileZip(buffer);
        setOriginalFC(fc);
      } else {
        throw new Error(
          isAr
            ? "صيغة غير مدعومة. يرجى رفع ملف (.geojson, .kml, .zip للملفات المساحية Shapefile)."
            : "Unsupported file format. Please upload .geojson, .kml, or .zip (Shapefile)."
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (isAr ? "فشل قراءة الملف." : "Failed to parse file."));
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReproject = () => {
    if (!originalFC) return;

    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      try {
        const { reprojectedFC: newFC, stats: newStats } = reprojectFeatureCollection(
          originalFC,
          srcCRS,
          tgtCRS
        );
        setReprojectedFC(newFC);
        setStats(newStats);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || (isAr ? "فشل التحويل الجيوديسي." : "Reprojection failed."));
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  const handleDownloadGeoJSON = () => {
    if (!reprojectedFC || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}_${tgtCRS.epsg || "reprojected"}.geojson`;
    downloadFile(JSON.stringify(reprojectedFC, null, 2), filename, "application/geo+json");
  };

  const handleDownloadKML = () => {
    if (!reprojectedFC || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${baseName}_${tgtCRS.epsg || "reprojected"}.kml`;
    const kml = featureCollectionToKML(reprojectedFC, `${baseName} (${tgtCRS.nameAr || tgtCRS.nameEn})`);
    downloadFile(kml, filename, "application/vnd.google-earth.kml+xml");
  };

  return (
    <div className="space-y-6" id="vector_reproject_tab">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-slate-100 font-sans">
              {isAr ? "تحويل وإسقاط ملفات الخرائط ونظم المعلومات (GIS)" : "Vector GIS File Reprojection"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">
              {isAr
                ? "إعادة إسقاط وتحويل ملفات Shapefile (ZIP) و GeoJSON و KML محلياً بالكامل بأعلى دقة جيوديسية ودون مغادرة جهازك."
                : "Client-side reprojection for Shapefile (ZIP), GeoJSON, and KML with complete offline privacy."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            {isAr ? "خصوصية تامة 100% محلية" : "100% Local Privacy"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Setup */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100 border-b border-neutral-100 dark:border-slate-700 pb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? "1. رفع ملف الطبقة الجغرافية" : "1. Upload GIS Vector File"}</span>
            </h3>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-neutral-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-slate-900/40 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".geojson,.json,.kml,.zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white dark:bg-slate-800 group-hover:scale-110 rounded-full shadow-sm text-emerald-600 dark:text-emerald-400 transition-transform">
                  <FileCode className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-neutral-700 dark:text-slate-200">
                  {file
                    ? file.name
                    : isAr
                    ? "انقر لرفع ملف أو اسحبه وأفلته هنا"
                    : "Click to upload or drag & drop"}
                </div>
                <p className="text-xs text-neutral-400 dark:text-slate-500">
                  {isAr
                    ? "يدعم صيغ: Shapefile (.zip)، و GeoJSON (.geojson, .json)، و Google Earth (.kml)"
                    : "Supports: Shapefile (.zip), GeoJSON (.geojson, .json), and Google Earth (.kml)"}
                </p>
                {file && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Systems Setup */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100 border-b border-neutral-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? "2. تحديد نظم الإحداثيات" : "2. Configure CRS Parameters"}</span>
              </h3>

              <CRSSelect
                label={isAr ? "نظام إحداثيات الملف المصدر (Source CRS):" : "Source File CRS:"}
                value={sourceId}
                onChange={(newId) => setSourceId(newId)}
                lang={lang}
                id="vector_source_crs_select"
              />

              <CRSSelect
                label={isAr ? "النظام المطلوب التحويل إليه (Target CRS):" : "Target CRS for Reprojection:"}
                value={targetId}
                onChange={(newId) => setTargetId(newId)}
                lang={lang}
                id="vector_target_crs_select"
              />

              <button
                onClick={handleReproject}
                disabled={!originalFC || loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-40 shadow-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>
                  {isAr
                    ? `تحويل الطبقة إلى (${tgtCRS.nameAr || tgtCRS.nameEn})`
                    : `Reproject to (${tgtCRS.nameEn})`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Layer Stats & Export */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-6 shadow-sm space-y-5 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100 border-b border-neutral-100 dark:border-slate-700 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isAr ? "3. نتائج ومعلومات الطبقة الجغرافية" : "3. Reprojected Layer Stats"}</span>
                </div>
                {stats && (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "تم التحويل بنجاح" : "Success"}</span>
                  </span>
                )}
              </h3>

              {stats ? (
                <div className="space-y-4 pt-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-neutral-50 dark:bg-slate-900/50 rounded-lg border border-neutral-200/60 dark:border-slate-700">
                      <span className="text-[11px] font-medium text-neutral-400 dark:text-slate-400 block">
                        {isAr ? "عدد المعالم الجغرافية" : "Feature Count"}
                      </span>
                      <div className="text-xl font-bold font-mono text-neutral-800 dark:text-slate-100 mt-0.5">
                        {stats.featureCount}
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-slate-900/50 rounded-lg border border-neutral-200/60 dark:border-slate-700">
                      <span className="text-[11px] font-medium text-neutral-400 dark:text-slate-400 block">
                        {isAr ? "أنواع الأشكال الهندسية" : "Geometry Types"}
                      </span>
                      <div className="text-xs font-bold text-neutral-700 dark:text-slate-200 mt-1">
                        {stats.geometryTypes.join(", ") || "Geometry"}
                      </div>
                    </div>
                  </div>

                  {/* Geodetic Provenance Badges */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-slate-400 font-medium">
                        {isAr ? "مسار التحويل الجيوديسي:" : "Geodetic Operation:"}
                      </span>
                      <span className="font-mono font-bold text-neutral-800 dark:text-slate-200">
                        {stats.operationId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-slate-400 font-medium">
                        {isAr ? "الدقة الاسمية للتحويل:" : "Nominal Accuracy:"}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ±{stats.accuracyMeters} m
                      </span>
                    </div>
                  </div>

                  {/* Bounding Box */}
                  <div className="p-3 bg-neutral-50 dark:bg-slate-900/50 rounded-lg border border-neutral-200/60 dark:border-slate-700 text-xs">
                    <span className="font-medium text-neutral-400 dark:text-slate-400 block mb-1">
                      {isAr ? "النطاق المكاني للطبقة (Bounding Box):" : "Layer Extent (Bounding Box):"}
                    </span>
                    <div className="font-mono text-neutral-700 dark:text-slate-300 space-y-0.5">
                      <div>X: [{stats.bounds[0].toFixed(3)}, {stats.bounds[2].toFixed(3)}]</div>
                      <div>Y: [{stats.bounds[1].toFixed(3)}, {stats.bounds[3].toFixed(3)}]</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-neutral-400 dark:text-slate-500 space-y-2">
                  <Layers className="w-10 h-10 mx-auto text-neutral-300 dark:text-slate-600 stroke-1" />
                  <p className="text-sm">
                    {isAr
                      ? "قم برفع ملف واضغط 'تحويل الطبقة' لعرض النتائج وتصدير الملف المحول."
                      : "Upload a file and click 'Reproject' to view stats and download."}
                  </p>
                </div>
              )}
            </div>

            {/* Export Action Buttons */}
            {reprojectedFC && (
              <div className="pt-4 border-t border-neutral-100 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-neutral-500 dark:text-slate-400 block">
                  {isAr ? "تصدير الطبقة المحولة:" : "Export Reprojected Layer:"}
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadGeoJSON}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? "تصدير GeoJSON (.geojson)" : "Export GeoJSON"}</span>
                  </button>

                  <button
                    onClick={handleDownloadKML}
                    className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{isAr ? "تصدير KML (.kml)" : "Export KML"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
