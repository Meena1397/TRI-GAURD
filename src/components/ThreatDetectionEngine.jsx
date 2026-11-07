import React, { useEffect, useState } from 'react';
import { Cpu, Loader2, Database } from 'lucide-react';

export default function ThreatDetectionEngine() {
  const [progress, setProgress] = useState(87);

  useEffect(() => {
    // Dynamic Progress ticker simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return next > 92 ? 85 : next < 82 ? 88 : next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scanningStages = [
    { id: '1', label: 'Behavior Analysis' },
    { id: '2', label: 'Anomaly Detection' },
    { id: '3', label: 'ML Classification' },
    { id: '4', label: 'Threat Correlation' }
  ];

  return (
    <div className="cyber-card engine-card">
      <div className="cyber-card-header">
        <div>
          <div className="cyber-title font-tech">
            <Cpu size={15} className="glow-cyan" />
            THREAT DETECTION ENGINE
          </div>
          <div className="cyber-subtitle font-sans">AI-Powered Analysis</div>
        </div>
      </div>

      <div className="engine-layout font-sans">
        {/* Futuristic Cyber Database Scanning Reticle (Replaced Brain graphic) */}
        <div className="cylinder-scanner-wrapper">
          <svg viewBox="0 0 160 160" className="scanner-svg">
            <defs>
              <radialGradient id="scannerCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0.4)" />
                <stop offset="60%" stopColor="rgba(168, 85, 247, 0.25)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </radialGradient>

              <filter id="neonScannerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Core Radial Glow */}
            <circle cx="80" cy="80" r="70" fill="url(#scannerCoreGlow)" />

            {/* Rotating Outer Target Reticle Rings */}
            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" strokeDasharray="8 6" className="hud-rotate" />
            <circle cx="80" cy="80" r="62" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.2" strokeDasharray="14 8" className="hud-rotate-reverse" />
            <circle cx="80" cy="80" r="52" fill="rgba(6, 12, 30, 0.85)" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="1.5" />

            {/* Inner Pulsing Radar Beam Sweep */}
            <line x1="80" y1="80" x2="132" y2="80" stroke="#00f0ff" strokeWidth="2" filter="url(#neonScannerGlow)" className="radar-sweep-beam" />

            {/* Glowing Corner Target Indicators */}
            <circle cx="28" cy="28" r="2.5" fill="#a855f7" />
            <circle cx="132" cy="28" r="2.5" fill="#00f0ff" />
            <circle cx="28" cy="132" r="2.5" fill="#00f0ff" />
            <circle cx="132" cy="132" r="2.5" fill="#a855f7" />
          </svg>

          {/* Central 3D Database Cylinder Stack Emblem */}
          <div className="central-cylinder-emblem">
            <Database size={34} className="cylinder-icon text-cyan" />
            <div className="cylinder-stack-rings">
              <div className="c-ring r1"></div>
              <div className="c-ring r2"></div>
            </div>
          </div>
        </div>

        {/* AI Scanning Status Checklist */}
        <div className="scanning-checklist font-sans">
          {scanningStages.map((stage) => (
            <div key={stage.id} className="checklist-item">
              <div className="scan-icon-col">
                <Loader2 size={13} className="spin-icon text-cyan" />
              </div>
              <div className="scan-label-text">{stage.label}</div>
              <div className="scanning-pill font-mono">Scanning...</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section font-mono">
        <div className="progress-label-row">
          <span className="progress-text">Processing...</span>
          <span className="progress-percent text-cyan">{progress}%</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style>{`
        .engine-card {
          width: 100%;
        }

        .engine-layout {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 8px 0 14px 0;
        }

        .cylinder-scanner-wrapper {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scanner-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .hud-rotate {
          animation: spinSlow 20s linear infinite;
          transform-origin: center;
        }

        .hud-rotate-reverse {
          animation: spinReverse 16s linear infinite;
          transform-origin: center;
        }

        .radar-sweep-beam {
          animation: radarSweep 3s linear infinite;
          transform-origin: 80px 80px;
        }

        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .central-cylinder-emblem {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .cylinder-icon {
          filter: drop-shadow(0 0 12px #00f0ff);
        }

        .cylinder-stack-rings {
          position: absolute;
          inset: -6px;
          pointer-events: none;
        }

        .c-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px dashed rgba(168, 85, 247, 0.6);
          animation: spinSlow 12s linear infinite;
        }

        .scanning-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 10, 26, 0.7);
          border: 1px solid rgba(0, 240, 255, 0.12);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
        }

        .scan-icon-col {
          display: flex;
          align-items: center;
          margin-right: 6px;
        }

        .spin-icon {
          animation: spinSlow 2s linear infinite;
        }

        .scan-label-text {
          color: #ffffff;
          font-weight: 600;
          flex: 1;
        }

        .scanning-pill {
          font-size: 0.62rem;
          color: #00f0ff;
          background: rgba(0, 240, 255, 0.12);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 1px 6px;
          border-radius: 4px;
          animation: pulse-ring 2s infinite;
        }

        .progress-section {
          background: rgba(5, 8, 19, 0.75);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid rgba(0, 240, 255, 0.16);
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          margin-bottom: 6px;
          color: var(--text-secondary);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #008cff 0%, #00f0ff 50%, #a855f7 100%);
          border-radius: 3px;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
