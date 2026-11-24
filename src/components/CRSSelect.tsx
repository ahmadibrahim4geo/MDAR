/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { CRS_LIST, CRS_CATEGORIES, ARAB_COUNTRIES, getCRSById } from "../lib/crsData";
import { CRSType, CRSCategory, CountryCode } from "../types";
import { Search, ChevronDown, Check, Globe, Layers, MapPin, X, Filter } from "lucide-react";

interface CRSSelectProps {
  label: string;
  value: string;
  onChange: (crsId: string) => void;
  lang: "ar" | "en";
  id?: string;
  className?: string;
}

export default function CRSSelect({
  label,
  value,
  onChange,
  lang,
  id = "crs_select",
  className = ""
}: CRSSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CRSCategory | "ALL">("ALL");
  const [activeCountry, setActiveCountry] = useState<CountryCode>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PROJECTED" | "GEOGRAPHIC">("ALL");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "LOCAL" | "GLOBAL">("ALL");

  const currentCRS = getCRSById(value) || CRS_LIST[0];

  // Category badges mapping
  const categoryBadgeMap: Record<CRSCategory, { ar: string; en: string; color: string }> = {
    EGYPT_NATIONAL: { ar: "مصر (ETM/MTM)", en: "Egypt Grids", color: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800" },
    GEOGRAPHIC: { ar: "جغرافي", en: "Geographic", color: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800" },
    ARAB_REGIONAL: { ar: "أنظمة عربية", en: "Arab Grids", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
    UTM_NORTH: { ar: "UTM شمالي", en: "UTM North", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
    UTM_SOUTH: { ar: "UTM جنوبي", en: "UTM South", color: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
    WEB_PROJECTIONS: { ar: "إسقاط متري عالمي", en: "Global Metric Projections", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800" }
  };

  // Filtered list based on search, activeCategory, country, type, scope
  const filteredCRS = useMemo(() => {
    return CRS_LIST.filter((crs) => {
      // Category filter
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

      // Scope filter (Local/National vs Global)
      if (scopeFilter === "LOCAL" && !crs.isLocal) return false;
      if (scopeFilter === "GLOBAL" && crs.isLocal) return false;

      // Search query filter
      if (!search.trim()) return true;
      const query = search.toLowerCase().trim();
      const nameAr = crs.nameAr.toLowerCase();
      const nameEn = crs.nameEn.toLowerCase();
      const countryAr = crs.countryNameAr.toLowerCase();
      const countryEn = crs.countryNameEn.toLowerCase();
      const epsg = (crs.epsg || "").toLowerCase();
      const idStr = crs.id.toLowerCase();
      const cmStr = crs.projection?.cm !== undefined ? `cm:${crs.projection.cm}` : "";

      return (
        nameAr.includes(query) ||
        nameEn.includes(query) ||
        countryAr.includes(query) ||
        countryEn.includes(query) ||
        epsg.includes(query) ||
        idStr.includes(query) ||
        cmStr.includes(query)
      );
    });
  }, [search, activeCategory, activeCountry, typeFilter, scopeFilter]);

  // Group filtered results by category
  const groupedCRS = useMemo(() => {
    const groups: { category: CRSCategory; title: string; items: typeof CRS_LIST }[] = [];

    CRS_CATEGORIES.forEach((catGroup) => {
      const items = filteredCRS.filter((item) => item.category === catGroup.key);
      if (items.length > 0) {
        groups.push({
          category: catGroup.key,
          title: lang === "ar" ? catGroup.titleAr : catGroup.titleEn,
          items
        });
      }
    });

    return groups;
  }, [filteredCRS, lang]);

  const handleSelect = (crsId: string) => {
    onChange(crsId);
    setIsOpen(false);
  };

  const currentCatInfo = categoryBadgeMap[currentCRS.category] || categoryBadgeMap.GEOGRAPHIC;

  return (
    <div className={`relative ${className}`} id={`${id}_wrapper`}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-slate-300 mb-1.5 block">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(true)}
        className="w-full bg-white dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-3 text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <Globe className="w-4.5 h-4.5" />
          </div>

          <div className="min-w-0 text-right">
            <div className="text-sm font-bold text-neutral-800 dark:text-slate-100 truncate flex items-center gap-1.5">
              <span>{lang === "ar" ? currentCRS.nameAr : currentCRS.nameEn}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${currentCatInfo.color}`}>
                {lang === "ar" ? currentCatInfo.ar : currentCatInfo.en}
              </span>
              <span className="text-[10px] bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">
                {currentCRS.countryNameAr}
              </span>
              {currentCRS.epsg && (
                <span className="text-[10px] font-mono bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                  EPSG:{currentCRS.epsg}
                </span>
              )}
            </div>
          </div>
        </div>

        <ChevronDown className="w-4 h-4 text-neutral-400 dark:text-slate-500 shrink-0 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-right"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-800 dark:text-slate-100">
                    {lang === "ar" ? "تحديد نظام الإحداثيات مرشح حسب الدول والأنماط" : "Select Coordinate System by Country & Type"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-slate-400">
                    {lang === "ar"
                      ? "استخدم فلاتر الدول والدقة المترية/الجغرافية لتحديد النظام المطلوبة بدقة بدون عناء"
                      : "Filter by Arab country, metric/geographic, or UTM zones"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-slate-200 hover:bg-neutral-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Control Section */}
            <div className="p-4 border-b border-neutral-200 dark:border-slate-700 space-y-3 bg-neutral-50/30 dark:bg-slate-900/40">
              {/* Search Bar */}
              <div className="relative">
                <Search className={`w-4 h-4 text-neutral-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-3" : "left-3"}`} />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "ابحث باسم الدولة (مثال: مصر، السعودية)، كود EPSG (مثال: 22992، 20438)، أو اسم النظام..."
                      : "Search by country, EPSG code, or system name..."
                  }
                  className={`w-full py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-slate-700 focus:outline-none focus:border-emerald-500 bg-white dark:bg-slate-800 text-neutral-800 dark:text-slate-100 transition-colors shadow-sm ${
                    lang === "ar" ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"
                  }`}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className={`text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-slate-200 absolute top-1/2 -translate-y-1/2 ${
                      lang === "ar" ? "left-3" : "right-3"
                    }`}
                  >
                    {lang === "ar" ? "مسح" : "Clear"}
                  </button>
                )}
              </div>

              {/* Multi-Tier Filter Controls */}
              <div className="space-y-2 pt-1">
                {/* Quick Country Flag Chips Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-neutral-600 dark:text-slate-300 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-emerald-600" />
                      {lang === "ar" ? "تصفية بنقرة واحدة لـ 22 دولة عربية والأنظمة العالمية:" : "Quick Filter for 22 Arab Countries & Global:"}
                    </label>
                    {(activeCountry !== "ALL" || activeCategory !== "ALL" || typeFilter !== "ALL" || scopeFilter !== "ALL" || search !== "") && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCountry("ALL");
                          setActiveCategory("ALL");
                          setTypeFilter("ALL");
                          setScopeFilter("ALL");
                          setSearch("");
                        }}
                        className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                      >
                        {lang === "ar" ? "إعادة ضبط الفلاتر ✕" : "Reset Filters ✕"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
                    {ARAB_COUNTRIES.map((c) => {
                      const isSelected = activeCountry === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setActiveCountry(c.code)}
                          className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 border ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                              : "bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border-neutral-200 dark:border-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span className="text-xs">{c.flag}</span>
                          <span>{lang === "ar" ? c.nameAr.split(" ")[0] : c.nameEn.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* 1. Country Selector Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-neutral-600 dark:text-slate-300">
                      {lang === "ar" ? "قائمة الدول (22 دولة):" : "Country Dropdown (22):"}
                    </label>
                    <select
                      value={activeCountry}
                      onChange={(e) => setActiveCountry(e.target.value as CountryCode)}
                      className="w-full text-xs font-bold rounded-lg border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 shadow-sm"
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
                  <label className="text-[11px] font-extrabold text-neutral-600 dark:text-slate-300">
                    {lang === "ar" ? "نمط النظام (مترية / جغرافية):" : "Type (Metric / Geographic):"}
                  </label>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-neutral-300 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setTypeFilter("ALL")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        typeFilter === "ALL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                      }`}
                    >
                      {lang === "ar" ? "الكل" : "All"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTypeFilter("PROJECTED")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        typeFilter === "PROJECTED" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                      }`}
                    >
                      {lang === "ar" ? "مترية (مسقطة)" : "Metric"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTypeFilter("GEOGRAPHIC")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        typeFilter === "GEOGRAPHIC" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                      }`}
                    >
                      {lang === "ar" ? "جغرافية (درجات)" : "Geographic"}
                    </button>
                  </div>
                </div>

                {/* 3. Scope Filter (Local vs Global) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-neutral-600 dark:text-slate-300">
                    {lang === "ar" ? "نطاق النظام (قومي / عالمي):" : "Scope (Local / Global):"}
                  </label>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-neutral-300 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setScopeFilter("ALL")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        scopeFilter === "ALL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                      }`}
                    >
                      {lang === "ar" ? "الكل" : "All"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeFilter("LOCAL")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        scopeFilter === "LOCAL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                      }`}
                    >
                      {lang === "ar" ? "قومية / محلي" : "Local"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeFilter("GLOBAL")}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        scopeFilter === "GLOBAL" ? "bg-emerald-600 text-white" : "text-neutral-600 dark:text-slate-400"
                      }`}
                    >
                      {lang === "ar" ? "عالمية (UTM & Mercator)" : "Global (UTM & Mercator)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategory("ALL")}
                  className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    activeCategory === "ALL"
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-100"
                  }`}
                >
                  {lang === "ar" ? "جميع الفئات" : "All Categories"} ({CRS_LIST.length})
                </button>

                {CRS_CATEGORIES.map((cat) => {
                  const count = CRS_LIST.filter((item) => item.category === cat.key).length;
                  const isSelected = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200 dark:border-slate-700 hover:bg-neutral-100"
                      }`}
                    >
                      {lang === "ar" ? cat.titleAr.split(" ")[0] : cat.titleEn.split(" ")[0]} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {groupedCRS.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 dark:text-slate-500 text-sm space-y-2">
                  <p>{lang === "ar" ? "لم يتم العثور على أي نظام يطابق الفلاتر المحددة." : "No coordinate systems match the selected filters."}</p>
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
                    {lang === "ar" ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                  </button>
                </div>
              ) : (
                groupedCRS.map((group) => (
                  <div key={group.category} className="space-y-2.5">
                    {/* Category Title */}
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-slate-700/80 pb-1.5">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        {group.title}
                      </h4>
                      <span className="text-[11px] font-mono text-neutral-400 dark:text-slate-500">
                        {group.items.length} {lang === "ar" ? "نظام" : "systems"}
                      </span>
                    </div>

                    {/* Group Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.items.map((crs) => {
                        const isSelected = crs.id === value;
                        const catBadge = categoryBadgeMap[crs.category];
                        const isProjected = crs.type === CRSType.PROJECTED;

                        return (
                          <button
                            key={crs.id}
                            type="button"
                            onClick={() => handleSelect(crs.id)}
                            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? "bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                                : "bg-neutral-50/50 dark:bg-slate-900/50 border-neutral-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:border-neutral-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${catBadge.color}`}>
                                  {lang === "ar" ? catBadge.ar : catBadge.en}
                                </span>
                                <span className="text-[10px] font-bold bg-neutral-200 dark:bg-slate-700 text-neutral-800 dark:text-slate-200 px-1.5 py-0.5 rounded">
                                  {crs.countryNameAr}
                                </span>
                                {crs.epsg && (
                                  <span className="text-[10px] font-mono bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">
                                    EPSG:{crs.epsg}
                                  </span>
                                )}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  isProjected ? "bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300" : "bg-sky-100/60 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300"
                                }`}>
                                  {isProjected ? (lang === "ar" ? "متري" : "Metric") : (lang === "ar" ? "جغرافي" : "Geographic")}
                                </span>
                              </div>

                              <div className="text-sm font-bold text-neutral-800 dark:text-slate-100 truncate">
                                {lang === "ar" ? crs.nameAr : crs.nameEn}
                              </div>

                              {crs.projection?.cm !== undefined && (
                                <div className="text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5 font-mono">
                                  CM: {crs.projection.cm}° | Scale: {crs.projection.scaleFactor}
                                </div>
                              )}
                            </div>

                            {isSelected && (
                              <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-neutral-200 dark:border-slate-700 bg-neutral-50/50 dark:bg-slate-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-slate-400">
              <div className="font-semibold">
                {lang === "ar"
                  ? `الأنظمة المعروضة: ${filteredCRS.length} من إجمالي ${CRS_LIST.length} نظام إحداثي`
                  : `Showing ${filteredCRS.length} of ${CRS_LIST.length} Coordinate Systems`}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-200 dark:bg-slate-700 text-neutral-700 dark:text-slate-200 font-semibold hover:bg-neutral-300 dark:hover:bg-slate-600 transition-colors"
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
