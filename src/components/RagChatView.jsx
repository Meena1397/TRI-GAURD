import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Send, 
  Paperclip, 
  ShieldCheck, 
  User, 
  Building, 
  Shield, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  X,
  Search,
  Filter,
  Download
} from 'lucide-react';

export default function RagChatView({ playCyberBeep, currentUser }) {
  const userName = currentUser?.name || 'Mamtha S';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      name: userName,
      time: '14:32',
      text: "What is our company's leave policy?"
    },
    {
      id: 2,
      sender: 'ai',
      name: 'TRI-GUARD AI',
      time: '14:32',
      text: `According to the company's HR policy, the leave policy is as follows:\n\n1. Annual Leave – 21 days per year\n2. Sick Leave – 12 days per year\n3. Casual Leave – 6 days per year\n4. Maternity Leave – 26 weeks\n5. Paternity Leave – 2 weeks\n\nFor more details, refer to the HR_Policy.pdf and Leave_Procedure.docx.`,
      grounding: '96%',
      confidence: '94%',
      approved: true
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const fileInputRef = useRef(null);

  const sources = [
    { 
      id: 1, 
      name: 'HR_Policy.pdf', 
      meta: 'Company A • HR • 2.4 MB', 
      score: '96%', 
      type: 'pdf', 
      status: 'Authorized',
      pages: 8,
      content: `COMPANY A • HUMAN RESOURCES POLICY (2025 EDITION)\n\n1. SCOPE & GENERAL PRINCIPLES\nThis document applies to all full-time, part-time, and contractual employees of Company A. All employees must comply with organizational data governance and document security procedures.\n\n2. LEAVE ALLOWANCES & POLICIES\n- Annual Paid Leave: 21 Days per year.\n- Sick & Emergency Leave: 12 Days per year with medical verification for >2 days.\n- Casual Leave: 6 Days per year.\n- Parental Leave: 26 weeks maternity / 2 weeks paternity.\n\n3. DOCUMENT CLASSIFICATION & CONFIDENTIALITY\n- Internal HR documents are strictly Tenant-Isolated within Company A.\n- Vector embeddings are protected with Zero-Trust authorization checking.`
    },
    { 
      id: 2, 
      name: 'Leave_Procedure.docx', 
      meta: 'Company A • HR • 1.8 MB', 
      score: '92%', 
      type: 'docx', 
      status: 'Authorized',
      pages: 4,
      content: `STANDARD OPERATING PROCEDURE: LEAVE APPLICATION\n\n1. SUBMISSION PROCESS\nLeave requests must be submitted through the Employee Portal at least 3 business days in advance.\n\n2. APPROVAL WORKFLOW\n- Team Lead review within 24 hours.\n- HR Sync upon manager authorization.`
    },
    { 
      id: 3, 
      name: 'Employee_Handbook.pdf', 
      meta: 'Company A • HR • 3.1 MB', 
      score: '89%', 
      type: 'pdf', 
      status: 'Authorized',
      pages: 14,
      content: `COMPANY A EMPLOYEE HANDBOOK 2025\n\nSECTION 1: CODE OF CONDUCT & ETHICS\nAll employees are expected to uphold integrity, data security, and collaborative standards.\n\nSECTION 2: COMPUTING & DEVICE POLICY\nOnly authorized software and hardware connected through Tri-Guard Endpoint Protection may access tenant repositories.`
    },
    { 
      id: 4, 
      name: 'IT_Security_Guidelines.pdf', 
      meta: 'Company A • IT • 4.2 MB', 
      score: '87%', 
      type: 'pdf', 
      status: 'Authorized',
      pages: 10,
      content: `INFORMATION SECURITY & ACCESS CONTROL SPECIFICATION\n\n1. CREDENTIAL HYGIENE\n- 16-character minimum passwords required.\n- MFA active across all tenant gateways.\n\n2. ZERO-TRUST ISOLATION\n- Vector search bounds restricted to active tenant ID.`
    },
    { 
      id: 5, 
      name: 'Remote_Work_Policy_2025.docx', 
      meta: 'Company A • Operations • 1.5 MB', 
      score: '85%', 
      type: 'docx', 
      status: 'Authorized',
      pages: 5,
      content: `HYBRID & REMOTE WORK REGULATIONS 2025\n\n- Remote days permitted: up to 3 days per week.\n- Mandatory WPA3 encrypted or corporate VPN connection.`
    },
    { 
      id: 6, 
      name: 'Access_Control_Matrix.xlsx', 
      meta: 'Company A • Security • 890 KB', 
      score: '81%', 
      type: 'xlsx', 
      status: 'Authorized',
      pages: 2,
      content: `TRI-GUARD ACCESS CONTROL MATRIX\n\nRole: Employee -> Tenant Scope: Company A -> Document Bounds: Verified`
    }
  ];

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      if (playCyberBeep) playCyberBeep(850);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (playCyberBeep) playCyberBeep(450);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() && !attachedFile) return;

    let messageText = inputVal;
    if (attachedFile) {
      messageText = `[Attached Document: ${attachedFile.name} (${attachedFile.size})]\n${inputVal}`;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      name: userName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageText
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputVal;
    const currentAtt = attachedFile;

    setInputVal('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsSearching(true);
    if (playCyberBeep) playCyberBeep(700);

    setTimeout(() => {
      let replyText = "Verified against Company A security corpus: Document access authorized.";

      if (currentAtt) {
        replyText = `Analyzing attached document '${currentAtt.name}' under Tenant 'Company A':\n\n1. Vector Embeddings indexed and verified with Zero-Trust ACLs.\n2. Document content extracted cleanly: No security policy violations or tenant data leakage detected.\n3. RAG Grounding matrix matched to authorized employee scope for ${userName}.`;
      } else if (currentInput.toLowerCase().includes('remote') || currentInput.toLowerCase().includes('work')) {
        replyText = "According to Company A IT & HR Remote Work Policy:\n\n1. Hybrid work permitted up to 3 days/week with team lead approval.\n2. VPN & MFA mandatory on all corporate hardware.\n3. Data classification policies apply strictly to remote endpoints.";
      } else if (currentInput.toLowerCase().includes('security') || currentInput.toLowerCase().includes('password')) {
        replyText = "Company A Information Security Guidelines:\n\n1. Passwords must be minimum 16 characters with multi-factor authentication.\n2. Inactive sessions lock automatically after 15 minutes.\n3. Zero-Trust access enforcement is monitored by Tri-Guard Security Engine.";
      } else {
        replyText = `Authorization verified for tenant 'Company A'. The requested topic has been cross-referenced with authorized internal documents. All retrieved vectors remain strictly isolated within your tenant scope.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        name: 'TRI-GUARD AI',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        grounding: `${Math.floor(Math.random() * 5 + 93)}%`,
        confidence: `${Math.floor(Math.random() * 5 + 92)}%`,
        approved: true
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsSearching(false);
      if (playCyberBeep) playCyberBeep(1100);
    }, 1000);
  };

  return (
    <div className="rag-chat-container">
      {/* Outer Card Wrapper */}
      <div className="rag-chat-card cyber-card">
        
        {/* Top Header Card Inside Content */}
        <div className="rag-header-bar font-sans">
          <div className="rag-header-title">
            <div className="header-icon-box">
              <FileText size={22} className="text-cyan" />
            </div>
            <div>
              <h2 className="rag-title font-tech">SECURE RAG CHAT</h2>
              <p className="rag-sub font-sans">Ask questions and get AI-powered answers from your authorized documents.</p>
            </div>
          </div>

          <div className="rag-user-badge">
            <div className="user-field">
              <User size={13} className="field-icon text-cyan" />
              <span className="field-label">User:</span>
              <span className="field-val">{userName}</span>
            </div>
            <div className="user-field">
              <Building size={13} className="field-icon text-cyan" />
              <span className="field-label">Tenant:</span>
              <span className="field-val">Company A</span>
            </div>
            <div className="user-field">
              <Shield size={13} className="field-icon text-cyan" />
              <span className="field-label">Role:</span>
              <span className="field-val">Employee</span>
            </div>
            <div className="verified-pill">
              <ShieldCheck size={14} className="pill-icon" />
              <span>Authorization <strong>VERIFIED</strong></span>
            </div>
          </div>
        </div>

        {/* Grid Body */}
        <div className="rag-body-grid">
          
          {/* Main Chat Thread Area */}
          <div className="chat-thread-column">
            <div className="chat-messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'msg-user' : 'msg-ai'}`}>
                  
                  {msg.sender === 'user' ? (
                    <div className="user-avatar">
                      <User size={16} />
                    </div>
                  ) : (
                    <div className="ai-avatar">
                      <ShieldCheck size={18} className="text-cyan" />
                    </div>
                  )}

                  <div className="message-content-wrapper">
                    <div className="message-header font-mono">
                      <span className="sender-name">{msg.name}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>

                    {msg.sender === 'user' ? (
                      <div className="user-bubble font-sans">
                        {msg.text.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <div className="ai-response-box">
                        <div className="ai-text-content font-sans">
                          {msg.text.split('\n').map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>

                        <div className="ai-meta-bar">
                          <div className="metrics-group font-mono">
                            <span>Grounding: <strong className="text-cyan">{msg.grounding}</strong></span>
                            <span className="divider">|</span>
                            <span>Confidence: <strong className="text-cyan">{msg.confidence}</strong></span>
                          </div>

                          {msg.approved && (
                            <div className="approved-btn">
                              <ShieldCheck size={14} />
                              <span>RESPONSE APPROVED</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSearching && (
                <div className="chat-message-row msg-ai">
                  <div className="ai-avatar pulsing">
                    <Sparkles size={18} className="text-cyan" />
                  </div>
                  <div className="searching-indicator font-mono">
                    Vector searching tenant boundaries & grounding facts...
                  </div>
                </div>
              )}
            </div>

            {/* Attached Document Pill Chip (if any) */}
            {attachedFile && (
              <div className="attachment-chip font-mono">
                <FileText size={14} className="text-cyan" />
                <span>Attached: <strong>{attachedFile.name}</strong> ({attachedFile.size})</span>
                <button type="button" className="remove-att-btn" onClick={handleRemoveAttachment}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSend} className="chat-input-bar">
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />

              <button 
                type="button" 
                className="attach-btn" 
                title="Attach Document to RAG Context"
                onClick={handleAttachClick}
              >
                <Paperclip size={16} />
              </button>

              <input
                type="text"
                className="chat-input-field"
                placeholder="Ask a question about your documents..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />

              <button type="submit" className="send-btn" title="Send Message">
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Right Side Panels */}
          <div className="rag-sidebar-column">
            
            {/* RETRIEVED SOURCES Card */}
            <div className="sources-card">
              <div className="card-header-flex">
                <span className="card-title font-tech">RETRIEVED SOURCES ({sources.length})</span>
                <button 
                  type="button" 
                  className="view-all-btn font-mono"
                  onClick={() => setShowSourcesModal(true)}
                >
                  View All
                </button>
              </div>

              <div className="sources-list font-sans">
                {sources.slice(0, 3).map((src) => (
                  <div 
                    key={src.id} 
                    className="source-item interactive-source-item"
                    onClick={() => setSelectedPdf(src)}
                    title="Click to View PDF Source"
                  >
                    <div className="source-icon-box">
                      <FileText size={18} className="text-cyan" />
                    </div>
                    <div className="source-info">
                      <div className="source-name font-tech">{src.name}</div>
                      <div className="source-meta font-mono">{src.meta}</div>
                    </div>
                    <div className="relevance-tag font-mono">
                      Relevance {src.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUTHORIZATION CHECK Card */}
            <div className="auth-check-card">
              <div className="card-header-flex">
                <span className="card-title font-tech">AUTHORIZATION CHECK</span>
                <span className="auth-status-badge font-mono">AUTHORIZED</span>
              </div>

              <ul className="auth-check-list font-sans">
                <li>
                  <CheckCircle2 size={15} className="check-icon text-cyan" />
                  <span>Identity Verified ({userName})</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon text-cyan" />
                  <span>Tenant Matched (Company A)</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon text-cyan" />
                  <span>Permission Check Passed</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon text-cyan" />
                  <span>Search Space Restricted</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* VIEW ALL RETRIEVED SOURCES MODAL */}
      {showSourcesModal && (
        <div className="sources-modal-overlay font-sans" onClick={() => setShowSourcesModal(false)}>
          <div className="sources-modal-card cyber-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="sources-modal-header">
              <div className="s-modal-title-group">
                <FileText size={20} className="text-cyan" />
                <h3 className="s-modal-title font-tech">All Retrieved Document Sources ({sources.length})</h3>
              </div>
              <button 
                type="button" 
                className="s-modal-close"
                onClick={() => setShowSourcesModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="s-modal-body">
              <p className="s-modal-sub font-mono">
                Authorized search index for <strong>Company A</strong> (User: {userName})
              </p>

              <div className="s-modal-list font-mono">
                {sources.map((src) => (
                  <div 
                    key={src.id} 
                    className="s-full-item interactive-source-item"
                    onClick={() => {
                      setShowSourcesModal(false);
                      setSelectedPdf(src);
                    }}
                    title="Click to View Document"
                  >
                    <div className="s-full-icon">
                      <FileText size={18} className="text-cyan" />
                    </div>
                    <div className="s-full-info">
                      <div className="s-full-name font-tech">{src.name}</div>
                      <div className="s-full-meta">{src.meta}</div>
                    </div>
                    <div className="s-full-tags">
                      <span className="relevance-tag font-mono">Relevance {src.score}</span>
                      <span className="status-tag font-mono">✓ {src.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="s-modal-footer font-tech">
              <button 
                type="button" 
                className="s-modal-done-btn"
                onClick={() => setShowSourcesModal(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RAG CHAT DOCUMENT VIEWER MODAL (NO DOWNLOAD ICON) */}
      {selectedPdf && (
        <div className="pdf-modal-overlay font-sans" onClick={() => setSelectedPdf(null)}>
          <div className="pdf-modal-card cyber-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Toolbar - NO download button included */}
            <div className="pdf-modal-toolbar">
              <div className="pdf-toolbar-left font-tech">
                <FileText size={20} className="text-cyan" />
                <div>
                  <h3 className="pdf-doc-title">{selectedPdf.name}</h3>
                  <span className="pdf-doc-meta font-mono">{selectedPdf.meta} • {selectedPdf.pages || 4} Pages</span>
                </div>
              </div>

              <div className="pdf-toolbar-right">
                <span className="pdf-authorized-badge font-mono font-bold">✓ AUTHORIZED RAG SOURCE</span>
                <button type="button" className="pdf-close-btn" onClick={() => setSelectedPdf(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Render Sheet */}
            <div className="pdf-sheet-wrapper">
              <div className="pdf-page-sheet font-sans">
                <div className="sheet-header-bar font-mono">
                  <div className="sheet-watermark">TRI-GUARD SECURE RAG INDEX • TENANT A SCOPED</div>
                  <div className="sheet-user-stamp">Authorized Access: {userName}</div>
                </div>

                <div className="sheet-body-content font-mono">
                  {selectedPdf.content ? selectedPdf.content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  )) : <p>Document contents verified and scope-checked.</p>}
                </div>

                <div className="sheet-footer-bar font-mono">
                  <span>Page 1 of {selectedPdf.pages || 4}</span>
                  <span>AES-256 Vector Embedded Stream</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .rag-chat-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rag-chat-card {
          background: rgba(8, 14, 32, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rag-header-bar {
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

        .rag-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
        }

        .rag-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #ffffff;
          margin: 0;
        }

        .rag-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
        }

        .rag-user-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 114, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 6px 14px;
          border-radius: 8px;
        }

        .user-field {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
        }

        .field-icon {
          color: var(--color-cyan);
        }

        .field-label {
          color: var(--text-muted);
        }

        .field-val {
          color: #ffffff;
          font-weight: 600;
        }

        .verified-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }

        .rag-body-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
        }

        @media (max-width: 1200px) {
          .rag-body-grid {
            grid-template-columns: 1fr;
          }
        }

        .chat-thread-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 480px;
        }

        .chat-messages-container {
          flex: 1;
          background: rgba(4, 9, 24, 0.7);
          border: 1px solid rgba(0, 240, 255, 0.12);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          max-height: 520px;
        }

        .chat-message-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }

        .ai-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid var(--color-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }

        .message-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
        }

        .sender-name {
          font-weight: 700;
          color: #ffffff;
        }

        .message-time {
          color: var(--text-muted);
        }

        .user-bubble {
          background: linear-gradient(135deg, rgba(0, 114, 255, 0.35), rgba(0, 240, 255, 0.15));
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 8px 8px 8px 2px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 0.88rem;
          max-width: 85%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .user-bubble p {
          margin: 0;
        }

        .ai-response-box {
          background: rgba(6, 16, 38, 0.9);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
        }

        .ai-text-content {
          font-size: 0.85rem;
          color: #e2e8f0;
          line-height: 1.5;
        }

        .ai-text-content p {
          margin-bottom: 6px;
        }

        .ai-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.72rem;
          flex-wrap: wrap;
          gap: 8px;
        }

        .metrics-group {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .divider {
          color: var(--text-muted);
        }

        .approved-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.5);
          color: #34d399;
          font-family: var(--font-tech);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }

        .attachment-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.72rem;
          color: #ffffff;
        }

        .remove-att-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          margin-left: auto;
          display: flex;
          align-items: center;
        }

        .remove-att-btn:hover {
          color: #ff3377;
        }

        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(5, 12, 30, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.25);
          border-radius: 8px;
          padding: 6px 10px;
        }

        .attach-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .attach-btn:hover {
          color: var(--color-cyan);
          background: rgba(0, 240, 255, 0.1);
        }

        .chat-input-field {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          outline: none;
          padding: 6px;
        }

        .chat-input-field::placeholder {
          color: var(--text-muted);
        }

        .send-btn {
          background: linear-gradient(135deg, #0072ff, #00f0ff);
          border: none;
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
          transition: all 0.2s;
        }

        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 18px rgba(0, 240, 255, 0.6);
        }

        .rag-sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sources-card, .auth-check-card {
          background: rgba(6, 12, 28, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.16);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
        }

        .card-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.8px;
        }

        .view-all-btn {
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.3);
          color: var(--color-cyan);
          font-size: 0.68rem;
          padding: 3px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: rgba(0, 240, 255, 0.25);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
        }

        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .source-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 240, 255, 0.04);
          border: 1px solid rgba(0, 240, 255, 0.12);
          border-radius: 6px;
          padding: 8px 10px;
        }

        .source-icon-box {
          width: 32px;
          height: 32px;
          background: rgba(0, 240, 255, 0.08);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .source-info {
          flex: 1;
          min-width: 0;
        }

        .source-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .source-meta {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .relevance-tag {
          font-size: 0.65rem;
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 3px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .auth-status-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
        }

        .auth-check-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .auth-check-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
          color: #cbd5e1;
        }

        .text-cyan {
          color: var(--color-cyan);
        }

        .pulsing {
          animation: pulse-ring 1.5s infinite;
        }

        .searching-indicator {
          font-size: 0.78rem;
          color: var(--color-cyan);
          padding: 8px 12px;
          background: rgba(0, 240, 255, 0.08);
          border-radius: 6px;
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        /* Sources Modal */
        .sources-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .sources-modal-card {
          width: 100%;
          max-width: 520px;
        }

        .sources-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 12px;
        }

        .s-modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .s-modal-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }

        .s-modal-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .s-modal-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .s-modal-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 340px;
          overflow-y: auto;
        }

        .s-full-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(4, 10, 26, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.15);
          border-radius: 6px;
          padding: 10px 12px;
        }

        .s-full-info {
          flex: 1;
          min-width: 0;
        }

        .s-full-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
        }

        .s-full-meta {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .s-full-tags {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-tag {
          font-size: 0.65rem;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 3px 6px;
          border-radius: 4px;
        }

        .s-modal-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 12px;
          margin-top: 12px;
        }

        .s-modal-done-btn {
          background: linear-gradient(135deg, #0072ff, #00f0ff);
          border: none;
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .interactive-source-item {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .interactive-source-item:hover {
          background: rgba(0, 240, 255, 0.12) !important;
          border-color: rgba(0, 240, 255, 0.4) !important;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.25);
          transform: translateX(2px);
        }

        /* PDF Viewer Modal (RAG Chat - No Download Icon) */
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

        .pdf-close-btn {
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

        .pdf-close-btn:hover {
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
      `}</style>
    </div>
  );
}
