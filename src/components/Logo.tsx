/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "w-10 h-10", size }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 p-2 text-emerald-400 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40 overflow-hidden group transition-transform hover:scale-105 ${className}`}>
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-radial from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
      
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="coreGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Outer Precision Meridian Scale Circle */}
        <circle cx="50" cy="50" r="45" stroke="#334155" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="41" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.7" />

        {/* Geodetic Latitude / Longitude Ellipses */}
        <ellipse cx="50" cy="50" rx="41" ry="18" stroke="#10B981" strokeWidth="1.2" strokeOpacity="0.35" />
        <ellipse cx="50" cy="50" rx="18" ry="41" stroke="#10B981" strokeWidth="1.2" strokeOpacity="0.35" />

        {/* Survey Triangulation Pyramid Symbol */}
        <polygon points="50,20 22,74 50,66" fill="url(#emeraldGradient)" fillOpacity="0.9" />
        <polygon points="50,20 50,66 78,74" fill="url(#emeraldGradient)" fillOpacity="0.65" />
        <line x1="50" y1="20" x2="50" y2="66" stroke="#A7F3D0" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Total Station / Optical Survey Target Reticle */}
        <circle cx="50" cy="50" r="16" stroke="url(#goldGradient)" strokeWidth="2.5" fill="#022C22" fillOpacity="0.85" />
        <circle cx="50" cy="50" r="6" stroke="#FEF08A" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="2.5" fill="url(#coreGold)" />

        {/* Laser Sight Crosshair Lines */}
        <path d="M50 8 V22 M50 78 V92 M8 50 H22 M78 50 H92" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />

        {/* North Arrow Marker */}
        <polygon points="50,4 45,12 55,12" fill="#FBBF24" />
      </svg>
    </div>
  );
}

