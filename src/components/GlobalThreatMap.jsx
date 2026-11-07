import React, { useState } from 'react';
import { Globe, ShieldAlert, Crosshair, Filter } from 'lucide-react';

export default function GlobalThreatMap({ filterCategory, setFilterCategory }) {
  const [activeNode, setActiveNode] = useState(null);

  // Global Threat Hotspot Nodes mapped to SVG viewBox coordinates (800 x 400)
  const hotspots = [
    { id: 'ny', name: 'North America SOC (New York)', x: 220, y: 135, type: 'CRITICAL', threat: 'Zero-Day Exploit', count: 1482 },
    { id: 'london', name: 'Europe West (London)', x: 395, y: 110, type: 'CRITICAL', threat: 'DDoS Amplification', count: 2104 },
    { id: 'frankfurt', name: 'Central Europe (Frankfurt)', x: 430, y: 122, type: 'HIGH', threat: 'Context Injection', count: 875 },
    { id: 'tokyo', name: 'Asia East (Tokyo)', x: 690, y: 150, type: 'CRITICAL', threat: 'Prompt Extraction', count: 1320 },
    { id: 'singapore', name: 'Asia South (Singapore)', x: 625, y: 235, type: 'MEDIUM', threat: 'Unauthorized API Access', count: 450 },
    { id: 'delhi', name: 'South Asia (New Delhi)', x: 575, y: 175, type: 'CRITICAL', threat: 'Vector DB Poisoning', count: 1940 },
    { id: 'saopaulo', name: 'South America (Sao Paulo)', x: 290, y: 285, type: 'LOW', threat: 'Port Scan Anomaly', count: 210 }
  ];

  // Curved Attack Arc Paths connecting nodes
  const arcs = [
    { from: 'ny', to: 'london', path: 'M 220,135 Q 307,70 395,110', color: '#ff0055' },
    { from: 'tokyo', to: 'ny', path: 'M 690,150 Q 455,40 220,135', color: '#ff0055' },
    { from: 'frankfurt', to: 'delhi', path: 'M 430,122 Q 500,110 575,175', color: '#ff3377' },
    { from: 'delhi', to: 'tokyo', path: 'M 575,175 Q 630,130 690,150', color: '#00f0ff' },
    { from: 'singapore', to: 'delhi', path: 'M 625,235 Q 600,200 575,175', color: '#00f0ff' },
    { from: 'saopaulo', to: 'ny', path: 'M 290,285 Q 230,210 220,135', color: '#f97316' }
  ];

  return (
    <div className="cyber-card global-map-card">
      <div className="cyber-card-header">
        <div>
          <div className="cyber-title font-tech">
            <Globe size={16} className="glow-cyan" />
            GLOBAL THREAT MAP
          </div>
          <div className="cyber-subtitle font-sans">Real-time Attack Visualization</div>
        </div>

        <div className="filter-select-wrapper">
          <Filter size={13} className="text-cyan" />
          <select 
            className="cyber-select font-tech"
            value={filterCategory || 'All Threats'}
            onChange={(e) => setFilterCategory && setFilterCategory(e.target.value)}
          >
            <option value="All Threats">All Threats</option>
            <option value="Critical">Critical</option>
            <option value="Exploits">Exploits</option>
            <option value="Phishing">Phishing</option>
            <option value="DDoS">DDoS</option>
          </select>
        </div>
      </div>

      <div className="map-view-container font-sans">
        <svg viewBox="0 0 800 400" className="world-map-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="mapBgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 114, 255, 0.12)" />
              <stop offset="100%" stopColor="rgba(5, 8, 19, 0)" />
            </radialGradient>

            <filter id="glowRedArc" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Map Grid Background */}
          <rect width="800" height="400" fill="url(#mapBgGlow)" />

          {/* Latitude & Longitude HUD Lines */}
          <g stroke="rgba(0, 240, 255, 0.07)" strokeWidth="1" strokeDasharray="4 6">
            <line x1="0" y1="100" x2="800" y2="100" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="400" y1="0" x2="400" y2="400" />
            <line x1="600" y1="0" x2="600" y2="400" />
          </g>

          {/* Futuristic 2D World Continent Vector Outlines */}
          <g fill="rgba(0, 114, 255, 0.18)" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1">
            {/* North America */}
            <path d="M 120,70 L 230,60 L 290,110 L 250,170 L 190,180 L 160,140 L 110,110 Z" />
            {/* South America */}
            <path d="M 260,210 L 320,230 L 310,320 L 270,350 L 250,260 Z" />
            {/* Europe */}
            <path d="M 380,80 L 460,75 L 480,130 L 410,140 L 370,110 Z" />
            {/* Africa */}
            <path d="M 370,150 L 470,155 L 490,240 L 430,300 L 380,240 Z" />
            {/* Asia */}
            <path d="M 490,65 L 710,55 L 750,140 L 680,210 L 560,180 L 480,120 Z" />
            {/* Australia */}
            <path d="M 660,260 L 750,265 L 740,330 L 660,320 Z" />
          </g>

          {/* Cyber Dot Grid Overlay across Map */}
          <g fill="rgba(0, 240, 255, 0.25)">
            <circle cx="160" cy="90" r="1.5" />
            <circle cx="200" cy="110" r="1.5" />
            <circle cx="240" cy="130" r="1.5" />
            <circle cx="410" cy="95" r="1.5" />
            <circle cx="440" cy="115" r="1.5" />
            <circle cx="580" cy="140" r="1.5" />
            <circle cx="650" cy="120" r="1.5" />
            <circle cx="700" cy="170" r="1.5" />
            <circle cx="280" cy="250" r="1.5" />
            <circle cx="420" cy="220" r="1.5" />
            <circle cx="700" cy="290" r="1.5" />
          </g>

          {/* Animated Attack Arcs */}
          {arcs.map((arc, index) => (
            <g key={index}>
              <path
                d={arc.path}
                fill="none"
                stroke={arc.color}
                strokeWidth="2"
                opacity="0.85"
                filter="url(#glowRedArc)"
              />
              <path
                d={arc.path}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="12 40"
                className="animated-arc-beam"
              />
            </g>
          ))}

          {/* Glowing Threat Hotspot Nodes */}
          {hotspots.map((node) => {
            const isCritical = node.type === 'CRITICAL';
            return (
              <g 
                key={node.id} 
                className="map-node-group"
                onMouseEnter={() => setActiveNode(node)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {/* Outer Pulsing Ring */}
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isCritical ? 14 : 10} 
                  fill="none" 
                  stroke={isCritical ? '#ff0055' : '#00f0ff'} 
                  strokeWidth="1.5"
                  className={isCritical ? 'pulse-node-critical' : 'pulse-node-cyan'}
                />

                {/* Inner Core Node */}
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isCritical ? 5 : 4} 
                  fill={isCritical ? '#ff0055' : '#00f0ff'} 
                  filter="url(#nodeGlow)"
                />
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="2" 
                  fill="#ffffff" 
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeNode && (
          <div 
            className="map-node-tooltip font-mono animate-fade-in"
            style={{
              left: `${(activeNode.x / 800) * 100}%`,
              top: `${(activeNode.y / 400) * 100}%`
            }}
          >
            <div className="tooltip-header">
              <ShieldAlert size={12} className={activeNode.type === 'CRITICAL' ? 'text-critical' : 'text-cyan'} />
              <span>{activeNode.name}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Threat:</span>
              <span className="tooltip-val text-white">{activeNode.threat}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Volume:</span>
              <span className="tooltip-val text-cyan">{activeNode.count.toLocaleString()} req/s</span>
            </div>
          </div>
        )}

        {/* Map Footer Telemetry Bar */}
        <div className="map-telemetry-bar font-mono">
          <div className="t-status">
            <span className="pulse-dot"></span>
            <span>LIVE THREAT FEEDS: <strong>7 ACTIVE NODES</strong></span>
          </div>
          <div className="t-legend font-sans">
            <span className="legend-item"><span className="dot dot-red"></span> Critical</span>
            <span className="legend-item"><span className="dot dot-orange"></span> High</span>
            <span className="legend-item"><span className="dot dot-cyan"></span> Active</span>
          </div>
        </div>
      </div>

      <style>{`
        .global-map-card {
          width: 100%;
        }

        .filter-select-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .map-view-container {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(4, 9, 22, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.15);
        }

        .world-map-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .animated-arc-beam {
          animation: arcDashMove 2s linear infinite;
        }

        @keyframes arcDashMove {
          0% { stroke-dashoffset: 52; }
          100% { stroke-dashoffset: 0; }
        }

        .map-node-group {
          cursor: pointer;
        }

        .pulse-node-critical {
          animation: pulseNodeRed 1.8s ease-out infinite;
          transform-origin: center;
        }

        .pulse-node-cyan {
          animation: pulseNodeCyan 2.2s ease-out infinite;
          transform-origin: center;
        }

        @keyframes pulseNodeRed {
          0% { r: 5px; opacity: 1; stroke-width: 2px; }
          100% { r: 18px; opacity: 0; stroke-width: 0.5px; }
        }

        @keyframes pulseNodeCyan {
          0% { r: 4px; opacity: 1; stroke-width: 2px; }
          100% { r: 14px; opacity: 0; stroke-width: 0.5px; }
        }

        .map-node-tooltip {
          position: absolute;
          transform: translate(-50%, -120%);
          background: rgba(8, 14, 30, 0.95);
          border: 1px solid rgba(0, 240, 255, 0.4);
          border-radius: 6px;
          padding: 8px 12px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 240, 255, 0.2);
          pointer-events: none;
          z-index: 20;
          white-space: nowrap;
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #00f0ff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 4px;
          margin-bottom: 4px;
        }

        .tooltip-row {
          display: flex;
          gap: 8px;
          font-size: 0.7rem;
        }

        .tooltip-label {
          color: rgba(148, 163, 184, 0.7);
        }

        .map-telemetry-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(3, 7, 18, 0.8);
          border-top: 1px solid rgba(0, 240, 255, 0.1);
          font-size: 0.72rem;
          color: rgba(226, 232, 240, 0.8);
        }

        .t-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .t-legend {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.72rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .dot-red { background: #ff0055; box-shadow: 0 0 6px #ff0055; }
        .dot-orange { background: #f97316; }
        .dot-cyan { background: #00f0ff; box-shadow: 0 0 6px #00f0ff; }
      `}</style>
    </div>
  );
}