import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Download, ExternalLink, Loader2 } from 'lucide-react';
import { COMPLIANCE_ITEMS } from '../utils/mockData';
import jsPDF from 'jspdf';

export default function ComplianceModal({ isOpen, onClose }) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportPDF = () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Dark cyber theme background
        doc.setFillColor(5, 8, 19);
        doc.rect(0, 0, 210, 297, 'F');

        // Top accent glowing line
        doc.setFillColor(0, 240, 255);
        doc.rect(0, 0, 210, 4, 'F');

        // Header Title
        doc.setTextColor(0, 240, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('TRI-GUARD CYBERSHIELD', 15, 20);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('GLOBAL SECURITY & AUDIT COMPLIANCE REPORT', 15, 28);

        doc.setFontSize(8);
        doc.setTextColor(139, 155, 180);
        doc.text(`Generated: ${new Date().toUTCString()} | Context: Manetha S (Company A)`, 15, 34);

        // Divider Line
        doc.setDrawColor(0, 240, 255);
        doc.setLineWidth(0.4);
        doc.line(15, 38, 195, 38);

        // Summary Score Box
        doc.setFillColor(11, 20, 44);
        doc.roundedRect(15, 44, 180, 26, 3, 3, 'F');
        doc.setDrawColor(0, 240, 255);
        doc.roundedRect(15, 44, 180, 26, 3, 3, 'S');

        doc.setTextColor(0, 240, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('98.2%', 22, 61);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text('Overall Security Compliance Score', 58, 54);
        doc.setFontSize(8);
        doc.setTextColor(139, 155, 180);
        doc.text('All 4 compliance framework audits passed with active automated evidence collection.', 58, 61);

        // Table Header
        doc.setFillColor(15, 26, 56);
        doc.rect(15, 78, 180, 10, 'F');
        doc.setTextColor(0, 240, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('FRAMEWORK', 20, 84);
        doc.text('COMPLIANCE', 75, 84);
        doc.text('AUDIT CONTROLS', 115, 84);
        doc.text('STATUS', 165, 84);

        // Table Content Rows
        let y = 96;
        COMPLIANCE_ITEMS.forEach((item, index) => {
          doc.setFillColor(index % 2 === 0 ? 8 : 12, 16, 36);
          doc.rect(15, y - 6, 180, 12, 'F');

          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text(item.name, 20, y);

          doc.setTextColor(0, 240, 255);
          doc.text(`${item.score}%`, 75, y);

          doc.setTextColor(200, 210, 225);
          doc.setFont('helvetica', 'normal');
          doc.text(`${item.passedControls} / ${item.totalControls} Passed`, 115, y);

          doc.setTextColor(52, 211, 153);
          doc.setFont('helvetica', 'bold');
          doc.text(`[PASSED] ${item.status}`, 165, y);

          y += 14;
        });

        // Verification Section
        doc.setDrawColor(0, 240, 255);
        doc.line(15, y + 5, 195, y + 5);

        doc.setTextColor(0, 240, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('AUTHENTICATION & AUTHORIZATION ENFORCEMENT SUMMARY', 15, y + 15);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(200, 210, 225);
        doc.text('• Identity & Role Verification: PASSED (Verified via OAuth2 / SAML2 SSO)', 20, y + 23);
        doc.text('• Tenant Isolation Boundary: ENFORCED (Company A Search Scope Partition Active)', 20, y + 29);
        doc.text('• RAG Grounding Verification: ACTIVE (Minimum grounding threshold 90% enforced)', 20, y + 35);
        doc.text('• Vector Store Data Encryption: AES-256 (At rest & in transit encryption validated)', 20, y + 41);

        // Footer Stamp
        doc.setFillColor(0, 240, 255);
        doc.rect(15, y + 52, 180, 0.4, 'F');

        doc.setFontSize(7);
        doc.setTextColor(139, 155, 180);
        doc.text('Tri-Guard AI Security Engine Cryptographic Validation Stamp:', 15, y + 58);
        doc.setTextColor(0, 240, 255);
        doc.setFont('courier', 'normal');
        doc.text('SHA256: 8f9a2b4e7c1d3f5a0e9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f', 15, y + 63);

        // Save PDF file
        doc.save('TriGuard_Compliance_Audit_Report.pdf');
        setDownloadSuccess(true);
      } catch (err) {
        console.error("PDF Export Error:", err);
      } finally {
        setIsExporting(false);
      }
    }, 600);
  };

  return (
    <div className="modal-backdrop">
      <div className="cyber-modal compliance-modal-box">
        <div className="modal-header">
          <div className="modal-title-row">
            <ShieldCheck size={20} className="glow-cyan" />
            <span className="modal-title font-tech">TRI-GUARD GLOBAL COMPLIANCE REPORT</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="summary-banner">
            <div className="banner-score">98.2%</div>
            <div className="banner-text">
              <div className="banner-title font-tech">Overall Security Compliance Score</div>
              <div className="banner-sub font-sans">All 4 framework audits passed with active automated evidence collection.</div>
            </div>
          </div>

          <div className="compliance-table font-sans">
            <div className="table-row table-head font-tech">
              <div>Framework</div>
              <div>Compliance</div>
              <div>Audit Controls</div>
              <div>Status</div>
            </div>
            {COMPLIANCE_ITEMS.map((item) => (
              <div key={item.id} className="table-row">
                <div className="framework-name font-tech">{item.name}</div>
                <div className="score-val font-mono">{item.score}%</div>
                <div className="controls-val font-mono">{item.passedControls} / {item.totalControls} Passed</div>
                <div className="status-val font-tech">
                  <CheckCircle2 size={14} className="green-icon" /> {item.status}
                </div>
              </div>
            ))}
          </div>

          {downloadSuccess && (
            <div className="pdf-success-banner font-tech">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>TriGuard_Compliance_Audit_Report.pdf generated and downloaded successfully!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cyber-button secondary-btn font-tech" onClick={onClose}>
            Close
          </button>
          <button 
            className="cyber-button primary-remediate-btn font-tech" 
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export Audit PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .compliance-modal-box {
          max-width: 640px !important;
        }

        .summary-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.25);
          padding: 14px;
          border-radius: 8px;
        }

        .banner-score {
          font-family: var(--font-mono);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--color-cyan);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
        }

        .banner-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
        }

        .banner-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .compliance-table {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(5, 8, 19, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          overflow: hidden;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.5fr 1fr;
          padding: 10px 14px;
          font-size: 0.78rem;
          align-items: center;
        }

        .table-head {
          background: rgba(0, 240, 255, 0.06);
          font-weight: 700;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .framework-name {
          font-weight: 600;
          color: #ffffff;
        }

        .score-val {
          color: var(--color-cyan);
        }

        .controls-val {
          color: var(--text-secondary);
        }

        .status-val {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #34d399;
          font-weight: 600;
        }

        .green-icon { color: #34d399; }

        .pdf-success-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          animation: bannerSlideIn 0.3s ease-out;
        }

        @keyframes bannerSlideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .text-emerald { color: #34d399; }
      `}</style>
    </div>
  );
}
