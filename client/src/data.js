export const transactions = [
  { id: 'TX-240901', title: 'Green Basket Market', kind: 'Card payment', date: 'Today, 10:42 AM', amount: -1240, status: 'Completed', icon: 'shopping' },
  { id: 'TX-240899', title: 'Salary credit · Demo Corp', kind: 'NEFT', date: 'Today, 9:16 AM', amount: 48500, status: 'Completed', icon: 'arrow' },
  { id: 'TX-240892', title: 'Riya Sharma', kind: 'IMPS', date: 'Yesterday, 6:32 PM', amount: -2500, status: 'Completed', icon: 'send' },
  { id: 'TX-240877', title: 'Electricity bill', kind: 'Bill payment', date: 'Yesterday, 11:08 AM', amount: -1840, status: 'Completed', icon: 'bolt' },
  { id: 'TX-240861', title: 'Kailash savings', kind: 'UPI', date: '27 Sep, 4:55 PM', amount: -650, status: 'Completed', icon: 'send' },
];

export const threats = [
  ['T1', 'Phishing / Vishing', 'Social engineering and impersonation', 'Credential theft through deceptive messages or calls', 'Account takeover and unauthorized activity', 'Awareness, MFA, reporting, transaction confirmation', 4, 4, 'Critical'],
  ['T2', 'SIM Swap Fraud', 'Weak carrier account verification', 'Fraudster moves a victim number to a new SIM', 'OTP interception and account takeover', 'Strong MFA, SIM-change signals, step-up checks', 3, 4, 'High'],
  ['T3', 'SQL Injection', 'Unsafe handling of untrusted input', 'Injected query syntax alters database operation', 'Unauthorized data access or modification', 'Parameterized queries, validation, least privilege', 3, 4, 'High'],
  ['T4', 'Man-in-the-Browser', 'Compromised endpoint or browser', 'Malware manipulates a session or transaction', 'Data theft and fraudulent transfers', 'Endpoint hygiene, transaction-bound MFA, monitoring', 2, 4, 'High'],
  ['T5', 'DDoS', 'Distributed traffic from many sources', 'Service flooded with requests', 'Service disruption and loss of availability', 'WAF, rate limits, traffic monitoring, recovery plan', 3, 3, 'High'],
  ['T6', 'ATM/Card Skimming', 'Tampered card reader or hidden camera', 'Card data and PIN captured at a compromised terminal', 'Card fraud and unauthorized access', 'Tamper checks, alerts, card controls, customer awareness', 2, 3, 'Medium'],
  ['T7', 'Business Email Compromise', 'Email account compromise or impersonation', 'Payment instructions changed through deceptive email', 'Misrouted funds and operational loss', 'Out-of-band verification, dual approval, staff training', 3, 4, 'High'],
  ['T8', 'Insider Fraud', 'Excessive access or weak oversight', 'Trusted access misused to alter or disclose records', 'Financial loss and data exposure', 'RBAC, separation of duties, audit monitoring', 2, 4, 'High'],
  ['T9', 'API Abuse', 'Weak API authorization or request controls', 'Automated or unauthorized API access', 'Data exposure, account enumeration, service strain', 'API gateway, ownership checks, rate limits, logging', 3, 3, 'High'],
  ['T10', 'Ransomware', 'Malicious attachment or vulnerable endpoint', 'Data and services encrypted by an attacker', 'Operational disruption and potential data loss', 'Endpoint controls, isolated backups, recovery exercises', 2, 4, 'High'],
  ['T11', 'Session Hijacking / Replay Attack', 'Stolen token or insufficient session controls', 'Captured session credential reused by an attacker', 'Impersonation and unauthorized actions', 'Short-lived tokens, secure sessions, replay checks', 3, 4, 'High'],
  ['T12', 'KYC / Account Database Data Breach', 'Unauthorized database access or misconfiguration', 'Sensitive account records accessed or exfiltrated', 'Privacy harm, fraud, and compliance impact', 'Encryption, RBAC, monitoring, backups, response plan', 2, 4, 'High'],
].map(([id, name, cause, method, impact, mitigation, likelihood, severity, risk]) => ({
  id, name, cause, method, impact, mitigation, likelihood, severity, risk,
}));

export const initialEvents = [
  { id: 'EVT-88421', time: '10:42:16', event: 'LOGIN_SUCCESS', user: 'CUST1001', source: 'Device-001 · Chrome', severity: 'Low', status: 'Reviewed' },
  { id: 'EVT-88420', time: '10:39:52', event: 'MFA_VERIFIED', user: 'CUST1001', source: 'Session-7F2A', severity: 'Low', status: 'Reviewed' },
  { id: 'EVT-88419', time: '10:37:08', event: 'SUSPICIOUS_TRANSACTION', user: 'CUST1001', source: 'Transfer · simulated', severity: 'High', status: 'Open' },
  { id: 'EVT-88418', time: '10:31:44', event: 'API_RATE_LIMIT', user: 'System', source: 'Gateway · demo', severity: 'Medium', status: 'Open' },
  { id: 'EVT-88417', time: '10:28:03', event: 'LOGIN_FAILED', user: 'CUST1001', source: 'Device-Unknown', severity: 'Medium', status: 'Open' },
  { id: 'EVT-88416', time: '10:24:31', event: 'TRANSACTION_APPROVED', user: 'CHECK1001', source: 'Approval-102', severity: 'Low', status: 'Reviewed' },
  { id: 'EVT-88415', time: '10:19:15', event: 'ACCOUNT_ACCESS_DENIED', user: 'CUST1001', source: 'Ownership check', severity: 'Medium', status: 'Reviewed' },
];

export const auditSeed = [
  { time: '10:42:16', user: 'Customer', action: 'LOGIN', device: 'Device-001', resource: 'Authentication', status: 'SUCCESS', risk: 'Low', id: 'AUD-9812' },
  { time: '10:37:08', user: 'Customer', action: 'FUND_TRANSFER', device: 'Device-001', resource: 'Transaction', status: 'REVIEW', risk: 'High', id: 'AUD-9811' },
  { time: '10:24:31', user: 'Approver', action: 'APPROVAL_REVIEW', device: 'Device-002', resource: 'Approval-102', status: 'SUCCESS', risk: 'Medium', id: 'AUD-9810' },
  { time: '09:46:01', user: 'Administrator', action: 'CONTROL_VIEW', device: 'SOC-Console', resource: 'Security controls', status: 'SUCCESS', risk: 'Low', id: 'AUD-9809' },
  { time: '09:42:15', user: 'Customer', action: 'MFA_VERIFIED', device: 'Device-001', resource: 'Authentication', status: 'SUCCESS', risk: 'Low', id: 'AUD-9808' },
];

export const controls = [
  { group: 'Authentication', name: 'Multi-factor authentication', status: 'Active', purpose: 'Adds a second verification step after the password.', mitigates: 'Phishing, credential theft, account takeover', demo: 'Demo OTP challenge (no message is sent)' },
  { group: 'Authentication', name: 'OTP & transaction-bound check', status: 'Active', purpose: 'Confirms a sensitive action with a separate challenge.', mitigates: 'Session misuse, unauthorized transfer', demo: 'Shown in the sign-in and transfer flow' },
  { group: 'Authentication', name: 'PBKDF2 password hashing', status: 'Demonstration', purpose: 'Derives a salted password hash to slow offline guessing.', mitigates: 'Password database exposure', demo: 'Interactive PBKDF2-HMAC-SHA256 lab' },
  { group: 'Authorization', name: 'Role-based access control', status: 'Active', purpose: 'Restricts actions to the signed-in role.', mitigates: 'Privilege misuse, unauthorized actions', demo: 'Customer, administrator, and checker views' },
  { group: 'Authorization', name: 'Least privilege & ownership checks', status: 'Active', purpose: 'Limits each request to permitted records and actions.', mitigates: 'Cross-account access, privilege escalation', demo: 'Role-guarded REST API' },
  { group: 'Authorization', name: 'Maker-checker', status: 'Active', purpose: 'Requires a separate checker for higher-risk work.', mitigates: 'Insider fraud, unauthorized high-value transfer', demo: 'Transfer approval queue' },
  { group: 'Encryption', name: 'TLS 1.3 concept', status: 'Concept', purpose: 'Protects data while it travels between services.', mitigates: 'Interception, tampering in transit', demo: 'Represented in the security pipeline' },
  { group: 'Encryption', name: 'AES-256-GCM & HSM concept', status: 'Demonstration', purpose: 'Authenticated encryption protects confidentiality and integrity.', mitigates: 'Data exposure, undetected modification', demo: 'Interactive AES-GCM encryption and tamper test' },
  { group: 'Encryption', name: 'Data masking & tokenisation', status: 'Active', purpose: 'Reduces exposure of sensitive values in screens and logs.', mitigates: 'Unnecessary sensitive-data exposure', demo: 'Masked demo account identifiers' },
  { group: 'Network Security', name: 'WAF, firewall & API gateway', status: 'Concept', purpose: 'Filters and routes requests through controlled entry points.', mitigates: 'Malicious requests, abuse, service disruption', demo: 'Request stages in transfer pipeline' },
  { group: 'Network Security', name: 'Rate limiting', status: 'Active', purpose: 'Restricts repeated requests over a short period.', mitigates: 'Brute force, API abuse, resource exhaustion', demo: 'Rate-limit event in simulated SOC feed' },
  { group: 'Detection', name: 'IDS/IPS, SIEM & fraud monitoring', status: 'Demonstration', purpose: 'Identifies suspicious behavior and centralizes security events.', mitigates: 'Fraud, intrusion, anomalous access', demo: 'SOC metrics, events, alerts, and risk scoring' },
  { group: 'Detection', name: 'Audit logging', status: 'Active', purpose: 'Records security-relevant actions for review.', mitigates: 'Untraceable actions, weak accountability', demo: 'Searchable simulated audit log' },
  { group: 'Recovery', name: 'Encrypted backup & disaster recovery', status: 'Concept', purpose: 'Supports restoration after disruption or data loss.', mitigates: 'Ransomware, outage, accidental loss', demo: 'Recovery architecture components' },
];

export const architectureLayers = [
  { title: '01 · Prevention', color: 'teal', items: ['WAF', 'MFA', 'TLS', 'Transaction limits', 'Security awareness'] },
  { title: '02 · Detection', color: 'blue', items: ['IDS / IPS', 'SIEM', 'Fraud detection', 'Monitoring'] },
  { title: '03 · Protection', color: 'purple', items: ['AES-256-GCM', 'HSM', 'RBAC', 'Maker-checker', 'Tokenisation'] },
  { title: '04 · Response & recovery', color: 'amber', items: ['Incident response', 'Backup', 'Disaster recovery', 'Forensics', 'Regulatory reporting'] },
];

export const navGroups = [
  { label: 'Overview', items: [['Dashboard', 'dashboard'], ['Accounts & activity', 'accounts'], ['Beneficiaries', 'beneficiaries'], ['Security activity', 'securityActivity'], ['Security alerts', 'alerts']] },
  { label: 'Banking simulation', items: [['Transfer demo', 'transfer'], ['Approvals', 'approvals']] },
  { label: 'Cyber defense', items: [['SOC monitoring', 'soc'], ['Threat center', 'threats'], ['Risk assessment', 'risk'], ['Security controls', 'controls'], ['Security lab', 'lab'], ['Cyber defense architecture', 'architecture'], ['Audit logs', 'audit']] },
  { label: 'Workspace', items: [['Settings', 'settings']] },
];
