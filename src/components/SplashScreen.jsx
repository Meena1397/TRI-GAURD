import React from 'react';
import TriGuardLogo from './TriGuardLogo';
import { ArrowRight, Shield, UserPlus } from 'lucide-react';

export default function SplashScreen({ onProceed, onGoToSignUp }) {
  return (
    <div className="splash-screen-container" onClick={() => onProceed && onProceed('SIGN_IN')}>
      {/* Background Cyber Glow & Grid Effects */}
      <div className="splash-bg-glow cyan-glow" />
      <div className="splash-bg-glow orange-glow" />
      <div className="splash-grid-pattern" />

      {/* Main Centered Content */}
      <div className="splash-content-box">
        <div className="splash-logo-wrapper">
          <TriGuardLogo 
            showText={true} 
            layout="vertical" 
            size={240} 
            subtitleText="THREE-LAYER ZERO-TRUST SECURITY FOR RAG" 
          />
        </div>

        {/* Action Buttons Row */}
        <div className="splash-buttons-row">
          <button className="splash-proceed-btn font-tech" onClick={(e) => { e.stopPropagation(); onProceed && onProceed('SIGN_IN'); }}>
            <Shield size={16} className="text-cyan" />
            <span>ENTER PORTAL</span>
            <ArrowRight size={16} />
          </button>

          <button className="splash-signup-btn font-tech" onClick={(e) => { e.stopPropagation(); onGoToSignUp ? onGoToSignUp() : onProceed('SIGN_UP'); }}>
            <UserPlus size={16} className="text-orange" />
            <span>SIGN UP</span>
          </button>
        </div>
      </div>

      <div className="splash-footer-note font-mono">
        System Initialized • v2.4 Zero-Trust Architecture • Click anywhere to continue
      </div>

      <style>{`
        .splash-screen-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #030712;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          cursor: pointer;
          overflow: hidden;
          user-select: none;
        }

        .splash-bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.22;
          pointer-events: none;
        }

        .cyan-glow {
          top: -100px;
          left: -100px;
          background: #00f0ff;
        }

        .orange-glow {
          bottom: -100px;
          right: -100px;
          background: #f97316;
        }

        .splash-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .splash-content-box {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          padding: 20px;
          animation: splashFadeIn 0.8s ease-out;
        }

        @keyframes splashFadeIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }

        .splash-logo-wrapper {
          transform: scale(1.05);
          filter: drop-shadow(0 0 40px rgba(0, 240, 255, 0.25));
        }

        .splash-buttons-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 10px;
        }

        .splash-proceed-btn, .splash-signup-btn {
          background: rgba(8, 16, 36, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.35);
          color: #ffffff;
          padding: 12px 28px;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.25), inset 0 0 12px rgba(0, 240, 255, 0.15);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .splash-proceed-btn {
          animation: btnPulse 2.5s infinite ease-in-out;
        }

        .splash-signup-btn {
          border-color: rgba(249, 115, 22, 0.45);
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.25), inset 0 0 12px rgba(249, 115, 22, 0.15);
        }

        .splash-proceed-btn:hover {
          background: linear-gradient(90deg, rgba(0, 114, 255, 0.4), rgba(0, 240, 255, 0.4));
          border-color: #00f0ff;
          box-shadow: 0 0 40px rgba(0, 240, 255, 0.5), inset 0 0 20px rgba(0, 240, 255, 0.3);
          transform: scale(1.05);
        }

        .splash-signup-btn:hover {
          background: linear-gradient(90deg, rgba(249, 115, 22, 0.4), rgba(255, 157, 0, 0.4));
          border-color: #f97316;
          box-shadow: 0 0 40px rgba(249, 115, 22, 0.5), inset 0 0 20px rgba(249, 115, 22, 0.3);
          transform: scale(1.05);
        }

        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.25); }
          50% { box-shadow: 0 0 35px rgba(0, 240, 255, 0.5); }
        }

        .splash-footer-note {
          position: absolute;
          bottom: 24px;
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 1px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
