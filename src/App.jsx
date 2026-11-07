import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// SOC Dashboard Components
import ThreatOverviewCard from './components/ThreatOverviewCard';
import ActiveThreatsDonut from './components/ActiveThreatsDonut';
import ThreatActivityFeed from './components/ThreatActivityFeed';
import CentralProtectionShield from './components/CentralProtectionShield';
import SystemMetricsTrio from './components/SystemMetricsTrio';
import ThreatDetectionEngine from './components/ThreatDetectionEngine';
import TopAttackVectors from './components/TopAttackVectors';
import ComplianceStatus from './components/ComplianceStatus';
import IncidentModal from './components/IncidentModal';
import ComplianceModal from './components/ComplianceModal';

// Next Sub-Page Views (Tri-Guard Authorization & Document Security System)
import RagChatView from './components/RagChatView';
import DocumentSecurityView from './components/DocumentSecurityView';
import AttackLabView from './components/AttackLabView';
import SecurityTraceView from './components/SecurityTraceView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import SettingsView from './components/SettingsView';

// Landing & Auth Screens (Tri-Guard Entry Experience)
import SplashScreen from './components/SplashScreen';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';

import { 
  INITIAL_THREAT_SUMMARY, 
  RECENT_THREAT_FEED, 
  INITIAL_SYSTEM_METRICS 
} from './utils/mockData';

export default function App() {
  // Application Authentication & Entry Flow: 'SPLASH' | 'SIGN_IN' | 'SIGN_UP' | 'AUTHENTICATED'
  const [authStage, setAuthStage] = useState('SPLASH');

  // Dynamic Current User Session
  const [currentUser, setCurrentUser] = useState({
    name: 'Mamtha S',
    email: 'mamtha@triguard.ai'
  });

  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All Threats');
  
  const [summary, setSummary] = useState(INITIAL_THREAT_SUMMARY);
  const [feedEvents, setFeedEvents] = useState(RECENT_THREAT_FEED);
  const [metrics, setMetrics] = useState(INITIAL_SYSTEM_METRICS);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);

  // Audio Telemetry Synthesizer
  const playCyberBeep = (freq = 880, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Live Threat Simulation Ticker for SOC Dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      const severities = ['HIGH', 'MEDIUM', 'CRITICAL', 'LOW'];
      const sev = severities[Math.floor(Math.random() * severities.length)];
      const randomIp = `${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
      
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

      const newEvent = {
        id: `evt-${Date.now()}`,
        severity: sev,
        title: sev === 'CRITICAL' ? 'Zero-Day Exploit Attempt' : sev === 'HIGH' ? 'Suspicious Port Scan' : 'API Token Anomaly',
        detail: `Source: ${randomIp}`,
        timestamp: timeStr,
        ip: randomIp,
        vector: sev === 'CRITICAL' ? 'Exploits' : 'Unauthorized Access',
        mitigation: 'Tri-Guard AI isolated socket connection & updated dynamic firewall rules.'
      };

      setFeedEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      
      setSummary((prev) => ({
        ...prev,
        total: prev.total + 1,
        high: sev === 'HIGH' ? prev.high + 1 : prev.high,
        critical: sev === 'CRITICAL' ? prev.critical + 1 : prev.critical
      }));

      playCyberBeep(sev === 'CRITICAL' ? 1200 : 750);
    }, 4500);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleRemediate = (id) => {
    setFeedEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedIncident(null);
    playCyberBeep(1400, 'triangle');
  };

  const handleRemediateAll = () => {
    setFeedEvents([]);
    setSummary((prev) => ({
      ...prev,
      high: 0,
      critical: 0
    }));
    playCyberBeep(1400, 'triangle');
  };

  const handleUserAuth = (userData) => {
    if (userData) {
      setCurrentUser({
        name: userData.name || (userData.email ? userData.email.split('@')[0] : 'Mamtha S'),
        email: userData.email || 'user@triguard.ai'
      });
    }
    setAuthStage('AUTHENTICATED');
  };

  // 1st Stage: Splash Screen
  if (authStage === 'SPLASH') {
    return (
      <SplashScreen 
        onProceed={(targetStage) => setAuthStage(targetStage || 'SIGN_IN')} 
        onGoToSignUp={() => setAuthStage('SIGN_UP')}
      />
    );
  }

  // 2nd Stage: Sign In Screen
  if (authStage === 'SIGN_IN') {
    return (
      <SignInScreen 
        onLogin={handleUserAuth} 
        onGoToSignUp={() => setAuthStage('SIGN_UP')} 
      />
    );
  }

  // 3rd Stage: Sign Up Screen
  if (authStage === 'SIGN_UP') {
    return (
      <SignUpScreen 
        onRegister={handleUserAuth} 
        onGoToSignIn={() => setAuthStage('SIGN_IN')} 
      />
    );
  }

  // Main Authenticated SOC Application Layout
  return (
    <div className="app-layout-wrapper scanline-container">
      {/* Left Vertical Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Container */}
      <div className="app-main-viewport">
        {/* Top Header Navigation */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          currentUser={currentUser}
          onSignOut={() => setAuthStage('SIGN_IN')}
          onGoToSignUp={() => setAuthStage('SIGN_UP')}
        />

        {/* Content Body Area based on Active Navigation Tab */}
        <div className="app-content-area">
          {activeTab === 'DASHBOARD' && (
            <main className="dashboard-grid">
              {/* Left Column */}
              <section className="left-column">
                <ThreatOverviewCard summary={summary} />
                <ActiveThreatsDonut summary={summary} />
                <ThreatActivityFeed 
                  feedEvents={feedEvents} 
                  onSelectIncident={(evt) => {
                    setSelectedIncident(evt);
                    playCyberBeep(600);
                  }} 
                  onRemediateAll={handleRemediateAll}
                />
              </section>

              {/* Center Column */}
              <section className="center-column">
                <CentralProtectionShield />
                <SystemMetricsTrio metrics={metrics} />
              </section>

              {/* Right Column */}
              <section className="right-column">
                <ThreatDetectionEngine />
                <TopAttackVectors />
                <ComplianceStatus 
                  onOpenComplianceModal={() => {
                    setIsComplianceModalOpen(true);
                    playCyberBeep(500);
                  }} 
                />
              </section>
            </main>
          )}

          {activeTab === 'KNOWLEDGE_BASE' && (
            <KnowledgeBaseView />
          )}

          {activeTab === 'DOCUMENT_SECURITY' && (
            <DocumentSecurityView currentUser={currentUser} />
          )}

          {activeTab === 'RAG_CHAT' && (
            <RagChatView playCyberBeep={playCyberBeep} currentUser={currentUser} />
          )}

          {activeTab === 'ATTACK_LAB' && (
            <AttackLabView playCyberBeep={playCyberBeep} currentUser={currentUser} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'SECURITY_TRACE' && (
            <SecurityTraceView currentUser={currentUser} />
          )}

          {activeTab === 'SETTINGS' && (
            <SettingsView />
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <IncidentModal 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)}
        onRemediate={handleRemediate}
      />

      <ComplianceModal 
        isOpen={isComplianceModalOpen} 
        onClose={() => setIsComplianceModalOpen(false)}
      />

      <style>{`
        .app-layout-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
        }

        .app-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-y: auto;
          min-height: 100vh;
        }

        .app-content-area {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
