/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TranslationDictionary, AppSettings } from "../types";
import { Settings, Save, Check, Globe, RefreshCw, Moon, Sun } from "lucide-react";

interface SettingsTabProps {
  t: TranslationDictionary;
  lang: "ar" | "en";
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export default function SettingsTab({
  t,
  lang,
  settings,
  onUpdateSettings
}: SettingsTabProps) {
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-neutral-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden" id="settings_tab_container">
      <div className="bg-neutral-50 dark:bg-slate-900/50 px-6 py-4 border-b border-neutral-200 dark:border-slate-700 flex items-center gap-2">
        <Settings className="w-5 h-5 text-neutral-500 dark:text-slate-400" />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-slate-100">{t.settingsTitle}</h3>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-neutral-400" />
            {t.languageLabel}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onUpdateSettings({ language: "ar" })}
              className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                settings.language === "ar"
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500"
                  : "border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900/40 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
              }`}
            >
              {t.languageAr}
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings({ language: "en" })}
              className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                settings.language === "en"
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500"
                  : "border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900/40 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
              }`}
            >
              {t.languageEn}
            </button>
          </div>
        </div>

        {/* Dark Mode Theme Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 flex items-center gap-1.5">
            {settings.darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            {t.darkModeLabel}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onUpdateSettings({ darkMode: false })}
              className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                !settings.darkMode
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500"
                  : "border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900/40 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t.darkModeLight}</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ darkMode: true })}
              className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                settings.darkMode
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500"
                  : "border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900/40 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-700"
              }`}
            >
              <Moon className="w-4 h-4 text-sky-400" />
              <span>{t.darkModeDark}</span>
            </button>
          </div>
        </div>

        {/* Metric Decimals Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
            {t.metricDecimalsLabel}
          </label>
          <select
            value={settings.metricDecimals}
            onChange={(e) => onUpdateSettings({ metricDecimals: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value={2}>{lang === "ar" ? "منزلتان (0.01 م)" : "2 decimals (0.01 m)"}</option>
            <option value={3}>{lang === "ar" ? "3 منازل (0.001 م - افتراضي)" : "3 decimals (0.001 m - Default)"}</option>
            <option value={4}>{lang === "ar" ? "4 منازل (0.0001 م)" : "4 decimals (0.0001 m)"}</option>
          </select>
        </div>

        {/* Geographic Decimals Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
            {t.geoDecimalsLabel}
          </label>
          <select
            value={settings.geoDecimals}
            onChange={(e) => onUpdateSettings({ geoDecimals: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value={6}>{lang === "ar" ? "6 منازل (دقة عادية)" : "6 decimals"}</option>
            <option value={8}>{lang === "ar" ? "8 منازل (دقة جيوديسية - افتراضي)" : "8 decimals (Geodetic - Default)"}</option>
            <option value={9}>{lang === "ar" ? "9 منازل (دقة قصوى)" : "9 decimals (Ultra precision)"}</option>
          </select>
        </div>

        {/* Geographic Orders selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
            {t.geoOrderLabel}
          </label>
          <select
            value={settings.geoOrder}
            onChange={(e) => onUpdateSettings({ geoOrder: e.target.value as "lat_lon" | "lon_lat" })}
            className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="lat_lon">{lang === "ar" ? "خط العرض أولاً ثم خط الطول [Latitude, Longitude]" : "Latitude, Longitude"}</option>
            <option value="lon_lat">{lang === "ar" ? "خط الطول أولاً ثم خط العرض [Longitude, Latitude]" : "Longitude, Latitude"}</option>
          </select>
        </div>

        {/* Metric Orders selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
            {t.metricOrderLabel}
          </label>
          <select
            value={settings.metricOrder}
            onChange={(e) => onUpdateSettings({ metricOrder: e.target.value as "e_n" | "n_e" })}
            className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="e_n">{lang === "ar" ? "الشرقي أولاً ثم الشمالي [Easting (X), Northing (Y)]" : "Easting (X), Northing (Y)"}</option>
            <option value="n_e">{lang === "ar" ? "الشمالي أولاً ثم الشرقي [Northing (Y), Easting (X)]" : "Northing (Y), Easting (X)"}</option>
          </select>
        </div>

        {/* Boundary distance warning selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700 dark:text-slate-300 block">
            {t.warningDistanceLabel}
          </label>
          <select
            value={settings.boundaryWarningDistance}
            onChange={(e) => onUpdateSettings({ boundaryWarningDistance: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-neutral-300 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900 px-3 py-2 text-sm text-neutral-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value={2}>{lang === "ar" ? "2 كم" : "2 km"}</option>
            <option value={5}>{lang === "ar" ? "5 كم (موصى به)" : "5 km (Recommended)"}</option>
            <option value={10}>{lang === "ar" ? "10 كم" : "10 km"}</option>
          </select>
        </div>

        {/* Save button with feedback animation */}
        <div className="pt-4 border-t border-neutral-100 dark:border-slate-700 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>{lang === "ar" ? "تم الحفظ بنجاح!" : "Preferences Saved!"}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t.saveSettingsBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
