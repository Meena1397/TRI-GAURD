import React from 'react';
import { ShieldCheck, Award, Lock, Activity, ChevronRight } from 'lucide-react';
import { COMPLIANCE_ITEMS } from '../utils/mockData';

export default function ComplianceStatus({ onOpenComplianceModal }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={20} />;
      case 'Award': return <Award size={20} />;
      case 'Lock': return <Lock size={20} />;
      case 'Activity': return <Activity size={20} />;
      default: return <ShieldCheck size={20} />;
    }
  };

  return (
    <div className="cyber-card compliance-card">
      <div className="cyber-card-header">
        <div>
          <div className="cyber-title">COMPLIANCE STATUS</div>
          <div className="cyber-subtitle">Security Compliance Overview</div>
        </div>
      </div>

      <div className="compliance-grid">
        {COMPLIANCE_ITEMS.map((item) => (
          <div key={item.id} className="compliance-badge-item">
            <div className="ring-gauge-wrapper">
              <svg width="48" height="48" viewBox="0 0 48 48">
                {/* Outer Ring Background Track */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="rgba(0, 240, 255, 0.15)"
                  strokeWidth="2.5"
                />
                {/* Glowing Cyan Gauge Arc */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  strokeDasharray={`${(item.score / 100) * 125.6} 125.6`}
                  strokeDashoffset="0"
                  transform="rotate(-90 24 24)"
                  style={{ filter: 'drop-shadow(0 0 5px #00f0ff)' }}
                />
              </svg>
              <div className="ring-icon-center">
                {getIcon(item.icon)}
              </div>
            </div>

            <div className="badge-name">{item.name}</div>
            <div className="badge-status">{item.status}</div>
          </div>
        ))}
      </div>

      <button className="cyber-button full-width-btn" onClick={onOpenComplianceModal}>
        View Compliance Report
      </button>

      <style>{`
        .compliance-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .compliance-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin: 10px 0 14px 0;
        }

        .compliance-badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ring-gauge-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .ring-icon-center {
          position: absolute;
          color: var(--color-cyan);
          filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.8));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-name {
          font-family: var(--font-tech);
          font-size: 0.68rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .badge-status {
          font-size: 0.6rem;
          color: var(--color-low);
          margin-top: 2px;
          font-weight: 500;
        }

        .full-width-btn {
          width: 100%;
          padding: 8px 12px;
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 6px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

