import React, { useState, useRef } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Unlock,
  XCircle, 
  Search, 
  Upload, 
  Eye, 
  MoreVertical, 
  Shield, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  FilePlus,
  Download,
  Trash2,
  Check,
  ShieldAlert
} from 'lucide-react';
import { scanDocument } from '../utils/securityPipeline';

export default function KnowledgeBaseView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [documentsData, setDocumentsData] = useState([
    { id: 1, name: 'HR_Policy.pdf', tenant: 'Company A', type: 'PDF', risk: 12, status: 'APPROVED', date: 'May 16, 2025 14:32', content: 'COMPANY A HR POLICY\nScope: Employee guidelines, leave policies, hybrid work protocols.' },
    { id: 2, name: 'Finance_Guide.docx', tenant: 'Company A', type: 'DOCX', risk: 18, status: 'APPROVED', date: 'May 16, 2025 12:18', content: 'FINANCE & REIMBURSEMENT GUIDELINES\nCovers corporate cards, travel expense reporting, and auditing procedures.' },
    { id: 3, name: 'Employee_Handbook.pdf', tenant: 'Company A', type: 'PDF', risk: 46, status: 'REVIEW', date: 'May 16, 2025 11:03', content: 'EMPLOYEE HANDBOOK 2025\nGeneral code of conduct, performance appraisals, and security policies.' },
    { id: 4, name: 'IT_Policy.txt', tenant: 'Company B', type: 'TXT', risk: 22, status: 'APPROVED', date: 'May 16, 2025 10:47', content: 'IT INFRASTRUCTURE POLICY\nCredential hygiene, 16-char password enforcement, MFA verification.' },
    { id: 5, name: 'Contract_v3.pdf', tenant: 'Company B', type: 'PDF', risk: 67, status: 'REVIEW', date: 'May 16, 2025 09:21', content: 'VENDOR AGREEMENT V3\nThird-party vendor contracts, SLA guarantees, and compliance schedules.' },
    { id: 6, name: 'Marketing_Plan.pdf', tenant: 'Company B', type: 'PDF', risk: 91, status: 'QUARANTINED', date: 'May 16, 2025 08:56', content: 'QUARANTINED DOCUMENT\nFlagged due to potential cross-tenant vector leakage risk.' }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTenantForUpload, setSelectedTenantForUpload] = useState('Company A');
  const [dragActive, setDragActive] = useState(false);

  // Action Modals State
  const [viewDocDetails, setViewDocDetails] = useState(null);
  const [lockPermissionsDoc, setLockPermissionsDoc] = useState(null);
  const [moreActionsDoc, setMoreActionsDoc] = useState(null);

  const handleDownloadDoc = (doc) => {
    if (!doc) return;
    const textContent = doc.content || `CONFIDENTIAL & AUTHORIZED DOCUMENT: ${doc.name}\nTenant: ${doc.tenant}\nType: ${doc.type}\nStatus: ${doc.status}\nUploaded On: ${doc.date}`;
    const blob = new Blob([textContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateDocStatus = (docId, newStatus) => {
    setDocumentsData(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
    if (viewDocDetails && viewDocDetails.id === docId) {
      setViewDocDetails(prev => ({ ...prev, status: newStatus }));
    }
    if (lockPermissionsDoc && lockPermissionsDoc.id === docId) {
      setLockPermissionsDoc(prev => ({ ...prev, status: newStatus }));
    }
    if (moreActionsDoc && moreActionsDoc.id === docId) {
      setMoreActionsDoc(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteDoc = (docId) => {
    setDocumentsData(prev => prev.filter(d => d.id !== docId));
    setMoreActionsDoc(null);
  };

  const fileInputRef = useRef(null);

  const approvedCount = documentsData.filter(d => d.status === 'APPROVED').length + 138;
  const reviewCount = documentsData.filter(d => d.status === 'REVIEW').length + 16;
  const quarantinedCount = documentsData.filter(d => d.status === 'QUARANTINED').length + 11;

  const tenantACount = documentsData.filter(d => d.tenant === 'Company A').length + 83;
  const tenantBCount = documentsData.filter(d => d.tenant === 'Company B').length + 53;

  const filteredDocs = documentsData.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenant = selectedTenant === 'All' || doc.tenant === selectedTenant;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    return matchesSearch && matchesTenant && matchesStatus;
  });

  const processUploadedFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setUploadModalOpen(false);

    try {
      const scanResults = await Promise.all(
        Array.from(fileList).map(async (file, idx) => {
          const scanRes = await scanDocument(file, {
            tenantInfo: { uploader: 'Mamtha S', tenantId: selectedTenantForUpload, source: 'Upload' }
          });
          const ext = (file.name.split('.').pop() || 'PDF').toUpperCase();
          const now = new Date();
          const timeStr = `May 16, 2025 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

          let statusVal = 'APPROVED';
          if (scanRes.decision === 'QUARANTINE') {
            statusVal = 'QUARANTINED';
          } else if (scanRes.decision === 'REVIEW') {
            statusVal = 'REVIEW';
          }

          const inVectorDb = scanRes.decision === 'SAFE';

          return {
            id: Date.now() + idx,
            name: file.name,
            tenant: selectedTenantForUpload,
            type: ext,
            risk: scanRes.riskScore,
            status: statusVal,
            date: timeStr,
            inVectorDb,
            scanRes,
            content: `DOCUMENT: ${file.name}\nSECURITY STATUS: ${statusVal} (Risk Score: ${scanRes.riskScore}/100)\nVECTOR DB INDEXED: ${inVectorDb ? 'YES (Entered Vector DB)' : 'NO (Blocked from Vector DB)'}\nREASON: ${scanRes.reason}`
          };
        })
      );

      setDocumentsData(prev => [...scanResults, ...prev]);
      setIsUploading(false);

      const quarantinedCnt = scanResults.filter(d => d.status === 'QUARANTINED').length;
      const reviewCnt = scanResults.filter(d => d.status === 'REVIEW').length;
      const approvedCnt = scanResults.filter(d => d.status === 'APPROVED').length;

      setUploadSuccessMsg(
        `✓ Scanned ${scanResults.length} document(s): ${approvedCnt} Approved (Indexed in Vector DB), ${reviewCnt} Review Needed, ${quarantinedCnt} Quarantined (Blocked from Vector DB)!`
      );

      setTimeout(() => {
        setUploadSuccessMsg('');
      }, 5000);
    } catch (err) {
      setIsUploading(false);
      console.error('Error scanning uploaded document:', err);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="kb-container font-sans">
      {/* Hidden Native File Input */}
      <input 
        id="kb-file-upload-input"
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        multiple
      />

      {/* Outer Cyber Card */}
      <div className="kb-card cyber-card">
        
        {/* Header Bar */}
        <div className="kb-header-bar">
          <div className="kb-header-title">
            <div className="avatar-icon-box">
              <FileText size={22} className="text-cyan" />
            </div>
            <div>
              <h2 className="kb-title font-tech">KNOWLEDGE BASE</h2>
              <p className="kb-sub font-sans">Manage approved documents and their security status.</p>
            </div>
          </div>
        </div>

        {/* Top 3 Stat Cards Row */}
        <div className="kb-stats-row font-tech">
          {/* Card 1: Approved */}
          <div 
            className={`kb-stat-card stat-approved ${selectedStatus === 'APPROVED' ? 'active-filter' : ''}`}
            onClick={() => setSelectedStatus(selectedStatus === 'APPROVED' ? 'All' : 'APPROVED')}
          >
            <div className="stat-icon-wrapper circle-approved">
              <ShieldCheck size={20} className="text-emerald" />
            </div>
            <div>
              <span className="stat-label">Approved</span>
              <span className="stat-num text-emerald">{approvedCount}</span>
            </div>
          </div>

          {/* Card 2: Pending Review */}
          <div 
            className={`kb-stat-card stat-review ${selectedStatus === 'REVIEW' ? 'active-filter' : ''}`}
            onClick={() => setSelectedStatus(selectedStatus === 'REVIEW' ? 'All' : 'REVIEW')}
          >
            <div className="stat-icon-wrapper circle-review">
              <Lock size={20} className="text-warning" />
            </div>
            <div>
              <span className="stat-label">Pending Review</span>
              <span className="stat-num text-warning">{reviewCount}</span>
            </div>
          </div>

          {/* Card 3: Quarantined */}
          <div 
            className={`kb-stat-card stat-quarantined ${selectedStatus === 'QUARANTINED' ? 'active-filter' : ''}`}
            onClick={() => setSelectedStatus(selectedStatus === 'QUARANTINED' ? 'All' : 'QUARANTINED')}
          >
            <div className="stat-icon-wrapper circle-quarantined">
              <XCircle size={20} className="text-critical" />
            </div>
            <div>
              <span className="stat-label">Quarantined</span>
              <span className="stat-num text-critical">{quarantinedCount}</span>
            </div>
          </div>
        </div>

        {/* Upload Scanning Status Banner */}
        {isUploading && (
          <div className="kb-scanning-banner font-tech">
            <Loader2 size={18} className="animate-spin text-cyan" />
            <span>Scanning document vector embeddings & checking zero-trust tenant boundaries...</span>
          </div>
        )}

        {/* Upload Success Banner */}
        {uploadSuccessMsg && (
          <div className="kb-success-banner font-tech">
            <CheckCircle2 size={18} className="text-emerald" />
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* Controls Bar (Search + Tenant Select + Upload Button) */}
        <div className="kb-controls-bar">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon text-muted" />
            <input 
              type="text" 
              className="kb-search-input font-sans"
              placeholder="Search documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="controls-right font-sans">
            <select 
              className="tenant-select font-mono"
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
            >
              <option value="All">All Tenants</option>
              <option value="Company A">Company A</option>
              <option value="Company B">Company B</option>
            </select>

            <button 
              type="button" 
              className="upload-btn font-tech"
              onClick={() => setUploadModalOpen(true)}
              disabled={isUploading}
            >
              <Upload size={15} />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Main Body Grid: Table + Right Sidebar Filters */}
        <div className="kb-body-grid">
          
          {/* Main Table */}
          <div className="kb-table-container">
            <table className="kb-table font-mono">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Tenant</th>
                  <th>Type</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Uploaded On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc, index) => {
                  let statusClass = 'pill-approved';
                  if (doc.status === 'REVIEW') statusClass = 'pill-review';
                  if (doc.status === 'QUARANTINED') statusClass = 'pill-quarantined';

                  let riskClass = 'risk-low';
                  if (doc.risk > 30) riskClass = 'risk-mid';
                  if (doc.risk > 80) riskClass = 'risk-high';

                  return (
                    <tr key={doc.id}>
                      <td className="col-id">{index + 1}</td>
                      <td className="col-name font-tech">
                        <FileText size={15} className="text-cyan" />
                        <span>{doc.name}</span>
                      </td>
                      <td className="col-tenant">{doc.tenant}</td>
                      <td className="col-type">{doc.type}</td>
                      <td>
                        <span className={`risk-tag ${riskClass}`}>{doc.risk}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${statusClass}`}>{doc.status}</span>
                      </td>
                      <td className="col-date">{doc.date}</td>
                      <td className="col-actions">
                        <button 
                          className="act-btn" 
                          title="View Details"
                          onClick={() => setViewDocDetails(doc)}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="act-btn" 
                          title="Permissions & Lock"
                          onClick={() => setLockPermissionsDoc(doc)}
                        >
                          <Lock size={14} />
                        </button>
                        <button 
                          className="act-btn" 
                          title="More Actions"
                          onClick={() => setMoreActionsDoc(doc)}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right Sidebar Filters */}
          <div className="kb-filters-sidebar font-sans">
            
            {/* TENANT FILTER Card */}
            <div className="filter-card">
              <div className="filter-card-header font-tech">
                TENANT FILTER
              </div>

              <div className="filter-card-body">
                <select 
                  className="sidebar-select font-mono"
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                >
                  <option value="All">All Tenants</option>
                  <option value="Company A">Company A</option>
                  <option value="Company B">Company B</option>
                </select>

                <div className="filter-counts font-mono">
                  <div 
                    className={`count-row ${selectedTenant === 'Company A' ? 'selected' : ''}`}
                    onClick={() => setSelectedTenant(selectedTenant === 'Company A' ? 'All' : 'Company A')}
                  >
                    <span className="c-name">Company A</span>
                    <span className="c-val text-cyan">{tenantACount}</span>
                  </div>
                  <div 
                    className={`count-row ${selectedTenant === 'Company B' ? 'selected' : ''}`}
                    onClick={() => setSelectedTenant(selectedTenant === 'Company B' ? 'All' : 'Company B')}
                  >
                    <span className="c-name">Company B</span>
                    <span className="c-val text-cyan">{tenantBCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DOCUMENT STATUS Card */}
            <div className="filter-card">
              <div className="filter-card-header font-tech">
                DOCUMENT STATUS
              </div>

              <div className="filter-status-list font-mono">
                <div 
                  className={`status-count-row ${selectedStatus === 'APPROVED' ? 'selected' : ''}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'APPROVED' ? 'All' : 'APPROVED')}
                >
                  <div className="status-label-dot">
                    <span className="s-dot dot-approved"></span>
                    <span>Approved</span>
                  </div>
                  <span className="s-count text-emerald">{approvedCount}</span>
                </div>

                <div 
                  className={`status-count-row ${selectedStatus === 'REVIEW' ? 'selected' : ''}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'REVIEW' ? 'All' : 'REVIEW')}
                >
                  <div className="status-label-dot">
                    <span className="s-dot dot-review"></span>
                    <span>Pending Review</span>
                  </div>
                  <span className="s-count text-warning">{reviewCount}</span>
                </div>

                <div 
                  className={`status-count-row ${selectedStatus === 'QUARANTINED' ? 'selected' : ''}`}
                  onClick={() => setSelectedStatus(selectedStatus === 'QUARANTINED' ? 'All' : 'QUARANTINED')}
                >
                  <div className="status-label-dot">
                    <span className="s-dot dot-quarantined"></span>
                    <span>Quarantined</span>
                  </div>
                  <span className="s-count text-critical">{quarantinedCount}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Cyber Upload Modal */}
      {uploadModalOpen && (
        <div className="modal-backdrop">
          <div className="cyber-modal upload-modal font-sans">
            <div className="modal-header">
              <div className="modal-title-row font-tech">
                <Upload size={18} className="text-cyan" />
                <span>UPLOAD DOCUMENTS TO KNOWLEDGE BASE</span>
              </div>
              <button className="modal-close-btn" onClick={() => setUploadModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="tenant-select-row">
                <label className="font-tech text-cyan">Select Destination Tenant Scope:</label>
                <select 
                  className="cyber-select font-mono"
                  value={selectedTenantForUpload}
                  onChange={(e) => setSelectedTenantForUpload(e.target.value)}
                >
                  <option value="Company A">Company A (Your Tenant)</option>
                  <option value="Company B">Company B (Isolated Scope)</option>
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div 
                className={`dropzone-box ${dragActive ? 'dropzone-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <FilePlus size={36} className="text-cyan dropzone-icon" />
                <div className="dropzone-text font-tech">
                  Drag & Drop Document Files Here or <span className="underline">Browse Files</span>
                </div>
                <div className="dropzone-sub font-mono">
                  Supported formats: PDF, DOCX, TXT, CSV, JSON (Auto AI Malware & Partition Scan)
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cyber-button secondary-btn font-tech" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </button>
              <button 
                className="cyber-button primary-btn font-tech" 
                onClick={triggerFileInput}
              >
                <Upload size={14} />
                <span>Select & Upload Files</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW DETAILS (Eye Icon) */}
      {viewDocDetails && (
        <div className="modal-backdrop font-sans" onClick={() => setViewDocDetails(null)}>
          <div className="cyber-modal kb-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header font-tech">
              <div className="modal-title-row">
                <Eye size={18} className="text-cyan" />
                <span>DOCUMENT SECURITY DETAILS</span>
              </div>
              <button className="modal-close-btn" onClick={() => setViewDocDetails(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body font-mono">
              <div className="doc-detail-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">File Name:</span>
                  <span className="meta-val text-cyan font-bold">{viewDocDetails.name}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tenant Scope:</span>
                  <span className="meta-val">{viewDocDetails.tenant}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Document Type:</span>
                  <span className="meta-val">{viewDocDetails.type}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Risk Score:</span>
                  <span className={`meta-val font-bold ${viewDocDetails.risk > 60 ? 'text-critical' : viewDocDetails.risk > 30 ? 'text-warning' : 'text-emerald'}`}>
                    {viewDocDetails.risk}/100
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status:</span>
                  <span className={`meta-val font-bold ${viewDocDetails.status === 'QUARANTINED' ? 'text-critical' : viewDocDetails.status === 'REVIEW' ? 'text-warning' : 'text-emerald'}`}>
                    {viewDocDetails.status}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Vector DB Status:</span>
                  <span className={`meta-val font-bold ${viewDocDetails.status === 'APPROVED' ? 'text-emerald' : 'text-critical'}`}>
                    {viewDocDetails.status === 'APPROVED' ? 'INDEXED IN VECTOR DB' : 'BLOCKED FROM VECTOR DB'}
                  </span>
                </div>
              </div>

              {viewDocDetails.scanRes && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '6px' }}>
                  <div className="font-tech text-cyan" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>5 REAL DETECTORS SCAN RESULTS</div>
                  <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>1. Instruction Pattern: <strong>{viewDocDetails.scanRes.detectors.instruction.score}/100</strong> ({viewDocDetails.scanRes.detectors.instruction.detected ? 'Threat Detected' : 'Clear'})</div>
                    <div>2. AI Classification: <strong>{viewDocDetails.scanRes.detectors.ai.score}/100</strong> ({viewDocDetails.scanRes.detectors.ai.detected ? 'Threat Detected' : 'Clear'})</div>
                    <div>3. Context Anomaly: <strong>{viewDocDetails.scanRes.detectors.context.score}/100</strong> ({viewDocDetails.scanRes.detectors.context.detected ? 'Anomaly Detected' : 'Clear'})</div>
                    <div>4. Hidden Content: <strong>{viewDocDetails.scanRes.detectors.hidden.score}/100</strong> ({viewDocDetails.scanRes.detectors.hidden.detected ? 'Hidden Payloads Found' : 'Clear'})</div>
                    <div>5. Provenance: <strong>{viewDocDetails.scanRes.detectors.provenance.score}/100</strong> ({viewDocDetails.scanRes.detectors.provenance.detected ? 'Suspicious Origin' : 'Clear'})</div>
                  </div>
                  {viewDocDetails.scanRes.reason && (
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: viewDocDetails.status === 'APPROVED' ? '#34d399' : '#ff3377' }}>
                      <strong>Evidence & Reason:</strong> {viewDocDetails.scanRes.reason}
                    </div>
                  )}
                </div>
              )}

              <div className="doc-content-box" style={{ marginTop: '12px' }}>
                <div className="content-box-title font-tech text-cyan">DOCUMENT CONTENT PREVIEW & VECTOR EMBEDDINGS</div>
                <div className="content-text-body font-mono">
                  {viewDocDetails.content || `CONFIDENTIAL DOCUMENT: ${viewDocDetails.name}\nZero-Trust vector space indexed under ${viewDocDetails.tenant}. All access requests authenticated.`}
                </div>
              </div>
            </div>

            <div className="modal-footer font-tech">
              <button className="cyber-button secondary-btn" onClick={() => setViewDocDetails(null)}>
                Close
              </button>
              <button 
                className="cyber-button primary-btn"
                onClick={() => handleDownloadDoc(viewDocDetails)}
              >
                <Download size={14} />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LOCK & PERMISSIONS (Lock Icon) */}
      {lockPermissionsDoc && (
        <div className="modal-backdrop font-sans" onClick={() => setLockPermissionsDoc(null)}>
          <div className="cyber-modal kb-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header font-tech">
              <div className="modal-title-row">
                <Lock size={18} className="text-cyan" />
                <span>PERMISSIONS & LOCK CONTROL</span>
              </div>
              <button className="modal-close-btn" onClick={() => setLockPermissionsDoc(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body font-mono">
              <p className="lock-sub-text">
                Manage access levels, tenant partition bounds, and quarantine state for <strong>{lockPermissionsDoc.name}</strong>.
              </p>

              <div className="lock-status-row">
                <span className="l-label">Current Security Status:</span>
                <div className="status-button-group font-tech">
                  <button 
                    className={`status-opt-btn ${lockPermissionsDoc.status === 'APPROVED' ? 'opt-approved' : ''}`}
                    onClick={() => handleUpdateDocStatus(lockPermissionsDoc.id, 'APPROVED')}
                  >
                    <Check size={12} /> APPROVED
                  </button>
                  <button 
                    className={`status-opt-btn ${lockPermissionsDoc.status === 'REVIEW' ? 'opt-review' : ''}`}
                    onClick={() => handleUpdateDocStatus(lockPermissionsDoc.id, 'REVIEW')}
                  >
                    <AlertTriangle size={12} /> REVIEW
                  </button>
                  <button 
                    className={`status-opt-btn ${lockPermissionsDoc.status === 'QUARANTINED' ? 'opt-quarantined' : ''}`}
                    onClick={() => handleUpdateDocStatus(lockPermissionsDoc.id, 'QUARANTINED')}
                  >
                    <Lock size={12} /> QUARANTINED
                  </button>
                </div>
              </div>

              <div className="acl-options-list font-sans">
                <div className="acl-item">
                  <div>
                    <div className="acl-title font-tech">Tenant Boundary Enforcement</div>
                    <div className="acl-sub font-mono">Restricts retrieval vector space strictly to {lockPermissionsDoc.tenant}</div>
                  </div>
                  <span className="acl-badge text-emerald">ACTIVE</span>
                </div>
                <div className="acl-item">
                  <div>
                    <div className="acl-title font-tech">AES-256 Encryption at Rest</div>
                    <div className="acl-sub font-mono">Document chunks encrypted in vector datastore</div>
                  </div>
                  <span className="acl-badge text-emerald">ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="modal-footer font-tech">
              <button className="cyber-button secondary-btn" onClick={() => setLockPermissionsDoc(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MORE ACTIONS (Three Dots Icon) */}
      {moreActionsDoc && (
        <div className="modal-backdrop font-sans" onClick={() => setMoreActionsDoc(null)}>
          <div className="cyber-modal kb-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header font-tech">
              <div className="modal-title-row">
                <MoreVertical size={18} className="text-cyan" />
                <span>ACTIONS: {moreActionsDoc.name}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setMoreActionsDoc(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body font-sans">
              <div className="more-actions-menu font-mono">
                <button 
                  className="action-menu-item"
                  onClick={() => {
                    handleDownloadDoc(moreActionsDoc);
                    setMoreActionsDoc(null);
                  }}
                >
                  <Download size={16} className="text-cyan" />
                  <div>
                    <div className="menu-title font-tech">Download File</div>
                    <div className="menu-sub">Save local copy of file</div>
                  </div>
                </button>

                <button 
                  className="action-menu-item"
                  onClick={() => handleUpdateDocStatus(moreActionsDoc.id, 'APPROVED')}
                >
                  <ShieldCheck size={16} className="text-emerald" />
                  <div>
                    <div className="menu-title font-tech">Approve Document</div>
                    <div className="menu-sub">Set status to Approved for RAG indexing</div>
                  </div>
                </button>

                <button 
                  className="action-menu-item"
                  onClick={() => handleUpdateDocStatus(moreActionsDoc.id, 'QUARANTINED')}
                >
                  <Lock size={16} className="text-critical" />
                  <div>
                    <div className="menu-title font-tech">Quarantine Document</div>
                    <div className="menu-sub">Lock document and block retrieval</div>
                  </div>
                </button>

                <button 
                  className="action-menu-item danger-item"
                  onClick={() => handleDeleteDoc(moreActionsDoc.id)}
                >
                  <Trash2 size={16} className="text-critical" />
                  <div>
                    <div className="menu-title font-tech text-critical">Delete Document</div>
                    <div className="menu-sub">Remove permanently from Knowledge Base</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .kb-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .kb-card {
          background: rgba(8, 14, 32, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .kb-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 10, 26, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 12px 18px;
        }

        .kb-header-title {
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

        .kb-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #ffffff;
          margin: 0;
        }

        .kb-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
        }

        .kb-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .kb-stats-row {
            grid-template-columns: 1fr;
          }
        }

        .kb-stat-card {
          background: rgba(6, 12, 28, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .kb-stat-card:hover, .active-filter {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 240, 255, 0.15);
        }

        .stat-approved { border-left: 3px solid #34d399; }
        .stat-review { border-left: 3px solid #facc15; }
        .stat-quarantined { border-left: 3px solid #ff3377; }

        .stat-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circle-approved { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); }
        .circle-review { background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); }
        .circle-quarantined { background: rgba(255, 0, 85, 0.15); border: 1px solid rgba(255, 0, 85, 0.4); }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
          display: block;
        }

        .stat-num {
          font-size: 1.2rem;
          font-weight: 800;
          display: block;
        }

        .kb-scanning-banner {
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

        .kb-success-banner {
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
          animation: bannerSlideIn 0.3s ease-out;
        }

        @keyframes bannerSlideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .kb-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
        }

        .kb-search-input {
          width: 100%;
          background: rgba(6, 12, 28, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 6px;
          padding: 8px 12px 8px 36px;
          color: #ffffff;
          font-size: 0.85rem;
          outline: none;
        }

        .kb-search-input:focus {
          border-color: var(--color-cyan);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tenant-select, .sidebar-select {
          background: rgba(6, 12, 28, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.2);
          color: var(--color-cyan);
          font-size: 0.8rem;
          padding: 8px 12px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }

        .upload-btn {
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

        .upload-btn:hover {
          box-shadow: 0 0 18px rgba(0, 240, 255, 0.5);
        }

        .kb-body-grid {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 16px;
        }

        @media (max-width: 1100px) {
          .kb-body-grid {
            grid-template-columns: 1fr;
          }
        }

        .kb-table-container {
          background: rgba(6, 12, 28, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          overflow-x: auto;
        }

        .kb-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.76rem;
        }

        .kb-table th {
          background: rgba(0, 240, 255, 0.06);
          color: var(--text-muted);
          padding: 10px 12px;
          font-weight: 700;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
        }

        .kb-table td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
        }

        .kb-table tr:hover {
          background: rgba(0, 240, 255, 0.04);
        }

        .col-id { color: var(--text-muted); }

        .col-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          font-weight: 700;
        }

        .col-tenant { color: var(--color-cyan); }
        .col-type { color: var(--text-muted); }
        .col-date { color: var(--text-muted); font-size: 0.72rem; }

        .risk-tag {
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .risk-low { color: #34d399; background: rgba(16, 185, 129, 0.1); }
        .risk-mid { color: #facc15; background: rgba(234, 179, 8, 0.1); }
        .risk-high { color: #ff3377; background: rgba(255, 0, 85, 0.1); }

        .status-pill {
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.68rem;
        }

        .pill-approved {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .pill-review {
          background: rgba(234, 179, 8, 0.15);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.4);
        }

        .pill-quarantined {
          background: rgba(255, 0, 85, 0.15);
          color: #ff3377;
          border: 1px solid rgba(255, 0, 85, 0.4);
        }

        .col-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .act-btn {
          background: rgba(0, 240, 255, 0.05);
          border: 1px solid rgba(0, 240, 255, 0.15);
          color: var(--text-secondary);
          width: 26px;
          height: 26px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .act-btn:hover {
          color: var(--color-cyan);
          border-color: var(--color-cyan);
        }

        .kb-filters-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .filter-card {
          background: rgba(6, 12, 28, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-card-header {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
        }

        .filter-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-counts {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .count-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.76rem;
          padding: 5px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .count-row:hover, .count-row.selected {
          background: rgba(0, 240, 255, 0.08);
        }

        .c-name { color: #cbd5e1; }
        .c-val { font-weight: 700; }

        .filter-status-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .status-count-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.76rem;
          padding: 5px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .status-count-row:hover, .status-count-row.selected {
          background: rgba(0, 240, 255, 0.08);
        }

        .status-label-dot {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cbd5e1;
        }

        .s-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-approved { background: #34d399; box-shadow: 0 0 6px #34d399; }
        .dot-review { background: #facc15; box-shadow: 0 0 6px #facc15; }
        .dot-quarantined { background: #ff3377; box-shadow: 0 0 6px #ff3377; }

        .s-count { font-weight: 700; }

        /* Upload Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(2, 6, 18, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .cyber-modal {
          background: rgba(8, 14, 32, 0.98);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.2);
          width: 100%;
          max-width: 520px;
          overflow: hidden;
          animation: modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: rgba(0, 240, 255, 0.06);
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.8px;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 12px 18px;
          background: rgba(4, 9, 24, 0.95);
          border-top: 1px solid rgba(0, 240, 255, 0.12);
        }

        .cyber-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-secondary);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .primary-btn {
          background: linear-gradient(135deg, #0072ff, #00f0ff);
          border: none;
          color: #ffffff;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }

        .primary-btn:hover {
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
        }

        .cyber-select {
          width: 100%;
          background: rgba(6, 12, 28, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.25);
          color: var(--color-cyan);
          font-size: 0.8rem;
          padding: 8px 12px;
          border-radius: 6px;
          outline: none;
        }

        .tenant-select-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .dropzone-box {
          border: 2px dashed rgba(0, 240, 255, 0.3);
          background: rgba(0, 240, 255, 0.04);
          border-radius: 8px;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropzone-box:hover, .dropzone-active {
          border-color: var(--color-cyan);
          background: rgba(0, 240, 255, 0.1);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
        }

        .dropzone-icon {
          margin-bottom: 10px;
        }

        .dropzone-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
        }

        .underline {
          color: var(--color-cyan);
          text-decoration: underline;
        }

        .dropzone-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .text-cyan { color: var(--color-cyan); }
        .text-emerald { color: #34d399; }
        .kb-action-modal {
          max-width: 540px;
          width: 100%;
        }

        .doc-detail-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: rgba(4, 10, 26, 0.7);
          border: 1px solid rgba(0, 240, 255, 0.15);
          border-radius: 6px;
          padding: 12px;
          font-size: 0.76rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meta-label {
          color: var(--text-muted);
        }

        .doc-content-box {
          margin-top: 12px;
          background: rgba(6, 12, 28, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 6px;
          padding: 12px;
        }

        .content-box-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .content-text-body {
          font-size: 0.75rem;
          color: #cbd5e1;
          line-height: 1.5;
          white-space: pre-line;
        }

        .lock-sub-text {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }

        .lock-status-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .l-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .status-button-group {
          display: flex;
          gap: 8px;
        }

        .status-opt-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-secondary);
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .status-opt-btn.opt-approved {
          background: rgba(16, 185, 129, 0.2);
          border-color: #34d399;
          color: #34d399;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }

        .status-opt-btn.opt-review {
          background: rgba(250, 204, 21, 0.2);
          border-color: #facc15;
          color: #facc15;
          box-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
        }

        .status-opt-btn.opt-quarantined {
          background: rgba(255, 51, 119, 0.2);
          border-color: #ff3377;
          color: #ff3377;
          box-shadow: 0 0 10px rgba(255, 51, 119, 0.3);
        }

        .acl-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .acl-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 10, 26, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.12);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .acl-title {
          font-size: 0.78rem;
          color: #ffffff;
          font-weight: 700;
        }

        .acl-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .acl-badge {
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .more-actions-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(4, 10, 26, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.15);
          border-radius: 6px;
          padding: 10px 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-menu-item:hover {
          background: rgba(0, 240, 255, 0.1);
          border-color: var(--color-cyan);
          transform: translateX(3px);
        }

        .action-menu-item.danger-item:hover {
          background: rgba(255, 51, 119, 0.15);
          border-color: var(--color-critical);
        }

        .menu-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .menu-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .text-cyan { color: var(--color-cyan); }
        .text-critical { color: var(--color-critical); }
        .text-emerald { color: #34d399; }
      `}</style>
    </div>
  );
}
