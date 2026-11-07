import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Lock, 
  Database, 
  Volume2, 
  Bell, 
  ShieldCheck, 
  Save,
  CheckCircle2
} from 'lucide-react';

export default function SettingsView() {
  const [tenantBoundary, setTenantBoundary] = useState(true);
  const [crossTenantAudit, setCrossTenantAudit] = useState(true);
  const [groundingThreshold, setGroundingThreshold] = useState(90);
  const [soundFx, setSoundFx] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-container">
      <div className="settings-card cyber-card">
        
        {/* Header */}
        <div className="settings-header-bar">
          <div className="settings-header-title">
            <div className="avatar-icon-box">
              <Settings size={22} className="text-cyan" />
            </div>
            <div>
              <h2 className="settings-title font-tech">SYSTEM & SECURITY SETTINGS</h2>
              <p className="settings-sub font-sans">Configure tenant boundaries, AI grounding parameters, and system telemetry.</p>
            </div>
          </div>

          <button 
            type="button" 
            className="save-settings-btn font-tech"
            onClick={handleSave}
          >
            {saved ? <CheckCircle2 size={16} className="text-emerald" /> : <Save size={16} />}
            <span>{saved ? 'SETTINGS SAVED!' : 'SAVE CONFIGURATION'}</span>
          </button>
        </div>

        {/* Grid of Settings Panels */}
        <div className="settings-grid">
          
          {/* Panel 1: Tenant Isolation Policy */}
          <div className="setting-panel">
            <div className="panel-header font-tech">
              <Lock size={16} className="text-cyan" />
              <span>TENANT ISOLATION POLICY</span>
            </div>

            <div className="setting-option font-sans">
              <div>
                <span className="option-title">Strict Tenant Boundary Enforcement</span>
                <span className="option-desc font-mono">Block any query attempt accessing documents outside assigned tenant ID.</span>
              </div>
              <input 
                type="checkbox" 
                className="cyber-checkbox" 
                checked={tenantBoundary} 
                onChange={(e) => setTenantBoundary(e.target.checked)} 
              />
            </div>

            <div className="setting-option font-sans">
              <div>
                <span className="option-title">Real-Time Cross-Tenant Audit Logging</span>
                <span className="option-desc font-mono">Flag and store blocked cross-tenant access in SOC incident logs.</span>
              </div>
              <input 
                type="checkbox" 
                className="cyber-checkbox" 
                checked={crossTenantAudit} 
                onChange={(e) => setCrossTenantAudit(e.target.checked)} 
              />
            </div>
          </div>

          {/* Panel 2: RAG Grounding & Confidence */}
          <div className="setting-panel">
            <div className="panel-header font-tech">
              <Sliders size={16} className="text-cyan" />
              <span>RAG GROUNDING & THRESHOLDS</span>
            </div>

            <div className="setting-slider font-sans">
              <div className="slider-header">
                <span className="option-title">Minimum Grounding Score ({groundingThreshold}%)</span>
                <span className="option-desc font-mono">Responses below this threshold will be flagged as unverified.</span>
              </div>
              <input 
                type="range" 
                min="70" 
                max="99" 
                value={groundingThreshold} 
                onChange={(e) => setGroundingThreshold(e.target.value)}
                className="cyber-range-input" 
              />
            </div>
          </div>

          {/* Panel 3: Vector Engine Settings */}
          <div className="setting-panel">
            <div className="panel-header font-tech">
              <Database size={16} className="text-cyan" />
              <span>VECTOR DATABASE & ENCRYPTION</span>
            </div>

            <div className="setting-option font-sans">
              <div>
                <span className="option-title">AES-256 Vector Store Encryption</span>
                <span className="option-desc font-mono">All embeddings encrypted at rest per tenant partition key.</span>
              </div>
              <span className="status-badge-active font-mono">ACTIVE</span>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .settings-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .settings-card {
          background: rgba(8, 14, 32, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .settings-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 10, 26, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 12px 18px;
        }

        .settings-header-title {
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

        .settings-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #ffffff;
          margin: 0;
        }

        .settings-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
        }

        .save-settings-btn {
          background: linear-gradient(135deg, #0072ff, #00f0ff);
          border: none;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-panel {
          background: rgba(6, 12, 28, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .panel-header {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
        }

        .setting-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .option-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #e2e8f0;
          display: block;
        }

        .option-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: block;
          margin-top: 2px;
        }

        .cyber-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--color-cyan);
          cursor: pointer;
        }

        .setting-slider {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cyber-range-input {
          width: 100%;
          accent-color: var(--color-cyan);
          cursor: pointer;
        }

        .status-badge-active {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          font-size: 0.7rem;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .text-cyan { color: var(--color-cyan); }
        .text-emerald { color: #34d399; }
      `}</style>
    </div>
  );
}
