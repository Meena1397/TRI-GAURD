import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  FileCheck, 
  MessageSquareCode, 
  ShieldAlert, 
  GitCommit, 
  Settings 
} from 'lucide-react';
import TriGuardLogo from './TriGuardLogo';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'KNOWLEDGE_BASE', label: 'Knowledge Base', icon: Database },
    { id: 'DOCUMENT_SECURITY', label: 'Document Security', icon: FileCheck },
    { id: 'RAG_CHAT', label: 'RAG Chat', icon: MessageSquareCode },
    { id: 'ATTACK_LAB', label: 'Attack Lab', icon: ShieldAlert },
    { id: 'SECURITY_TRACE', label: 'Security Trace', icon: GitCommit },
    { id: 'SETTINGS', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <TriGuardLogo size={32} />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="icon-wrapper">
                <IconComponent size={18} />
              </div>
              <span className="link-label">{item.label}</span>
              {isActive && <div className="active-indicator-glow" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-brand">TRI-GUARD</div>
        <div className="footer-tagline">Detect • Protect • Enable</div>
      </div>

      <style>{`
        .sidebar-container {
          width: 240px;
          background: rgba(4, 8, 18, 0.96);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(0, 240, 255, 0.14);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px 12px;
          min-height: 100vh;
          flex-shrink: 0;
          z-index: 50;
        }

        .sidebar-header {
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 240, 255, 0.1);
          margin-bottom: 16px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--text-secondary);
          font-family: var(--font-tech);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          text-align: left;
        }

        .sidebar-link:hover {
          color: #ffffff;
          background: rgba(0, 240, 255, 0.06);
          border-color: rgba(0, 240, 255, 0.15);
        }

        .sidebar-link.active {
          color: #ffffff;
          background: linear-gradient(90deg, rgba(0, 114, 255, 0.4) 0%, rgba(0, 240, 255, 0.15) 100%);
          border: 1px solid var(--color-cyan);
          box-shadow: 0 0 16px rgba(0, 240, 255, 0.25), inset 0 0 10px rgba(0, 240, 255, 0.15);
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-cyan);
        }

        .sidebar-link.active .icon-wrapper {
          color: #ffffff;
          filter: drop-shadow(0 0 6px var(--color-cyan));
        }

        .link-label {
          letter-spacing: 0.5px;
        }

        .active-indicator-glow {
          position: absolute;
          left: 0;
          top: 15%;
          bottom: 15%;
          width: 3px;
          background: var(--color-cyan);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 10px var(--color-cyan);
        }

        .sidebar-footer {
          padding-top: 16px;
          border-top: 1px solid rgba(0, 240, 255, 0.1);
          text-align: center;
        }

        .footer-brand {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--color-cyan);
          letter-spacing: 1.5px;
        }

        .footer-tagline {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--text-muted);
          margin-top: 2px;
          letter-spacing: 0.8px;
        }
      `}</style>
    </aside>
  );
}
