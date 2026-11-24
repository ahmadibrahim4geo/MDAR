/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppSettings, TranslationDictionary } from "./types";
import { AR_TRANSLATION, EN_TRANSLATION } from "./lib/translation";
import HomeTab from "./components/HomeTab";
import BatchTab from "./components/BatchTab";
import HelpTab from "./components/HelpTab";
import SettingsTab from "./components/SettingsTab";
import CatalogTab from "./components/CatalogTab";
import Logo from "./components/Logo";
import { Navigation, FileSpreadsheet, BookOpen, Settings, Database, Globe, Sun, Moon } from "lucide-react";

export default function App() {
  // Application settings (Persisted client-side for ease of use)
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("egy_converter_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      language: "ar", // Arabic default as requested
      darkMode: false,
      metricDecimals: 3,
      geoDecimals: 8,
      geoOrder: "lat_lon",
      metricOrder: "e_n",
      boundaryWarningDistance: 5
    };
  });

  const [activeTab, setActiveTab] = useState<"home" | "batch" | "help" | "settings" | "catalog">("home");

  // Sync settings with localStorage and apply document dark class
  useEffect(() => {
    localStorage.setItem("egy_converter_settings", JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const isRtl = settings.language === "ar";
  const t: TranslationDictionary = isRtl ? AR_TRANSLATION : EN_TRANSLATION;

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-neutral-800 dark:text-slate-100 font-sans antialiased flex flex-col justify-between transition-colors duration-200"
      dir={isRtl ? "rtl" : "ltr"}
      id="app_shell"
    >
      {/* Navigation Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-neutral-200/80 dark:border-slate-700/80 sticky top-0 z-50 shadow-sm" id="main_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Title / Logo */}
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold font-sans tracking-tight text-neutral-900 dark:text-white leading-none">
                  {t.appTitle}
                </h1>
                <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-1 hidden md:block">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Quick Header Actions (Theme & Language) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className="p-2 rounded-lg border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-700/50 hover:bg-neutral-100 dark:hover:bg-slate-700 text-neutral-600 dark:text-slate-300 transition-colors"
                title={settings.darkMode ? t.darkModeLight : t.darkModeDark}
                id="header_theme_toggle"
              >
                {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              <button
                onClick={() => updateSettings({ language: settings.language === "ar" ? "en" : "ar" })}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-700/50 hover:bg-neutral-100 dark:hover:bg-slate-700 text-xs font-semibold text-neutral-600 dark:text-slate-200 transition-colors flex items-center gap-1.5 font-sans"
                id="header_lang_toggle"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-400 dark:text-slate-400" />
                <span>{settings.language === "ar" ? "English" : "العربية"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main_content_area">
        <div className="flex flex-col gap-6">
          {/* Tab Navigation Menu */}
          <div className="flex border-b border-neutral-200 dark:border-slate-700 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap bg-white dark:bg-slate-800 px-2 rounded-xl border p-1 shadow-xs" id="navigation_tabs">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
                activeTab === "home"
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30"
                  : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:border-neutral-300"
              }`}
            >
              <Navigation className="w-4 h-4 shrink-0" />
              <span>{t.tabHome}</span>
            </button>

            <button
              onClick={() => setActiveTab("batch")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
                activeTab === "batch"
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30"
                  : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:border-neutral-300"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span>{t.tabBatch}</span>
            </button>

            <button
              onClick={() => setActiveTab("help")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
                activeTab === "help"
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30"
                  : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:border-neutral-300"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>{t.tabHelp}</span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
                activeTab === "catalog"
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30"
                  : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:border-neutral-300"
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>{t.tabCatalog}</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
                activeTab === "settings"
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30"
                  : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 hover:border-neutral-300"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>{t.tabSettings}</span>
            </button>
          </div>

          {/* Active Tab Screen Render */}
          <div className="min-h-[450px]" id="tab_screen_renderer">
            {activeTab === "home" && (
              <HomeTab
                t={t}
                lang={settings.language}
                metricDecimals={settings.metricDecimals}
                geoDecimals={settings.geoDecimals}
              />
            )}
            {activeTab === "batch" && (
              <BatchTab
                t={t}
                lang={settings.language}
                metricDecimals={settings.metricDecimals}
                geoDecimals={settings.geoDecimals}
                geoOrder={settings.geoOrder}
                metricOrder={settings.metricOrder}
              />
            )}
            {activeTab === "help" && <HelpTab />}
            {activeTab === "catalog" && <CatalogTab t={t} lang={settings.language} />}
            {activeTab === "settings" && (
              <SettingsTab
                t={t}
                lang={settings.language}
                settings={settings}
                onUpdateSettings={updateSettings}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-neutral-200 dark:border-slate-700 px-4 py-6 mt-12 text-center text-xs text-neutral-400 dark:text-slate-400 font-sans" id="main_footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>
            {settings.language === "ar" 
              ? "مُحوّل الإحداثيات المصرية والعالمية © 2026 - يعمل محلياً بالكامل (100% Offline)" 
              : "Egypt & Global Coordinate Converter © 2026 - Works 100% Offline"}
          </span>
          <span className="text-neutral-300 dark:text-slate-600 hidden md:inline">|</span>
          <span>
            {settings.language === "ar" 
              ? "دقة رياضية وجيوديسية مطلقة (EPSG:7697)" 
              : "Absolute geodetic mathematical precision (EPSG:7697)"}
          </span>
        </div>
      </footer>
    </div>
  );
}
