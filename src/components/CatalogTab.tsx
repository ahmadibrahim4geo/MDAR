/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { CRS_LIST, CRS_CATEGORIES, ARAB_COUNTRIES } from "../lib/crsData";
import { TranslationDictionary, CRSType, CRSCategory, CountryCode } from "../types";
import { Search, Database, Globe2, Layers, Filter, MapPin } from "lucide-react";

interface CatalogTabProps {
  t: TranslationDictionary;
  lang: "ar" | "en";
}

export default function CatalogTab({ t, lang }: CatalogTabProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CRSCategory | "ALL">("ALL");
  const [activeCountry, setActiveCountry] = useState<CountryCode>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PROJECTED" | "GEOGRAPHIC">("ALL");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "LOCAL" | "GLOBAL">("ALL");

  const filteredCRS = useMemo(() => {
    return CRS_LIST.filter((crs) => {
      // Category tab filter
      if (activeCategory !== "ALL" && crs.category !== activeCategory) {
        return false;
      }

      // Country filter
      if (activeCountry !== "ALL" && crs.countryCode !== activeCountry) {
        return false;
      }

      // Type filter (Metric vs Geographic)
      if (typeFilter === "PROJECTED" && crs.type !== CRSType.PROJECTED) return false;
      if (typeFilter === "GEOGRAPHIC" && crs.type !== CRSType.GEOGRAPHIC) return false;

      // Scope filter (Local vs Global)
      if (scopeFilter === "LOCAL" && !crs.isLocal) return false;
      if (scopeFilter === "GLOBAL" && crs.isLocal) return false;

      const nameAr = crs.nameAr.toLowerCase();
      const nameEn = crs.nameEn.toLowerCase();
      const countryAr = crs.countryNameAr.toLowerCase();
      const countryEn = crs.countryNameEn.toLowerCase();
      const epsg = (crs.epsg || "").toLowerCase();
      const id = crs.id.toLowerCase();
      const q = search.toLowerCase().trim();

      if (!q) return true;

      return (
        nameAr.includes(q) ||
        nameEn.includes(q) ||
        countryAr.includes(q) ||
        countryEn.includes(q) ||
        epsg.includes(q) ||
        id.includes(q)
      );
    });
  }, [search, activeCategory, activeCountry, typeFilter, scopeFilter]);

  return (
    <div className="space-y-6" id="crs_catalog_container">
      {/* Intro section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="catalog_intro">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {t.catalogTitle}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-slate-400">
            {lang === "ar" 
              ? "دليل شامل لكافة الأنظمة الجيوديسية والإسقاطات المترية للدول العربية وأنظمة UTM العالمية"
              : "Comprehensive reference for all Arab national grids, geodetic datums, and global UTM projections"}
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "ar" ? "ابحث باسم الدولة، الاسم، أو كود EPSG..." : "Search by country, name, or EPSG..."}
            className="w-full pl-3 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-slate-700 focus:outline-none focus:border-emerald-500 bg-neutral-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition-colors text-neutral-800 dark:text-slate-100 text-right shadow-sm"
            dir="rtl"
          />
          <Search className="w-4 h-4 text-neutral-400 dark:text-slate-500 absolute left-auto right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Structured Multi-Tier Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-slate-700/80 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-neutral-800 dark:text-slate-200">
              {lang === "ar" ? "فلاتر التصفية والتصنيف (22 دولة عربية والأنظمة العالمية)" : "Filter Controls (22 Arab Countries & Global Systems)"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {(activeCountry !== "ALL" || activeCategory !== "ALL" || typeFilter !== "ALL" || scopeFilter !== "ALL" || search !== "") && (
              <button
                onClick={() => {
                  setActiveCountry("ALL");
                  setActiveCategory("ALL");
                  setTypeFilter("ALL");
                  setScopeFilter("ALL");
                  setSearch("");
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              >
                {lang === "ar" ? "إعادة ضبط الفلاتر ✕" : "Reset Filters ✕"}
              </button>
            )}

            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {lang === "ar" ? `النتائج: ${filteredCRS.length}` : `Results: ${filteredCRS.length}`}
            </span>
          </div>
        </div>

        {/* Quick Country Flag Chips (Scrollable Horizontal Bar) */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-neutral-700 dark:text-slate-300 block">
            {lang === "ar" ? "اختيار دولة عربية بنقرة واحدة:" : "Quick Country Selector:"}
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar text-xs">
            {ARAB_COUNTRIES.map((c) => {
              const isSelected = activeCountry === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setActiveCountry(c.code)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                      : "bg-neutral-50 dark:bg-slate-900 text-neutral-700 dark:text-slate-300 border-neutral-200 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-sm">{c.flag}</span>
                  <span>{lang === "ar" ? c.nameAr.split(" ")[0] : c.nameEn.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Arab Country Filter Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-neutral-700 dark:text-slate-300 block">
              {lang === "ar" ? "قائمة الدول العربية المتاحة (22 دولة):" : "Arab Country Selector (22 Countries):"}
            </label>
            <select
              value={activeCountry}
              onChange={(e) => setActiveCountry(e.target.value as CountryCode)}
              className="w-full text-xs font-bold rounded-lg border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 px-3 py-2 text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              {ARAB_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {lang === "ar" ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Type Filter (Metric vs Geographic) */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-neutral-700 dark:text-slate-300 block">
              {lang === "ar" ? "النمط الجغرافي / المتري:" : "Type (Metric / Geographic):"}
            </label>
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-slate-900 p-1 rounded-lg border border-neutral-300 dark:border-slate-700">
              <button
                onClick={() => setTypeFilter("ALL")}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  typeFilter === "ALL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                }`}
              >
                {lang === "ar" ? "الكل" : "All"}
              </button>
              <button
                onClick={() => setTypeFilter("PROJECTED")}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  typeFilter === "PROJECTED" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                }`}
              >
                {lang === "ar" ? "أنماط مترية" : "Metric"}
              </button>
              <button
                onClick={() => setTypeFilter("GEOGRAPHIC")}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  typeFilter === "GEOGRAPHIC" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                }`}
              >
                {lang === "ar" ? "أنماط جغرافية" : "Geographic"}
              </button>
            </div>
          </div>

          {/* 3. Scope Filter (Local vs Global) */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-neutral-700 dark:text-slate-300 block">
              {lang === "ar" ? "النطاق المحلي / العالمي:" : "Scope (Local / Global):"}
            </label>
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-slate-900 p-1 rounded-lg border border-neutral-300 dark:border-slate-700">
              <button
                onClick={() => setScopeFilter("ALL")}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  scopeFilter === "ALL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                }`}
              >
                {lang === "ar" ? "الكل" : "All"}
              </button>
              <button
                onClick={() => setScopeFilter("LOCAL")}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  scopeFilter === "LOCAL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                }`}
              >
                {lang === "ar" ? "أنظمة قومية" : "National"}
              </button>
              <button
                onClick={() => setScopeFilter("GLOBAL")}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  scopeFilter === "GLOBAL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                }`}
              >
                {lang === "ar" ? "أنظمة عالمية (UTM & Mercator)" : "Global (UTM & Mercator)"}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar text-xs border-t border-neutral-100 dark:border-slate-700/60">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
              activeCategory === "ALL"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-600"
            }`}
          >
            {lang === "ar" ? "جميع الفئات" : "All Categories"} ({CRS_LIST.length})
          </button>

          {CRS_CATEGORIES.map((cat) => {
            const count = CRS_LIST.filter(c => c.category === cat.key).length;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-600"
                }`}
              >
                <span>{lang === "ar" ? cat.titleAr : cat.titleEn}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? "bg-emerald-700 text-emerald-100" : "bg-neutral-200 dark:bg-slate-800 text-neutral-600 dark:text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="crs_catalog_grid">
        {filteredCRS.map((crs) => {
          const isProjected = crs.type === CRSType.PROJECTED;
          return (
            <div
              key={crs.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-neutral-100 dark:border-slate-700/80 pb-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isProjected 
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" 
                        : "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-800"
                    }`}>
                      {isProjected ? t.systemProjected : t.systemGeographic}
                    </span>

                    <span className="text-[10px] font-bold bg-neutral-100 dark:bg-slate-700 text-neutral-800 dark:text-slate-200 px-2 py-0.5 rounded">
                      {crs.countryNameAr}
                    </span>
                  </div>
                  
                  {crs.epsg ? (
                    <span className="text-xs font-mono font-bold bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-200 px-2 py-0.5 rounded">
                      EPSG:{crs.epsg}
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                      Custom CRS
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">
                  {lang === "ar" ? crs.nameAr : crs.nameEn}
                </h3>
              </div>

              {/* Card Details */}
              <div className="mt-4 space-y-2 text-xs text-neutral-600 dark:text-slate-300 font-sans">
                {/* Ellipsoid */}
                <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                  <span className="text-neutral-400 dark:text-slate-400">{t.ellipsoidName}</span>
                  <span className="font-semibold text-neutral-700 dark:text-slate-200">{crs.ellipsoid.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                  <span className="text-neutral-400 dark:text-slate-400">{lang === "ar" ? "نصف القطر الأكبر (a)" : "Semi-major axis (a)"}</span>
                  <span className="font-mono text-neutral-700 dark:text-slate-200 font-semibold">{crs.ellipsoid.a.toLocaleString()} m</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                  <span className="text-neutral-400 dark:text-slate-400">{lang === "ar" ? "مقلوب التفلطح (1/f)" : "Reciprocal flattening (1/f)"}</span>
                  <span className="font-mono text-neutral-700 dark:text-slate-200 font-semibold">{crs.ellipsoid.rf}</span>
                </div>

                {/* Projection Constants if metric */}
                {isProjected && crs.projection && (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                      <span className="text-neutral-400 dark:text-slate-400">{t.centralMeridian}</span>
                      <span className="font-semibold text-neutral-700 dark:text-slate-200">{crs.projection.cm}° E</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                      <span className="text-neutral-400 dark:text-slate-400">{t.scaleFactor}</span>
                      <span className="font-mono font-semibold text-neutral-700 dark:text-slate-200">{crs.projection.scaleFactor}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                      <span className="text-neutral-400 dark:text-slate-400">{t.falseEasting}</span>
                      <span className="font-mono font-semibold text-neutral-700 dark:text-slate-200">{crs.projection.falseEasting.toLocaleString()} m</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-neutral-100/50 dark:border-slate-700/50">
                      <span className="text-neutral-400 dark:text-slate-400">{t.falseNorthing}</span>
                      <span className="font-mono font-semibold text-neutral-700 dark:text-slate-200">{crs.projection.falseNorthing.toLocaleString()} m</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-400 dark:text-slate-400">{t.latOrigin}</span>
                      <span className="font-semibold text-neutral-700 dark:text-slate-200">{crs.projection.latOrigin}° N</span>
                    </div>
                  </>
                )}

                {/* If Auto zone projection */}
                {crs.id.startsWith("AUTO:") && (
                  <div className="p-3 bg-neutral-50 dark:bg-slate-900/60 rounded-lg text-[11px] text-neutral-500 dark:text-slate-400 leading-relaxed mt-2 border border-neutral-100 dark:border-slate-700/50">
                    {lang === "ar" 
                      ? "نظام ديناميكي محتسب تلقائياً لكل نقطة وفق خط الطول المحدد، يدعم التحويل المباشر مع الحفاظ على أعلى مستويات الدقة الجيوديسية."
                      : "A dynamic projection calculated per-point based on the input coordinate's longitude."}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredCRS.length === 0 && (
          <div className="col-span-full text-center py-12 bg-neutral-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-neutral-300 dark:border-slate-700 space-y-2">
            <span className="text-sm text-neutral-500 dark:text-slate-400 block">
              {lang === "ar" ? "لا توجد نتائج مطابقة لبحثك أو الفلاتر المحددة." : "No matching CRS found for selected filters."}
            </span>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("ALL");
                setActiveCountry("ALL");
                setTypeFilter("ALL");
                setScopeFilter("ALL");
              }}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold underline"
            >
              {lang === "ar" ? "إعادة ضبط جميع الفلاتر" : "Reset All Filters"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
