import React from 'react';

export default function TriGuardLogo({ showText = true, layout = 'horizontal', size = 36, subtitleText = "THREE-LAYER ZERO-TRUST SECURITY FOR RAG" }) {
  return (
    <div className={`triguard-logo-container ${layout}`}>
      <div className="logo-symbol-wrapper" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="triguard-svg">
          <defs>
            {/* 3D Orb Main Gradient */}
            <linearGradient id="orbGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0072ff" />
              <stop offset="35%" stopColor="#00c8ff" />
              <stop offset="70%" stopColor="#e67e22" />
              <stop offset="100%" stopColor="#f39c12" />
            </linearGradient>

            {/* Specular Inner Highlight */}
            <radialGradient id="orbHighlight" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Orbit Ring Gradient */}
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="40%" stopColor="#0055ff" />
              <stop offset="75%" stopColor="#ff7700" />
              <stop offset="100%" stopColor="#ffb700" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="logoGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Orbital Ring */}
          <ellipse 
            cx="100" cy="100" 
            rx="86" ry="74" 
            fill="none" 
            stroke="url(#ringGrad)" 
            strokeWidth="3.5" 
            transform="rotate(-24 100 100)" 
            opacity="0.9"
            filter="url(#logoGlowEffect)"
          />
          
          {/* Orbital Satellite 1 (Top Left) */}
          <circle cx="48" cy="42" r="7.5" fill="#f59e0b" filter="url(#logoGlowEffect)" />
          
          {/* Orbital Satellite 2 (Bottom Right) */}
          <circle cx="152" cy="158" r="7" fill="#00f0ff" filter="url(#logoGlowEffect)" />

          {/* Central 3D Pebble Shield Body */}
          <path 
            d="M 100,32 Q 165,42 155,110 Q 145,162 95,158 Q 44,152 44,95 Q 44,38 100,32 Z" 
            fill="url(#orbGrad3D)" 
            filter="url(#logoGlowEffect)"
          />

          {/* 3D Specular Highlight Overlay */}
          <path 
            d="M 100,32 Q 165,42 155,110 Q 145,162 95,158 Q 44,152 44,95 Q 44,38 100,32 Z" 
            fill="url(#orbHighlight)" 
          />

          {/* White Target Crosshair Symbol */}
          <g stroke="#ffffff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Center Target Circle */}
            <circle cx="100" cy="95" r="23" strokeWidth="5.5" />
            
            {/* Diagonal Crosshair Lines */}
            <line x1="77" y1="72" x2="123" y2="118" />
            <line x1="123" y1="72" x2="77" y2="118" />

            {/* T-bar Anchors */}
            <line x1="73" y1="68" x2="67" y2="74" strokeWidth="4.5" />
            <line x1="127" y1="68" x2="133" y2="74" strokeWidth="4.5" />
            <line x1="67" y1="116" x2="73" y2="122" strokeWidth="4.5" />
            <line x1="133" y1="116" x2="127" y2="122" strokeWidth="4.5" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="logo-text-block">
          <div className="logo-brand-title font-tech">
            <span className="text-blue">TRI-</span>
            <span className="text-orange">GUARD</span>
          </div>
          {subtitleText && (
            <div className="logo-brand-subtitle font-mono">
              {subtitleText}
            </div>
          )}
        </div>
      )}

      <style>{`
        .triguard-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          user-select: none;
        }

        .triguard-logo-container.vertical {
          flex-direction: column;
          text-align: center;
          gap: 16px;
        }

        .logo-symbol-wrapper {
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .triguard-svg {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 0 12px rgba(0, 240, 255, 0.35));
        }

        .logo-text-block {
          display: flex;
          flex-direction: column;
        }

        .logo-brand-title {
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 1.5px;
          line-height: 1;
        }

        .triguard-logo-container.vertical .logo-brand-title {
          font-size: 2.2rem;
          letter-spacing: 3px;
        }

        .text-blue {
          color: #00f0ff;
          text-shadow: 0 0 12px rgba(0, 240, 255, 0.7);
        }

        .text-orange {
          color: #f97316;
          text-shadow: 0 0 12px rgba(249, 115, 22, 0.7);
        }

        .logo-brand-subtitle {
          font-size: 0.54rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 1px;
          margin-top: 5px;
          text-transform: uppercase;
        }

        .triguard-logo-container.vertical .logo-brand-subtitle {
          font-size: 0.75rem;
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
}
