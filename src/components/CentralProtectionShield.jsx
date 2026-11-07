import React from 'react';
import { 
  Shield, 
  Cpu, 
  FileText, 
  Database, 
  Code2, 
  Folder, 
  Server, 
  Image as ImageIcon, 
  Lock 
} from 'lucide-react';

export default function CentralProtectionShield() {
  const nodeFeatures = [
    { id: 'code', icon: Code2, label: 'Prompt Sanitizer', color: '#00f0ff', pos: 'node-top-left' },
    { id: 'doc1', icon: FileText, label: 'Doc Embeddings', color: '#00f0ff', pos: 'node-top' },
    { id: 'db', icon: Database, label: 'Vector Isolation', color: '#00f0ff', pos: 'node-top-right' },
    { id: 'folder', icon: Folder, label: 'RAG Context Shield', color: '#00f0ff', pos: 'node-mid-right' },
    { id: 'server', icon: Server, label: 'LLM Output Firewall', color: '#00f0ff', pos: 'node-bottom-right' },
    { id: 'doc2', icon: FileText, label: 'Tenant Isolation', color: '#00f0ff', pos: 'node-bottom' },
    { id: 'img', icon: ImageIcon, label: 'Multimodal Scanner', color: '#00f0ff', pos: 'node-bottom-left' },
  ];

  return (
    <div className="ragshield-hero-container font-sans">
      
      {/* Central Cyber Sphere Grid & Laser Arc System */}
      <div className="ragshield-stage">
        
        {/* SVG Laser Beam Connectors */}
        <svg className="laser-network-svg" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="redLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0055" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.4" />
            </linearGradient>

            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Red Attack & Cyan Defense Lasers branching from Center (250, 220) */}
          <line x1="250" y1="220" x2="140" y2="110" stroke="#ff0055" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="140" cy="110" r="4" fill="#ff0055" />

          <line x1="250" y1="220" x2="250" y2="70" stroke="#00f0ff" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="250" cy="70" r="4" fill="#00f0ff" />

          <line x1="250" y1="220" x2="360" y2="110" stroke="#ff0055" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="360" cy="110" r="4" fill="#ff0055" />

          <line x1="250" y1="220" x2="410" y2="200" stroke="#00f0ff" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="410" cy="200" r="4" fill="#00f0ff" />

          <line x1="250" y1="220" x2="380" y2="310" stroke="#ff0055" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="380" cy="310" r="4" fill="#ff0055" />

          <line x1="250" y1="220" x2="250" y2="360" stroke="#00f0ff" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="250" cy="360" r="4" fill="#00f0ff" />

          <line x1="250" y1="220" x2="120" y2="300" stroke="#ff0055" strokeWidth="2" filter="url(#laserGlow)" />
          <circle cx="120" cy="300" r="4" fill="#ff0055" />

          {/* Outer Orbital Grid Rings */}
          <circle cx="250" cy="220" r="160" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1.2" strokeDasharray="6 6" className="orbit-rotate-slow" />
          <circle cx="250" cy="220" r="110" fill="none" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1" />
        </svg>

        {/* Orbiting Feature Node Badges */}
        <div className="orbit-badge node-code"><Code2 size={16} /></div>
        <div className="orbit-badge node-doc1"><FileText size={16} /></div>
        <div className="orbit-badge node-db"><Database size={16} /></div>
        <div className="orbit-badge node-folder"><Folder size={16} /></div>
        <div className="orbit-badge node-server"><Server size={16} /></div>
        <div className="orbit-badge node-doc2"><FileText size={16} /></div>
        <div className="orbit-badge node-img"><ImageIcon size={16} /></div>

        {/* Hero Center Shield Badge with AI Chip */}
        <div className="hero-shield-emblem">
          <div className="shield-glow-aura"></div>
          <div className="shield-glass-body">
            <Shield size={72} className="hero-shield-outline" />
            <div className="ai-chip-core">
              <Cpu size={24} className="cpu-icon text-cyan" />
              <span className="ai-text font-display">AI</span>
            </div>
          </div>
        </div>

        {/* 3D Pedestal Platform Base */}
        <div className="pedestal-platform font-tech">
          <div className="pedestal-ring-outer"></div>
          <div className="pedestal-ring-inner"></div>
          <div className="pedestal-light-beam"></div>
        </div>

      </div>

      {/* Subtitle Telemetry Footer */}
      <div className="ragshield-footer font-tech">
        <span className="sub-tag text-cyan font-bold">RAGSHIELD</span>
        <span className="dot-divider">•</span>
        <span>MONITOR</span>
        <span className="dot-divider">•</span>
        <span>DETECT</span>
        <span className="dot-divider">•</span>
        <span>PROTECT</span>
      </div>

      <style>{`
        .ragshield-hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 10px 0 4px 0;
          position: relative;
        }

        .ragshield-stage {
          position: relative;
          width: 440px;
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .laser-network-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .orbit-rotate-slow {
          animation: spinOrbit 30s linear infinite;
          transform-origin: 250px 220px;
        }

        @keyframes spinOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Orbit Badge Icons */
        .orbit-badge {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(8, 20, 48, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.5);
          color: #00f0ff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
          z-index: 10;
          transition: transform 0.3s;
        }

        .orbit-badge:hover {
          transform: scale(1.15);
          border-color: #ffffff;
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.8);
        }

        .node-code { top: 70px; left: 100px; }
        .node-doc1 { top: 35px; left: 200px; }
        .node-db { top: 70px; left: 300px; }
        .node-folder { top: 140px; left: 350px; }
        .node-server { top: 220px; left: 320px; }
        .node-doc2 { top: 270px; left: 200px; }
        .node-img { top: 210px; left: 80px; }

        /* Central Hero Shield */
        .hero-shield-emblem {
          position: absolute;
          top: 100px;
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield-glow-aura {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(0, 102, 255, 0.1) 70%, transparent 100%);
          filter: blur(12px);
          animation: shieldPulse 2.5s ease-in-out infinite alternate;
        }

        @keyframes shieldPulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 1; }
        }

        .shield-glass-body {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-shield-outline {
          color: #00f0ff;
          filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.8));
        }

        .ai-chip-core {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .cpu-icon {
          filter: drop-shadow(0 0 10px #00f0ff);
        }

        .ai-text {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #ffffff;
          margin-top: -2px;
          text-shadow: 0 0 8px #00f0ff;
        }

        /* 3D Pedestal Base Platform */
        .pedestal-platform {
          position: absolute;
          bottom: 10px;
          width: 240px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pedestal-ring-outer {
          position: absolute;
          width: 240px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(0, 240, 255, 0.6);
          background: radial-gradient(ellipse at center, rgba(0, 114, 255, 0.4) 0%, rgba(4, 9, 24, 0.8) 100%);
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.3);
          transform: rotateX(65deg);
        }

        .pedestal-ring-inner {
          position: absolute;
          width: 170px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid rgba(0, 255, 157, 0.7);
          box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
          transform: rotateX(65deg);
        }

        .pedestal-light-beam {
          position: absolute;
          bottom: 15px;
          width: 140px;
          height: 90px;
          background: linear-gradient(to top, rgba(0, 240, 255, 0.35) 0%, rgba(0, 240, 255, 0) 100%);
          clip-path: polygon(20% 100%, 80% 100%, 100% 0%, 0% 0%);
          pointer-events: none;
        }

        /* Footer Subtitle */
        .ragshield-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          color: rgba(148, 163, 184, 0.8);
          letter-spacing: 1.5px;
          margin-top: 4px;
        }

        .sub-tag {
          letter-spacing: 2px;
        }

        .dot-divider {
          color: rgba(0, 240, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
