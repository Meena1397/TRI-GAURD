import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ActiveThreatsDonut({ summary }) {
  // Proportions for SVG Donut segments
  const total = summary.total;
  const critical = summary.critical;
  const high = summary.high;
  const medium = summary.medium;
  const low = summary.low;

  // Calculate SVG stroke-dasharray values
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const lowPct = low / total;
  const medPct = medium / total;
  const highPct = high / total;
  const critPct = critical / total;

  const lowStroke = lowPct * circumference;
  const medStroke = medPct * circumference;
  const highStroke = highPct * circumference;
  const critStroke = critPct * circumference;

  // Rotational offsets
  const lowOffset = 0;
  const medOffset = -lowStroke;
  const highOffset = -(lowStroke + medStroke);
  const critOffset = -(lowStroke + medStroke + highStroke);

  return (
    <div className="cyber-card">
      <div className="cyber-card-header">
        <div>
          <div className="cyber-title">ACTIVE THREATS</div>
          <div className="cyber-subtitle">By Severity</div>
        </div>
        <div className="status-indicator">
          <CheckCircle2 size={12} />
        </div>
      </div>

      <div className="donut-layout">
        <div className="donut-graphic">
          <svg width="110" height="110" viewBox="0 0 110 110">
            {/* Background ring */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="12"
            />
            {/* Low Arc (Green) */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={`${lowStroke} ${circumference - lowStroke}`}
              strokeDashoffset={lowOffset}
              transform="rotate(-90 55 55)"
            />
            {/* Medium Arc (Yellow) */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="#eab308"
              strokeWidth="12"
              strokeDasharray={`${medStroke} ${circumference - medStroke}`}
              strokeDashoffset={medOffset}
              transform="rotate(-90 55 55)"
            />
            {/* High Arc (Orange) */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="#f97316"
              strokeWidth="12"
              strokeDasharray={`${highStroke} ${circumference - highStroke}`}
              strokeDashoffset={highOffset}
              transform="rotate(-90 55 55)"
            />
            {/* Critical Arc (Red) */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="#ff0055"
              strokeWidth="12"
              strokeDasharray={`${critStroke} ${circumference - critStroke}`}
              strokeDashoffset={critOffset}
              transform="rotate(-90 55 55)"
              style={{ filter: 'drop-shadow(0 0 4px #ff0055)' }}
            />
          </svg>
          <div className="donut-center">
            <div className="center-number">{total.toLocaleString()}</div>
            <div className="center-label">TOTAL</div>
          </div>
        </div>

        <div className="donut-legend">
          <div className="legend-row">
            <span className="legend-dot critical"></span>
            <span className="legend-name">Critical</span>
            <span className="legend-val">{critical.toLocaleString()}</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot high"></span>
            <span className="legend-name">High</span>
            <span className="legend-val">{high.toLocaleString()}</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot medium"></span>
            <span className="legend-name">Medium</span>
            <span className="legend-val">{medium.toLocaleString()}</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot low"></span>
            <span className="legend-name">Low</span>
            <span className="legend-val">{low.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <style>{`
        .donut-layout {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 4px 0;
        }

        .donut-graphic {
          position: relative;
          width: 110px;
          height: 110px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .donut-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .center-number {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
        }

        .center-label {
          font-family: var(--font-tech);
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .legend-row {
          display: flex;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 0.72rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .legend-dot.critical { background: #ff0055; box-shadow: 0 0 6px #ff0055; }
        .legend-dot.high { background: #f97316; }
        .legend-dot.medium { background: #eab308; }
        .legend-dot.low { background: #10b981; }

        .legend-name {
          color: var(--text-secondary);
          flex: 1;
        }

        .legend-val {
          font-family: var(--font-mono);
          font-weight: 600;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
