import React from 'react';
import { Laptop, Cloud, Network, CheckCircle2 } from 'lucide-react';

export default function SystemMetricsTrio({ metrics }) {
  const cards = [
    {
      title: 'ENDPOINTS',
      subtitle: 'Security Status',
      icon: Laptop,
      protected: metrics.endpoints.protected,
      atRisk: metrics.endpoints.atRisk,
      sparkColor: '#00f0ff'
    },
    {
      title: 'CLOUD SYSTEMS',
      subtitle: 'Security Status',
      icon: Cloud,
      protected: metrics.cloud.protected,
      atRisk: metrics.cloud.atRisk,
      sparkColor: '#3b82f6'
    },
    {
      title: 'NETWORK',
      subtitle: 'Security Status',
      icon: Network,
      protected: metrics.network.protected,
      atRisk: metrics.network.atRisk,
      sparkColor: '#00f0ff'
    }
  ];

  return (
    <div className="trio-container">
      {cards.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <div key={idx} className="cyber-card trio-card">
            <div className="cyber-card-header">
              <div>
                <div className="trio-title">{card.title}</div>
                <div className="cyber-subtitle">{card.subtitle}</div>
              </div>
              <div className="status-indicator">
                <CheckCircle2 size={13} />
              </div>
            </div>

            <div className="trio-body">
              <div className="trio-icon-col">
                <div className="trio-icon-box">
                  <IconComp size={24} className="trio-icon" />
                </div>
                <div className="protected-tag">Protected</div>
              </div>

              <div className="trio-stats-col">
                <div className="stat-row">
                  <div className="stat-label">Protected</div>
                  <div className="stat-num protected-num">{card.protected.toLocaleString()}</div>
                </div>
                <div className="stat-row">
                  <div className="stat-label">At Risk</div>
                  <div className="stat-num at-risk-num">{card.atRisk}</div>
                </div>
              </div>
            </div>

            {/* Bottom glowing mini sparkline SVG */}
            <div className="mini-chart">
              <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path
                  d="M0 18 Q 20 5, 40 15 T 80 8 T 100 12 L 100 24 L 0 24 Z"
                  fill="rgba(0, 240, 255, 0.08)"
                />
                <path
                  d="M0 18 Q 20 5, 40 15 T 80 8 T 100 12"
                  fill="none"
                  stroke={card.sparkColor}
                  strokeWidth="1.8"
                />
              </svg>
            </div>
          </div>
        );
      })}

      <style>{`
        .trio-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 4px;
        }

        .trio-card {
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .trio-title {
          font-family: var(--font-tech);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #ffffff;
        }

        .trio-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0 6px 0;
        }

        .trio-icon-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .trio-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(0, 240, 255, 0.06);
          border: 1px solid rgba(0, 240, 255, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-cyan);
          box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
        }

        .protected-tag {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          color: var(--text-secondary);
        }

        .trio-stats-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .stat-row {
          text-align: right;
        }

        .stat-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .protected-num {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
        }

        .at-risk-num {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          font-weight: 700;
          color: #ff0055;
        }

        .mini-chart {
          margin-top: 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 4px;
        }
      `}</style>
    </div>
  );
}

