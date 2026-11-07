import React from 'react';
import { 
  ShieldCheck, 
  User, 
  Building, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  FileText, 
  AlertTriangle,
  Activity,
  Check,
  X
} from 'lucide-react';

export default function DocumentSecurityView({ currentUser }) {
  const userName = currentUser?.name || 'Mamtha S';

  const recentLogs = [
    { time: 'May 16, 14:32', title: 'RAG Query - Allowed', status: 'allowed', icon: CheckCircle2, color: '#34d399' },
    { time: 'May 16, 14:28', title: 'Cross-Tenant Attempt - Blocked', status: 'blocked', icon: Lock, color: '#ff3377' },
    { time: 'May 16, 14:21', title: 'Document Access - Allowed', status: 'allowed-alt', icon: FileText, color: '#facc15' },
    { time: 'May 16, 14:15', title: 'Permission Check - Allowed', status: 'allowed-alt', icon: FileText, color: '#facc15' },
    { time: 'May 16, 14:08', title: 'Unauthorized Access - Blocked', status: 'blocked', icon: XCircle, color: '#ff3377' }
  ];

  return (
    <div className="doc-sec-container font-sans">
      {/* Outer Cyber Card Wrapper */}
      <div className="doc-sec-card cyber-card">
        
        {/* Main Header Bar */}
        <div className="doc-header-bar font-sans">
          <div className="doc-header-title">
            <div className="avatar-icon-box">
              <User size={22} className="text-cyan" />
            </div>
            <div>
              <h2 className="doc-title font-tech">AUTHORIZATION CONTROL CENTER</h2>
              <p className="doc-sub font-sans">Manage access, permissions and tenant boundaries for secure retrieval.</p>
            </div>
          </div>

          <div className="doc-user-info font-sans">
            <div className="info-chip">
              <User size={13} className="text-cyan" />
              <span>Current User: <strong>{userName}</strong></span>
            </div>
            <div className="info-chip">
              <Building size={13} className="text-cyan" />
              <span>Tenant: <strong>Company A</strong></span>
            </div>
            <div className="info-chip">
              <Shield size={13} className="text-cyan" />
              <span>Role: <strong>Employee</strong></span>
            </div>
          </div>
        </div>

        {/* Top 3 Cards Grid */}
        <div className="top-cards-grid font-sans">
          
          {/* Card 1: AUTHORIZED Access Granted */}
          <div className="authorized-hero-card">
            <div className="hero-shield-wrapper">
              <div className="shield-glowing-circle">
                <ShieldCheck size={56} className="hero-shield-icon" />
              </div>
            </div>
            <div className="hero-text-block">
              <h3 className="hero-auth-title font-tech">AUTHORIZED</h3>
              <p className="hero-auth-sub font-tech">Access Granted</p>
            </div>
          </div>

          {/* Card 2: AUTHORIZATION STATUS */}
          <div className="status-checklist-card">
            <div className="card-inner-header font-tech">
              AUTHORIZATION STATUS
            </div>
            
            <div className="status-card-body">
              <ul className="auth-checklist font-sans">
                <li>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Identity Verified ({userName})</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Tenant Verified (Company A)</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Role Verified</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Permission Verified</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Search Scope Restricted</span>
                </li>
              </ul>

              {/* Circular Radial Gauge */}
              <div className="gauge-wrapper">
                <svg className="radial-gauge-svg" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    className="gauge-bg" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    className="gauge-val" 
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="gauge-center font-tech">
                  <span className="gauge-percent">100%</span>
                  <span className="gauge-label">ACCESS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: RECENT ACCESS LOG */}
          <div className="recent-log-card">
            <div className="card-inner-header font-tech">
              <AlertTriangle size={14} className="text-cyan" />
              <span>RECENT ACCESS LOG</span>
            </div>

            <div className="logs-list font-mono">
              {recentLogs.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="log-row">
                    <IconComponent size={14} style={{ color: item.color, flexShrink: 0 }} />
                    <span className="log-time">{item.time}</span>
                    <span className="log-title" style={{ color: item.color }}>{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom 3 Cards Grid */}
        <div className="bottom-cards-grid font-sans">
          
          {/* Card 1: PERMITTED ACCESS */}
          <div className="access-list-card permitted-card">
            <div className="card-inner-header font-tech text-emerald">
              <CheckCircle2 size={15} />
              <span>PERMITTED ACCESS</span>
            </div>

            <ul className="access-items-list font-sans">
              <li>
                <div className="item-icon-box check-box"><Check size={12} /></div>
                <span>View Documents</span>
              </li>
              <li>
                <div className="item-icon-box check-box"><Check size={12} /></div>
                <span>RAG Chat</span>
              </li>
              <li>
                <div className="item-icon-box check-box"><Check size={12} /></div>
                <span>Search Scope</span>
              </li>
              <li>
                <div className="item-icon-box check-box"><Check size={12} /></div>
                <span>Company A Scope Only</span>
              </li>
            </ul>
          </div>

          {/* Card 2: DENIED ACCESS */}
          <div className="access-list-card denied-card">
            <div className="card-inner-header font-tech text-critical">
              <XCircle size={15} />
              <span>DENIED ACCESS</span>
            </div>

            <ul className="access-items-list font-sans">
              <li>
                <div className="item-icon-box cross-box"><X size={12} /></div>
                <span>Other Tenant Data</span>
              </li>
              <li>
                <div className="item-icon-box cross-box"><X size={12} /></div>
                <span>Admin Panel</span>
              </li>
              <li>
                <div className="item-icon-box cross-box"><X size={12} /></div>
                <span>System Logs</span>
              </li>
              <li>
                <div className="item-icon-box cross-box"><X size={12} /></div>
                <span>Bulk Download</span>
              </li>
            </ul>
          </div>

          {/* Card 3: ACCESS SUMMARY */}
          <div className="access-summary-card">
            <div className="card-inner-header font-tech">
              <span>ACCESS SUMMARY</span>
            </div>

            <div className="summary-metrics-grid font-mono">
              <div className="metric-box">
                <span className="m-label">Total Requests</span>
                <span className="m-val">248</span>
              </div>
              <div className="metric-box">
                <span className="m-label">Allowed</span>
                <span className="m-val text-cyan">232</span>
              </div>
              <div className="metric-box">
                <span className="m-label">Blocked</span>
                <span className="m-val text-critical">16</span>
              </div>
              <div className="metric-box">
                <span className="m-label">Success Rate</span>
                <span className="m-val text-emerald">93.5%</span>
              </div>
            </div>

            {/* Sparkline Graph */}
            <div className="sparkline-container">
              <svg className="sparkline-svg" viewBox="0 0 300 40">
                <path 
                  d="M0,30 Q30,10 60,25 T120,15 T180,28 T240,12 T300,22" 
                  fill="none" 
                  stroke="#00f0ff" 
                  strokeWidth="2" 
                />
                <path 
                  d="M0,30 Q30,10 60,25 T120,15 T180,28 T240,12 T300,22 L300,40 L0,40 Z" 
                  fill="url(#cyan-grad)" 
                  opacity="0.25" 
                />
                <defs>
                  <linearGradient id="cyan-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .doc-sec-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .doc-sec-card {
          background: rgba(8, 14, 32, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .doc-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 10, 26, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 12px 18px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .doc-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
        }

        .doc-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #ffffff;
          margin: 0;
        }

        .doc-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
        }

        .doc-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 240, 255, 0.05);
          border: 1px solid rgba(0, 240, 255, 0.15);
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .info-chip strong {
          color: #ffffff;
        }

        .top-cards-grid {
          display: grid;
          grid-template-columns: 260px 1fr 340px;
          gap: 16px;
        }

        @media (max-width: 1200px) {
          .top-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .authorized-hero-card {
          background: rgba(6, 16, 32, 0.85);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.12);
        }

        .hero-shield-wrapper {
          position: relative;
        }

        .shield-glowing-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 70%);
          border: 2px solid rgba(16, 185, 129, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.4);
        }

        .hero-shield-icon {
          color: #34d399;
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.8));
        }

        .hero-text-block {
          text-align: center;
        }

        .hero-auth-title {
          font-size: 1.1rem;
          font-weight: 900;
          color: #34d399;
          letter-spacing: 1.5px;
          margin: 0;
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .hero-auth-sub {
          font-size: 0.8rem;
          color: #e2e8f0;
          margin: 2px 0 0 0;
          letter-spacing: 0.5px;
        }

        .status-checklist-card, .recent-log-card, .access-list-card, .access-summary-card {
          background: rgba(6, 12, 28, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-inner-header {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-card-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .auth-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .auth-checklist li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #cbd5e1;
        }

        .text-emerald {
          color: #34d399;
        }

        .gauge-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radial-gauge-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .gauge-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.06);
          stroke-width: 8;
        }

        .gauge-val {
          fill: none;
          stroke: #34d399;
          stroke-width: 8;
          stroke-linecap: round;
          filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.8));
        }

        .gauge-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .gauge-percent {
          font-size: 1.1rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
        }

        .gauge-label {
          font-size: 0.58rem;
          color: var(--text-muted);
          letter-spacing: 1px;
          margin-top: 2px;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .log-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          padding: 4px 6px;
          background: rgba(0, 240, 255, 0.03);
          border-radius: 4px;
        }

        .log-time {
          color: var(--text-muted);
          width: 82px;
          flex-shrink: 0;
        }

        .log-title {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bottom-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr;
          gap: 16px;
        }

        @media (max-width: 1200px) {
          .bottom-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .access-items-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .access-items-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #cbd5e1;
        }

        .item-icon-box {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .check-box {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .cross-box {
          background: rgba(255, 0, 85, 0.15);
          color: #ff3377;
          border: 1px solid rgba(255, 0, 85, 0.4);
        }

        .summary-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .metric-box {
          background: rgba(0, 240, 255, 0.04);
          border: 1px solid rgba(0, 240, 255, 0.12);
          padding: 8px 10px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }

        .m-label {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .m-val {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 2px;
        }

        .text-cyan { color: var(--color-cyan); }
        .text-critical { color: var(--color-critical); }

        .sparkline-container {
          margin-top: 6px;
          height: 35px;
          width: 100%;
        }

        .sparkline-svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
