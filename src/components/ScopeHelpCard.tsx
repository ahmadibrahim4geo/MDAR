/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, Target, Compass, Sliders, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
import { TargetZoneMode } from "../types";

interface ScopeHelpCardProps {
  lang: "ar" | "en";
  activeMode: TargetZoneMode;
  onSelectMode?: (mode: TargetZoneMode) => void;
}

export default function ScopeHelpCard({ lang, activeMode, onSelectMode }: ScopeHelpCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = lang === "ar";

  return (
    <div className="bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200/80 dark:border-slate-700 rounded-xl p-4 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-bold text-xs">
          <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            {isAr
              ? "دليل توضيحي: نطاق التحويل (Zone Scope) وتأثيره على القياسات"
              : "Guide: Zone Scope Impact & Engineering Meaning"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 bg-amber-100 dark:bg-slate-700 hover:bg-amber-200 dark:hover:bg-slate-600 text-amber-900 dark:text-amber-200 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 border border-amber-300/60 dark:border-slate-600"
        >
          <span>{isOpen ? (isAr ? "إخفاء التوضيح" : "Hide Details") : (isAr ? "فهم الفرق والأثر الهندسي" : "Understand Scope Impact")}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Explanation Content */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-slate-700 text-xs text-neutral-700 dark:text-slate-300 space-y-3 animate-fadeIn">
          <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-slate-400">
            {isAr
              ? "عند التحويل إلى نظم متريّة عالمية (UTM) أو محلية (ETM/MTM)، يتم تقسيم الأرض إلى أحزمة/نطاقات طولية (6 درجات لكل حزام UTM). اختيار نطاق التحويل يُحدد كيف يُعامل البرنامج النقاط المساحية المتعددة:"
              : "When converting to Projected Metric CRS (UTM, ETM, MTM), the earth is divided into longitudinal belts. Selecting the Zone Scope determines how boundary-crossing points are processed:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Mode 1: Auto Per Point */}
            <div
              onClick={() => onSelectMode?.(TargetZoneMode.AUTO)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeMode === TargetZoneMode.AUTO
                  ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-neutral-200 dark:border-slate-700 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-slate-100 mb-1">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {isAr ? "1. تلقائي لكل نقطة (Per-Point)" : "1. Auto Per-Point"}
                </span>
                {activeMode === TargetZoneMode.AUTO && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono">
                    {isAr ? "الافتراضي" : "Default"}
                  </span>
                )}
              </div>
              <div className="text-[11px] space-y-1.5 leading-normal text-neutral-600 dark:text-slate-400">
                <p>
                  <strong>{isAr ? "المفهوم:" : "Concept:"}</strong>{" "}
                  {isAr
                    ? "كل نقطة تحسب حزامها الخاص تلقائياً حسب خط طولها."
                    : "Each point gets its exact UTM belt based on its longitude."}
                </p>
                <p className="text-emerald-800 dark:text-emerald-300">
                  <strong>{isAr ? "الأثر المساحي:" : "Survey Impact:"}</strong>{" "}
                  {isAr
                    ? "دقة رياضية مطلق لكل نقطة بشكل منفرد. ممتاز للنقاط المتباعدة."
                    : "Absolute accuracy per individual point. Ideal for scattered survey points."}
                </p>
              </div>
            </div>

            {/* Mode 2: Project Centroid */}
            <div
              onClick={() => onSelectMode?.(TargetZoneMode.UNIFIED_CENTER)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeMode === TargetZoneMode.UNIFIED_CENTER
                  ? "bg-amber-100/80 dark:bg-amber-950/50 border-amber-500 shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-neutral-200 dark:border-slate-700 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-slate-100 mb-1">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {isAr ? "2. موحد لمركز المشروع" : "2. Unified Centroid"}
                </span>
                {activeMode === TargetZoneMode.UNIFIED_CENTER && (
                  <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-mono">
                    {isAr ? "نشط" : "Active"}
                  </span>
                )}
              </div>
              <div className="text-[11px] space-y-1.5 leading-normal text-neutral-600 dark:text-slate-400">
                <p>
                  <strong>{isAr ? "المفهوم:" : "Concept:"}</strong>{" "}
                  {isAr
                    ? "يحسب المركز الثقلي للمشروع ويُوحد جميع النقاط في نطاق هذا المركز."
                    : "Calculates overall centroid and forces all points into the center belt."}
                </p>
                <p className="text-amber-900 dark:text-amber-200">
                  <strong>{isAr ? "الأثر المساحي:" : "Survey Impact:"}</strong>{" "}
                  {isAr
                    ? "يمنع انفصال خطوط AutoCAD عند حدود الأحزمة للمشاريع الممتدة."
                    : "Prevents line splits in CAD when continuous sites cross zone borders."}
                </p>
              </div>
            </div>

            {/* Mode 3: Manual Definition */}
            <div
              onClick={() => onSelectMode?.(TargetZoneMode.MANUAL)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeMode === TargetZoneMode.MANUAL
                  ? "bg-sky-100/80 dark:bg-sky-950/50 border-sky-500 shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-neutral-200 dark:border-slate-700 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-neutral-900 dark:text-slate-100 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  {isAr ? "3. تعريف يدوي موحد" : "3. Manual Override"}
                </span>
                {activeMode === TargetZoneMode.MANUAL && (
                  <span className="text-[10px] bg-sky-600 text-white px-1.5 py-0.5 rounded font-mono">
                    {isAr ? "نشط" : "Active"}
                  </span>
                )}
              </div>
              <div className="text-[11px] space-y-1.5 leading-normal text-neutral-600 dark:text-slate-400">
                <p>
                  <strong>{isAr ? "المفهوم:" : "Concept:"}</strong>{" "}
                  {isAr
                    ? "تطبيق إجباري لحزام محدد تقتضيه الجهة التنظيمية أو العقد."
                    : "Forces a specific client-mandated UTM zone or local Belt."}
                </p>
                <p className="text-sky-900 dark:text-sky-200">
                  <strong>{isAr ? "الأثر المساحي:" : "Survey Impact:"}</strong>{" "}
                  {isAr
                    ? "ضمان قبول المخططات والتسليم الحكومي حسب كراسة الشروط الرسمية."
                    : "Ensures compliance with official municipal or client specifications."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
