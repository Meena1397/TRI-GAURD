import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Settings, 
  Volume2, 
  VolumeX, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  X,
  ExternalLink 
} from 'lucide-react';
import TriGuardLogo from './TriGuardLogo';

export default function Header({ activeTab, setActiveTab, soundEnabled, setSoundEnabled, currentUser, onSignOut, onGoToSignUp }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      severity: 'CRITICAL',
      title: 'Zero-Day Exploit Attempt',
      detail: 'API Gateway socket isolated from 185.220.101.5',
      time: '14:32 UTC',
      read: false
    },
    {
      id: 'notif-2',
      severity: 'HIGH',
      title: 'Cross-Tenant Access Attempt Blocked',
      detail: 'User from Company A tried to access Company B HR data',
      time: '14:28 UTC',
      read: false
    },
    {
      id: 'notif-3',
      severity: 'HIGH',
      title: 'Suspicious Port Scan Filtered',
      detail: 'Tri-Guard dynamic firewall deployed port 8080 probe mitigation',
      time: '14:15 UTC',
      read: false
    },
    {
      id: 'notif-4',
      severity: 'INFO',
      title: 'Compliance Evidence Sync Completed',
      detail: 'Automated evidence collection synchronized for SOC2 & ISO 27001',
      time: '12:30 UTC',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Live Local Time
      const timeFormatted = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setTimeStr(timeFormatted);
      
      // Format Live Local Date
      const dateFormatted = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
      setDateStr(dateFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const navItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'KNOWLEDGE_BASE', label: 'KNOWLEDGE BASE' },
    { id: 'DOCUMENT_SECURITY', label: 'DOCUMENT SECURITY' },
    { id: 'RAG_CHAT', label: 'RAG CHAT' },
    { id: 'ATTACK_LAB', label: 'ATTACK LAB' },
    { id: 'SECURITY_TRACE', label: 'SECURITY TRACE' },
    { id: 'SETTINGS', label: 'SETTINGS' }
  ];

  const userName = currentUser?.name || 'Mamtha S';

  return (
    <header className="header-bar">
      <div className="header-left">
        <TriGuardLogo size={34} />
      </div>

      <nav className="header-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-right">
        {/* User Account Profile Badge & Dropdown */}
        <div className="user-profile-wrapper" ref={userMenuRef} style={{ position: 'relative' }}>
          <div 
            className="user-profile-badge" 
            title="User Profile & Account Menu"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <User size={14} className="user-icon" />
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="tenant-tag">Account Menu ▾</span>
            </div>
          </div>

          {isUserMenuOpen && (
            <div className="user-menu-dropdown font-sans animate-fade-in">
              <div className="user-menu-header">
                <span className="u-header-title">{userName}</span>
                <span className="u-header-email">{currentUser?.email || 'user@triguard.ai'}</span>
              </div>
              <div className="user-menu-actions font-tech">
                <button 
                  type="button" 
                  className="u-menu-btn text-orange"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onGoToSignUp) onGoToSignUp();
                  }}
                >
                  <User size={14} />
                  <span>Create Account (Sign Up)</span>
                </button>
                <button 
                  type="button" 
                  className="u-menu-btn text-muted"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                >
                  <X size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell Icon & Interactive Dropdown */}
        <div className="notification-wrapper" ref={dropdownRef}>
          <button 
            className={`icon-btn notification-btn ${isNotificationsOpen ? 'active-btn' : ''}`} 
            title="Live Security Alerts"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {/* Notifications Dropdown Modal / Panel */}
          {isNotificationsOpen && (
            <div className="notifications-dropdown font-sans">
              <div className="dropdown-header">
                <div className="header-title-flex font-tech">
                  <ShieldAlert size={16} className="text-critical" />
                  <span>LIVE SECURITY ALERTS</span>
                  {unreadCount > 0 && (
                    <span className="unread-count-pill font-mono">{unreadCount} NEW</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button className="mark-read-btn font-mono" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-list font-mono">
                {notifications.map((notif) => {
                  let badgeStyle = 'badge-critical';
                  let iconElement = <ShieldAlert size={14} className="text-critical" />;
                  if (notif.severity === 'HIGH') {
                    badgeStyle = 'badge-high';
                    iconElement = <AlertTriangle size={14} className="text-high" />;
                  } else if (notif.severity === 'INFO') {
                    badgeStyle = 'badge-low';
                    iconElement = <Info size={14} className="text-cyan" />;
                  }

                  return (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'item-unread' : ''}`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <div className="item-header-row font-sans">
                        <div className="item-title-flex">
                          {iconElement}
                          <span className="item-title">{notif.title}</span>
                        </div>
                        <span className="item-time">{notif.time}</span>
                      </div>

                      <p className="item-detail">{notif.detail}</p>

                      <div className="item-footer">
                        <span className={`badge-severity ${badgeStyle}`}>{notif.severity}</span>
                        {!notif.read && <span className="unread-dot"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dropdown-footer font-tech">
                <button 
                  className="view-trace-btn"
                  onClick={() => {
                    setActiveTab('SECURITY_TRACE');
                    setIsNotificationsOpen(false);
                  }}
                >
                  <span>VIEW SECURITY TRACE MONITOR</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn" title="System Settings" onClick={() => setActiveTab('SETTINGS')}>
          <Settings size={15} />
        </button>

        <div className="time-display">
          <div className="time-utc">{timeStr}</div>
          <div className="date-utc">{dateStr}</div>
        </div>
      </div>

      <style>{`
        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 20px;
          background: rgba(4, 9, 24, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 240, 255, 0.16);
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7);
          z-index: 90;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          background: rgba(8, 14, 32, 0.7);
          padding: 3px 6px;
          border-radius: 6px;
          border: 1px solid rgba(0, 240, 255, 0.12);
        }

        .nav-tab {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-family: var(--font-tech);
          font-size: 0.76rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 5px;
          cursor: pointer;
          letter-spacing: 0.8px;
          transition: all 0.2s ease;
        }

        .nav-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-tab.active {
          color: #ffffff;
          background: linear-gradient(180deg, rgba(0, 114, 255, 0.5) 0%, rgba(0, 240, 255, 0.2) 100%);
          border: 1px solid var(--color-cyan);
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.35), inset 0 0 8px rgba(0, 240, 255, 0.2);
          text-shadow: 0 0 8px rgba(0, 240, 255, 0.9);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 240, 255, 0.06);
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .user-icon {
          color: var(--color-cyan);
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
        }

        .tenant-tag {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--color-cyan);
        }

        .icon-btn {
          background: rgba(10, 18, 40, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.18);
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .icon-btn:hover, .active-btn {
          color: var(--color-cyan);
          border-color: var(--color-cyan);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }

        .icon-btn.active-audio {
          color: var(--color-cyan);
          border-color: var(--color-cyan);
        }

        .notification-wrapper {
          position: relative;
        }

        .notification-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--color-critical);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--bg-primary);
          box-shadow: 0 0 8px var(--color-critical);
        }

        .notifications-dropdown {
          position: absolute;
          top: 42px;
          right: 0;
          width: 340px;
          background: rgba(8, 14, 32, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          animation: dropdownFade 0.2s ease-out;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: rgba(0, 240, 255, 0.06);
          border-bottom: 1px solid rgba(0, 240, 255, 0.15);
        }

        .header-title-flex {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .unread-count-pill {
          background: rgba(255, 0, 85, 0.2);
          color: #ff3377;
          border: 1px solid rgba(255, 0, 85, 0.5);
          font-size: 0.6rem;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .mark-read-btn {
          background: transparent;
          border: none;
          color: var(--color-cyan);
          font-size: 0.65rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .notifications-list {
          max-height: 320px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: background 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .notification-item:hover {
          background: rgba(0, 240, 255, 0.06);
        }

        .item-unread {
          background: rgba(0, 240, 255, 0.03);
        }

        .item-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .item-title-flex {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .item-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
        }

        .item-time {
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .item-detail {
          font-size: 0.68rem;
          color: var(--text-secondary);
          line-height: 1.3;
          margin: 0;
        }

        .item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2px;
        }

        .unread-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-cyan);
          box-shadow: 0 0 6px var(--color-cyan);
        }

        .dropdown-footer {
          padding: 8px 12px;
          background: rgba(4, 9, 24, 0.95);
          border-top: 1px solid rgba(0, 240, 255, 0.12);
        }

        .view-trace-btn {
          width: 100%;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.25);
          color: var(--color-cyan);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .view-trace-btn:hover {
          background: rgba(0, 240, 255, 0.2);
          color: #ffffff;
        }

        .text-critical { color: #ff3377; }
        .text-high { color: #fb923c; }
        .text-cyan { color: var(--color-cyan); }

        .time-display {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: var(--font-mono);
          padding-left: 10px;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .time-utc {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .date-utc {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        /* USER PROFILE DROPDOWN MENU */
        .user-menu-dropdown {
          position: absolute;
          top: 42px;
          right: 0;
          width: 220px;
          background: rgba(8, 14, 32, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
        }

        .user-menu-header {
          padding: 10px 14px;
          background: rgba(0, 240, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
        }

        .u-header-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffffff;
        }

        .u-header-email {
          font-size: 0.68rem;
          color: var(--color-cyan);
        }

        .user-menu-actions {
          display: flex;
          flex-direction: column;
          padding: 6px;
        }

        .u-menu-btn {
          width: 100%;
          background: transparent;
          border: none;
          padding: 8px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }

        .u-menu-btn:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .text-orange { color: #f97316 !important; }
        .text-muted { color: var(--text-muted) !important; }
      `}</style>
    </header>
  );
}
