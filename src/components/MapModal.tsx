/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Globe, Layers, Download, Maximize2, MapPin, Eye, CheckCircle2 } from "lucide-react";
import { BatchRow } from "../types";
import { downloadKMLFile } from "../utils/kmlExport";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: BatchRow[];
  selectedRowIds?: Set<number>;
  lang: "ar" | "en";
  metricDecimals: number;
  geoDecimals: number;
  formatDMS: (val: number | undefined, isLat: boolean) => string;
}

export default function MapModal({
  isOpen,
  onClose,
  rows,
  selectedRowIds,
  lang,
  metricDecimals,
  geoDecimals,
  formatDMS,
}: MapModalProps) {
  const isAr = lang === "ar";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [basemap, setBasemap] = useState<"satellite" | "osm" | "light">("satellite");
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filter valid rows with coordinates
  const targetRows = selectedRowIds && selectedRowIds.size > 0
    ? rows.filter((r) => selectedRowIds.has(r.id))
    : rows;

  const validRows = targetRows.filter(
    (r) => r.outputLat !== undefined && r.outputLon !== undefined && !isNaN(r.outputLat) && !isNaN(r.outputLon)
  );

  // Initialize and update Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Fix default marker icon issues in Vite/Webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    if (!mapInstanceRef.current) {
      // Default center: Egypt (26.8206° N, 30.8025° E)
      const map = L.map(mapContainerRef.current, {
        center: [26.8206, 30.8025],
        zoom: 6,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;

    // Update Basemap Tile Layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = "";
    let attribution = "";

    if (basemap === "satellite") {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
    } else if (basemap === "light") {
      tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    tileLayerRef.current = L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

    // Invalidate size to ensure map fills container properly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  }, [isOpen, basemap]);

  // Update Markers when rows or map changes
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !markersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    if (validRows.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    validRows.forEach((r, idx) => {
      const lat = r.outputLat!;
      const lon = r.outputLon!;
      latLngs.push([lat, lon]);

      const pId = r.pointId || `Pt_${idx + 1}`;
      const easting = r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "-";
      const northing = r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "-";
      const zone = r.outputZone || "-";
      const dmsLatStr = r.outputDMSLat || formatDMS(lat, true);
      const dmsLonStr = r.outputDMSLon || formatDMS(lon, false);

      // Create Custom Styled HTML Pin
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; items-center; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
            <div style="background: linear-gradient(135deg, #059669, #047857); color: white; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 9999px; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.4); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
              <span>📍</span> <span>${pId}</span>
            </div>
            <div style="width: 2px; height: 10px; background-color: #047857;"></div>
            <div style="width: 8px; height: 8px; background-color: #fbbf24; border-radius: 50%; border: 2px solid #000;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.5; color: #1e293b; direction: ${isAr ? 'rtl' : 'ltr'}; min-width: 210px;">
          <div style="background-color: #047857; color: white; padding: 6px 10px; border-radius: 6px 6px 0 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
            <span>📍 ${isAr ? "نقطة" : "Point"}: ${pId}</span>
          </div>
          <div style="padding: 10px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 6px 6px;">
            <div style="margin-bottom: 4px; display: flex; justify-content: space-between; border-b: 1px solid #f1f5f9; padding-bottom: 3px;">
              <span style="color: #64748b; font-weight: 600;">${isAr ? "الشرقي X" : "Easting X"}:</span>
              <span style="font-family: monospace; font-weight: bold; color: #0f172a;">${easting} m</span>
            </div>
            <div style="margin-bottom: 4px; display: flex; justify-content: space-between; border-b: 1px solid #f1f5f9; padding-bottom: 3px;">
              <span style="color: #64748b; font-weight: 600;">${isAr ? "الشمالي Y" : "Northing Y"}:</span>
              <span style="font-family: monospace; font-weight: bold; color: #0f172a;">${northing} m</span>
            </div>
            <div style="margin-bottom: 4px; display: flex; justify-content: space-between; border-b: 1px solid #f1f5f9; padding-bottom: 3px;">
              <span style="color: #64748b; font-weight: 600;">${isAr ? "المنطقة" : "Zone"}:</span>
              <span style="font-weight: bold; color: #0284c7;">${zone}</span>
            </div>
            <div style="margin-bottom: 4px; display: flex; justify-content: space-between; border-b: 1px solid #f1f5f9; padding-bottom: 3px;">
              <span style="color: #64748b; font-weight: 600;">${isAr ? "خط العرض" : "Latitude"}:</span>
              <span style="font-family: monospace; font-weight: bold; color: #047857;">${lat.toFixed(geoDecimals)}°</span>
            </div>
            <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span style="color: #64748b; font-weight: 600;">${isAr ? "خط الطول" : "Longitude"}:</span>
              <span style="font-family: monospace; font-weight: bold; color: #047857;">${lon.toFixed(geoDecimals)}°</span>
            </div>
            <div style="margin-top: 6px; padding-top: 4px; border-t: 1px dashed #cbd5e1; font-size: 11px; color: #475569; text-align: center;">
              ${dmsLatStr} | ${dmsLonStr}
            </div>
          </div>
        </div>
      `;

      const marker = L.marker([lat, lon], { icon: customIcon }).bindPopup(popupContent, {
        maxWidth: 280,
      });

      markersGroup.addLayer(marker);
    });

    // Auto-fit bounds
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [isOpen, validRows]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || validRows.length === 0) return;
    const latLngs: L.LatLngExpression[] = validRows.map((r) => [r.outputLat!, r.outputLon!]);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-slate-700 shadow-2xl w-full max-w-5xl h-[88vh] overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-emerald-800 dark:bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between border-b border-emerald-900 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600/30 dark:bg-emerald-600/20 text-emerald-200 dark:text-emerald-400 border border-emerald-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {isAr ? "معاينة النقاط على الخريطة التفاعلية وصور الأقمار الصناعية" : "Interactive Map & Satellite Point Inspector"}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 dark:bg-emerald-500/20 text-emerald-100 dark:text-emerald-300 text-xs font-semibold border border-emerald-400/30 dark:border-emerald-500/30">
                  {validRows.length} / {targetRows.length} {isAr ? "نقطة موقعة" : "plotted"}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 dark:text-slate-400">
                {isAr
                  ? "تأكد من توقيع ودقة النقاط المساحية على سطح الأرض مباشرة قبل التصدير"
                  : "Verify survey point alignment and placement directly on Earth's surface"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadKMLFile(validRows, metricDecimals, geoDecimals, formatDMS, lang)}
              disabled={validRows.length === 0}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-40"
              title={isAr ? "تصدير النقاط الموقعة على الخريطة إلى ملف Google Earth KML" : "Export mapped points to Google Earth KML"}
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? "تصدير Google Earth (.kml)" : "Export KML"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 dark:hover:bg-slate-800 rounded-xl text-emerald-100 dark:text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Control Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/90 text-neutral-800 dark:text-slate-200 px-6 py-2.5 border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-600 dark:text-slate-400 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {isAr ? "طبقة الخريطة:" : "Map Layer:"}
            </span>
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-1 border border-neutral-300 dark:border-slate-700 shadow-xs">
              <button
                type="button"
                onClick={() => setBasemap("satellite")}
                className={`px-3 py-1 rounded-md transition-colors text-xs font-semibold ${
                  basemap === "satellite"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200"
                }`}
              >
                {isAr ? "أقمار صناعية (Satellite)" : "Satellite"}
              </button>
              <button
                type="button"
                onClick={() => setBasemap("osm")}
                className={`px-3 py-1 rounded-md transition-colors text-xs font-semibold ${
                  basemap === "osm"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200"
                }`}
              >
                {isAr ? "شوارع (Street)" : "Street Map"}
              </button>
              <button
                type="button"
                onClick={() => setBasemap("light")}
                className={`px-3 py-1 rounded-md transition-colors text-xs font-semibold ${
                  basemap === "light"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-neutral-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200"
                }`}
              >
                {isAr ? "فاتح (Light)" : "Light Map"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFitBounds}
              disabled={validRows.length === 0}
              className="px-3 py-1 bg-white hover:bg-neutral-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-neutral-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-neutral-300 dark:border-slate-600 shadow-xs disabled:opacity-40"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isAr ? "احتواء كل النقاط" : "Fit All Points"}</span>
            </button>
          </div>
        </div>

        {/* Map Canvas Area */}
        <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {validRows.length === 0 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xs text-slate-300 p-6 text-center">
              <MapPin className="w-12 h-12 text-slate-500 mb-3 animate-bounce" />
              <h4 className="font-bold text-lg text-slate-100 mb-1">
                {isAr ? "لا توجد نقاط مساحية ذات إحداثيات صحيحة للتوقيع" : "No Valid Coordinates to Plot"}
              </h4>
              <p className="text-xs text-slate-400 max-w-md">
                {isAr
                  ? "يرجى إضافة نقاط في الجدول والضغط على زر 'تحويل الجدول بالكامل' لإنشاء نتائج جغرافية WGS84 صحيحة للتوقيع على الخريطة."
                  : "Please add points to the batch table and execute transformation to generate valid WGS84 coordinates."}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Legend / Footer */}
        <div className="bg-neutral-50 dark:bg-slate-900 px-6 py-2.5 text-xs text-neutral-600 dark:text-slate-400 border-t border-neutral-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? "انقر على أي دبوس لعرض تفاصيل النقطة والمستحضر المساحي" : "Click any pin on the map to inspect full coordinates"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 dark:bg-slate-800 hover:bg-neutral-300 dark:hover:bg-slate-700 text-neutral-800 dark:text-slate-200 rounded-xl font-bold transition-colors"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
