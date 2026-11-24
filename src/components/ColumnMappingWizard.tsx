/**
 * مدار – MDAR | Column Mapping Wizard Component
 * Step-by-step interactive interface for reviewing, confirming, and adjusting
 * column roles before data ingestion and coordinate transformation.
 */

import React, { useState, useEffect } from "react";
import {
  DetectedColumn,
  ColumnRole,
  validateColumnSet
} from "../utils/smartColumnDetection";
import { SmartImportResult } from "../utils/smartImport";
import {
  Check,
  AlertTriangle,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
  Save,
  FolderOpen,
  X,
  FileSpreadsheet,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

interface ColumnMappingWizardProps {
  isOpen: boolean;
  importResult: SmartImportResult;
  lang: "ar" | "en";
  onConfirm: (confirmedColumns: DetectedColumn[], updatedResult: SmartImportResult) => void;
  onCancel: () => void;
}

export default function ColumnMappingWizard({
  isOpen,
  importResult,
  lang,
  onConfirm,
  onCancel
}: ColumnMappingWizardProps) {
  const [columns, setColumns] = useState<DetectedColumn[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(importResult.selectedSheet);
  const [profiles, setProfiles] = useState<Record<string, Record<string, ColumnRole>>>({});
  const [profileName, setProfileName] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize columns from import result
  useEffect(() => {
    if (importResult && importResult.detectedColumns) {
      setColumns(JSON.parse(JSON.stringify(importResult.detectedColumns)));
      setSelectedSheet(importResult.selectedSheet);
    }
  }, [importResult]);

  // Load saved profiles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mdar_column_mapping_profiles");
      if (stored) {
        setProfiles(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read localStorage profiles:", e);
    }
  }, []);

  if (!isOpen) return null;

  const isRtl = lang === "ar";

  const roleOptions: { role: ColumnRole; labelAr: string; labelEn: string; color: string }[] = [
    { role: "X", labelAr: "إحداثي X (الشرقيات / خط الطول)", labelEn: "X (Easting / Longitude)", color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300" },
    { role: "Y", labelAr: "إحداثي Y (الشماليات / دائرة العرض)", labelEn: "Y (Northing / Latitude)", color: "text-sky-700 bg-sky-50 dark:bg-sky-950 dark:text-sky-300" },
    { role: "Z", labelAr: "إحداثي Z (الارتفاع / المنسوب)", labelEn: "Z (Elevation / Height)", color: "text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300" },
    { role: "ID", labelAr: "معرف النقطة (Point ID)", labelEn: "Point ID / Code", color: "text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300" },
    { role: "NAME", labelAr: "اسم النقطة (Name / Label)", labelEn: "Point Name", color: "text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300" },
    { role: "CRS", labelAr: "النظام الإحداثي (CRS / EPSG)", labelEn: "CRS / EPSG Code", color: "text-cyan-700 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300" },
    { role: "DESCRIPTION", labelAr: "الوصف / الملاحظات (Description)", labelEn: "Description / Notes", color: "text-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-slate-300" },
    { role: "ATTRIBUTE", labelAr: "حقل إضافي (حفظ في الجدول)", labelEn: "Additional Attribute", color: "text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300" },
    { role: "IGNORE", labelAr: "تجاهل (استبعاد من الاستيراد)", labelEn: "Ignore Column", color: "text-neutral-500 bg-neutral-100 dark:bg-slate-800 dark:text-slate-400" }
  ];

  const handleRoleChange = (colIndex: number, newRole: ColumnRole) => {
    setValidationError(null);
    setColumns((prev) => {
      const updated = prev.map((col) => {
        if (col.index === colIndex) {
          return {
            ...col,
            suggestedRole: newRole,
            warnings: col.warnings.filter((w) => !w.includes("أكثر من عمود"))
          };
        }
        return col;
      });
      validateColumnSet(updated);
      return updated;
    });
  };

  const handleSwapXY = () => {
    setValidationError(null);
    setColumns((prev) => {
      const updated = prev.map((col) => {
        if (col.suggestedRole === "X") return { ...col, suggestedRole: "Y" as ColumnRole };
        if (col.suggestedRole === "Y") return { ...col, suggestedRole: "X" as ColumnRole };
        return col;
      });
      validateColumnSet(updated);
      return updated;
    });
  };

  const handleReset = () => {
    setValidationError(null);
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        suggestedRole: "ATTRIBUTE",
        confidence: 0,
        warnings: []
      }))
    );
  };

  const handleAutoDetect = () => {
    setValidationError(null);
    if (importResult && importResult.detectedColumns) {
      setColumns(JSON.parse(JSON.stringify(importResult.detectedColumns)));
    }
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) return;
    const mapping: Record<string, ColumnRole> = {};
    columns.forEach((c) => {
      mapping[c.originalHeader] = c.suggestedRole;
    });

    const nextProfiles = { ...profiles, [profileName.trim()]: mapping };
    setProfiles(nextProfiles);
    try {
      localStorage.setItem("mdar_column_mapping_profiles", JSON.stringify(nextProfiles));
    } catch (e) {
      console.warn("Failed to save profile:", e);
    }
    setProfileName("");
    setShowProfileModal(false);
  };

  const handleLoadProfile = (name: string) => {
    const profile = profiles[name];
    if (!profile) return;

    setColumns((prev) => {
      const updated = prev.map((col) => {
        if (profile[col.originalHeader]) {
          return { ...col, suggestedRole: profile[col.originalHeader] };
        }
        return col;
      });
      validateColumnSet(updated);
      return updated;
    });
  };

  const handleConfirm = () => {
    const xCol = columns.find((c) => c.suggestedRole === "X");
    const yCol = columns.find((c) => c.suggestedRole === "Y");

    if (!xCol || !yCol) {
      setValidationError(
        isRtl
          ? "خطأ في التعيين: يجب تحديد عمود للإحداثي X وعمود للإحداثي Y قبل المتابعة."
          : "Mapping Error: You must assign both an X coordinate column and a Y coordinate column."
      );
      return;
    }

    if (xCol.index === yCol.index) {
      setValidationError(
        isRtl
          ? "خطأ في التعيين: لا يمكن تعيين نفس العمود كإحداثي X وY معاً."
          : "Mapping Error: The same column cannot be assigned to both X and Y."
      );
      return;
    }

    onConfirm(columns, importResult);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Wizard Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {isRtl ? "معالج فحص ومطابقة الأعمدة الذكي" : "Smart Column Mapping Wizard"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isRtl
                    ? `الملف: ${importResult.fileName} (${importResult.totalRows.toLocaleString()} صف | الترميز: ${importResult.encoding})`
                    : `File: ${importResult.fileName} (${importResult.totalRows.toLocaleString()} rows | ${importResult.encoding})`}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-neutral-100/70 dark:bg-slate-850 border-b border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAutoDetect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? "اكتشاف تلقائي" : "Auto Detect"}</span>
            </button>

            <button
              onClick={handleSwapXY}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{isRtl ? "عكس X و Y" : "Swap X / Y"}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? "إعادة تعيين" : "Reset Mapping"}</span>
            </button>
          </div>

          {/* Profile Management Buttons */}
          <div className="flex items-center gap-2">
            {Object.keys(profiles).length > 0 && (
              <select
                onChange={(e) => e.target.value && handleLoadProfile(e.target.value)}
                defaultValue=""
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs"
              >
                <option value="" disabled>
                  {isRtl ? "📂 قوالب التعيين المحفوظة..." : "📂 Load Saved Profile..."}
                </option>
                {Object.keys(profiles).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isRtl ? "حفظ كقالب" : "Save Profile"}</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Columns Mapping Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">{isRtl ? "اسم العمود الأصلي" : "Original Header"}</th>
                <th className="p-3">{isRtl ? "الوظيفة المحددة" : "Assigned Role"}</th>
                <th className="p-3 w-28 text-center">{isRtl ? "درجة الثقة" : "Confidence"}</th>
                <th className="p-3">{isRtl ? "عينة من القيم (أول 5 صفوف)" : "Sample Values"}</th>
                <th className="p-3">{isRtl ? "تنبيهات وملاحظات" : "Status & Warnings"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-slate-800/60">
              {columns.map((col) => {
                const currentOption = roleOptions.find((r) => r.role === col.suggestedRole);
                const hasWarnings = col.warnings.length > 0;

                return (
                  <tr
                    key={col.index}
                    className="hover:bg-neutral-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-mono text-center text-slate-400">{col.index + 1}</td>

                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {col.originalHeader}
                    </td>

                    <td className="p-3">
                      <select
                        value={col.suggestedRole}
                        onChange={(e) => handleRoleChange(col.index, e.target.value as ColumnRole)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          currentOption ? currentOption.color : ""
                        } border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800`}
                      >
                        {roleOptions.map((opt) => (
                          <option key={opt.role} value={opt.role}>
                            {isRtl ? opt.labelAr : opt.labelEn}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          col.confidence >= 80
                            ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300"
                            : col.confidence >= 50
                            ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {col.confidence}%
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1 flex-wrap font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {col.sampleValues.map((val, i) => (
                          <span
                            key={i}
                            className="bg-neutral-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-slate-700"
                          >
                            {val || "—"}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">
                      {hasWarnings ? (
                        <div className="space-y-1">
                          {col.warnings.map((warn, wIdx) => (
                            <span
                              key={wIdx}
                              className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{warn}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{isRtl ? "جاهز للاستيراد" : "Valid"}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Wizard Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-neutral-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isRtl ? "إلغاء وفحص ملف آخر" : "Cancel"}
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
          >
            <span>{isRtl ? "اعتماد التعيين واستيراد البيانات" : "Confirm & Import Data"}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Save Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-neutral-200 dark:border-slate-800 shadow-xl max-w-sm w-full space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isRtl ? "حفظ قالب التعيين" : "Save Mapping Profile"}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl
                  ? "أدخل اسماً للقالب لتطبيقه مستقبلاً على الملفات التي تتبع نفس التنسيق:"
                  : "Enter a profile name to reuse this mapping for similar files:"}
              </p>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={isRtl ? "مثال: مخططات المساحة المصرية" : "e.g. Survey Coordinates"}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-neutral-100 dark:hover:bg-slate-800"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  {isRtl ? "حفظ" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
