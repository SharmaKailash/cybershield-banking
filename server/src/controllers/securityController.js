import { architectureLayers, controls, threats } from '../data/securityData.js';
import { auditLogs, securityEvents, writeAudit, writeSecurityEvent } from '../services/demoStore.js';
import { parseBody } from '../utils/validation.js';
import { z } from 'zod';

export function getThreats(_req, res) {
  res.json({ items: threats, simulated: true });
}

export function getRisk(_req, res) {
  res.json({ method: 'Likelihood × impact', scale: 'Illustrative 1–4 scale', items: threats.map((threat) => ({ id: threat.id, name: threat.name, likelihood: threat.likelihood, impact: threat.severity, score: threat.likelihood * threat.severity, risk: threat.risk, mitigation: threat.mitigation })), simulated: true });
}

export function getControls(_req, res) {
  res.json({ items: controls, simulated: true });
}

export function getArchitecture(_req, res) {
  res.json({ layers: architectureLayers, simulated: true });
}

export function getEvents(_req, res) {
  res.json({ items: securityEvents, simulated: true });
}

export async function createDemoEvent(req, res) {
  const schema = z.object({
    event: z.enum(['SQL_INJECTION_ATTEMPT', 'LOGIN_FAILED', 'API_RATE_LIMIT']),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
    source: z.string().trim().min(3).max(100).default('Controlled teaching simulation'),
  });
  const { event, severity, source } = parseBody(schema, req.body);
  const record = await writeSecurityEvent({ event, user: req.user.customerId, source, severity });
  await writeAudit({ user: req.user.customerId, action: event, resource: source, status: 'SIMULATED', risk: severity });
  res.status(201).json({ event: record, simulated: true });
}

export function getAudit(_req, res) {
  res.json({ items: auditLogs, simulated: true });
}

export async function createDemoAlert(req, res) {
  const record = await writeSecurityEvent({ event: 'FRAUD_ALERT', user: req.user.customerId, source: 'Controlled alert simulation', severity: 'High' });
  res.status(201).json({ alert: { id: record.id, severity: 'High', status: 'Open', simulated: true } });
}

export function getDashboard(req, res) {
  res.json({
    user: { customerId: req.user.customerId, role: req.user.role },
    metrics: { activeUsers: 1284, authenticationEvents: 8492, suspiciousTransactions: 7, blockedRequests: 142, criticalAlerts: 2, apiRequests: 24800, securityEvents: 1284 },
    simulated: true,
  });
}
