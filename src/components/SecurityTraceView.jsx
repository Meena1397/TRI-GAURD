import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Search, 
  Filter, 
  Database, 
  FileText, 
  AlertTriangle,
  Check,
  ChevronRight,
  Lock,
  XCircle,
  X,
  Printer,
  Download,
  Eye
} from 'lucide-react';

export default function SecurityTraceView({ currentUser }) {
  const userName = currentUser?.name || 'Mamtha S';

  const [selectedPdf, setSelectedPdf] = useState(null);

  const steps = [
    { id: 'query', label: 'User Query', icon: User, checked: false },
    { id: 'id_check', label: 'Identity Check', icon: ShieldCheck, checked: true },
    { id: 'tenant_check', label: 'Tenant Check', icon: ShieldCheck, checked: true },
    { id: 'perm_check', label: 'Permission Check', icon: ShieldCheck, checked: true },
    { id: 'filter_docs', label: 'Filter Documents', icon: Filter, checked: true },
    { id: 'vector_search', label: 'Vector Search', icon: Database, checked: true },
    { id: 'auth_results', label: 'Authorized Results', icon: FileText, checked: false, isFinal: true }
  ];

  const retrievedDocs = [
    { 
      id: 'doc-1', 
      name: 'Remote_Work_Policy.pdf', 
      tenant: 'Company A', 
      score: '96%', 
      color: '#34d399', 
      pages: 4, 
      size: '2.4 MB',
      content: `CONFIDENTIAL & AUTHORIZED • COMPANY A SECURITY POLICY\n\n1. SCOPE & PURPOSE\nThis document outlines the corporate guidelines for remote and hybrid work environments. All employees of Company A must adhere strictly to these cybersecurity protocols.\n\n2. HARDWARE & NETWORK SECURITY\n- Corporate laptops must have Tri-Guard Endpoint Protection active at all times.\n- Remote connections require WPA3-Enterprise WiFi or encrypted VPN tunnel.\n- Dynamic session timeouts enforce 15-minute lock screen parameters.\n\n3. DATA CLASSIFICATION & TENANT SCOPE\n- Company A data must not be transferred, copied, or stored on non-authorized tenant drives.\n- Access control matrices prevent cross-tenant vector retrieval.`
    },
    { 
      id: 'doc-2', 
      name: 'Employee_Handbook.pdf', 
      tenant: 'Company A', 
      score: '92%', 
      color: '#facc15', 
      pages: 12, 
      size: '3.1 MB',
      content: `COMPANY A EMPLOYEE HANDBOOK 2025\n\nSECTION 4: LEAVE & WORKPLACE GUIDELINES\n- Annual Paid Time Off: 21 Days\n- Sick & Emergency Leave: 12 Days\n- Zero-Trust Authorization Matrix: Level 2 Verified User Access.`
    },
    { 
      id: 'doc-3', 
      name: 'IT_Policies.docx', 
      tenant: 'Company A', 
      score: '87%', 
      color: '#fb923c', 
      pages: 6, 
      size: '1.8 MB',
      content: `IT INFRASTRUCTURE & CREDENTIAL MANAGEMENT\n\n- Passwords must contain a minimum of 16 characters.\n- Multi-Factor Authentication (MFA) required on all gateway authentications.\n- System logs audited continuously by Tri-Guard SOC.`
    }
  ];

  const filteredDocs = [
    { name: 'Finance_Report.pdf', tenant: 'Company B', score: '0%', color: '#ff3377' },
    { name: 'Marketing_Plan.pdf', tenant: 'Company B', score: '0%', color: '#ff3377' }
  ];

  const handleDownloadPdf = (doc) => {
    if (!doc) return;
    const content = doc.content || `CONFIDENTIAL & AUTHORIZED DOCUMENT: ${doc.name}\nTenant: ${doc.tenant || 'Company A'}\nScore: ${doc.score || '100%'}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name || 'Authorized_Document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStepClick = (step) => {
    if (step.id === 'auth_results') {
      setSelectedPdf(retrievedDocs[0]);
    }
  };

  return (
    <div className="sec-trace-container">
      {/* Outer Cyber Card */}
      <div className="sec-trace-card cyber-card">
        
        {/* Header Bar */}
        <div className="trace-header-bar font-sans">
          <div className="trace-header-title">
            <div className="avatar-icon-box">
              <ShieldCheck size={22} className="text-cyan" />
            </div>
            <div>
              <h2 className="trace-title font-tech">RETRIEVAL SECURITY MONITOR</h2>
              <p className="trace-sub font-sans">Track and analyze the document retrieval process with authorization checks.</p>
            </div>
          </div>
        </div>

        {/* Top Pipeline Stepper Flow Bar */}
        <div className="pipeline-stepper-box">
          <div className="pipeline-flow font-tech">
            {steps.map((st, idx) => {
              const IconComponent = st.icon;
              return (
                <React.Fragment key={st.id}>
                  <div 
                    className={`pipeline-step-node ${st.isFinal ? 'final-node-clickable' : ''}`}
                    onClick={() => handleStepClick(st)}
                    title={st.isFinal ? "Click to view Authorized PDF Document" : ""}
                    style={{ cursor: st.isFinal ? 'pointer' : 'default' }}
                  >
                    <div className={`node-circle ${st.isFinal ? 'circle-final' : 'circle-check'}`}>
                      <IconComponent size={16} />
                    </div>
                    <span className="step-label">{st.label} {st.checked && <span className="step-check font-mono">✓</span>}</span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="pipeline-arrow font-mono text-cyan">
                      ➔
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bottom 3 Cards Grid */}
        <div className="trace-bottom-grid">
          
          {/* Card 1: QUERY DETAILS */}
          <div className="trace-card query-details-card">
            <div className="card-inner-header font-tech">
              QUERY DETAILS
            </div>

            <div className="query-box font-sans">
              "What is our company's remote work policy?"
            </div>

            <div className="details-table font-mono">
              <div className="detail-row">
                <span className="d-label">Tenant</span>
                <span className="d-colon">:</span>
                <span className="d-val">Company A</span>
              </div>
              <div className="detail-row">
                <span className="d-label">User</span>
                <span className="d-colon">:</span>
                <span className="d-val">{userName}</span>
              </div>
              <div className="detail-row">
                <span className="d-label">Role</span>
                <span className="d-colon">:</span>
                <span className="d-val">Employee</span>
              </div>
              <div className="detail-row">
                <span className="d-label">Time</span>
                <span className="d-colon">:</span>
                <span className="d-val">14:32</span>
              </div>
            </div>
          </div>

          {/* Card 2: RETRIEVAL STATISTICS */}
          <div className="trace-card stats-card">
            <div className="card-inner-header font-tech">
              RETRIEVAL STATISTICS
            </div>

            <div className="stats-list font-mono">
              <div className="stat-row">
                <span className="s-label">Total Documents Searched</span>
                <span className="s-val">48</span>
              </div>
              <div className="stat-row">
                <span className="s-label">Filtered Out (Not Authorized)</span>
                <span className="s-val text-cyan font-bold">37</span>
              </div>
              <div className="stat-row">
                <span className="s-label">Authorized Documents</span>
                <span className="s-val text-emerald font-bold">11</span>
              </div>
              <div className="stat-row">
                <span className="s-label">Retrieval Time</span>
                <span className="s-val">1.8 sec</span>
              </div>
            </div>

            {/* Radial Gauge Chart */}
            <div className="trace-gauge-wrapper">
              <svg className="trace-gauge-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="t-gauge-bg" />
                <circle 
                  cx="50" cy="50" r="40" 
                  className="t-gauge-val" 
                  strokeDasharray="251.2"
                  strokeDashoffset="193.4"
                />
              </svg>
              <div className="t-gauge-center font-tech">
                <span className="t-percent">23%</span>
                <span className="t-label">Authorized Results</span>
              </div>
            </div>
          </div>

          {/* Card 3: RETRIEVED DOCUMENTS */}
          <div className="trace-card retrieved-docs-card">
            <div className="card-inner-header font-tech">
              <AlertTriangle size={14} className="text-cyan" />
              <span>RETRIEVED DOCUMENTS (Click to open)</span>
            </div>

            <div className="docs-table-wrapper font-mono">
              <div className="table-header-row">
                <span>Document</span>
                <span>Tenant</span>
                <span>Score</span>
                <span>Download</span>
              </div>

              {retrievedDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="doc-row interactive-doc-row"
                  onClick={() => setSelectedPdf(doc)}
                  title="Click to Open PDF Viewer"
                >
                  <div className="doc-name-col">
                    <FileText size={14} style={{ color: doc.color, flexShrink: 0 }} />
                    <span className="doc-name" style={{ color: doc.color }}>{doc.name}</span>
                  </div>
                  <span className="doc-tenant">{doc.tenant}</span>
                  <span className="doc-score" style={{ color: doc.color }}>{doc.score}</span>
                  <button 
                    type="button" 
                    className="doc-download-btn"
                    title={`Download ${doc.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPdf(doc);
                    }}
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* FILTERED DOCUMENTS (Not Authorized) Box */}
            <div className="filtered-alert-box font-mono">
              <div className="filtered-header font-tech text-critical">
                <AlertTriangle size={13} />
                <span>FILTERED DOCUMENTS <span className="font-mono text-muted">(Not Authorized)</span></span>
              </div>

              {filteredDocs.map((fdoc, idx) => (
                <div key={idx} className="filtered-row font-mono">
                  <div className="doc-name-col">
                    <FileText size={14} className="text-critical" />
                    <span className="text-critical">{fdoc.name}</span>
                  </div>
                  <span className="doc-tenant">{fdoc.tenant}</span>
                  <span className="doc-score text-critical">{fdoc.score}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* PDF DOCUMENT VIEWER MODAL */}
      {selectedPdf && (
        <div className="pdf-modal-overlay font-sans" onClick={() => setSelectedPdf(null)}>
          <div className="pdf-modal-card cyber-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Toolbar */}
            <div className="pdf-modal-toolbar">
              <div className="pdf-toolbar-left font-tech">
                <FileText size={20} className="text-cyan" />
                <div>
                  <h3 className="pdf-doc-title">{selectedPdf.name}</h3>
                  <span className="pdf-doc-meta font-mono">Tenant: {selectedPdf.tenant} • {selectedPdf.size} • {selectedPdf.pages} Pages</span>
                </div>
              </div>

              <div className="pdf-toolbar-right">
                <span className="pdf-authorized-badge font-mono font-bold">✓ AUTHORIZED DOCUMENT</span>
                <button type="button" className="pdf-tool-btn" title="Download PDF" onClick={() => handleDownloadPdf(selectedPdf)}>
                  <Download size={16} />
                </button>
                <button type="button" className="pdf-close-btn" onClick={() => setSelectedPdf(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF Render Sheet */}
            <div className="pdf-sheet-wrapper">
              <div className="pdf-page-sheet font-sans">
                <div className="sheet-header-bar font-mono">
                  <div className="sheet-watermark">TRI-GUARD SECURITY VERIFIED • TENANT A SCOPED</div>
                  <div className="sheet-user-stamp">Authorized Access: {userName}</div>
                </div>

                <div className="sheet-body-content font-mono">
                  {selectedPdf.content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="sheet-footer-bar font-mono">
                  <span>Page 1 of {selectedPdf.pages}</span>
                  <span>AES-256 Encrypted Stream</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .sec-trace-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sec-trace-card {
          background: rgba(8, 14, 32, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trace-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 10, 26, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 12px 18px;
        }

        .trace-header-title {
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

        .trace-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #ffffff;
          margin: 0;
        }

        .trace-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
        }

        .pipeline-stepper-box {
          background: rgba(6, 12, 28, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.18);
          border-radius: 8px;
          padding: 14px 16px;
          overflow-x: auto;
        }

        .pipeline-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 800px;
          gap: 6px;
        }

        .pipeline-step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s;
        }

        .final-node-clickable:hover {
          transform: scale(1.08);
        }

        .node-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circle-check {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.5);
          color: #34d399;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }

        .circle-final {
          background: rgba(0, 240, 255, 0.2);
          border: 1px solid var(--color-cyan);
          color: var(--color-cyan);
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
          animation: pulse-ring 2s infinite;
        }

        .step-label {
          font-size: 0.72rem;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .step-check {
          color: #34d399;
        }

        .pipeline-arrow {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .trace-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr;
          gap: 16px;
        }

        @media (max-width: 1200px) {
          .trace-bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        .trace-card {
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

        .query-box {
          background: rgba(0, 240, 255, 0.06);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 0.82rem;
          color: #ffffff;
          font-style: italic;
        }

        .details-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 6px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          font-size: 0.76rem;
        }

        .d-label {
          color: var(--text-muted);
          width: 70px;
        }

        .d-colon {
          color: var(--text-muted);
          margin-right: 10px;
        }

        .d-val {
          color: #ffffff;
          font-weight: 600;
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
          padding-bottom: 6px;
        }

        .s-label {
          color: var(--text-secondary);
        }

        .s-val {
          color: #ffffff;
        }

        .trace-gauge-wrapper {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 6px auto 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trace-gauge-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .t-gauge-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.06);
          stroke-width: 8;
        }

        .t-gauge-val {
          fill: none;
          stroke: var(--color-cyan);
          stroke-width: 8;
          stroke-linecap: round;
          filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.8));
        }

        .t-gauge-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .t-percent {
          font-size: 1.1rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
        }

        .t-label {
          font-size: 0.58rem;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .docs-table-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-header-row {
          display: grid;
          grid-template-columns: 1fr 80px 45px 30px;
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 4px;
        }

        .doc-row {
          display: grid;
          grid-template-columns: 1fr 80px 45px 30px;
          align-items: center;
          font-size: 0.74rem;
          padding: 4px 6px;
          border-radius: 4px;
        }

        .doc-download-btn {
          background: transparent;
          border: none;
          color: var(--color-cyan);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .doc-download-btn:hover {
          background: rgba(0, 240, 255, 0.2);
          color: #ffffff;
          transform: scale(1.15);
        }

        .interactive-doc-row {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .interactive-doc-row:hover {
          background: rgba(0, 240, 255, 0.1);
          box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
        }

        .doc-name-col {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
        }

        .doc-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-tenant {
          color: var(--text-muted);
        }

        .doc-score {
          font-weight: 700;
        }

        .filtered-alert-box {
          background: rgba(255, 0, 85, 0.06);
          border: 1px solid rgba(255, 0, 85, 0.3);
          border-radius: 6px;
          padding: 10px;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filtered-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .filtered-row {
          display: grid;
          grid-template-columns: 1fr 90px 50px;
          align-items: center;
          font-size: 0.72rem;
        }

        /* PDF Modal Styles */
        .pdf-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.88);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .pdf-modal-card {
          width: 100%;
          max-width: 680px;
          height: 80vh;
          background: rgba(8, 14, 32, 0.95);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 40px rgba(0, 240, 255, 0.25);
          overflow: hidden;
        }

        .pdf-modal-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(4, 10, 26, 0.95);
          border-bottom: 1px solid rgba(0, 240, 255, 0.2);
        }

        .pdf-toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pdf-doc-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }

        .pdf-doc-meta {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .pdf-toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pdf-authorized-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.65rem;
        }

        .pdf-tool-btn, .pdf-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
        }

        .pdf-tool-btn:hover, .pdf-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .pdf-sheet-wrapper {
          flex: 1;
          background: #0d1527;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
        }

        .pdf-page-sheet {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          color: #1e293b;
          border-radius: 6px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 480px;
        }

        .sheet-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 700;
        }

        .sheet-watermark {
          color: #0284c7;
        }

        .sheet-body-content {
          margin: 20px 0;
          font-size: 0.82rem;
          line-height: 1.6;
          color: #334155;
          white-space: pre-line;
        }

        .sheet-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .text-cyan { color: var(--color-cyan); }
        .text-critical { color: var(--color-critical); }
        .text-emerald { color: #34d399; }
        .font-bold { font-weight: 700; }
      `}</style>
    </div>
  );
}
