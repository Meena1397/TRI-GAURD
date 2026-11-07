export const INITIAL_THREAT_SUMMARY = {
  total: 24387,
  high: 1934,
  medium: 4387,
  low: 17638,
  critical: 428,
  totalChange: '+12.4%',
  highChange: '+15.3%',
  mediumChange: '+3.2%',
  lowChange: '-1.1%'
};

export const INITIAL_ATTACK_VECTORS = [
  { name: 'Malware', percentage: 38.7, color: '#ef4444' },
  { name: 'Phishing', percentage: 24.1, color: '#f97316' },
  { name: 'Exploits', percentage: 17.3, color: '#eab308' },
  { name: 'Unauthorized Access', percentage: 12.6, color: '#3b82f6' },
  { name: 'Other', percentage: 7.3, color: '#10b981' }
];

export const INITIAL_SYSTEM_METRICS = {
  endpoints: { protected: 7892, atRisk: 23, total: 7915 },
  cloud: { protected: 1256, atRisk: 8, total: 1264 },
  network: { protected: 4325, atRisk: 17, total: 4342 }
};

export const RECENT_THREAT_FEED = [
  {
    id: 'evt-001',
    severity: 'CRITICAL',
    title: 'Ransomware Detected',
    detail: 'Endpoint: FIN-LAPTOP-32',
    timestamp: '14:35:22',
    ip: '192.168.1.104',
    vector: 'Malware',
    mitigation: 'Isolated endpoint from network & initialized memory dump snapshot.'
  },
  {
    id: 'evt-002',
    severity: 'HIGH',
    title: 'Unauthorized Access Attempt',
    detail: 'User: admin@corporate.com',
    timestamp: '14:35:18',
    ip: '45.142.120.9',
    vector: 'Brute Force / Credential Stuffing',
    mitigation: 'Triggered step-up MFA challenge & temporarily rate-limited IP.'
  },
  {
    id: 'evt-003',
    severity: 'HIGH',
    title: 'Malicious IP Connection Blocked',
    detail: 'Source IP: 185.234.216.98',
    timestamp: '14:35:15',
    ip: '185.234.216.98',
    vector: 'Exploit / C2 Connection',
    mitigation: 'Dropped all inbound packet flow via eBPF perimeter firewall.'
  },
  {
    id: 'evt-004',
    severity: 'MEDIUM',
    title: 'Suspicious File Behavior',
    detail: 'File: invoice_update.exe',
    timestamp: '14:35:10',
    ip: '10.0.4.19',
    vector: 'Phishing attachment',
    mitigation: 'Quarantined file to Tri-Guard AI Sandbox for dynamic analysis.'
  },
  {
    id: 'evt-005',
    severity: 'LOW',
    title: 'Phishing Email Quarantined',
    detail: 'User: j.doe@corporate.com',
    timestamp: '14:35:05',
    ip: '103.21.244.0',
    vector: 'Phishing',
    mitigation: 'Email headers neutralized; domain added to global blocklist.'
  }
];

export const MAP_NODES = [
  { id: 'us-east', name: 'New York (US-East)', x: 260, y: 145, status: 'active', attackCount: 142 },
  { id: 'us-west', name: 'San Francisco (US-West)', x: 180, y: 160, status: 'active', attackCount: 98 },
  { id: 'eu-west', name: 'London (UK)', x: 470, y: 120, status: 'critical', attackCount: 312 },
  { id: 'eu-central', name: 'Frankfurt (DE)', x: 505, y: 125, status: 'active', attackCount: 205 },
  { id: 'ap-east', name: 'Tokyo (JP)', x: 790, y: 165, status: 'critical', attackCount: 489 },
  { id: 'ap-south', name: 'Singapore (SG)', x: 730, y: 245, status: 'active', attackCount: 176 },
  { id: 'sa-east', name: 'São Paulo (BR)', x: 330, y: 290, status: 'normal', attackCount: 45 },
  { id: 'au-east', name: 'Sydney (AU)', x: 840, y: 310, status: 'normal', attackCount: 62 }
];

export const COMPLIANCE_ITEMS = [
  { id: 'iso27001', name: 'ISO 27001', score: 98, status: 'Compliant', icon: 'ShieldCheck', totalControls: 114, passedControls: 112 },
  { id: 'soc2', name: 'SOC 2 Type II', score: 100, status: 'Compliant', icon: 'Award', totalControls: 64, passedControls: 64 },
  { id: 'gdpr', name: 'GDPR', score: 96, status: 'Compliant', icon: 'Lock', totalControls: 88, passedControls: 85 },
  { id: 'hipaa', name: 'HIPAA', score: 99, status: 'Compliant', icon: 'Activity', totalControls: 52, passedControls: 51 }
];

export const SCANNING_STAGES = [
  { id: 1, label: 'Behavior Analysis Scanning...', status: 'scanning' },
  { id: 2, label: 'Anomaly Detection Scanning...', status: 'scanning' },
  { id: 3, label: 'ML Classification Scanning...', status: 'scanning' },
  { id: 4, label: 'Threat Correlation Scanning...', status: 'scanning' }
];
