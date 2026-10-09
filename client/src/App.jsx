import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, ArrowDownLeft, ArrowRight, ArrowUpRight, Banknote,
  Bell, BookOpenCheck, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  Cloud, Cpu, Download, Eye, EyeOff, FileClock, Fingerprint, Gauge, Globe2,
  KeyRound, LayoutDashboard, LockKeyhole, LogOut, Menu, MonitorCog, MoreHorizontal,
  Network, Plus, Search, Send, Shield, ShieldAlert, ShieldCheck,
  ShoppingBag, Smartphone, Sparkles, UserRound, Users, Wallet, X, Zap, Settings,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  architectureLayers, auditSeed, controls, initialEvents, navGroups, threats, transactions,
} from './data.js';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
const customerProfiles = {
  CUST1001: { name: 'Kailash Sharma', role: 'customer', title: 'Customer' },
  ADMIN1001: { name: 'Security Administrator', role: 'admin', title: 'Security administrator' },
  CHECK1001: { name: 'Maitri Sharma', role: 'checker', title: 'Approver / checker' },
};
const money = (value) => `₹${Math.abs(value).toLocaleString('en-IN')}`;
const Icon = ({ name, size = 18 }) => {
  const icons = { shopping: ShoppingBag, arrow: ArrowDownLeft, send: Send, bolt: Zap };
  const Component = icons[name] || Activity;
  return <Component size={size} />;
};
const cx = (...classes) => classes.filter(Boolean).join(' ');

function DemoBadge() {
  return <span className="demo-badge"><span className="demo-dot" /> DEMO ENVIRONMENT</span>;
}

function Login({ onAuthenticated }) {
  const [customerId, setCustomerId] = useState('CUST1001');
  const [password, setPassword] = useState('Shield@2026');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('credentials');
  const [message, setMessage] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(sessionStorage.getItem('cybershield-remember-device') === 'true');
  const selected = customerProfiles[customerId.toUpperCase()] || customerProfiles.CUST1001;

  async function submitCredentials(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { customerId, password });
      setDemoOtp(data.demoOtp);
      setChallengeId(data.challengeId);
      setStep('mfa');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not reach the demo API. Start the server and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-mfa', { customerId, otp, challengeId });
      sessionStorage.setItem('cybershield-token', data.token);
      onAuthenticated({ ...data.user, customerId, title: customerProfiles[customerId.toUpperCase()]?.title || 'Customer' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'The demo OTP could not be verified.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="login-shell">
    <section className="login-story">
      <div className="brand-lockup"><div className="brand-mark"><ShieldCheck size={23} /></div><span>CyberShield<span className="brand-light"> Banking</span></span></div>
      <div className="login-story-copy">
        <div className="eyebrow light-eyebrow"><span className="live-pulse" /> INFORMATION SECURITY · SEMESTER 7</div>
        <h1>Banking, protected<br />at every layer.</h1>
        <p>An interactive walkthrough of the security controls that help protect digital banking journeys.</p>
        <div className="story-controls">
          {[[ShieldCheck, 'Layered defense', 'Prevention · Detection · Response'], [Fingerprint, 'Strong identity', 'MFA · RBAC · Device signals'], [Activity, 'Always monitoring', 'Fraud signals · Security events']].map(([Symbol, label, detail]) =>
            <div className="story-control" key={label}><span className="story-icon"><Symbol size={17} /></span><div><b>{label}</b><small>{detail}</small></div><Check size={16} className="story-check" /></div>)}
        </div>
      </div>
      <span className="story-footer">ACADEMIC PROTOTYPE · NO REAL ACCOUNTS OR TRANSACTIONS</span>
    </section>
    <section className="login-panel">
      <div className="login-panel-head"><DemoBadge /><span className="tiny-secure"><LockKeyhole size={14} /> Secure demo session</span></div>
      <div className="login-form-wrap">
        <div className="login-avatar"><Shield size={23} /></div>
        {step === 'credentials' ? <>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your<br />secure workspace</h2>
          <p className="muted-copy">This prototype uses fictional data for classroom demonstration.</p>
          <form onSubmit={submitCredentials} className="form-stack">
            <label>Demo user role<select value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="CUST1001">Customer · Kailash Sharma</option><option value="ADMIN1001">Security administrator</option><option value="CHECK1001">Approver / checker · Maitri Sharma</option></select></label>
            <label>Customer ID<input value={customerId} onChange={(e) => setCustomerId(e.target.value.toUpperCase())} autoComplete="username" required /></label>
            <label>Password<span className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /><button type="button" className="icon-button password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
            <div className="login-options"><label className="check-label"><input type="checkbox" checked={rememberDevice} onChange={(event) => { setRememberDevice(event.target.checked); sessionStorage.setItem('cybershield-remember-device', String(event.target.checked)); }} /> Remember this demo device</label><button type="button" className="text-button" onClick={() => setMessage('For this demonstration, use the published demo credentials shown below.')}>Forgot password?</button></div>
            {message && <div className="inline-error" role="alert">{message}</div>}
            <button className="primary-button full-button" disabled={loading}>{loading ? 'Verifying credentials…' : 'Continue securely'} <ArrowRight size={16} /></button>
          </form>
          <div className="login-demo-hint"><KeyRound size={16} /><span>Demo credentials: <b>{selected.customerId || customerId}</b> / <b>Shield@2026</b></span></div>
        </> : <>
          <span className="eyebrow">SECOND FACTOR · DEMO ONLY</span>
          <h2>Verify it’s<br />really you</h2>
          <p className="muted-copy">A one-time code is generated locally for this demo. No SMS or email is sent.</p>
          <form onSubmit={verifyOtp} className="form-stack">
            <div className="otp-demo"><span>YOUR DEMO OTP</span><strong>{demoOtp}</strong><small>Do not use as a real banking code</small></div>
            <label>6-digit demo code<input inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Enter the code above" required /></label>
            {message && <div className="inline-error" role="alert">{message}</div>}
            <button className="primary-button full-button" disabled={loading}>{loading ? 'Verifying…' : 'Verify & open workspace'} <ArrowRight size={16} /></button>
            <button type="button" className="back-button" onClick={() => { setStep('credentials'); setOtp(''); }}>Back to sign in</button>
          </form>
        </>}
        <div className="login-footnote"><LockKeyhole size={13} /> Authentication and every transaction in this prototype are simulated.</div>
      </div>
    </section>
  </main>;
}

function Header({ user, onLogout, onPresent, presenting, onToggleMenu, onAlerts }) {
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={onToggleMenu} aria-label="Open navigation"><Menu size={20} /></button>
    <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><b>Demo environment</b></div>
    <div className="topbar-actions"><button className={cx('presentation-button', presenting && 'presenting')} onClick={onPresent}><Sparkles size={15} />{presenting ? 'Exit presentation' : 'Presentation mode'}</button><DemoBadge /><button className="notification-button" aria-label="Notifications" onClick={onAlerts}><Bell size={18} /><i /></button><div className="user-chip"><span className="user-avatar">{user.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span><span><b>{user.name}</b><small>{user.title}</small></span><button className="icon-button logout" onClick={onLogout} title="Sign out"><LogOut size={16} /></button></div></div>
  </header>;
}

function Sidebar({ user, approvals, page, setPage, open, onClose }) {
  return <aside className={cx('sidebar', open && 'sidebar-open')}>
    <div className="side-brand"><div className="brand-mark"><ShieldCheck size={22} /></div><span>CyberShield<small>SECURITY PLATFORM</small></span><button className="side-close icon-button" onClick={onClose}><X size={18} /></button></div>
    <div className="workspace-label">DEMO WORKSPACE <ChevronDown size={13} /></div>
    <nav>
      {navGroups.map((group) => {
        const allowed = group.items.filter(([, key]) => {
          if (user.role === 'customer') return ['dashboard', 'accounts', 'beneficiaries', 'securityActivity', 'alerts', 'transfer', 'controls', 'lab', 'architecture', 'settings'].includes(key);
          if (user.role === 'checker') return ['dashboard', 'approvals', 'audit', 'settings'].includes(key);
          return ['dashboard', 'soc', 'threats', 'risk', 'controls', 'lab', 'architecture', 'audit', 'alerts', 'settings'].includes(key);
        });
        if (!allowed.length) return null;
        return <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{allowed.map(([label, key]) => {
          const IconComponent = navIcon[key] || LayoutDashboard;
          const pendingCount = approvals.filter((approval) => approval.status === 'PENDING').length;
          return <button key={key} onClick={() => { setPage(key); onClose(); }} className={cx('nav-link', page === key && 'active')}><IconComponent size={17} /><span>{label}</span>{key === 'approvals' && user.role === 'checker' && pendingCount > 0 && <i className="nav-count">{pendingCount}</i>}</button>;
        })}</div>;
      })}
    </nav>
    <div className="side-bottom">
      <div className="side-security"><div className="side-security-icon"><ShieldCheck size={17} /></div><div><b>All systems protected</b><small>Security controls active</small></div><span className="status-dot" /></div>
      <div className="side-user"><span className="user-avatar">{user.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span><span><b>{user.name}</b><small>{user.title}</small></span><MoreHorizontal size={18} /></div>
      <p className="side-disclaimer">SIMULATED ENVIRONMENT<br />No real funds or accounts</p>
    </div>
  </aside>;
}

const navIcon = { dashboard: LayoutDashboard, accounts: Wallet, beneficiaries: Users, securityActivity: Activity, alerts: Bell, transfer: Send, approvals: BookOpenCheck, soc: Activity, threats: ShieldAlert, risk: Gauge, controls: MonitorCog, lab: Cpu, architecture: Network, audit: FileClock, settings: Settings };

function PageHeading({ eyebrow = 'SECURE DIGITAL BANKING', title, subtitle, action, children }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow} <span className="heading-demo">· DEMO</span></span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="heading-actions">{action}{children}</div></div>;
}

function Why({ children }) {
  const [open, setOpen] = useState(false);
  return <div className="why-wrap"><button className="why-toggle" onClick={() => setOpen(!open)}><CircleHelp size={15} /> Why this matters? <ChevronDown size={14} className={open ? 'rotate' : ''} /></button>{open && <p className="why-copy">{children}</p>}</div>;
}

function Metric({ label, value, change, icon: Symbol, tone = 'blue', detail }) {
  return <div className="metric-card"><div className={cx('metric-icon', tone)}><Symbol size={18} /></div><span className="metric-label">{label}</span><strong>{value}</strong><div className="metric-bottom"><span className={cx('metric-change', change?.startsWith('+') && 'positive')}>{change}</span><span>{detail}</span></div></div>;
}

function Status({ children }) {
  const text = String(children).toLowerCase();
  const tone = text.includes('critical') || text.includes('high') || text.includes('blocked') || text.includes('open') ? 'red' : text.includes('medium') || text.includes('review') || text.includes('pending') || text.includes('required') ? 'amber' : text.includes('active') || text.includes('success') || text.includes('completed') || text.includes('normal') || text.includes('low') || text.includes('reviewed') ? 'green' : 'blue';
  return <span className={`status-pill ${tone}`}><i />{children}</span>;
}

function Dashboard({ user, go, approvals }) {
  const [period, setPeriod] = useState('This week');
  const chart = period === 'This month'
    ? [{ day: 'W1', amount: 18 }, { day: 'W2', amount: 21 }, { day: 'W3', amount: 16 }, { day: 'W4', amount: 29 }]
    : period === 'This year'
      ? [{ day: 'Jan', amount: 14 }, { day: 'Mar', amount: 19 }, { day: 'May', amount: 17 }, { day: 'Jul', amount: 25 }, { day: 'Sep', amount: 29 }]
      : [{ day: 'Mon', amount: 12 }, { day: 'Tue', amount: 18 }, { day: 'Wed', amount: 14 }, { day: 'Thu', amount: 25 }, { day: 'Fri', amount: 20 }, { day: 'Sat', amount: 29 }, { day: 'Sun', amount: 24 }];
  const mix = [{ name: 'Card', value: 34, color: '#087e78' }, { name: 'UPI', value: 28, color: '#3b82f6' }, { name: 'Transfers', value: 22, color: '#8b79dc' }, { name: 'Bills', value: 16, color: '#efb34e' }];
  return <><PageHeading eyebrow="WEDNESDAY, 30 SEPTEMBER 2026" title={`Good morning, ${user.name.split(' ')[0]}`} subtitle="Last demo login 10:42 AM · Device-001 · Review your security and activity overview." action={<button className="secondary-button" onClick={() => go('transfer')}><Send size={15} /> New transfer</button>} />
    <div className="notice-bar"><ShieldCheck size={18} /><span><b>You’re protected.</b> All core demo security controls are active and monitoring this simulated session.</span><Status>Active</Status></div>
    <div className="metrics-grid dashboard-metrics">
      <Metric label="Available balance" value="₹1,24,580.00" change="+₹48,500" detail="this month" icon={Wallet} tone="teal" />
      <Metric label="Current account" value="₹42,300.00" change="•••• 3021" detail="Demo account" icon={Banknote} />
      <Metric label="Savings account" value="₹82,280.00" change="•••• 9184" detail="Demo account" icon={ShieldCheck} tone="purple" />
      <Metric label="Monthly transactions" value="24" change="This month" detail="Simulated activity" icon={Activity} tone="amber" />
      <Metric label="Security score" value="96 / 100" change="+4 pts" detail="Strong posture" icon={Gauge} tone="green" />
    </div>
    <div className="dashboard-grid">
      <section className="card activity-card"><div className="card-head"><div><span className="eyebrow">ACCOUNT ACTIVITY</span><h3>Transaction overview</h3></div><select className="filter-select chart-period" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Chart period"><option>This week</option><option>This month</option><option>This year</option></select></div><div className="chart-key"><span><i className="key-dot teal-dot" /> Inflow</span><span><i className="key-dot blue-dot" /> Outflow</span><b>₹68,240 <small>total movement · {period.toLowerCase()}</small></b></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{ top: 12, right: 3, left: -24, bottom: 0 }}><defs><linearGradient id="amountFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0c8e82" stopOpacity={0.19} /><stop offset="95%" stopColor="#0c8e82" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#edf1f5" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8c9aab', fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c9aab', fontSize: 10 }} /><Tooltip contentStyle={{ border: '1px solid #e9eef3', borderRadius: 10, fontSize: 12 }} /><Area type="monotone" dataKey="amount" stroke="#087e78" strokeWidth={2.5} fill="url(#amountFill)" /></AreaChart></ResponsiveContainer></div></section>
      <section className="card mix-card"><div className="card-head"><div><span className="eyebrow">SPENDING</span><h3>Activity mix</h3></div><MoreHorizontal size={19} className="decorative-more" aria-hidden="true" /></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={mix} dataKey="value" innerRadius={58} outerRadius={78} paddingAngle={4} stroke="none">{mix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><b>24</b><span>transactions</span></div></div><div className="mix-legend">{mix.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<b>{item.value}%</b></span>)}</div></section>
    </div>
    <div className="dashboard-grid lower-grid">
      <section className="card transactions-card"><div className="card-head"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Recent transactions</h3></div><button className="text-button" onClick={() => go('accounts')}>View all <ArrowRight size={14} /></button></div><div className="transaction-list">{transactions.slice(0, 4).map((tx) => <div className="transaction-row" key={tx.id}><span className="transaction-icon"><Icon name={tx.icon} /></span><span className="transaction-description"><b>{tx.title}</b><small>{tx.kind} · {tx.date}</small></span><Status>{tx.status}</Status><strong className={tx.amount > 0 ? 'money-in' : ''}>{tx.amount > 0 ? '+' : '−'}{money(tx.amount)}</strong></div>)}</div></section>
      <section className="card security-card"><div className="card-head"><div><span className="eyebrow">SECURITY POSTURE</span><h3>Protected by design</h3></div><span className="security-score"><ShieldCheck size={17} /> 96</span></div><div className="security-list">{[['Multi-factor authentication', 'Enabled', LockKeyhole], ['Device binding', 'Active', Smartphone], ['Fraud monitoring', 'Monitoring', Activity], ['Session security', 'Protected', ShieldCheck]].map(([label, status, Symbol]) => <div className="security-row" key={label}><span className="security-row-icon"><Symbol size={15} /></span><span>{label}</span><Status>{status}</Status></div>)}</div><Why>Layered controls reduce the chance that a stolen password alone can be used to access an account or perform a sensitive action.</Why></section>
    </div>
    {user.role === 'checker' && <div className="notice-bar approval-notice"><BookOpenCheck size={18} /><span><b>{approvals.length} simulated approvals need review.</b> Maker-checker keeps the submitter and approver separate.</span><button className="text-button" onClick={() => go('approvals')}>Review queue <ArrowRight size={14} /></button></div>}
  </>;
}

function Accounts() {
  return <><PageHeading title="Accounts & activity" subtitle="Fictional account records and simulated activity for this demo." /><div className="account-cards"><div className="account-banner"><div><span className="eyebrow">CURRENT ACCOUNT · DEMO</span><h2>Everyday account</h2><span className="masked-number">XXXX XXXX XXXX 3021 <span className="mask-icon" aria-label="Account number remains masked"><Eye size={14} /></span></span></div><strong>₹42,300.00</strong><div className="account-banner-mark"><ShieldCheck size={42} /></div></div><div className="account-banner savings-banner"><div><span className="eyebrow">SAVINGS ACCOUNT · DEMO</span><h2>Smart savings</h2><span className="masked-number">XXXX XXXX XXXX 9184 <span className="mask-icon" aria-label="Account number remains masked"><Eye size={14} /></span></span></div><strong>₹82,280.00</strong><div className="account-banner-mark"><Sparkles size={39} /></div></div></div><section className="card table-card"><div className="card-head"><div><span className="eyebrow">ACTIVITY HISTORY</span><h3>Recent transactions</h3></div><button className="secondary-button compact" onClick={() => window.alert('This export contains fictional demo data only.')}><Download size={14} /> Export demo</button></div><TransactionTable /></section><Why>Account masking limits how much sensitive information is visible in a user interface or in a screenshot.</Why></>;
}

function Beneficiaries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [saved, setSaved] = useState('');

  async function loadBeneficiaries() {
    setLoading(true);
    try {
      const { data } = await API.get('/beneficiaries');
      setItems(data.items);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load demo beneficiaries.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBeneficiaries(); }, []);

  async function add(event) {
    event.preventDefault();
    setError('');
    setSaved('');
    try {
      const { data } = await API.post('/beneficiaries', {
        name,
        accountNumberMasked: `XXXX ${account.slice(-4)}`,
      });
      setItems((current) => [data.beneficiary, ...current]);
      setName('');
      setAccount('');
      setSaved('Demo beneficiary added and recorded in the audit trail.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add the demo beneficiary.');
    }
  }

  return <><PageHeading title="Beneficiaries" subtitle="Manage fictional payment recipients. No real payee is created." action={<DemoBadge />} />
    <div className="dashboard-grid">
      <section className="card">
        <div className="card-head"><div><span className="eyebrow">ADD RECIPIENT</span><h3>New demo beneficiary</h3></div><Users size={19} className="decorative-more" /></div>
        <form className="form-stack" onSubmit={add}>
          <label>Beneficiary name<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={60} required placeholder="e.g. Riya Sharma" /></label>
          <label>Demo account digits<input value={account} onChange={(event) => setAccount(event.target.value.replace(/\D/g, '').slice(0, 16))} minLength={4} inputMode="numeric" required placeholder="Last four digits are displayed" /></label>
          {error && <div className="inline-error" role="alert">{error}</div>}
          {saved && <div className="success-callout"><CheckCircle2 size={16} />{saved}</div>}
          <button className="primary-button" disabled={loading}>Save beneficiary <Check size={15} /></button>
        </form>
      </section>
      <section className="card table-card"><div className="card-head"><div><span className="eyebrow">SAVED RECIPIENTS</span><h3>Demo beneficiaries</h3></div><Status>Ownership checked</Status></div>
        {loading ? <div className="empty-state">Loading simulated beneficiaries…</div> : <div className="table-scroll"><table><thead><tr><th>NAME</th><th>ACCOUNT</th><th>STATUS</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><b>{item.name}</b></td><td className="mono">{item.accountNumberMasked}</td><td><Status>Active</Status></td></tr>)}</tbody></table>{!items.length && <div className="empty-state">No demo beneficiaries found.</div>}</div>}
      </section>
    </div>
    <Why>Beneficiary ownership checks ensure that a customer can only view and use recipients belonging to their fictional profile.</Why>
  </>;
}

function SettingsPage({ user, onLogout }) {
  const [rememberDevice, setRememberDevice] = useState(sessionStorage.getItem('cybershield-remember-device') === 'true');
  function toggleRemember(event) {
    const value = event.target.checked;
    setRememberDevice(value);
    sessionStorage.setItem('cybershield-remember-device', String(value));
  }
  return <><PageHeading title="Workspace settings" subtitle="Manage preferences for this simulated security workspace." action={<DemoBadge />} />
    <div className="settings-grid">
      <section className="card settings-card"><div className="settings-profile"><span className="user-avatar large">{user.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span><div><span className="eyebrow">SIGNED-IN DEMO IDENTITY</span><h2>{user.name}</h2><p>{user.customerId} · {user.title}</p></div></div><div className="settings-row"><span><b>Role-based access</b><small>Features are limited to the {user.role} demonstration role.</small></span><Status>Active</Status></div><div className="settings-row"><span><b>Demo session</b><small>JWT session expires automatically after 30 minutes.</small></span><Status>Protected</Status></div></section>
      <section className="card settings-card"><div className="card-head"><div><span className="eyebrow">SESSION PREFERENCES</span><h3>Security preferences</h3></div><Settings size={19} className="decorative-more" /></div><div className="settings-row"><span><b>Remember this demo device</b><small>Stores a local preference only; no real device is registered.</small></span><input type="checkbox" checked={rememberDevice} onChange={toggleRemember} /></div><div className="settings-row"><span><b>MFA challenge</b><small>Every sign-in requires the published demo OTP.</small></span><Status>Required</Status></div><button className="danger-outline" onClick={onLogout}><LogOut size={15} /> Sign out of demo</button></section>
    </div>
    <Why>Settings make security behavior visible: the session is short-lived, MFA is always required, and device preferences remain local to this academic prototype.</Why>
  </>;
}

function TransactionTable() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All activity');
  const filtered = transactions.filter((tx) => `${tx.title} ${tx.kind} ${tx.id}`.toLowerCase().includes(query.toLowerCase()) && (kind === 'All activity' || tx.kind === kind));
  return <><div className="table-tools"><label className="search-box"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activity…" /></label><select className="filter-select" value={kind} onChange={(event) => setKind(event.target.value)} aria-label="Filter activity type"><option>All activity</option><option>UPI</option><option>NEFT</option><option>IMPS</option><option>Card payment</option><option>Bill payment</option></select></div><div className="table-scroll"><table><thead><tr><th>DESCRIPTION</th><th>REFERENCE</th><th>DATE</th><th>STATUS</th><th className="align-right">AMOUNT</th></tr></thead><tbody>{filtered.map((tx) => <tr key={tx.id}><td><span className="table-description"><span className="transaction-icon small"><Icon name={tx.icon} size={15} /></span><b>{tx.title}</b></span></td><td className="mono">{tx.id}</td><td>{tx.date}</td><td><Status>{tx.status}</Status></td><td className={cx('align-right amount-cell', tx.amount > 0 && 'money-in')}>{tx.amount > 0 ? '+' : '−'}{money(tx.amount)}</td></tr>)}</tbody></table>{!filtered.length && <div className="empty-state">No matching demo activity found.</div>}</div></>;
}

function Transfer({ onTransfer }) {
  const [step, setStep] = useState(1);
  const [beneficiary, setBeneficiary] = useState('Riya Sharma · XXXX 4408');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Personal transfer');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [checks, setChecks] = useState([]);
  const [beneficiariesList, setBeneficiariesList] = useState(['Riya Sharma · XXXX 4408', 'Dev Mehta · XXXX 1920']);
  const [addingBeneficiary, setAddingBeneficiary] = useState(false);
  const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
  const [newBeneficiaryAccount, setNewBeneficiaryAccount] = useState('');
  const [beneficiaryError, setBeneficiaryError] = useState('');
  const highValue = Number(amount) >= 25000;
  const pipeline = ['Request', 'TLS', 'WAF', 'Authentication', 'Authorization', 'Fraud detection', 'Transaction limit', 'Maker-checker', 'Core banking simulation', 'SIEM logging', 'Confirmation'];

  async function addBeneficiary(event) {
    event.preventDefault();
    setBeneficiaryError('');
    try {
      const accountNumberMasked = `XXXX ${newBeneficiaryAccount.replace(/\D/g, '').slice(-4)}`;
      const { data } = await API.post('/beneficiaries', { name: newBeneficiaryName, accountNumberMasked });
      const label = `${data.beneficiary.name} · ${data.beneficiary.accountNumberMasked} (new)`;
      setBeneficiariesList((items) => [...items, label]);
      setBeneficiary(label);
      setNewBeneficiaryName('');
      setNewBeneficiaryAccount('');
      setAddingBeneficiary(false);
    } catch (err) {
      setBeneficiaryError(err.response?.data?.message || 'Could not add a demo beneficiary.');
    }
  }

  async function submitTransfer() {
    setChecking(true);
    setError('');
    setChecks([]);
    for (let i = 0; i < pipeline.length - 1; i += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 210));
      setChecks((current) => [...current, pipeline[i]]);
    }
    try {
      const response = await onTransfer({ beneficiary, amount: Number(amount), purpose });
      setResult(response);
      setChecks(pipeline);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'The simulated transfer could not be submitted.');
    } finally {
      setChecking(false);
    }
  }

  return <><PageHeading title="Simulated transfer" subtitle="Explore the security checks around a fictional payment. No real funds move." action={<DemoBadge />} />
    <div className="transfer-layout"><section className="card transfer-card"><div className="stepper">{['Beneficiary', 'Amount', 'Review', 'Security checks'].map((label, index) => <div key={label} className={cx('step-item', step > index + 1 && 'complete', step === index + 1 && 'current')}><span>{step > index + 1 ? <Check size={13} /> : index + 1}</span><small>{label}</small></div>)}</div>
      {step === 1 && <div className="transfer-form"><span className="eyebrow">STEP 1 OF 4</span><h2>Who are you sending to?</h2><p>Choose a fictional beneficiary or add a demo one.</p><label>Saved beneficiaries<select value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)}>{beneficiariesList.map((item) => <option key={item}>{item}</option>)}</select></label>{addingBeneficiary ? <form className="add-beneficiary-form" onSubmit={addBeneficiary}><label>Fictional beneficiary name<input value={newBeneficiaryName} onChange={(e) => setNewBeneficiaryName(e.target.value)} minLength={2} maxLength={60} required /></label><label>Demo account digits<input value={newBeneficiaryAccount} onChange={(e) => setNewBeneficiaryAccount(e.target.value.replace(/\D/g, '').slice(0, 16))} inputMode="numeric" minLength={4} required /></label>{beneficiaryError && <div className="inline-error">{beneficiaryError}</div>}<div className="form-actions"><button type="button" className="back-button" onClick={() => setAddingBeneficiary(false)}>Cancel</button><button className="secondary-button">Save demo beneficiary</button></div></form> : <button className="outline-action" onClick={() => setAddingBeneficiary(true)}><Plus size={16} /> Add demo beneficiary</button>}<button className="primary-button" onClick={() => setStep(2)}>Continue <ArrowRight size={15} /></button></div>}
      {step === 2 && <div className="transfer-form"><span className="eyebrow">STEP 2 OF 4</span><h2>How much would you like to send?</h2><p>Set a simulated amount for the fraud checks.</p><label>Amount (INR)<div className="amount-input"><span>₹</span><input type="number" min="1" max="100000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></div></label><label>Purpose<select value={purpose} onChange={(e) => setPurpose(e.target.value)}><option>Personal transfer</option><option>Household expenses</option><option>Education</option><option>Other demo purpose</option></select></label><div className="form-hint"><Shield size={15} /> Transfers of ₹25,000 or more require a separate checker in this demo.</div><div className="form-actions"><button className="back-button" onClick={() => setStep(1)}>Back</button><button className="primary-button" disabled={!Number(amount) || Number(amount) > 100000} onClick={() => setStep(3)}>Review transfer <ArrowRight size={15} /></button></div></div>}
      {step === 3 && <div className="transfer-form"><span className="eyebrow">STEP 3 OF 4</span><h2>Review your transfer</h2><p>Check these simulated details before submitting.</p><div className="transfer-summary"><div><span>TO BENEFICIARY</span><b>{beneficiary}</b></div><div><span>AMOUNT</span><b>{money(Number(amount))}</b></div><div><span>PURPOSE</span><b>{purpose}</b></div><div><span>SECURITY PATH</span><b>Fraud analysis {highValue ? '· Checker review required' : '· Standard review'}</b></div></div><div className="form-actions"><button className="back-button" onClick={() => setStep(2)}>Edit</button><button className="primary-button" onClick={() => { setStep(4); submitTransfer(); }}><ShieldCheck size={16} /> Run security checks</button></div></div>}
      {step === 4 && <div className="transfer-form"><span className="eyebrow">STEP 4 OF 4 · SIMULATED PIPELINE</span><h2>{checking ? 'Checking every layer…' : result?.status === 'APPROVAL_REQUIRED' ? 'Checker approval required' : result?.status === 'BLOCKED' ? 'Transfer held for review' : 'Security checks complete'}</h2><p>{checking ? 'The request is passing through the demo security pipeline.' : 'This workflow writes only simulated records to the demonstration environment.'}</p><div className="pipeline">{pipeline.map((item, index) => { const complete = checks.includes(item); const active = checking && !complete && checks.length === index; return <div key={item} className={cx('pipeline-step', complete && 'passed', active && 'processing')}><span>{complete ? <Check size={13} /> : index + 1}</span><b>{item}</b>{active && <i className="live-pulse" />}{index !== pipeline.length - 1 && <div className="pipeline-line" />}</div>; })}</div>{result && <div className={cx('result-callout', result.status === 'APPROVAL_REQUIRED' && 'amber-callout')}><ShieldCheck size={18} /><div><b>{result.status === 'APPROVAL_REQUIRED' ? 'Submitted — awaiting checker approval' : `Simulated transfer ${result.status.toLowerCase()}`}</b><small>Reference {result.reference} · risk score {result.riskScore}/100 · {result.riskLevel} demo risk · audit event recorded</small><small>Triggered rules: {result.triggeredRules.join(', ')}</small><small>Recommended action: {result.recommendedAction}</small></div></div>}{error && <div className="inline-error" role="alert">{error}</div>}<div className="form-actions"><button className="back-button" onClick={() => { setStep(1); setResult(null); setChecks([]); }}>Start another demo</button><button className="secondary-button" onClick={() => setStep(3)}>Review details</button></div></div>}
    </section><aside className="transfer-side"><section className="card security-card"><span className="eyebrow">TRANSFER PROTECTION</span><h3>Every request is checked</h3><div className="security-list">{[['Encrypted channel', 'TLS concept', LockKeyhole], ['Fraud analysis', 'Real-time demo', Activity], ['Audit trail', 'Recorded', FileClock]].map(([label, status, Symbol]) => <div className="security-row" key={label}><span className="security-row-icon"><Symbol size={15} /></span><span>{label}</span><Status>{status}</Status></div>)}</div></section><div className="explain-card"><ShieldCheck size={19} /><b>Why the layers?</b><p>Each step verifies a different part of the request—from secure transport to permissions, risk, and an auditable outcome.</p></div></aside></div>
  </>;
}

function Soc({ events, setEvents, go }) {
  const metrics = [['Active users', '1,284', '+8.2%', Users, 'blue'], ['Auth events', '8,492', '+12.4%', KeyRound, 'teal'], ['Suspicious activity', '07', '−18.5%', ShieldAlert, 'amber'], ['Blocked requests', '142', '+3.1%', LockKeyhole, 'purple']];
  const severity = [{ name: 'Low', value: 64, color: '#1b9b87' }, { name: 'Medium', value: 27, color: '#efb34e' }, { name: 'High', value: 8, color: '#ec7857' }, { name: 'Critical', value: 1, color: '#db4c54' }];
  return <><PageHeading eyebrow="SECURITY OPERATIONS CENTER" title="SOC monitoring" subtitle="A live-looking view of simulated authentication and cyber-defense activity." action={<span className="live-label"><i className="live-pulse" /> DEMO FEED ACTIVE</span>} /><div className="metrics-grid soc-metrics">{metrics.map(([label, value, change, Symbol, tone]) => <Metric key={label} label={label} value={value} change={change} detail="vs. previous period" icon={Symbol} tone={tone} />)}</div><div className="soc-layout"><section className="card event-card"><div className="card-head"><div><span className="eyebrow">REAL-TIME · SIMULATED</span><h3>Security event feed</h3></div><button className="select-button"><i className="green-mini-dot" /> All events <ChevronDown size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>EVENT</th><th>USER / SOURCE</th><th>TIME</th><th>SEVERITY</th><th></th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td><span className="event-type"><span className="event-mini-icon"><Activity size={14} /></span><b>{event.event}</b></span><small className="event-id">{event.id}</small></td><td><b>{event.user}</b><small className="table-subline">{event.source}</small></td><td className="mono">{event.time}</td><td><Status>{event.severity}</Status></td><td><button className="icon-button" aria-label="Review event" onClick={() => setEvents(events.map((row) => row.id === event.id ? { ...row, status: 'Reviewed' } : row))}>{event.status === 'Reviewed' ? <CheckCircle2 size={17} className="reviewed-icon" /> : <Eye size={17} />}</button></td></tr>)}</tbody></table></div></section><section className="card severity-card"><div className="card-head"><div><span className="eyebrow">EVENT DISTRIBUTION</span><h3>Severity snapshot</h3></div></div><div className="severity-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={severity} dataKey="value" innerRadius={58} outerRadius={78} paddingAngle={3} stroke="none">{severity.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><b>1,024</b><span>total events</span></div></div><div className="severity-list">{severity.map((item) => <div key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</div></section></div><div className="soc-bottom"><section className="mini-info-card"><span className="metric-icon teal"><Globe2 size={18} /></span><div><b>API requests</b><strong>24.8K</strong><small>Rate limiting active</small></div></section><section className="mini-info-card"><span className="metric-icon purple"><ShieldCheck size={18} /></span><div><b>Security controls</b><strong>14 / 14</strong><small>All demo controls enabled</small></div></section><section className="mini-info-card"><span className="metric-icon amber"><AlertTriangle size={18} /></span><div><b>Open alerts</b><strong>{events.filter((event) => event.status !== 'Reviewed').length}</strong><small><button className="text-button" onClick={() => go('threats')}>Review event context <ArrowRight size={13} /></button></small></div></section></div><Why>Centralized security monitoring brings authentication events, fraud signals, and system controls together so analysts can spot patterns and respond.</Why></>;
}

function SecurityActivity({ events }) {
  const activity = (events.length ? events : initialEvents).filter((event) => event.user === 'CUST1001' || event.user === 'System');
  return <><PageHeading eyebrow="SESSION & DEVICE SECURITY" title="Security activity" subtitle="Review recent fictional sign-in, MFA, and device events for this demo session." /><div className="notice-bar"><Smartphone size={17} /><span><b>Current demo device · Device-001</b> Session-bound access · MFA verified · No real device fingerprint is collected.</span><Status>Trusted</Status></div><section className="card event-card"><div className="card-head"><div><span className="eyebrow">RECENT SECURITY EVENTS</span><h3>Login & device activity</h3></div><Status>Simulated</Status></div><div className="table-scroll"><table><thead><tr><th>EVENT</th><th>USER</th><th>DEVICE / SOURCE</th><th>TIME</th><th>SEVERITY</th><th>STATUS</th></tr></thead><tbody>{activity.map((event) => <tr key={event.id}><td><b>{event.event}</b><small className="event-id">{event.id}</small></td><td>{event.user}</td><td>{event.source}</td><td className="mono">{event.time}</td><td><Status>{event.severity}</Status></td><td><Status>{event.status}</Status></td></tr>)}</tbody></table></div></section><section className="card session-card"><span className="metric-icon teal"><ShieldCheck size={17} /></span><div><span className="eyebrow">SESSION PROTECTION</span><h3>Protected demo session</h3><p>The demo session uses a short-lived signed token, role-scoped API access, a no-delivery OTP challenge, and explicit logout. No browser fingerprint is collected.</p></div><Status>Active</Status></section><Why>Reviewing sign-in and device events can help detect unexpected access. This screen uses fictional signals only and does not collect information about your real device.</Why></>;
}

function ThreatCenter() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const levels = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const visible = threats.filter((threat) => (filter === 'All' || threat.risk === filter) && `${threat.id} ${threat.name} ${threat.cause}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeading eyebrow="THREAT INTELLIGENCE" title="Threat & vulnerability center" subtitle="The 12 threats identified for this report-aligned academic demonstration." action={<span className="threat-count"><ShieldAlert size={16} /> 12 REPORT THREATS</span>} /><div className="filter-bar"><label className="search-box"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search threats…" /></label><div className="filter-tabs">{levels.map((level) => <button key={level} onClick={() => setFilter(level)} className={filter === level ? 'selected' : ''}>{level}{level !== 'All' && <span>{threats.filter((t) => t.risk === level).length}</span>}</button>)}</div></div><div className="threat-grid">{visible.map((threat) => <button className="threat-card" key={threat.id} onClick={() => setSelected(threat)}><div className="threat-top"><span className="threat-id">{threat.id}</span><Status>{threat.risk}</Status></div><h3>{threat.name}</h3><p>{threat.cause}</p><div className="threat-meta"><span>LIKELIHOOD <b>{threat.likelihood}/4</b></span><span>IMPACT <b>{threat.severity}/4</b></span></div><div className="risk-meter"><i style={{ width: `${threat.likelihood * threat.severity / 16 * 100}%` }} /></div><span className="threat-open">View mitigation <ChevronRight size={14} /></span></button>)}</div>{!visible.length && <div className="empty-state card">No threats match that filter.</div>}<Why>The likelihood and impact values here are illustrative, not bank risk ratings. They make the report's threat themes explorable without representing a real institution's assessment.</Why>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="modal-card" onClick={(e) => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)}><X size={18} /></button><span className="eyebrow">{selected.id} · THREAT DETAIL</span><h2>{selected.name}</h2><Status>{selected.risk} risk · demo</Status><dl className="detail-list"><dt>Cause</dt><dd>{selected.cause}</dd><dt>Attack method</dt><dd>{selected.method}</dd><dt>Potential impact</dt><dd>{selected.impact}</dd><dt>Prevention & mitigation</dt><dd>{selected.mitigation}</dd></dl><button className="primary-button" onClick={() => setSelected(null)}>Close details</button></div></div>}</>;
}

function RiskAssessment() {
  const [selected, setSelected] = useState(null);
  const bins = [1, 2, 3, 4];
  const riskLabel = (score) => score >= 16 ? 'Critical' : score >= 9 ? 'High' : score >= 4 ? 'Medium' : 'Low';
  return <><PageHeading eyebrow="RISK GOVERNANCE" title="Risk assessment" subtitle="Interactive probability × impact matrix for the report-aligned threat set." /><div className="risk-layout"><section className="card matrix-card"><div className="card-head"><div><span className="eyebrow">4 × 4 DEMONSTRATION MATRIX</span><h3>Likelihood × impact</h3></div><span className="matrix-formula">Risk score = likelihood × impact</span></div><div className="matrix-wrap"><div className="matrix-y-label">LIKELIHOOD</div><div className="matrix-content"><div className="matrix-grid">{[...bins].reverse().map((likelihood) => bins.map((impact) => { const score = likelihood * impact; const placed = threats.filter((t) => t.likelihood === likelihood && t.severity === impact); return <button key={`${likelihood}-${impact}`} className={`matrix-cell matrix-${riskLabel(score).toLowerCase()}`} onClick={() => setSelected(placed[0] || null)} title={`Likelihood ${likelihood}, impact ${impact}: ${riskLabel(score)}`}><span className="cell-score">{score}</span><span className="cell-tags">{placed.map((t) => <i key={t.id} title={`${t.id}: ${t.name}`} onClick={(e) => { e.stopPropagation(); setSelected(t); }}>{t.id}</i>)}</span></button>; }))}</div><div className="matrix-x-label"><span>1 · Low</span><span>2 · Moderate</span><span>3 · Significant</span><span>4 · Severe</span></div></div></div><div className="matrix-legend">{[['Low', 'green'], ['Medium', 'yellow'], ['High', 'orange'], ['Critical', 'red']].map(([label, color]) => <span key={label}><i className={`legend-${color}`} />{label}</span>)}</div></section><aside className="risk-side"><section className="card risk-summary"><span className="eyebrow">PORTFOLIO SNAPSHOT</span><h3>Threat concentration</h3><div className="risk-totals">{[['Critical', threats.filter((t) => t.risk === 'Critical').length, 'red'], ['High', threats.filter((t) => t.risk === 'High').length, 'orange'], ['Medium', threats.filter((t) => t.risk === 'Medium').length, 'yellow'], ['Low', threats.filter((t) => t.risk === 'Low').length, 'green']].map(([label, count, color]) => <div key={label}><i className={`legend-${color}`} /><span>{label}</span><b>{count}</b></div>)}</div><p className="disclaimer-text">Illustrative 4 × 4 scoring only. Use the uploaded report's original likelihood and impact ratings for formal evaluation.</p></section><section className="card selected-risk">{selected ? <><span className="eyebrow">{selected.id} · SELECTED THREAT</span><h3>{selected.name}</h3><Status>{riskLabel(selected.likelihood * selected.severity)} · score {selected.likelihood * selected.severity}</Status><p>{selected.mitigation}</p></> : <><span className="metric-icon purple"><Gauge size={17} /></span><h3>Select a matrix item</h3><p>Choose a marker or cell to inspect threat mitigation detail.</p></>}</section></aside></div><section className="card threat-table"><div className="card-head"><div><span className="eyebrow">RISK REGISTER</span><h3>Threat scoring</h3></div><span className="matrix-formula">Demo reference scale · 1–4</span></div><div className="table-scroll"><table><thead><tr><th>THREAT</th><th>LIKELIHOOD</th><th>IMPACT</th><th>SCORE</th><th>LEVEL</th><th>MITIGATION</th></tr></thead><tbody>{threats.map((t) => <tr key={t.id}><td><b className="mono">{t.id}</b><span className="table-subline">{t.name}</span></td><td>{t.likelihood} / 4</td><td>{t.severity} / 4</td><td className="mono">{t.likelihood * t.severity}</td><td><Status>{riskLabel(t.likelihood * t.severity)}</Status></td><td>{t.mitigation}</td></tr>)}</tbody></table></div></section><Why>Risk assessment compares how likely a threat is with the severity of its impact. A matrix helps prioritize prevention and response work.</Why></>;
}

function SecurityControls() {
  const [group, setGroup] = useState('All controls');
  const groups = ['All controls', ...new Set(controls.map((control) => control.group))];
  const shown = group === 'All controls' ? controls : controls.filter((control) => control.group === group);
  return <><PageHeading title="Security controls" subtitle="How the report's core controls are represented in this demonstration." action={<span className="controls-summary"><ShieldCheck size={16} /> 14 controls mapped</span>} /><div className="control-summary-strip"><div><b>09</b><span>Active controls</span></div><div><b>03</b><span>Demonstrations</span></div><div><b>02</b><span>Conceptual controls</span></div><div><b>06</b><span>Control domains</span></div></div><div className="filter-tabs control-tabs">{groups.map((value) => <button key={value} className={group === value ? 'selected' : ''} onClick={() => setGroup(value)}>{value}</button>)}</div><div className="controls-grid">{shown.map((control) => <article className="control-card" key={control.name}><div className="control-card-top"><span className="control-icon"><ShieldCheck size={18} /></span><Status>{control.status}</Status></div><small className="eyebrow">{control.group}</small><h3>{control.name}</h3><p>{control.purpose}</p><div className="control-detail"><b>THREATS MITIGATED</b><span>{control.mitigates}</span></div><div className="control-detail demo-detail"><b>IN THIS PROTOTYPE</b><span>{control.demo}</span></div></article>)}</div><Why>Security is strongest when controls complement one another. This catalogue links the report's control concepts to visible, safe demonstrations.</Why></>;
}

async function derivePassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, keyMaterial, 256);
  return { salt: toHex(salt), hash: toHex(new Uint8Array(bits)), iterations: 120000 };
}
const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
async function verifyPassword(password, saltHex, expected) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g).map((part) => parseInt(part, 16)));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, keyMaterial, 256);
  return toHex(new Uint8Array(bits)) === expected;
}

function SecurityLab() {
  const [password, setPassword] = useState('');
  const [passwordResult, setPasswordResult] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [accountData, setAccountData] = useState('Account: XXXX XXXX XXXX 3021\\nOwner: Kailash Sharma\\nBalance: ₹42,300 (simulated)');
  const [cipher, setCipher] = useState(null);
  const [decrypted, setDecrypted] = useState('');
  const [tampered, setTampered] = useState(false);
  const [payload, setPayload] = useState("CUST1001' OR '1'='1");
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);

  async function hashPassword() {
    if (!password) return;
    setBusy(true);
    try { setPasswordResult(await derivePassword(password)); setPasswordCheck(null); } finally { setBusy(false); }
  }
  async function checkPassword(candidate) {
    if (!passwordResult) return;
    setPasswordCheck(await verifyPassword(candidate, passwordResult.salt, passwordResult.hash));
  }
  async function encryptData() {
    setBusy(true);
    try {
      const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(accountData));
      setCipher({ key, iv: toHex(iv), ciphertext: toHex(new Uint8Array(encrypted)) });
      setDecrypted('');
      setTampered(false);
    } finally { setBusy(false); }
  }
  async function decryptData(useTamper = false) {
    if (!cipher) return;
    setTampered(false);
    try {
      const data = Uint8Array.from((useTamper ? `${cipher.ciphertext.slice(0, -2)}${cipher.ciphertext.endsWith('00') ? 'ff' : '00'}` : cipher.ciphertext).match(/.{2}/g).map((part) => parseInt(part, 16)));
      const iv = Uint8Array.from(cipher.iv.match(/.{2}/g).map((part) => parseInt(part, 16)));
      const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cipher.key, data);
      setDecrypted(new TextDecoder().decode(clear));
    } catch {
      setDecrypted('');
      setTampered(true);
    }
  }
  const validWhitelist = /^[A-Za-z0-9_-]{3,20}$/.test(payload);

  return <><PageHeading eyebrow="PRACTICAL INFORMATION SECURITY" title="Security lab" subtitle="Run three safe, browser-side demonstrations inspired by the report." action={<span className="lab-pill"><Cpu size={15} /> INTERACTIVE LAB</span>} />
    <div className="lab-intro"><div className="lab-intro-icon"><Sparkles size={19} /></div><div><b>Hands-on security demonstrations</b><p>These lab inputs stay in your browser. Passwords and sample data are not sent to the server or stored.</p></div><DemoBadge /></div>
    <section className="card lab-card"><div className="lab-title"><span className="lab-number">01</span><div><span className="eyebrow">AUTHENTICATION</span><h2>Password security · PBKDF2</h2><p>Derive a salted PBKDF2-HMAC-SHA256 hash instead of storing a plain password.</p></div><div className="lab-symbol teal"><KeyRound size={19} /></div></div><div className="password-lab"><div className="lab-input-area"><label>Enter a demo-only password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type a sample password" autoComplete="new-password" /></label><button className="primary-button" onClick={hashPassword} disabled={!password || busy}>{busy ? 'Deriving…' : 'Derive secure hash'} <ArrowRight size={15} /></button><small>Never enter a password you use elsewhere.</small></div><div className="hash-flow"><div className={cx('flow-box', password && 'filled')}><span>PLAIN INPUT</span><b>{password ? '••••••••••••' : 'Awaiting demo input'}</b></div><ArrowRight size={17} /><div className={cx('flow-box', passwordResult && 'filled')}><span>RANDOM SALT</span><b className="mono">{passwordResult ? `${passwordResult.salt.slice(0, 18)}…` : 'Generated per hash'}</b></div><ArrowRight size={17} /><div className={cx('flow-box', passwordResult && 'filled')}><span>PBKDF2-HMAC-SHA256</span><b>{passwordResult ? `${passwordResult.iterations.toLocaleString()} iterations` : 'Key derivation'}</b></div><ArrowRight size={17} /><div className={cx('flow-box', passwordResult && 'filled')}><span>DERIVED HASH · SHA-256</span><b className="mono">{passwordResult ? `${passwordResult.hash.slice(0, 24)}…` : 'Output appears here'}</b></div></div></div>{passwordResult && <div className="verify-actions"><span><CheckCircle2 size={16} /> Salted hash derived in your browser</span><button className="secondary-button compact" onClick={() => checkPassword(password)}>Verify correct password</button><button className="secondary-button compact" onClick={() => checkPassword(`${password}-wrong`)}>Verify incorrect password</button>{passwordCheck !== null && <Status>{passwordCheck ? 'Password matches' : 'No match'}</Status>}</div>}</section>
    <section className="card lab-card"><div className="lab-title"><span className="lab-number">02</span><div><span className="eyebrow">DATA CONFIDENTIALITY & INTEGRITY</span><h2>AES-256-GCM encryption</h2><p>Encrypt sample account data with authenticated encryption and detect a changed ciphertext.</p></div><div className="lab-symbol purple"><LockKeyhole size={19} /></div></div><label className="wide-label">Fictional data to encrypt<textarea rows="3" value={accountData} onChange={(e) => setAccountData(e.target.value)} /></label><div className="encryption-actions"><button className="primary-button" onClick={encryptData} disabled={busy || !accountData}>{busy ? 'Encrypting…' : 'Encrypt sample data'} <LockKeyhole size={15} /></button>{cipher && <><button className="secondary-button" onClick={() => decryptData(false)}>Decrypt (authorized)</button><button className="danger-outline" onClick={() => decryptData(true)}>Run tamper test</button></>}</div>{cipher && <div className="crypto-result-grid"><div className="crypto-output"><span>RANDOM NONCE · 96-BIT</span><code>{cipher.iv}</code></div><div className="crypto-output"><span>CIPHERTEXT · AUTHENTICATED</span><code>{cipher.ciphertext.slice(0, 88)}…</code></div>{decrypted && <div className="crypto-output success-output"><span>AUTHORIZED DECRYPTION</span><code>{decrypted}</code></div>}{tampered && <div className="crypto-output tamper-output"><span><ShieldAlert size={14} /> TAMPER DETECTED</span><code>Authentication tag verification failed. Modified ciphertext was rejected.</code></div>}</div>}<p className="lab-note"><LockKeyhole size={14} /> Web Crypto AES-GCM with a fresh ephemeral key. Sample data is never transmitted or persisted.</p></section>
    <section className="card lab-card sql-lab"><div className="lab-title"><span className="lab-number">03</span><div><span className="eyebrow">INPUT VALIDATION · EDUCATIONAL SIMULATION</span><h2>SQL injection protection</h2><p>Compare unsafe string-building with parameterized query handling using the report payload.</p></div><div className="lab-symbol amber"><ShieldAlert size={19} /></div></div><div className="sql-demo-input"><label>Safe lab input<input value={payload} onChange={(e) => { setPayload(e.target.value); setValidated(false); }} /></label><button className="secondary-button" onClick={() => setValidated(true)}>Validate input <ArrowRight size={14} /></button></div><div className="sql-columns"><div className="sql-panel unsafe"><div><span>LEFT · UNSAFE ANTI-PATTERN</span><Status>Vulnerable concept</Status></div><pre>{`query = \"SELECT * FROM users WHERE id = '\" + input + \"'\"`}</pre><div className="sql-result"><AlertTriangle size={16} /><p><b>Potentially unsafe interpretation</b><br />A naïve string-built query can change meaning. This is a static explanation only; the payload is never executed.</p></div></div><div className="sql-panel safe"><div><span>RIGHT · PARAMETERIZED QUERY</span><Status>Safe pattern</Status></div><pre>{`db.users.findOne({ customerId: input })\n// input is data, not executable query syntax`}</pre><div className="sql-result"><ShieldCheck size={16} /><p><b>Payload treated as data</b><br />Parameterized database operations preserve the query structure and prevent injected syntax from running.</p></div></div></div><div className={cx('validation-result', validated && (validWhitelist ? 'valid' : 'invalid'))}>{validated ? validWhitelist ? <><CheckCircle2 size={17} /><span><b>Whitelist validation passed.</b> Input matches letters, digits, underscore, or hyphen (3–20 characters).</span></> : <><ShieldAlert size={17} /><span><b>Rejected by whitelist validation.</b> Unexpected characters or length detected; no query was executed.</span></> : <><CircleHelp size={17} /><span>Try the report's example payload: <code>CUST1001' OR '1'='1</code> and validate it to see whitelist rejection.</span></>}</div></section>
    <Why>Secure password hashing makes stolen password databases harder to use. Authenticated encryption detects tampering, and parameterized queries keep untrusted input from changing query logic.</Why></>;
}

function Approvals({ approvals, onDecision, user }) {
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState('');
  async function decide(id, decision) {
    setBusyId(id);
    setMessage('');
    try { await onDecision(id, decision); setMessage(`Approval ${decision.toLowerCase()} and recorded in the simulated audit log.`); }
    catch (error) { setMessage(error.response?.data?.message || 'Approval could not be recorded.'); }
    finally { setBusyId(null); }
  }
  const pendingCount = approvals.filter((approval) => approval.status === 'PENDING').length;
  return <><PageHeading eyebrow="SEPARATION OF DUTIES" title="Transaction approvals" subtitle="A checker reviews higher-risk demo transfers submitted by a separate maker." action={<span className="controls-summary"><Users size={15} /> MAKER-CHECKER FLOW</span>} /><div className="approval-flow">{['Maker', 'Submitted', 'Security validation', 'Fraud analysis', 'Checker review', 'Audit log'].map((label, index) => <div key={label} className={cx('approval-flow-step', index < 4 && 'done')}><span>{index < 4 ? <Check size={13} /> : index + 1}</span><b>{label}</b>{index < 5 && <i />}</div>)}</div><div className="notice-bar approval-notice"><ShieldCheck size={18} /><span><b>Independent review required.</b> A maker cannot approve their own request. All outcomes are recorded in the demo audit log.</span><Status>Protected</Status></div>{message && <div className="inline-success"><CheckCircle2 size={16} />{message}</div>}<section className="card table-card"><div className="card-head"><div><span className="eyebrow">CHECKER QUEUE</span><h3>Pending simulated transfers</h3></div><Status>{pendingCount} pending · {approvals.length - pendingCount} decided</Status></div>{approvals.length ? <div className="table-scroll"><table><thead><tr><th>REQUEST</th><th>MAKER</th><th>BENEFICIARY</th><th>AMOUNT</th><th>RISK</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{approvals.map((item) => <tr key={item.id}><td className="mono">{item.reference}</td><td>{item.maker}</td><td>{item.beneficiary}</td><td><b>{money(item.amount)}</b></td><td><Status>{item.riskLevel || 'High'}</Status></td><td><Status>{item.status}</Status></td><td>{user.role === 'checker' && item.status === 'PENDING' ? <div className="decision-buttons"><button disabled={busyId === item.id} onClick={() => decide(item.id, 'APPROVE')} className="approve-button"><Check size={14} />Approve</button><button disabled={busyId === item.id} onClick={() => decide(item.id, 'REJECT')} className="reject-button"><X size={14} />Reject</button></div> : <span className="muted-copy">View only</span>}</td></tr>)}</tbody></table></div> : <div className="empty-state"><span className="empty-check"><Check size={19} /></span><b>Approval queue is clear</b><p>Submit a transfer of ₹25,000 or more from the customer demo to create a checker request.</p></div>}</section><Why>Maker-checker separates the person initiating a sensitive transaction from the person authorizing it, reducing single-person misuse.</Why></>;
}

function AuditLogs() {
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('All risks');
  const [date, setDate] = useState('');
  const filtered = auditSeed.filter((row) => `${row.user} ${row.action} ${row.resource} ${row.id}`.toLowerCase().includes(query.toLowerCase()) && (severity === 'All risks' || row.risk === severity) && (!date || date === '2026-09-30'));
  function exportCsv() {
    const headers = ['Timestamp', 'User', 'Action', 'IP/Device', 'Resource', 'Status', 'Risk', 'Event ID'];
    const lines = [headers.join(','), ...filtered.map((row) => [row.time, row.user, row.action, row.device, row.resource, row.status, row.risk, row.id].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    link.download = 'cybershield-demo-audit.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }
  return <><PageHeading eyebrow="NON-REPUDIATION & ACCOUNTABILITY" title="Security audit log" subtitle="Searchable, fictional security records. Export contains demo values only." action={<button className="secondary-button" onClick={exportCsv}><Download size={15} /> Export CSV</button>} /><div className="audit-stats"><div><span>EVENTS TODAY</span><b>1,284</b><small>Simulated</small></div><div><span>REVIEWED</span><b>98.4%</b><small><i className="green-mini-dot" /> Within target</small></div><div><span>HIGH RISK EVENTS</span><b>07</b><small><i className="amber-mini-dot" /> 2 need review</small></div></div><section className="card table-card"><div className="table-tools"><label className="search-box"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search audit records…" /></label><select className="filter-select" value={severity} onChange={(e) => setSeverity(e.target.value)}><option>All risks</option><option>Low</option><option>Medium</option><option>High</option></select><input type="date" className="filter-select" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Filter by date" /></div><div className="table-scroll"><table><thead><tr><th>TIMESTAMP</th><th>USER</th><th>ACTION</th><th>IP / DEVICE</th><th>RESOURCE</th><th>STATUS</th><th>RISK</th><th>EVENT ID</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td className="mono">{row.time}</td><td>{row.user}</td><td><b>{row.action}</b></td><td>{row.device}</td><td>{row.resource}</td><td><Status>{row.status}</Status></td><td><Status>{row.risk}</Status></td><td className="mono">{row.id}</td></tr>)}</tbody></table></div></section><Why>Audit records give reviewers a traceable history of actions and outcomes, supporting accountability and non-repudiation.</Why></>;
}

function Architecture() {
  const [selected, setSelected] = useState(null);
  const architecture = [['Customer web app', UserRound], ['Load balancer', Globe2], ['WAF', Shield], ['API gateway', Network], ['Authentication & MFA', Fingerprint], ['Application services', Cpu], ['Fraud detection', Activity], ['Core banking simulation', Banknote], ['Encrypted database', LockKeyhole]];
  const side = [['SIEM', Activity], ['IDS / IPS', ShieldAlert], ['HSM concept', KeyRound], ['Monitoring', MonitorCog], ['Backup & recovery', Cloud]];
  return <><PageHeading eyebrow="LAYERED CYBER DEFENSE" title="Cyber defense architecture" subtitle="Explore the report's prevention, detection, protection, and recovery layers." /><div className="layer-grid">{architectureLayers.map((layer) => <section className="layer-card" key={layer.title}><div className={`layer-title ${layer.color}`}><span>{layer.title}</span><ShieldCheck size={17} /></div><div>{layer.items.map((item) => <button key={item} onClick={() => setSelected({ name: item, layer: layer.title })}><CheckCircle2 size={14} />{item}<ChevronRight size={13} /></button>)}</div></section>)}</div><section className="card system-architecture"><div className="card-head"><div><span className="eyebrow">SYSTEM SECURITY ARCHITECTURE</span><h3>Request path & defense services</h3></div><span className="live-label"><i className="live-pulse" /> ANIMATED DEMO FLOW</span></div><div className="architecture-flow"><div className="main-flow">{architecture.map(([name, Symbol], index) => <div className="architecture-node-wrap" key={name}><button className="architecture-node" onClick={() => setSelected({ name, layer: 'System architecture' })}><Symbol size={17} /><span>{name}</span><small>{index === 7 ? 'SIMULATED' : 'SECURE LAYER'}</small></button>{index < architecture.length - 1 && <div className="flow-arrow"><i /></div>}</div>)}</div><div className="side-services"><span className="eyebrow">CROSS-CUTTING SECURITY</span><div>{side.map(([name, Symbol]) => <button key={name} onClick={() => setSelected({ name, layer: 'Supporting service' })}><Symbol size={15} />{name}</button>)}</div></div></div><p className="architecture-caption"><ArrowRight size={14} /> Data-flow animation illustrates a conceptual route only; it is not connected to a real bank or payment system.</p></section><Why>Layered architecture puts checks at multiple boundaries. A single control can fail, while connected prevention, detection, protection, and recovery provide defense in depth.</Why>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="modal-card" onClick={(e) => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)}><X size={18} /></button><span className="eyebrow">{selected.layer}</span><h2>{selected.name}</h2><p className="muted-copy">This component contributes to layered protection by helping control access, protect data, or identify suspicious activity in the simulated architecture.</p><dl className="detail-list"><dt>Purpose</dt><dd>Provides a defined security boundary or monitoring capability.</dd><dt>Threats addressed</dt><dd>Unauthorized access, misuse, data exposure, and activity that bypasses adjacent controls.</dd><dt>Security function</dt><dd>Conceptual demonstration based on the report; no production service is connected.</dd></dl><button className="primary-button" onClick={() => setSelected(null)}>Close details</button></div></div>}</>;
}

function Alerts({ events, setEvents }) {
  const [resolved, setResolved] = useState([]);
  const [detail, setDetail] = useState(null);
  const alertRows = [
    { id: 'ALT-102', severity: 'Critical', title: 'Suspicious high-value transaction', time: '10:37 AM · 4 min ago', description: 'A simulated transfer triggered an elevated fraud score. Maker-checker review is required.', eventId: 'EVT-88419' },
    { id: 'ALT-101', severity: 'High', title: 'Multiple failed login attempts', time: '10:28 AM · 13 min ago', description: 'Repeated invalid demo credentials were recorded for a fictional customer ID.', eventId: 'EVT-88417' },
    { id: 'ALT-100', severity: 'Medium', title: 'New device detected', time: '09:54 AM · 47 min ago', description: 'A new simulated device signal would prompt additional verification.', eventId: 'EVT-88414' },
    { id: 'ALT-099', severity: 'Low', title: 'Successful MFA verification', time: '09:42 AM · 59 min ago', description: 'The demo MFA challenge was successfully completed.', eventId: 'EVT-88415' },
  ];
  return <><PageHeading eyebrow="SECURITY OPERATIONS" title="Security alert center" subtitle="Review, resolve, or escalate simulated security alerts." action={<span className="controls-summary"><Bell size={15} /> {alertRows.filter((a) => !resolved.includes(a.id)).length} open alerts</span>} /><div className="alert-list">{alertRows.map((alert) => <article className={cx('alert-card', alert.severity.toLowerCase(), resolved.includes(alert.id) && 'alert-resolved')} key={alert.id}><div className="alert-severity-icon">{alert.severity === 'Critical' ? <ShieldAlert size={18} /> : alert.severity === 'Low' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}</div><div className="alert-content"><div className="alert-title-line"><h3>{alert.title}</h3><Status>{resolved.includes(alert.id) ? 'Resolved' : alert.severity}</Status></div><p>{alert.description}</p><small>{alert.id} · {alert.time}</small></div><div className="alert-actions"><button className="secondary-button compact" onClick={() => setDetail(alert)}>View details</button>{resolved.includes(alert.id) ? <button className="text-button" onClick={() => setResolved(resolved.filter((id) => id !== alert.id))}>Reopen</button> : <><button className="text-button" onClick={() => { setResolved([...resolved, alert.id]); setEvents(events.map((event) => event.id === alert.eventId ? { ...event, status: 'Reviewed' } : event)); }}>Mark reviewed</button><button className="icon-button" onClick={() => setResolved([...resolved, alert.id])} title="Resolve alert"><Check size={16} /></button><button className="icon-button" onClick={() => window.alert(`Alert ${alert.id} escalated in the demo.`)} title="Escalate alert"><ArrowUpRight size={16} /></button></>}</div></article>)}</div><Why>Alerts make important signals actionable. Review and escalation workflows help analysts separate routine activity from events needing a response.</Why>{detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><div className="modal-card" onClick={(e) => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setDetail(null)}><X size={18} /></button><span className="eyebrow">ALERT DETAILS · {detail.id}</span><h2>{detail.title}</h2><Status>{detail.severity} severity</Status><p className="modal-description">{detail.description}</p><dl className="detail-list"><dt>Triggered rule</dt><dd>{detail.severity === 'Critical' ? 'High-value transaction risk score' : 'Security event monitoring'}</dd><dt>Recommended action</dt><dd>{detail.severity === 'Critical' ? 'Keep pending and route for checker review.' : 'Review event context and confirm expected activity.'}</dd><dt>Event reference</dt><dd>{detail.eventId}</dd></dl><button className="primary-button" onClick={() => setDetail(null)}>Close alert details</button></div></div>}</>;
}

function Presentation({ current, onNext, onExit }) {
  return <div className="presentation-bar"><div><span className="present-kicker"><Sparkles size={14} /> FACULTY WALKTHROUGH</span><b>{current + 1} / 12 · {presentationSteps[current][1]}</b><small>{presentationSteps[current][2]}</small></div><div className="presentation-actions"><div className="presentation-progress"><i style={{ width: `${(current + 1) / presentationSteps.length * 100}%` }} /></div><button className="secondary-button compact" onClick={onNext}>{current === presentationSteps.length - 1 ? 'Finish demo' : 'Next demo'} <ArrowRight size={14} /></button><button className="icon-button" onClick={onExit} aria-label="Exit presentation"><X size={17} /></button></div></div>;
}

const presentationSteps = [
  ['Login', 'MFA login', 'Show the three role-based demo identities and the locally generated OTP step.'],
  ['Dashboard', 'Customer dashboard', 'Explain the masked records, security posture, and simulated activity.'],
  ['Transfer demo', 'Protected transfer flow', 'Run a fictional transfer through the visible security pipeline.'],
  ['Fraud detection', 'Fraud analysis', 'Point out the risk score, signals, and triggered decision rules.'],
  ['MFA verification', 'Second factor', 'Show the no-delivery OTP challenge and session access.'],
  ['Approvals', 'Maker-checker', 'Use the checker identity to review a high-value simulated transfer.'],
  ['SOC monitoring', 'Security event', 'Review how the action appears in the simulated event feed.'],
  ['SOC monitoring', 'SOC alert', 'Connect the event to a severity alert and analyst review.'],
  ['Threat center', 'Threat analysis', 'Open a report-aligned threat and discuss its mitigation.'],
  ['Risk assessment', 'Risk matrix', 'Explain likelihood multiplied by impact in the demonstration matrix.'],
  ['Security lab', 'Practical security lab', 'Demonstrate PBKDF2, AES-GCM tamper detection, and SQL prevention.'],
  ['Cyber defense architecture', 'Defense in depth', 'Conclude with the four report-aligned defense layers.'],
];

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onClose, 3800);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return <div className="toast"><CheckCircle2 size={17} />{message}<button onClick={onClose} aria-label="Dismiss"><X size={15} /></button></div>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [events, setEvents] = useState(initialEvents);
  const [approvals, setApprovals] = useState([]);
  const [presentation, setPresentation] = useState(false);
  const [presentStep, setPresentStep] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const token = sessionStorage.getItem('cybershield-token');
  useEffect(() => { API.defaults.headers.common.Authorization = token ? `Bearer ${token}` : ''; }, [token, user]);
  useEffect(() => {
    if (!user || !token) return;
    API.get('/approvals')
      .then(({ data }) => setApprovals(data.items))
      .catch((error) => setToast(error.response?.data?.message || 'Could not load demo approval requests.'));
  }, [user, token]);

  function authenticated(nextUser) {
    setUser(nextUser);
    const token = sessionStorage.getItem('cybershield-token');
    API.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
    setToast(`Welcome to the simulated ${nextUser.title.toLowerCase()} workspace.`);
  }
  function logout() {
    sessionStorage.removeItem('cybershield-token');
    delete API.defaults.headers.common.Authorization;
    setUser(null);
    setPage('dashboard');
    setPresentation(false);
  }
  async function submitTransfer(body) {
    const { data } = await API.post('/transactions', body);
    setEvents((current) => [{ id: data.eventId, time: new Date().toLocaleTimeString('en-GB'), event: 'SUSPICIOUS_TRANSACTION', user: user.customerId, source: 'Transfer · simulated', severity: data.riskLevel, status: 'Open' }, ...current]);
    if (data.approval) setApprovals((current) => [data.approval, ...current]);
    setToast(data.status === 'APPROVAL_REQUIRED' ? 'Transfer submitted to the checker queue.' : 'Security checks completed for the simulated transfer.');
    return data;
  }
  async function decideApproval(id, decision) {
    const { data } = await API.patch(`/approvals/${id}`, { decision });
    setApprovals((current) => current.map((item) => item.id === id ? data.approval : item));
    setToast(`Simulated transfer ${decision.toLowerCase()}d and audit event recorded.`);
  }

  if (!user) return <Login onAuthenticated={authenticated} />;

  const pageTitles = {
    dashboard: 'Dashboard', accounts: 'Accounts & activity', beneficiaries: 'Beneficiaries', securityActivity: 'Security activity', alerts: 'Security alerts', transfer: 'Transfer demo', approvals: 'Approvals',
    soc: 'SOC monitoring', threats: 'Threat center', risk: 'Risk assessment', controls: 'Security controls',
    lab: 'Security lab', architecture: 'Cyber defense architecture', audit: 'Audit logs', settings: 'Workspace settings',
  };
  const renderPage = () => {
    switch (page) {
      case 'accounts': return user.role === 'customer' ? <Accounts /> : <div className="card"><b>This role does not have customer account access.</b></div>;
      case 'beneficiaries': return user.role === 'customer' ? <Beneficiaries /> : <div className="card"><b>This role does not have customer beneficiary access.</b></div>;
      case 'securityActivity': return user.role === 'customer' ? <SecurityActivity events={events} /> : <div className="card"><b>This role does not have customer security activity access.</b></div>;
      case 'alerts': return <Alerts events={events} setEvents={setEvents} />;
      case 'transfer': return user.role === 'customer'
        ? <Transfer onTransfer={submitTransfer} />
        : <section className="card"><span className="eyebrow">ROLE-BASED ACCESS</span><h2>Transfers are customer-only</h2><p className="muted-copy">Start a simulated transfer as the customer, then sign in separately as the checker to review any high-value approval.</p><button className="primary-button" onClick={logout}>Sign out and switch role <ArrowRight size={16} /></button></section>;
      case 'approvals': return <Approvals approvals={approvals} onDecision={decideApproval} user={user} />;
      case 'soc': return <><Soc events={events} setEvents={setEvents} go={setPage} /><Alerts events={events} setEvents={setEvents} /></>;
      case 'threats': return <ThreatCenter />;
      case 'risk': return <RiskAssessment />;
      case 'controls': return <SecurityControls />;
      case 'lab': return <SecurityLab />;
      case 'architecture': return <Architecture />;
      case 'audit': return <AuditLogs />;
      case 'settings': return <SettingsPage user={user} onLogout={logout} />;
      default: return user.role === 'admin' ? <Soc events={events} setEvents={setEvents} go={setPage} /> : user.role === 'checker' ? <Approvals approvals={approvals} onDecision={decideApproval} user={user} /> : <Dashboard user={user} go={setPage} approvals={approvals} />;
    }
  };

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
    <Sidebar user={user} approvals={approvals} page={page} setPage={(next) => { setPage(next); if (presentation) { const step = presentationSteps.findIndex(([route]) => route === next); if (step >= 0) setPresentStep(step); } }} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    <div className="main-column"><Header user={user} onLogout={logout} onToggleMenu={() => setMobileOpen(!mobileOpen)} onAlerts={() => setPage(user.role === 'admin' ? 'soc' : user.role === 'checker' ? 'approvals' : 'alerts')} presenting={presentation} onPresent={() => { setPresentation(!presentation); if (!presentation) { setPresentStep(1); setPage('dashboard'); } }} />
      {presentation && <Presentation current={presentStep} onExit={() => setPresentation(false)} onNext={() => { const next = (presentStep + 1) % presentationSteps.length; setPresentStep(next); setPage(presentationSteps[next][0]); }} />}
      <main className="main-content"><motion.div key={page} className="page-content" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}><div className="mobile-page-title"><span>{pageTitles[page]}</span><DemoBadge /></div>{renderPage()}</motion.div></main>
      <footer className="page-footer"><span>© 2026 CyberShield Banking · Academic demonstration only</span><span><LockKeyhole size={12} /> No connection to a real bank or payment network</span></footer>
    </div>
    <Toast message={toast} onClose={() => setToast('')} />
  </div>;
}
