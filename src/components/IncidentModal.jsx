import React, { useState } from 'react';
import { X, ShieldAlert, Terminal, Lock, Server, Cpu, CheckCircle2, Loader2 } from 'lucide-react';

export default function IncidentModal({ incident, onClose, onRemediate }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!incident) return null;

  const handleExecuteRemediation = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsDone(true);
      setTimeout(() => {
        onRemediate(incident.id);
        setIsDone(false);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="cyber-modal">
        <div className="modal-header">
          <div className="modal-title-row">
            <ShieldAlert size={20} className="glow-red" />
            <span className="modal-title">FORENSIC INCIDENT INVESTIGATION</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isExecuting}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="incident-headline-box">
            <span className={`badge-severity badge-${incident.severity.toLowerCase()}`}>
              {incident.severity}
            </span>
            <div className="headline-title">{incident.title}</div>
            <div className="headline-time">Detected at {incident.timestamp} UTC</div>
          </div>

          <div className="info-grid">
            <div className="info-cell">
              <div className="info-label">Affected Asset</div>
              <div className="info-val">{incident.detail}</div>
            </div>
            <div className="info-cell">
              <div className="info-label">Source IP Address</div>
              <div className="info-val ip-val">{incident.ip}</div>
            </div>
            <div className="info-cell">
              <div className="info-label">Attack Vector</div>
              <div className="info-val">{incident.vector}</div>
            </div>
            <div className="info-cell">
              <div className="info-label">Confidence Score</div>
              <div className="info-val score-val">99.4% (AI Verified)</div>
            </div>
          </div>

          <div className="remediation-box">
            <div className="box-header font-tech">
              <Terminal size={14} className="glow-cyan" />
              <span>Automated Tri-Guard AI Mitigation Action</span>
            </div>
            <div className="box-text font-mono">
              {incident.mitigation}
            </div>
          </div>

          {isExecuting && (
            <div className="executing-status-box font-tech">
              <Loader2 size={18} className="animate-spin text-cyan" />
              <span>Isolating socket connections & updating firewall matrix...</span>
            </div>
          )}

          {isDone && (
            <div className="done-status-box font-tech">
              <CheckCircle2 size={18} className="text-emerald" />
              <span>REMEDIATION PROTOCOL EXECUTED SUCCESSFULLY</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cyber-button secondary-btn" onClick={onClose} disabled={isExecuting}>
            Dismiss Alert
          </button>
          <button 
            className={`cyber-button primary-remediate-btn ${isExecuting ? 'btn-loading' : ''}`}
            onClick={handleExecuteRemediation}
            disabled={isExecuting || isDone}
          >
            {isExecuting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Executing Protocol...</span>
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 size={14} className="text-emerald" />
                <span>Remediated!</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>Execute Full Remediation Protocol</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cyber-modal {
          background: #090e20;
          border: 1px solid var(--border-glow);
          box-shadow: 0 0 40px rgba(0, 240, 255, 0.25);
          border-radius: 10px;
          width: 100%;
          max-width: 580px;
          overflow: hidden;
          animation: modalFade 0.2s ease-out;
        }

        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: rgba(0, 240, 255, 0.05);
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-title {
          font-family: var(--font-tech);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #ffffff;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .modal-close-btn:hover { color: #ffffff; }

        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .incident-headline-box {
          background: rgba(255, 0, 85, 0.08);
          border: 1px solid rgba(255, 0, 85, 0.25);
          border-radius: 6px;
          padding: 12px 14px;
        }

        .headline-title {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 6px;
        }

        .headline-time {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .info-cell {
          background: rgba(5, 8, 19, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 10px;
          border-radius: 6px;
        }

        .info-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          font-family: var(--font-tech);
          text-transform: uppercase;
        }

        .info-val {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          margin-top: 4px;
        }

        .ip-val {
          font-family: var(--font-mono);
          color: var(--color-cyan);
        }

        .score-val {
          color: #34d399;
        }

        .remediation-box {
          background: rgba(0, 240, 255, 0.04);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 6px;
          padding: 12px;
        }

        .box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-cyan);
          margin-bottom: 6px;
        }

        .box-text {
          font-size: 0.75rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .executing-status-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--color-cyan);
        }

        .done-status-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: #34d399;
          font-weight: 700;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 20px;
          background: rgba(5, 8, 19, 0.9);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          color: var(--text-secondary);
        }

        .primary-remediate-btn {
          background: linear-gradient(135deg, #0072ff, #00f0ff);
          color: #ffffff;
        }

        .text-cyan { color: var(--color-cyan); }
        .text-emerald { color: #34d399; }
      `}</style>
    </div>
  );
}
