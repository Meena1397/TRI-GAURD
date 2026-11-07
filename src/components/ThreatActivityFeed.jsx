import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Zap, ShieldCheck } from 'lucide-react';

export default function ThreatActivityFeed({ feedEvents, onSelectIncident, onRemediateAll }) {
  const [remediating, setRemediating] = useState(false);
  const [remediationSuccess, setRemediationSuccess] = useState(false);

  const getBadgeClass = (severity) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-low';
    }
  };

  const handleFullRemediation = (e) => {
    e.stopPropagation();
    if (remediating || feedEvents.length === 0) return;

    setRemediating(true);
    setTimeout(() => {
      setRemediating(false);
      setRemediationSuccess(true);
      if (onRemediateAll) onRemediateAll();

      setTimeout(() => {
        setRemediationSuccess(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="cyber-card feed-card">
      <div className="cyber-card-header flex-header">
        <div>
          <div className="cyber-title">
            <ShieldAlert size={14} className="glow-red" />
            THREAT ACTIVITY FEED
          </div>
          <div className="cyber-subtitle">Live SOC Telemetry Updates</div>
        </div>

        <button 
          className={`remediate-all-btn font-tech ${remediating ? 'btn-pulse' : ''}`}
          onClick={handleFullRemediation}
          disabled={remediating || feedEvents.length === 0}
          title="Execute Full Remediation Protocol on all active threat vectors"
        >
          <Zap size={13} fill="currentColor" />
          <span>{remediating ? 'EXECUTING PROTOCOL...' : 'EXECUTE FULL REMEDIATION'}</span>
        </button>
      </div>

      {remediationSuccess && (
        <div className="remediation-success-banner font-tech">
          <ShieldCheck size={16} className="text-emerald" />
          <span>FULL REMEDIATION PROTOCOL EXECUTED • ALL SOCKETS SECURED</span>
        </div>
      )}

      <div className="feed-list">
        {feedEvents.length === 0 ? (
          <div className="feed-empty-state font-mono">
            <CheckCircle2 size={24} className="text-emerald" />
            <span>All threat vectors remediated. System operating nominally.</span>
          </div>
        ) : (
          feedEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="feed-item"
              onClick={() => onSelectIncident(evt)}
              title="Click to view forensic analysis"
            >
              <div className="feed-badge-col">
                <span className={`badge-severity ${getBadgeClass(evt.severity)}`}>
                  {evt.severity}
                </span>
              </div>
              
              <div className="feed-content-col">
                <div className="feed-event-title">{evt.title}</div>
                <div className="feed-event-detail">{evt.detail}</div>
              </div>

              <div className="feed-time-col font-mono">
                {evt.timestamp}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .feed-card {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .flex-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .remediate-all-btn {
          background: linear-gradient(135deg, rgba(255, 0, 85, 0.25), rgba(0, 240, 255, 0.2));
          border: 1px solid rgba(255, 0, 85, 0.6);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: 0.5px;
          box-shadow: 0 0 10px rgba(255, 0, 85, 0.3);
          transition: all 0.2s ease;
        }

        .remediate-all-btn:hover:not(:disabled) {
          background: rgba(255, 0, 85, 0.4);
          box-shadow: 0 0 15px rgba(255, 0, 85, 0.6);
          transform: translateY(-1px);
        }

        .remediate-all-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-pulse {
          animation: btnPulseAnim 1s infinite alternate;
        }

        @keyframes btnPulseAnim {
          from { opacity: 0.6; }
          to { opacity: 1; box-shadow: 0 0 18px var(--color-critical); }
        }

        .remediation-success-banner {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 10px;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: bannerSlideIn 0.3s ease-out;
        }

        @keyframes bannerSlideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .feed-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          max-height: 280px;
          padding-right: 4px;
        }

        .feed-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 10px;
          gap: 10px;
          color: var(--text-secondary);
          font-size: 0.76rem;
          text-align: center;
        }

        .text-emerald { color: #34d399; }

        .feed-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: rgba(6, 11, 26, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .feed-item:hover {
          background: rgba(0, 240, 255, 0.08);
          border-color: rgba(0, 240, 255, 0.3);
          transform: translateX(3px);
        }

        .feed-badge-col {
          width: 70px;
          flex-shrink: 0;
        }

        .feed-content-col {
          flex: 1;
          margin: 0 10px;
        }

        .feed-event-title {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .feed-event-detail {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .feed-time-col {
          font-size: 0.65rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
