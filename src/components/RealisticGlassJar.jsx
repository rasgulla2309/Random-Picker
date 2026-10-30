import React from 'react';
import { motion } from 'framer-motion';

export default function RealisticGlassJar({ fillPercent = 0, slipCount = 0, isPacked = false }) {
  // Generate visual folded white paper chits inside the jar based on count
  const renderChits = Math.max(isPacked ? 28 : 0, Math.min(slipCount, 32));

  return (
    <div style={{
      position: 'relative',
      height: 'min(48vh, 350px)',
      maxHeight: '350px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
    }}>
      <svg
        viewBox="0 0 300 360"
        style={{
          height: '100%',
          width: 'auto',
          maxHeight: '350px',
          filter: 'drop-shadow(0 20px 34px rgba(22, 100, 60, 0.12))',
        }}
      >
        <defs>
          {/* Metallic Brushed Gold/Brass for Lid */}
          <linearGradient id="lidBrass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#855A1A" />
            <stop offset="20%" stopColor="#C89D3C" />
            <stop offset="45%" stopColor="#F5DF95" />
            <stop offset="55%" stopColor="#FFF2B8" />
            <stop offset="75%" stopColor="#C89D3C" />
            <stop offset="100%" stopColor="#633F0C" />
          </linearGradient>

          {/* Soft Sage Green Pedestal matching Mockup */}
          <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#558B6E" />
            <stop offset="35%" stopColor="#7EAF92" />
            <stop offset="70%" stopColor="#6E9F83" />
            <stop offset="100%" stopColor="#447358" />
          </linearGradient>

          {/* Realistic Multi-surface Glass Refraction */}
          <linearGradient id="glassWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.65)" />
            <stop offset="6%" stopColor="rgba(255, 255, 255, 0.28)" />
            <stop offset="18%" stopColor="rgba(220, 240, 230, 0.1)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.03)" />
            <stop offset="82%" stopColor="rgba(220, 240, 230, 0.1)" />
            <stop offset="94%" stopColor="rgba(255, 255, 255, 0.35)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
          </linearGradient>

          {/* Dynamic Caustic Glare Sweep Gradient */}
          <linearGradient id="dynamicCaustic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Clip path inside the glass container */}
          <clipPath id="jarGlassInterior">
            <path d="M 68 85 Q 52 110 52 150 L 52 270 Q 52 300 150 300 Q 248 300 248 270 L 248 150 Q 248 110 232 85 Z" />
          </clipPath>
        </defs>

        {/* 1. Stationary Sage Green Table Pedestal - 100% Still & Firmly Grounded */}
        <g id="stationaryPedestalBase">
          <ellipse cx="150" cy="318" rx="120" ry="24" fill="#3D684E" opacity="0.3" filter="blur(6px)" />
          <ellipse cx="150" cy="308" rx="114" ry="20" fill="url(#pedestalGrad)" />
          <ellipse cx="150" cy="305" rx="106" ry="16" fill="#88B89C" opacity="0.6" />
          <ellipse cx="150" cy="302" rx="98" ry="13" fill="#6FA184" />
        </g>

        {/* 2. Glass Jar Assembly Sitting On Pedestal */}
        <g id="jarGlassAssembly">
          {/* Jar Base & Interior Shadow */}
          <path
            d="M 68 85 Q 52 110 52 150 L 52 270 Q 52 300 150 300 Q 248 300 248 270 L 248 150 Q 248 110 232 85 Z"
            fill="rgba(235, 245, 240, 0.35)"
          />

          {/* 3. White Folded Origami Paper Chits Inside the Jar */}
          {renderChits > 0 && (
            <g clipPath="url(#jarGlassInterior)">
              {Array.from({ length: renderChits }).map((_, i) => {
                const col = i % 5;
                const row = Math.floor(i / 5);
                const x = 75 + col * 32 + ((row % 2) * 15);
                const y = 280 - row * 24;
                const rot = ((i * 47) % 60) - 30;

                return (
                  <g key={i} transform={`translate(${x}, ${y}) rotate(${rot})`}>
                    {/* Subtle Chit Shadow */}
                    <rect x="-14" y="-8" width="28" height="18" rx="2" fill="rgba(0,0,0,0.08)" filter="blur(1px)" />
                    {/* Crisp White Paper Chit */}
                    <rect x="-15" y="-9" width="30" height="20" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    {/* Diagonal Origami Fold Crease */}
                    <line x1="-15" y1="-9" x2="15" y2="11" stroke="#CBD5E1" strokeWidth="0.8" />
                    <line x1="-15" y1="1" x2="15" y2="1" stroke="#E2E8F0" strokeWidth="0.6" />
                  </g>
                );
              })}
            </g>
          )}

          {/* Dynamic Light Caustic Reflection Sweep Across Curved Glass */}
          <g clipPath="url(#jarGlassInterior)">
            <motion.rect
              x="50"
              y="70"
              width="200"
              height="240"
              fill="url(#dynamicCaustic)"
              animate={{ x: [-80, 80, -80], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ pointerEvents: 'none' }}
            />
          </g>

          {/* 4. Outer Glass Body with Caustics and Specular Bevels */}
          <path
            d="M 68 85 Q 52 110 52 150 L 52 270 Q 52 300 150 300 Q 248 300 248 270 L 248 150 Q 248 110 232 85 Z"
            fill="url(#glassWallGrad)"
            stroke="rgba(255, 255, 255, 0.88)"
            strokeWidth="2.5"
          />

          {/* Thick Base Curve */}
          <path
            d="M 64 275 Q 150 305 236 275 Q 150 292 64 275 Z"
            fill="rgba(255, 255, 255, 0.5)"
          />

          {/* Vertical Specular Glare Highlights */}
          <path
            d="M 66 110 Q 58 200 68 265"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 80 115 Q 74 190 82 250"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 234 110 Q 242 200 232 265"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* 5. Glass Neck Thread */}
          <rect x="76" y="65" width="148" height="22" rx="6" fill="url(#glassWallGrad)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.5" />

          {/* 6. Realistic Brushed Brass Screw-Top Lid */}
          <ellipse cx="150" cy="65" rx="66" ry="12" fill="url(#lidBrass)" />
          <rect x="84" y="44" width="132" height="20" fill="url(#lidBrass)" />
          
          {/* Subtle Horizontal Knurling Ring on Lid */}
          <line x1="84" y1="52" x2="216" y2="52" stroke="#633F0C" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="84" y1="58" x2="216" y2="58" stroke="#FFE9A3" strokeWidth="1" strokeOpacity="0.7" />

          {/* Top of Lid */}
          <ellipse cx="150" cy="44" rx="66" ry="12" fill="url(#lidBrass)" />
          <ellipse cx="150" cy="42" rx="60" ry="9" fill="#FFF4C7" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
