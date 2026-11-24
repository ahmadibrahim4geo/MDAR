/**
 * Utility to generate and download Google Earth KML files for coordinate batch rows
 */

import { BatchRow } from "../types";

export function generateKMLContent(
  rows: BatchRow[],
  metricDecimals: number = 3,
  geoDecimals: number = 7,
  formatDMS?: (val: number | undefined, isLat: boolean) => string,
  lang: "ar" | "en" = "ar"
): string {
  const isAr = lang === "ar";

  // Filter rows that have valid WGS84 outputs
  const validRows = rows.filter(
    (r) => r.outputLat !== undefined && r.outputLon !== undefined && !isNaN(r.outputLat) && !isNaN(r.outputLon)
  );

  const placemarks = validRows
    .map((r) => {
      const pId = r.pointId || `Pt_${r.id}`;
      const lon = r.outputLon!;
      const lat = r.outputLat!;
      const easting = r.outputX !== undefined ? r.outputX.toFixed(metricDecimals) : "-";
      const northing = r.outputY !== undefined ? r.outputY.toFixed(metricDecimals) : "-";
      const zone = r.outputZone || "-";

      const dmsLatStr = r.outputDMSLat || (formatDMS ? formatDMS(lat, true) : `${lat.toFixed(6)}°`);
      const dmsLonStr = r.outputDMSLon || (formatDMS ? formatDMS(lon, false) : `${lon.toFixed(6)}°`);

      const descHtml = `
        <![CDATA[
          <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #1e293b; direction: ${isAr ? 'rtl' : 'ltr'};">
            <h3 style="margin: 0 0 8px 0; color: #047857; font-size: 15px; border-bottom: 2px solid #10b981; padding-bottom: 4px;">
              📍 ${isAr ? "بيانات النقطة المساحية" : "Survey Point Details"}: ${pId}
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: ${isAr ? 'right' : 'left'};">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 4px 8px; font-weight: bold; border: 1px solid #e2e8f0;">${isAr ? "معرف النقطة" : "Point ID"}:</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0;">${pId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 8px; font-weight: bold; border: 1px solid #e2e8f0;">${isAr ? "الشرقي (Easting X)" : "Easting X"}:</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-family: monospace;">${easting} m</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 4px 8px; font-weight: bold; border: 1px solid #e2e8f0;">${isAr ? "الشمالي (Northing Y)" : "Northing Y"}:</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-family: monospace;">${northing} m</td>
              </tr>
              <tr>
                <td style="padding: 4px 8px; font-weight: bold; border: 1px solid #e2e8f0;">${isAr ? "المنطقة / الحزام" : "Zone / Belt"}:</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0;">${zone}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 4px 8px; font-weight: bold; border: 1px solid #e2e8f0;">${isAr ? "خط العرض (Latitude)" : "Latitude"}:</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-family: monospace;">${lat.toFixed(geoDecimals)}° (${dmsLatStr})</td>
              </tr>
              <tr>
                <td style="padding: 4px 8px; font-weight: bold; border: 1px solid #e2e8f0;">${isAr ? "خط الطول (Longitude)" : "Longitude"}:</td>
                <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-family: monospace;">${lon.toFixed(geoDecimals)}° (${dmsLonStr})</td>
              </tr>
            </table>
            <div style="margin-top: 8px; font-size: 11px; color: #64748b; text-align: center;">
              ${isAr ? "تم التحويل والمعالجة بواسطة منصة مدار – MِDAR" : "Converted & Processed via مدار – MِDAR Platform"}
            </div>
          </div>
        ]]>
      `.trim();

      return `
        <Placemark>
          <name>${pId}</name>
          <description>${descHtml}</description>
          <styleUrl>#surveyPointStyle</styleUrl>
          <Point>
            <coordinates>${lon},${lat},0</coordinates>
          </Point>
        </Placemark>
      `.trim();
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${isAr ? "مدار – MِDAR | نقاط جيوديسية محولة" : "مدار – MِDAR | Converted Geospatial Points"}</name>
    <description>${isAr ? "نقاط مساحية وجيوديسية محولة ومعالجة عبر منصة مدار – MِDAR" : "Converted survey and geospatial points processed via مدار – MِDAR Platform"}</description>
    
    <Style id="surveyPointStyle">
      <IconStyle>
        <scale>1.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png</href>
        </Icon>
        <hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>
      </IconStyle>
      <LabelStyle>
        <color>ff00ffff</color>
        <scale>0.9</scale>
      </LabelStyle>
    </Style>

    ${placemarks}
  </Document>
</kml>`.trim();
}

export function downloadKMLFile(
  rows: BatchRow[],
  metricDecimals: number = 3,
  geoDecimals: number = 7,
  formatDMS?: (val: number | undefined, isLat: boolean) => string,
  lang: "ar" | "en" = "ar"
) {
  const kmlContent = generateKMLContent(rows, metricDecimals, geoDecimals, formatDMS, lang);
  const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("download", `Egypt_Coordinates_${dateStr}.kml`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
