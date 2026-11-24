/**
 * Test Proj4js Integration and Dual-Engine Geodetic Accuracy
 */

import proj4 from "proj4";
import { tmForward, tmInverse, transformEgypt1907ToWGS84, transformWGS84ToEgypt1907 } from "../src/lib/coordinateMath";
import { ELLIPSOID_WGS84 } from "../src/lib/crsData";

console.log("=== Testing Proj4js Integration ===");

// 1. UTM Zone 36N Projection on WGS 84
const utm36nProj4 = "+proj=utm +zone=36 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
const cairoLon = 31.261142;
const cairoLat = 30.029871;

const [eProj4, nProj4] = proj4("EPSG:4326", utm36nProj4, [cairoLon, cairoLat]);
console.log(`Cairo Citadel UTM 36N via Proj4: E=${eProj4.toFixed(2)}, N=${nProj4.toFixed(2)}`);

// Compare with pyproj benchmark (E=332328.48, N=3323368.86)
const pyprojE = 332328.48;
const pyprojN = 3323368.86;
const diffE = Math.abs(eProj4 - pyprojE);
const diffN = Math.abs(nProj4 - pyprojN);
console.log(`Difference vs Pyproj Benchmark: dE=${diffE.toFixed(4)}m, dN=${diffN.toFixed(4)}m`);

// 2. Proj4 Forward-Inverse Roundtrip
const [lonInv, latInv] = proj4(utm36nProj4, "EPSG:4326", [eProj4, nProj4]);
const diffLon = Math.abs(cairoLon - lonInv);
const diffLat = Math.abs(cairoLat - latInv);
const roundtripMeters = Math.sqrt(diffLon * diffLon + diffLat * diffLat) * 111319.5;
console.log(`Proj4 Roundtrip Residual: ${roundtripMeters.toExponential(4)}m`);

// 3. Egypt Red Belt TM Projection via Proj4 (on Helmert 1906 ellipsoid)
const redBeltProj4 = "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +a=6378200 +rf=298.3 +units=m +no_defs";
// In Egypt 1907 Datum:
const egyGeo = transformWGS84ToEgypt1907(cairoLat, cairoLon);
const [eRed, nRed] = proj4(redBeltProj4, [egyGeo.lon, egyGeo.lat]);
console.log(`Cairo Citadel Egypt Red Belt via Proj4: E=${eRed.toFixed(2)}, N=${nRed.toFixed(2)}`);

// Pyproj Benchmark: E=640028.24, N=813321.39
const pyprojRedE = 640028.24;
const pyprojRedN = 813321.39;
console.log(`Difference vs Pyproj Red Belt: dE=${Math.abs(eRed - pyprojRedE).toFixed(3)}m, dN=${Math.abs(nRed - pyprojRedN).toFixed(3)}m`);
