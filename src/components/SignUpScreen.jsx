import React, { useState, useEffect, useRef } from 'react';
import TriGuardLogo from './TriGuardLogo';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  Clock,
  Sparkles,
  FileText,
  Shield,
  ShieldAlert,
  XCircle,
  KeyRound
} from 'lucide-react';
import { 
  registerUserAndSendOtp, 
  resendOtpCode, 
  verifyOtpCode, 
  maskEmail 
} from '../utils/authService';

export default function SignUpScreen({ onRegister, onGoToSignIn }) {
  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Screen Stages: 'FORM' | 'VERIFIED' | 'FAILED'
  const [stage, setStage] = useState('FORM');

  // OTP Verification State inside form
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOtpCode, setActiveOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(299); // 04:59 default
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [canResend, setCanResend] = useState(false);

  // Messages & Loading States
  const [errorMessage, setErrorMessage] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showTelemetryBanner, setShowTelemetryBanner] = useState(false);

  // Redirect Timer for Verified Screen
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Terms & Privacy Modal State: null | 'TERMS' | 'PRIVACY'
  const [showTermsModal, setShowTermsModal] = useState(null);

  // Refs for 6 OTP Input Boxes
  const otpInputRefs = useRef([]);

  // Timer Countdown Effect for 04:59
  useEffect(() => {
    let interval = null;
    if (isCodeSent && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCodeSent, timerSeconds]);

  // Automatic Redirect Effect for VERIFIED Stage
  useEffect(() => {
    let redirectInterval = null;
    if (stage === 'VERIFIED') {
      setRedirectCountdown(3);
      redirectInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(redirectInterval);
            onRegister({ 
              name: fullName || 'New User', 
              email: email || 'user@triguard.ai' 
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (redirectInterval) clearInterval(redirectInterval);
    };
  }, [stage]);

  // Format seconds into MM:SS format (e.g. 299 -> 04:59)
  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Send Code Handler
  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrorMessage('⚠ Please enter your email address first.');
      return;
    }

    setIsSendingCode(true);
    setErrorMessage('');

    try {
      const result = await resendOtpCode(email);
      setActiveOtpCode(result.otpCode);
      setTimerSeconds(299); // 04:59
      setCanResend(false);
      setIsCodeSent(true);
      setShowTelemetryBanner(true);
      setIsSendingCode(false);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setIsSendingCode(false);
      setErrorMessage('⚠ Failed to send verification code. Please try again.');
    }
  };

  // OTP Box Change Handler
  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];

    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage('');

    if (value !== '' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
      setErrorMessage('');
    }
  };

  // Main Form Submit ("Create Account ->")
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreeTerms) {
      setErrorMessage('⚠ You must agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('⚠ Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('⚠ Passwords do not match. Please confirm your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('⚠ Password must be at least 6 characters long.');
      return;
    }

    const enteredCode = otp.join('');

    // Verification check
    if (!enteredCode || enteredCode.length < 6) {
      setStage('FAILED');
      return;
    }

    const verifyResult = verifyOtpCode(email, enteredCode);

    if (verifyResult.success || (activeOtpCode && enteredCode === activeOtpCode)) {
      setStage('VERIFIED');
    } else {
      setStage('FAILED');
    }
  };

  // Reset to form on "Try Again"
  const handleTryAgain = () => {
    setStage('FORM');
    setErrorMessage('');
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Resend code from Failed screen
  const handleResendFromFailed = async () => {
    await handleSendCode();
    setStage('FORM');
  };

  // Immediate Continue from Verified screen
  const handleContinueImmediate = () => {
    onRegister({
      name: fullName || 'New User',
      email: email || 'user@triguard.ai'
    });
  };

  // Google Login Handlers
  const handleSelectGoogleAccount = (accEmail, name) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onRegister({ email: accEmail, name: name });
    }, 400);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      onRegister({ email: customGoogleEmail, name: customGoogleEmail.split('@')[0] || 'Google User' });
    }, 400);
  };

  return (
    <div className="auth-screen-layout font-sans">
      
      {/* Telemetry Banner for OTP Verification Code */}
      {showTelemetryBanner && stage === 'FORM' && (
        <div className="telemetry-otp-banner font-mono animate-slide-down">
          <div className="telemetry-left">
            <Sparkles size={14} className="text-cyan animate-pulse" />
            <span>[ 📧 TRI-GUARD OTP TELEMETRY: Code sent to <strong>{maskEmail(email || 'user@triguard.ai')}</strong> :</span>
            <span className="otp-code-highlight font-display">{activeOtpCode}</span>
            <span>(Expires in {formatTimer(timerSeconds)}) ]</span>
          </div>
          <button 
            type="button" 
            className="telemetry-close-btn"
            onClick={() => setShowTelemetryBanner(false)}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Left Branding Panel */}
      <div className="auth-left-panel">
        <div className="left-panel-content">
          <div className="left-logo-header">
            <TriGuardLogo size={38} showText={true} />
          </div>

          <div className="left-hero-text">
            <h1 className="hero-heading font-tech">
              Create Your Account <br />
              <span className="text-orange-grad">Join TRI-GUARD</span>
            </h1>
            <p className="hero-subtext">
              Build a safer, smarter future with <br />
              AI-powered security.
            </p>
          </div>
        </div>

        {/* Orbital Space Planet Graphic */}
        <div className="orbital-bg-graphic">
          <svg viewBox="0 0 500 500" className="orbital-svg">
            <defs>
              <radialGradient id="planetBodyGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#0d2857" />
                <stop offset="55%" stopColor="#040b1e" />
                <stop offset="100%" stopColor="#02040b" />
              </radialGradient>
              <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="#0072ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="leftArcGradSignUp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0055ff" />
                <stop offset="40%" stopColor="#00f0ff" />
                <stop offset="80%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ff9d00" />
              </linearGradient>
              <filter id="planetGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <circle cx="50" cy="450" r="230" fill="url(#atmosphereGlow)" />
            <circle 
              cx="40" 
              cy="460" 
              r="200" 
              fill="url(#planetBodyGrad)" 
              stroke="rgba(0, 150, 255, 0.4)" 
              strokeWidth="2.5" 
            />
            <path 
              d="M -70 490 A 300 300 0 0 1 430 70" 
              fill="none" 
              stroke="url(#leftArcGradSignUp)" 
              strokeWidth="4" 
              opacity="0.95"
              filter="url(#planetGlowFilter)"
            />
            <circle 
              cx="260" 
              cy="235" 
              r="15" 
              fill="#f97316" 
              filter="drop-shadow(0 0 16px #f97316)" 
            />
            <circle 
              cx="256" 
              cy="231" 
              r="6" 
              fill="#ffedd5" 
              opacity="0.7" 
            />
          </svg>
        </div>
      </div>

      {/* Right Panel: Render Form, Verified Screen, or Verification Failed Screen */}
      <div className="auth-right-panel">

        {/* STAGE 1: SIGN UP FORM WITH INLINE VERIFICATION */}
        {stage === 'FORM' && (
          <div className="form-wrapper animate-fade-in">
            <div className="form-header">
              <h2 className="form-title font-tech">
                Sign <span className="text-orange-grad">Up</span>
              </h2>
              <p className="form-subtitle">
                Create your TRI-GUARD account to get started.
              </p>
            </div>

            {errorMessage && (
              <div className="auth-error-banner font-sans animate-fade-in">
                <AlertTriangle size={16} className="error-alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="auth-form font-sans">
              
              {/* Full Name Field */}
              <div className="input-group">
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="auth-input font-sans"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Address Field */}
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

              {/* Verify Email Inline Block */}
              <div className="inline-verify-block">
                <div className="inline-verify-left">
                  <div className="inline-verify-icon-box">
                    <ShieldCheck size={20} className="text-cyan" />
                  </div>
                  <div className="inline-verify-text">
                    <h4 className="inline-verify-title">Verify your email</h4>
                    <p className="inline-verify-sub">We'll send a verification code to your email</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="send-code-btn font-tech"
                  onClick={handleSendCode}
                  disabled={isSendingCode}
                >
                  {isSendingCode ? 'Sending...' : 'Send Code'}
                </button>
              </div>

              {/* Verification Code Box Row */}
              <div className="verification-code-section">
                <div className="v-code-header font-sans">
                  <KeyRound size={16} className="v-code-icon" />
                  <span className="v-code-label">Verification code</span>
                </div>

                <div className="otp-digit-boxes font-mono">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className={`otp-box ${digit ? 'otp-box-active' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>

                <div className="v-code-footer font-sans">
                  <span className="v-caption-left">Enter the 6-digit code sent to your email.</span>
                  <span className="v-timer-right font-mono">{formatTimer(timerSeconds)}</span>
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
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="input-group">
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="auth-input font-sans"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="eye-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="form-options-row">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />
                  <span className="custom-checkbox"></span>
                  <span className="opt-text">
                    I agree to the{' '}
                    <button 
                      type="button" 
                      className="terms-link-btn" 
                      onClick={() => setShowTermsModal('TERMS')}
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button 
                      type="button" 
                      className="terms-link-btn" 
                      onClick={() => setShowTermsModal('PRIVACY')}
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button 
                type="submit" 
                className="gradient-auth-btn font-tech"
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </button>

              {/* Divider */}
              <div className="divider-row font-tech">
                <span>OR</span>
              </div>

              {/* Google Sign Up */}
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
                <span>Sign up with Google</span>
              </button>

              {/* Footer Link */}
              <div className="switch-auth-row font-sans">
                <span>Already have an account?</span>
                <button 
                  type="button" 
                  className="switch-auth-link"
                  onClick={onGoToSignIn}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STAGE 2: IF VERIFIED -> NEXT PAGE */}
        {stage === 'VERIFIED' && (
          <div className="result-card-container verified-card animate-scale-up font-sans">
            
            {/* Top Brand Logo */}
            <div className="result-brand-header">
              <TriGuardLogo size={36} showText={true} />
            </div>

            {/* Glowing Cyan/Emerald Shield Icon */}
            <div className="shield-graphic-wrapper verified-glow">
              <div className="shield-ring-outer"></div>
              <div className="shield-ring-inner"></div>
              <div className="shield-icon-badge">
                <ShieldCheck size={56} className="shield-emerald-icon" />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="result-text-block">
              <h2 className="result-title font-tech">
                Email Verified <span className="text-emerald font-bold">Successfully!</span>
              </h2>
              <p className="result-subtitle">
                Your account has been verified. You will now be redirected to the next step.
              </p>
            </div>

            {/* Continue Button */}
            <button 
              type="button" 
              className="continue-verified-btn font-tech"
              onClick={handleContinueImmediate}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>

            {/* Countdown Text */}
            <div className="redirect-status-text font-sans">
              <span>Redirecting in {redirectCountdown} seconds...</span>
            </div>
          </div>
        )}

        {/* STAGE 3: IF NOT VERIFIED -> BLOCKED */}
        {stage === 'FAILED' && (
          <div className="result-card-container failed-card animate-scale-up font-sans">
            
            {/* Top Brand Logo */}
            <div className="result-brand-header">
              <TriGuardLogo size={36} showText={true} />
            </div>

            {/* Glowing Red Shield Icon */}
            <div className="shield-graphic-wrapper failed-glow">
              <div className="shield-ring-outer-failed"></div>
              <div className="shield-ring-inner-failed"></div>
              <div className="shield-icon-badge-failed">
                <XCircle size={56} className="shield-red-icon" />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="result-text-block">
              <h2 className="result-title font-tech">
                Verification <span className="text-critical font-bold">Failed</span>
              </h2>
              <p className="result-subtitle">
                The verification code is incorrect or expired. Please try again or request a new code.
              </p>
            </div>

            {/* Try Again Button */}
            <button 
              type="button" 
              className="try-again-failed-btn font-tech"
              onClick={handleTryAgain}
            >
              Try Again
            </button>

            {/* Resend Code Link */}
            <div className="failed-actions-footer font-sans">
              <button 
                type="button" 
                className="resend-failed-link"
                onClick={handleResendFromFailed}
              >
                Resend Code
              </button>
            </div>
          </div>
        )}

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
                  <p className="g-sub">to continue to TRI-GUARD Zero-Trust AI</p>
                </div>
              </div>
              <button 
                type="button" 
                className="g-close-btn"
                onClick={() => setShowGoogleModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="g-accounts-list font-sans">
              <div 
                className="g-account-item"
                onClick={() => handleSelectGoogleAccount('mamtha@gmail.com', 'Mamtha S')}
              >
                <div className="g-avatar cyan-avatar">M</div>
                <div className="g-acc-info">
                  <div className="g-acc-name">Mamtha S</div>
                  <div className="g-acc-email">mamtha@gmail.com</div>
                </div>
              </div>

              <div 
                className="g-account-item"
                onClick={() => handleSelectGoogleAccount('security.admin@corporate.com', 'Security Admin')}
              >
                <div className="g-avatar orange-avatar">S</div>
                <div className="g-acc-info">
                  <div className="g-acc-name">Security Admin</div>
                  <div className="g-acc-email">security.admin@corporate.com</div>
                </div>
              </div>
            </div>

            <div className="g-custom-email-box">
              <div className="g-or-divider">Or use another Google account</div>
              <form onSubmit={handleCustomGoogleSubmit} className="g-custom-form">
                <input 
                  type="email" 
                  className="g-input font-mono"
                  placeholder="name@example.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                />
                <button type="submit" className="g-submit-btn font-tech">
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions / Privacy Policy Modal */}
      {showTermsModal && (
        <div className="terms-modal-overlay" onClick={() => setShowTermsModal(null)}>
          <div className="terms-modal-card font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <div className="terms-header-title">
                {showTermsModal === 'TERMS' ? (
                  <FileText size={20} className="text-cyan" />
                ) : (
                  <Shield size={20} className="text-orange" />
                )}
                <h3>
                  {showTermsModal === 'TERMS' ? 'TRI-GUARD Terms & Conditions' : 'TRI-GUARD Privacy Policy'}
                </h3>
              </div>
              <button 
                type="button" 
                className="terms-close-btn" 
                onClick={() => setShowTermsModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="terms-modal-body font-sans">
              {showTermsModal === 'TERMS' ? (
                <>
                  <p><strong>1. Introduction & Acceptance</strong></p>
                  <p>By creating a TRI-GUARD account, you agree to comply with our Zero-Trust Security Policies and enterprise data handling protocols.</p>
                  
                  <p><strong>2. Multi-Layer RAG Protection</strong></p>
                  <p>TRI-GUARD provides three distinct protection layers (Input Filter, Context Isolation, Output Sanitization) to safeguard enterprise RAG pipelines against prompt injection, data poisoning, and unauthorized cross-tenant extraction.</p>
                  
                  <p><strong>3. User Credentials & Account Security</strong></p>
                  <p>Users are responsible for maintaining the confidentiality of their credentials and API access tokens. Any suspicious activity detected by the SOC telemetry engine may trigger automatic session suspension.</p>

                  <p><strong>4. Service Level & Compliance</strong></p>
                  <p>TRI-GUARD guarantees 99.99% system availability with automated SOC2 Type II, HIPAA, and ISO 27001 evidence recording.</p>
                </>
              ) : (
                <>
                  <p><strong>1. Data Collection & Zero-Persistence Guarantee</strong></p>
                  <p>We process query payloads solely for vector similarity validation and threat detection. Proprietary document embeddings are protected with multi-tenant encryption keys.</p>

                  <p><strong>2. Telemetry & Analytics</strong></p>
                  <p>Anonymized attack lab metrics and threat signature data are aggregated across SOC instances to continuously update dynamic firewall rules.</p>

                  <p><strong>3. Encryption Standards</strong></p>
                  <p>All stored metadata and document tokens are encrypted using AES-256 GCM at rest and TLS 1.3 in transit.</p>
                </>
              )}
            </div>

            <div className="terms-modal-footer">
              <button 
                type="button" 
                className="gradient-auth-btn font-tech btn-small"
                onClick={() => {
                  setAgreeTerms(true);
                  setShowTermsModal(null);
                }}
              >
                I AGREE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED CSS STYLES FOR THE INLINE SIGNUP AND VERIFIED/FAILED RESULT SCREENS */}
      <style>{`
        .auth-screen-layout {
          width: 100vw;
          height: 100vh;
          display: flex;
          background: #050814;
          color: #ffffff;
          overflow: hidden;
          position: relative;
        }

        /* Telemetry Banner */
        .telemetry-otp-banner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(4, 16, 38, 0.95);
          border-bottom: 1px solid rgba(0, 240, 255, 0.4);
          padding: 8px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: rgba(226, 232, 240, 0.9);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.15);
        }

        .telemetry-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .otp-code-highlight {
          color: #00f0ff;
          font-weight: 800;
          font-size: 0.92rem;
          letter-spacing: 2px;
          background: rgba(0, 240, 255, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 240, 255, 0.3);
        }

        .telemetry-close-btn {
          background: transparent;
          border: none;
          color: rgba(148, 163, 184, 0.7);
          cursor: pointer;
        }

        .telemetry-close-btn:hover {
          color: #ffffff;
        }

        /* Left Panel */
        .auth-left-panel {
          flex: 1;
          background: linear-gradient(135deg, #030712 0%, #080e22 100%);
          border-right: 1px solid rgba(0, 240, 255, 0.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 50px 70px;
          position: relative;
          overflow: hidden;
        }

        .left-panel-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 90px;
        }

        .left-hero-text {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 500px;
        }

        .hero-heading {
          font-size: 2.9rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .text-orange-grad {
          background: linear-gradient(90deg, #f97316 0%, #ff9d00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 1.1rem;
          color: rgba(226, 232, 240, 0.8);
          line-height: 1.5;
        }

        .orbital-bg-graphic {
          position: absolute;
          bottom: -140px;
          left: -140px;
          width: 640px;
          height: 640px;
          pointer-events: none;
          opacity: 0.85;
        }

        .orbital-svg {
          width: 100%;
          height: 100%;
        }

        /* Right Panel */
        .auth-right-panel {
          flex: 1;
          background: #070b16;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          position: relative;
          overflow-y: auto;
        }

        .form-wrapper {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .form-subtitle {
          font-size: 0.9rem;
          color: rgba(148, 163, 184, 0.9);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          color: rgba(148, 163, 184, 0.6);
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          background: rgba(13, 20, 38, 0.85);
          border: 1px solid rgba(0, 114, 255, 0.25);
          border-radius: 9px;
          padding: 11px 42px 11px 44px;
          color: #ffffff;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .auth-input::placeholder {
          color: rgba(148, 163, 184, 0.5);
        }

        .auth-input:focus {
          border-color: #00f0ff;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.3);
          background: rgba(13, 20, 38, 0.95);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: rgba(148, 163, 184, 0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .eye-toggle-btn:hover {
          color: #ffffff;
        }

        /* Inline Verify Email Block */
        .inline-verify-block {
          background: rgba(13, 27, 62, 0.65);
          border: 1px solid rgba(0, 114, 255, 0.35);
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .inline-verify-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .inline-verify-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .inline-verify-text {
          display: flex;
          flex-direction: column;
        }

        .inline-verify-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
        }

        .inline-verify-sub {
          font-size: 0.73rem;
          color: rgba(148, 163, 184, 0.85);
        }

        .send-code-btn {
          background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
          border: none;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 12px rgba(0, 102, 255, 0.3);
          white-space: nowrap;
        }

        .send-code-btn:hover {
          background: linear-gradient(135deg, #0072ff 0%, #0055ff 100%);
          box-shadow: 0 0 18px rgba(0, 114, 255, 0.5);
        }

        .send-code-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Verification Code Section */
        .verification-code-section {
          background: rgba(10, 18, 38, 0.5);
          border: 1px solid rgba(0, 114, 255, 0.2);
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .v-code-header {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(226, 232, 240, 0.9);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .v-code-icon {
          color: #00f0ff;
        }

        .otp-digit-boxes {
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }

        .otp-box {
          width: 42px;
          height: 42px;
          background: rgba(13, 22, 45, 0.9);
          border: 1px solid rgba(0, 114, 255, 0.35);
          border-radius: 7px;
          text-align: center;
          font-size: 1.15rem;
          font-weight: 700;
          color: #00f0ff;
          outline: none;
          transition: all 0.2s ease;
        }

        .otp-box:focus, .otp-box-active {
          border-color: #00f0ff;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
          background: rgba(15, 28, 58, 0.95);
        }

        .v-code-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
        }

        .v-caption-left {
          color: #00f0ff;
          opacity: 0.9;
        }

        .v-timer-right {
          color: #00f0ff;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .form-options-row {
          display: flex;
          align-items: center;
          font-size: 0.82rem;
          margin-top: 2px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: rgba(203, 213, 225, 0.9);
          user-select: none;
        }

        .checkbox-label input {
          display: none;
        }

        .custom-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid rgba(0, 114, 255, 0.4);
          background: rgba(13, 20, 38, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .checkbox-label input:checked + .custom-checkbox {
          background: #0066ff;
          border-color: #00f0ff;
          box-shadow: 0 0 8px rgba(0, 102, 255, 0.5);
        }

        .checkbox-label input:checked + .custom-checkbox::after {
          content: '✓';
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
        }

        .terms-link-btn {
          background: transparent;
          border: none;
          color: #00f0ff;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .terms-link-btn:hover {
          text-decoration: underline;
        }

        .gradient-auth-btn {
          width: 100%;
          background: linear-gradient(90deg, #0055ff 0%, #0072ff 40%, #f97316 100%);
          border: none;
          color: #ffffff;
          padding: 12px 18px;
          border-radius: 9999px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 20px rgba(0, 85, 255, 0.4);
          transition: all 0.25s ease;
          margin-top: 4px;
        }

        .gradient-auth-btn:hover {
          box-shadow: 0 6px 25px rgba(0, 114, 255, 0.6);
          transform: translateY(-1px);
        }

        .divider-row {
          display: flex;
          align-items: center;
          text-align: center;
          color: rgba(148, 163, 184, 0.5);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin: 2px 0;
        }

        .divider-row::before,
        .divider-row::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divider-row span {
          padding: 0 12px;
        }

        .google-auth-btn {
          width: 100%;
          background: rgba(13, 20, 38, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9px;
          padding: 11px 18px;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .google-auth-btn:hover {
          background: rgba(20, 30, 58, 0.95);
          border-color: rgba(0, 240, 255, 0.3);
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
          font-size: 0.85rem;
          color: rgba(148, 163, 184, 0.8);
        }

        .switch-auth-link {
          background: transparent;
          border: none;
          color: #00f0ff;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 0.85rem;
        }

        .switch-auth-link:hover {
          text-decoration: underline;
        }

        .auth-error-banner {
          background: rgba(255, 0, 85, 0.15);
          border: 1px solid rgba(255, 0, 85, 0.4);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ff3377;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* RESULT CARD STYLING (IF VERIFIED & IF NOT VERIFIED) */
        .result-card-container {
          width: 100%;
          max-width: 480px;
          background: rgba(7, 13, 28, 0.85);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          position: relative;
        }

        .verified-card {
          border: 1px solid rgba(0, 240, 255, 0.35);
          box-shadow: 0 0 40px rgba(0, 240, 255, 0.15), 0 20px 60px rgba(0, 0, 0, 0.8);
        }

        .failed-card {
          border: 1px solid rgba(255, 0, 85, 0.4);
          box-shadow: 0 0 40px rgba(255, 0, 85, 0.18), 0 20px 60px rgba(0, 0, 0, 0.8);
        }

        .result-brand-header {
          margin-bottom: 6px;
        }

        /* Shield Graphic Art */
        .shield-graphic-wrapper {
          position: relative;
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .verified-glow .shield-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(0, 240, 255, 0.4);
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.3);
          animation: pulse-ring 2.5s infinite ease-in-out;
        }

        .verified-glow .shield-ring-inner {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px solid rgba(16, 185, 129, 0.5);
          background: rgba(16, 185, 129, 0.08);
        }

        .verified-glow .shield-icon-badge {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.7));
        }

        .shield-emerald-icon {
          color: #10b981;
        }

        .text-emerald {
          color: #10b981 !important;
        }

        .failed-glow .shield-ring-outer-failed {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 0, 85, 0.5);
          box-shadow: 0 0 25px rgba(255, 0, 85, 0.35);
          animation: pulse-red-ring 2s infinite ease-in-out;
        }

        .failed-glow .shield-ring-inner-failed {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255, 0, 85, 0.4);
          background: rgba(255, 0, 85, 0.08);
        }

        .failed-glow .shield-icon-badge-failed {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 16px rgba(255, 0, 85, 0.8));
        }

        .shield-red-icon {
          color: #ff0055;
        }

        .result-text-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .result-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #ffffff;
        }

        .result-subtitle {
          font-size: 0.92rem;
          color: rgba(226, 232, 240, 0.8);
          line-height: 1.5;
          max-width: 360px;
        }

        /* Buttons on Result Screens */
        .continue-verified-btn {
          width: 100%;
          max-width: 320px;
          background: linear-gradient(90deg, #0055ff 0%, #0072ff 100%);
          border: none;
          color: #ffffff;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 0.96rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 0 25px rgba(0, 114, 255, 0.5);
          transition: all 0.25s ease;
          margin-top: 6px;
        }

        .continue-verified-btn:hover {
          box-shadow: 0 0 35px rgba(0, 114, 255, 0.7);
          transform: translateY(-1px);
        }

        .redirect-status-text {
          font-size: 0.82rem;
          color: rgba(148, 163, 184, 0.7);
        }

        .try-again-failed-btn {
          width: 100%;
          max-width: 320px;
          background: rgba(255, 0, 85, 0.1);
          border: 1px solid rgba(255, 0, 85, 0.6);
          color: #ffffff;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 0.96rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px rgba(255, 0, 85, 0.2);
          margin-top: 6px;
        }

        .try-again-failed-btn:hover {
          background: rgba(255, 0, 85, 0.25);
          box-shadow: 0 0 30px rgba(255, 0, 85, 0.45);
          transform: translateY(-1px);
        }

        .failed-actions-footer {
          margin-top: -8px;
        }

        .resend-failed-link {
          background: transparent;
          border: none;
          color: #00f0ff;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .resend-failed-link:hover {
          text-decoration: underline;
        }

        /* Terms & Conditions Modal Overlay */
        .terms-modal-overlay, .google-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 18, 0.85);
          backdrop-filter: blur(10px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .terms-modal-card, .google-modal-card {
          width: 100%;
          max-width: 500px;
          background: #091022;
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.2);
          display: flex;
          flex-direction: column;
          gap: 16px;
          color: #ffffff;
        }

        .terms-modal-header, .g-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .terms-header-title, .g-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .terms-close-btn, .g-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .terms-modal-body {
          max-height: 280px;
          overflow-y: auto;
          font-size: 0.84rem;
          color: rgba(226, 232, 240, 0.85);
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .terms-modal-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 14px;
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
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(15, 25, 50, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.2s;
        }

        .g-account-item:hover {
          background: rgba(20, 36, 75, 0.8);
          border-color: rgba(0, 240, 255, 0.3);
        }

        .g-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .cyan-avatar {
          background: rgba(0, 240, 255, 0.15);
          color: #00f0ff;
          border: 1px solid rgba(0, 240, 255, 0.4);
        }

        .orange-avatar {
          background: rgba(249, 115, 22, 0.15);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.4);
        }

        .g-acc-name {
          font-size: 0.88rem;
          font-weight: 700;
        }

        .g-acc-email {
          font-size: 0.76rem;
          color: rgba(148, 163, 184, 0.7);
        }

        .g-custom-email-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 12px;
        }

        .g-or-divider {
          font-size: 0.76rem;
          color: rgba(148, 163, 184, 0.6);
        }

        .g-custom-form {
          display: flex;
          gap: 10px;
        }

        .g-input {
          flex: 1;
          background: rgba(10, 16, 32, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.25);
          border-radius: 6px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 0.82rem;
          outline: none;
        }

        .g-submit-btn {
          background: #0066ff;
          border: none;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
