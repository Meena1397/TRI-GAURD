import React, { useState } from 'react';
import TriGuardLogo from './TriGuardLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, User, CheckCircle2, AlertTriangle } from 'lucide-react';
import { validateSignIn } from '../utils/authService';

export default function SignInScreen({ onLogin, onGoToSignUp }) {
  const [email, setEmail] = useState('mamtha@triguard.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Google Account Selector Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = await validateSignIn(email, password);
    if (!res.success) {
      setErrorMessage(res.error || '⚠ Access Denied.');
      return;
    }

    onLogin({ email, name: email.split('@')[0] || 'User' });
  };

  const handleSelectGoogleAccount = (accEmail, name) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin({ email: accEmail, name: name });
    }, 600);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin({ email: customGoogleEmail, name: customGoogleEmail.split('@')[0] || 'Google User' });
    }, 600);
  };

  return (
    <div className="auth-screen-layout font-sans">
      {/* Left Panel - Branding & Slogan */}
      <div className="auth-left-panel">
        <div className="left-panel-content">
          <div className="left-logo-header">
            <TriGuardLogo size={38} showText={true} />
          </div>

          <div className="left-hero-text">
            <h1 className="hero-heading font-tech">
              Smarter AI. <br />
              <span className="text-orange-grad">Safer Answers.</span>
            </h1>
            <p className="hero-subtext">
              Protecting your data, preventing attacks, and ensuring trusted AI responses.
            </p>
          </div>
        </div>

        {/* Orbital Background Art */}
        <div className="orbital-bg-graphic">
          <svg viewBox="0 0 500 500" className="orbital-svg">
            <defs>
              <linearGradient id="leftArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#0072ff" />
                <stop offset="100%" stopColor="#00f0ff" />
              </linearGradient>
            </defs>
            <path 
              d="M -50 450 A 300 300 0 0 1 450 -50" 
              fill="none" 
              stroke="url(#leftArcGrad)" 
              strokeWidth="4" 
              opacity="0.8" 
            />
            <circle cx="280" cy="280" r="16" fill="#f97316" filter="drop-shadow(0 0 12px #f97316)" />
          </svg>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="auth-right-panel">
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title font-tech">
              Welcome <span className="text-orange-grad">Back</span>
            </h2>
            <p className="form-subtitle">
              Sign in to your TRI-GUARD account
            </p>
          </div>

          {errorMessage && (
            <div className="auth-error-banner font-mono animate-fade-in">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form font-sans">
            {/* Email Field */}
            <div className="input-group">
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="auth-input font-sans"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input font-sans"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="form-options-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                <span className="opt-text">Remember me</span>
              </label>

              <a href="#forgot" onClick={(e) => e.preventDefault()} className="forgot-link">
                Forgot password?
              </a>
            </div>

            {/* Gradient Primary Sign In Button */}
            <button type="submit" className="gradient-auth-btn font-tech">
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>

            {/* Divider */}
            <div className="divider-row font-tech">
              <span>OR</span>
            </div>

            {/* Google Sign In Button */}
            <button 
              type="button" 
              className="google-auth-btn font-sans"
              onClick={() => setShowGoogleModal(true)}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch to Sign Up */}
            <div className="switch-auth-row font-sans">
              <span>Don't have an account?</span>
              <button 
                type="button" 
                className="switch-auth-link"
                onClick={onGoToSignUp}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Account Selector Modal */}
      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={() => !isAuthenticating && setShowGoogleModal(false)}>
          <div className="google-modal-card font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="g-modal-header">
              <div className="g-header-title">
                <svg className="google-icon-large" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 className="g-title">Choose an account</h3>
                  <p className="g-sub">to continue to <strong>TRI-GUARD</strong></p>
                </div>
              </div>
              <button 
                type="button" 
                className="g-close-btn"
                onClick={() => setShowGoogleModal(false)}
                disabled={isAuthenticating}
              >
                <X size={18} />
              </button>
            </div>

            {isAuthenticating ? (
              <div className="g-authenticating-box font-tech">
                <div className="g-spinner"></div>
                <span>AUTHENTICATING WITH GOOGLE...</span>
              </div>
            ) : (
              <div className="g-accounts-list font-sans">
                
                {/* Google Account 1 */}
                <div 
                  className="g-account-item"
                  onClick={() => handleSelectGoogleAccount('mamtha@triguard.ai', 'Mamtha S')}
                >
                  <div className="g-avatar cyan-avatar">M</div>
                  <div className="g-account-info">
                    <div className="g-account-name">Mamtha S</div>
                    <div className="g-account-email">mamtha@triguard.ai</div>
                  </div>
                  <span className="g-default-badge font-mono">Default</span>
                </div>

                {/* Google Account 2 */}
                <div 
                  className="g-account-item"
                  onClick={() => handleSelectGoogleAccount('alex.mercer@gmail.com', 'Alex Mercer')}
                >
                  <div className="g-avatar orange-avatar">A</div>
                  <div className="g-account-info">
                    <div className="g-account-name">Alex Mercer</div>
                    <div className="g-account-email">alex.mercer@gmail.com</div>
                  </div>
                </div>

                {/* Custom Email Option */}
                <form onSubmit={handleCustomGoogleSubmit} className="g-custom-email-form">
                  <div className="g-custom-label">Use another Google account:</div>
                  <div className="g-custom-row">
                    <input 
                      type="email" 
                      className="g-custom-input"
                      placeholder="name@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    />
                    <button type="submit" className="g-custom-btn font-tech">
                      Continue
                    </button>
                  </div>
                </form>

              </div>
            )}

            <div className="g-modal-footer font-sans">
              To continue, Google will share your name, email address, and profile picture with TRI-GUARD.
            </div>
          </div>
        </div>
      )}

      <style>{`
        .auth-screen-layout {
          width: 100vw;
          height: 100vh;
          display: flex;
          background: #080c14;
          color: #ffffff;
          overflow: hidden;
        }

        .auth-left-panel {
          flex: 1;
          background: linear-gradient(135deg, #040812 0%, #0a1024 100%);
          border-right: 1px solid rgba(0, 240, 255, 0.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 60px;
          position: relative;
          overflow: hidden;
        }

        .left-panel-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 80px;
        }

        .left-hero-text {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
        }

        .hero-heading {
          font-size: 2.8rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .text-orange-grad {
          background: linear-gradient(90deg, #f97316 0%, #ffb700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .orbital-bg-graphic {
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 600px;
          height: 600px;
          pointer-events: none;
          opacity: 0.65;
        }

        .orbital-svg {
          width: 100%;
          height: 100%;
        }

        .auth-right-panel {
          flex: 1;
          background: #080c14;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
        }

        .form-wrapper {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
        }

        .form-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(0, 240, 255, 0.18);
          border-radius: 8px;
          padding: 12px 14px 12px 42px;
          color: #ffffff;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .auth-input:focus {
          border-color: #00f0ff;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.25);
          background: rgba(15, 23, 42, 0.9);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .eye-toggle-btn:hover {
          color: #ffffff;
        }

        .form-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .checkbox-label input {
          display: none;
        }

        .custom-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid rgba(0, 240, 255, 0.3);
          background: rgba(15, 23, 42, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .checkbox-label input:checked + .custom-checkbox {
          background: #0072ff;
          border-color: #00f0ff;
        }

        .checkbox-label input:checked + .custom-checkbox::after {
          content: '✓';
          color: #ffffff;
          font-size: 11px;
          font-weight: bold;
        }

        .forgot-link {
          color: #00f0ff;
          text-decoration: none;
          transition: all 0.2s;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .gradient-auth-btn {
          width: 100%;
          background: linear-gradient(90deg, #0072ff 0%, #f97316 100%);
          border: none;
          color: #ffffff;
          padding: 13px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 0 20px rgba(0, 114, 255, 0.35);
          transition: all 0.25s ease;
          margin-top: 6px;
        }

        .gradient-auth-btn:hover {
          box-shadow: 0 0 30px rgba(249, 115, 22, 0.5);
          transform: translateY(-1px);
        }

        .divider-row {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.72rem;
          margin: 6px 0;
        }

        .divider-row::before, .divider-row::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divider-row span {
          padding: 0 12px;
        }

        .google-auth-btn {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 11px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .google-auth-btn:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }

        .google-icon {
          width: 18px;
          height: 18px;
        }

        .switch-auth-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-top: 10px;
        }

        .switch-auth-link {
          background: transparent;
          border: none;
          color: #00f0ff;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 0.88rem;
        }

        .switch-auth-link:hover {
          text-decoration: underline;
        }

        /* Google Modal */
        .google-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .google-modal-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          color: #1f2937;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .g-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 14px;
        }

        .g-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .google-icon-large {
          width: 32px;
          height: 32px;
        }

        .g-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .g-sub {
          font-size: 0.8rem;
          color: #6b7280;
          margin: 2px 0 0 0;
        }

        .g-close-btn {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .g-close-btn:hover {
          color: #111827;
          background: #f3f4f6;
        }

        .g-authenticating-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 30px 0;
          font-size: 0.85rem;
          color: #2563eb;
          font-weight: 700;
        }

        .g-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .g-accounts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .g-account-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .g-account-item:hover {
          background: #f9fafb;
          border-color: #2563eb;
        }

        .g-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .cyan-avatar {
          background: #0284c7;
        }

        .orange-avatar {
          background: #ea580c;
        }

        .g-account-info {
          flex: 1;
        }

        .g-account-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #111827;
        }

        .g-account-email {
          font-size: 0.76rem;
          color: #6b7280;
        }

        .g-default-badge {
          font-size: 0.65rem;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid #bfdbfe;
        }

        .g-custom-email-form {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
        }

        .g-custom-label {
          font-size: 0.78rem;
          color: #4b5563;
        }

        .g-custom-row {
          display: flex;
          gap: 8px;
        }

        .g-custom-input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 0.82rem;
          outline: none;
        }

        .g-custom-input:focus {
          border-color: #2563eb;
        }

        .g-custom-btn {
          background: #2563eb;
          color: #ffffff;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .g-custom-btn:hover {
          background: #1d4ed8;
        }

        .g-modal-footer {
          font-size: 0.7rem;
          color: #9ca3af;
          line-height: 1.3;
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
        }
      `}</style>
    </div>
  );
}
