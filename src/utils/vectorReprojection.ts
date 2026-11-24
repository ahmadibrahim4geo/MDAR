/**
 * مدار – MِDAR | GIS Vector Reprojection Engine
 * High-performance client-side reprojection for GeoJSON, KML/KMZ, and Shapefiles (ZIP).
 * Integrates geometry coordinate transforms, XXE defense, and archive size boundaries.
 */

import { convertCoordinates } from "../lib/coordinateMath";
import { CRSDefinition, CRSType } from "../types";
import shp from "shpjs";

export interface ReprojectionStats {
  featureCount: number;
  geometryTypes: string[];
  sourceCRS: string;
  targetCRS: string;
  operationId: string;
  accuracyMeters: number;
  bounds: [number, number, number, number]; // [minX, minY, maxX, maxY]
}

/**
 * Defends against XML External Entity (XXE) and billion laughs attacks
 * by stripping DTD declarations and entity expansions.
 */
export function sanitizeXMLString(xml: string): string {
  return xml
    .replace(/<!DOCTYPE[^>\[]*(\[[^\]]*\])?\s*>/gi, "")
    .replace(/<!ENTITY[\s\S]*?>/gi, "")
    .trim();
}

/**
 * Reprojects a single 2D or 3D coordinate tuple [x, y, (z)]
 */
export function transformTuple(
  coord: number[],
  srcCRS: CRSDefinition,
  tgtCRS: CRSDefinition
): number[] {
  const x = coord[0];
  const y = coord[1];
  const z = coord.length > 2 ? coord[2] : undefined;

  const res = convertCoordinates(
    x,
    y,
    srcCRS,
    tgtCRS,
    srcCRS.type === CRSType.PROJECTED,
    tgtCRS.type === CRSType.PROJECTED
  );

  if (z !== undefined) {
    return [res.out1, res.out2, z];
  }
  return [res.out1, res.out2];
}

/**
 * Recursively reprojects coordinates in arbitrary nested arrays (Point, Line, Polygon, MultiPolygon)
 */
function transformCoordsRecursively(
  coords: any,
  depth: number,
  srcCRS: CRSDefinition,
  tgtCRS: CRSDefinition
): any {
  if (depth === 0) {
    return transformTuple(coords, srcCRS, tgtCRS);
  }
  return coords.map((c: any) => transformCoordsRecursively(c, depth - 1, srcCRS, tgtCRS));
}

/**
 * Reprojects a GeoJSON Geometry object
 */
export function reprojectGeometry(
  geom: any,
  srcCRS: CRSDefinition,
  tgtCRS: CRSDefinition
): any {
  if (!geom || !geom.type) return geom;

  switch (geom.type) {
    case "Point":
      return {
        ...geom,
        coordinates: transformTuple(geom.coordinates, srcCRS, tgtCRS)
      };

    case "MultiPoint":
    case "LineString":
      return {
        ...geom,
        coordinates: transformCoordsRecursively(geom.coordinates, 1, srcCRS, tgtCRS)
      };

    case "MultiLineString":
    case "Polygon":
      return {
        ...geom,
        coordinates: transformCoordsRecursively(geom.coordinates, 2, srcCRS, tgtCRS)
      };

    case "MultiPolygon":
      return {
        ...geom,
        coordinates: transformCoordsRecursively(geom.coordinates, 3, srcCRS, tgtCRS)
      };

    case "GeometryCollection":
      return {
        ...geom,
        geometries: geom.geometries.map((g: any) => reprojectGeometry(g, srcCRS, tgtCRS))
      };

    default:
      return geom;
  }
}

/**
 * Computes bounding box [minX, minY, maxX, maxY] for a FeatureCollection
 */
export function computeBounds(fc: any): [number, number, number, number] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  function scan(coords: any) {
    if (typeof coords[0] === "number") {
      const x = coords[0];
      const y = coords[1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    } else {
      for (const item of coords) {
        scan(item);
      }
    }
  }

  for (const feature of fc.features || []) {
    if (feature.geometry?.coordinates) {
      scan(feature.geometry.coordinates);
    }
  }

  if (minX === Infinity) return [0, 0, 0, 0];
  return [minX, minY, maxX, maxY];
}

/**
 * Reprojects an entire GeoJSON FeatureCollection
 */
export function reprojectFeatureCollection(
  fc: any,
  srcCRS: CRSDefinition,
  tgtCRS: CRSDefinition
): {
  reprojectedFC: any;
  stats: ReprojectionStats;
} {
  const geomTypesSet = new Set<string>();

  const reprojectedFeatures = (fc.features || []).map((f: any) => {
    if (f.geometry?.type) {
      geomTypesSet.add(f.geometry.type);
    }
    const newGeom = reprojectGeometry(f.geometry, srcCRS, tgtCRS);
    return {
      ...f,
      geometry: newGeom
    };
  });

  const reprojectedFC = {
    type: "FeatureCollection",
    features: reprojectedFeatures
  };

  const bounds = computeBounds(reprojectedFC);

  const stats: ReprojectionStats = {
    featureCount: reprojectedFeatures.length,
    geometryTypes: Array.from(geomTypesSet),
    sourceCRS: srcCRS.nameAr || srcCRS.nameEn,
    targetCRS: tgtCRS.nameAr || tgtCRS.nameEn,
    operationId: tgtCRS.operationId || srcCRS.operationId || "EPSG Standard Transformation",
    accuracyMeters: tgtCRS.accuracyMeters || srcCRS.accuracyMeters || 0.05,
    bounds
  };

  return { reprojectedFC, stats };
}

/**
 * Safe client-side KML parser converting to GeoJSON with XXE defense
 */
export function parseKMLToGeoJSON(kmlText: string): any {
  const cleanKML = sanitizeXMLString(kmlText);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(cleanKML, "text/xml");

  const parseError = xmlDoc.getElementsByTagName("parsererror");
  if (parseError.length > 0) {
    throw new Error("ملف KML تالف أو غير صالح البنية (XML Parse Error).");
  }

  const features: any[] = [];
  const placemarks = xmlDoc.getElementsByTagName("Placemark");

  for (let i = 0; i < placemarks.length; i++) {
    const pm = placemarks[i];
    const nameEl = pm.getElementsByTagName("name")[0];
    const descEl = pm.getElementsByTagName("description")[0];
    const name = nameEl?.textContent || `Feature_${i + 1}`;
    const description = descEl?.textContent || "";

    // 1. Point
    const pointEl = pm.getElementsByTagName("Point")[0];
    if (pointEl) {
      const coordEl = pointEl.getElementsByTagName("coordinates")[0];
      if (coordEl && coordEl.textContent) {
        const parts = coordEl.textContent.trim().split(",");
        const lon = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        const z = parts.length > 2 ? parseFloat(parts[2]) : undefined;
        if (!isNaN(lon) && !isNaN(lat)) {
          features.push({
            type: "Feature",
            properties: { name, description },
            geometry: {
              type: "Point",
              coordinates: z !== undefined ? [lon, lat, z] : [lon, lat]
            }
          });
          continue;
        }
      }
    }

    // 2. LineString
    const lineEl = pm.getElementsByTagName("LineString")[0];
    if (lineEl) {
      const coordEl = lineEl.getElementsByTagName("coordinates")[0];
      if (coordEl && coordEl.textContent) {
        const tuples = coordEl.textContent.trim().split(/\s+/).map((t) => {
          const parts = t.split(",");
          return [parseFloat(parts[0]), parseFloat(parts[1])];
        }).filter((c) => !isNaN(c[0]) && !isNaN(c[1]));

        if (tuples.length > 0) {
          features.push({
            type: "Feature",
            properties: { name, description },
            geometry: {
              type: "LineString",
              coordinates: tuples
            }
          });
          continue;
        }
      }
    }

    // 3. Polygon
    const polyEl = pm.getElementsByTagName("Polygon")[0];
    if (polyEl) {
      const rings: number[][][] = [];
      const outerEl = polyEl.getElementsByTagName("outerBoundaryIs")[0];
      if (outerEl) {
        const coordEl = outerEl.getElementsByTagName("coordinates")[0];
        if (coordEl && coordEl.textContent) {
          const ring = coordEl.textContent.trim().split(/\s+/).map((t) => {
            const parts = t.split(",");
            return [parseFloat(parts[0]), parseFloat(parts[1])];
          }).filter((c) => !isNaN(c[0]) && !isNaN(c[1]));

          if (ring.length >= 3) {
            rings.push(ring);
          }
        }
      }

      if (rings.length > 0) {
        features.push({
          type: "Feature",
          properties: { name, description },
          geometry: {
            type: "Polygon",
            coordinates: rings
          }
        });
      }
    }
  }

  return {
    type: "FeatureCollection",
    features
  };
}

/**
 * Parses Shapefile (.zip) buffer with size limits defense (< 100MB)
 */
export async function parseShapefileZip(buffer: ArrayBuffer): Promise<any> {
  // Defense: Size Limit 100MB
  if (buffer.byteLength > 100 * 1024 * 1024) {
    throw new Error("حجم الأرشيف يتجاوز الحد المسموح به (100 ميجابايت).");
  }

  const result = await (shp as any)(buffer);
  if (Array.isArray(result)) {
    // If multi-layer shapefile archive, combine into single FeatureCollection
    return {
      type: "FeatureCollection",
      features: result.flatMap((r) => r.features || [])
    };
  }
  return result;
}

/**
 * Converts a GeoJSON FeatureCollection to clean KML string
 */
export function featureCollectionToKML(fc: any, title = "مدار – MِDAR Vector Layer"): string {
  const placemarks: string[] = [];

  for (const f of fc.features || []) {
    const name = f.properties?.name || f.properties?.NAME || "Feature";
    const desc = f.properties?.description || "";
    const geom = f.geometry;
    if (!geom) continue;

    let kmlGeom = "";
    if (geom.type === "Point") {
      const c = geom.coordinates;
      kmlGeom = `<Point><coordinates>${c[0]},${c[1]}${c.length > 2 ? `,${c[2]}` : ""}</coordinates></Point>`;
    } else if (geom.type === "LineString") {
      const coordsStr = geom.coordinates.map((c: number[]) => `${c[0]},${c[1]}`).join(" ");
      kmlGeom = `<LineString><coordinates>${coordsStr}</coordinates></LineString>`;
    } else if (geom.type === "Polygon") {
      const outerRing = geom.coordinates[0];
      if (outerRing) {
        const coordsStr = outerRing.map((c: number[]) => `${c[0]},${c[1]}`).join(" ");
        kmlGeom = `<Polygon><outerBoundaryIs><LinearRing><coordinates>${coordsStr}</coordinates></LinearRing></outerBoundaryIs></Polygon>`;
      }
    }

    if (kmlGeom) {
      placemarks.push(`
        <Placemark>
          <name>${name}</name>
          <description><![CDATA[${desc}]]></description>
          ${kmlGeom}
        </Placemark>
      `.trim());
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${title}</name>
    <Style id="defaultStyle">
      <LineStyle><color>ff10b981</color><width>2.5</width></LineStyle>
      <PolyStyle><color>4d10b981</color></PolyStyle>
    </Style>
    ${placemarks.join("\n")}
  </Document>
</kml>`;
}

/**
 * Triggers client-side download of a text/blob file
 */
export function downloadFile(content: string, filename: string, mimeType = "application/json") {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
