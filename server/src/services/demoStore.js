import { randomUUID } from 'node:crypto';
import { isDatabaseConnected } from '../config/database.js';
import Account from '../models/Account.js';
import ApprovalRequestModel from '../models/ApprovalRequest.js';
import AuditLog from '../models/AuditLog.js';
import SecurityEvent from '../models/SecurityEvent.js';
import TransactionModel from '../models/Transaction.js';
import BeneficiaryModel from '../models/Beneficiary.js';

export const accounts = [
  { id: 'ACC-3021', customerId: 'CUST1001', accountNumberMasked: 'XXXX XXXX XXXX 3021', accountType: 'Current', balance: 42300, currency: 'INR', simulated: true },
  { id: 'ACC-9184', customerId: 'CUST1001', accountNumberMasked: 'XXXX XXXX XXXX 9184', accountType: 'Savings', balance: 82280, currency: 'INR', simulated: true },
];
export const beneficiaries = [
  { id: 'BEN-4408', customerId: 'CUST1001', name: 'Riya Sharma', accountNumberMasked: 'XXXX 4408', simulated: true },
  { id: 'BEN-1920', customerId: 'CUST1001', name: 'Dev Mehta', accountNumberMasked: 'XXXX 1920', simulated: true },
];
export const transactions = [];
export const approvals = [];
export const auditLogs = [];
export const securityEvents = [];

export async function writeAudit({ user, action, device = 'Demo-Session', resource, status, risk = 'Low' }) {
  const record = { eventId: `AUD-${randomUUID().slice(0, 8).toUpperCase()}`, user, action, device, resource, status, risk, simulated: true, timestamp: new Date().toISOString() };
  auditLogs.unshift(record);
  if (isDatabaseConnected()) {
    await AuditLog.create({ eventId: record.eventId, user, action, device, resource, status, risk, simulated: true });
  }
  return record;
}

export async function writeSecurityEvent({ event, user, source, severity = 'Low', status = 'Open' }) {
  const eventId = `EVT-${randomUUID().slice(0, 8).toUpperCase()}`;
  const record = { id: eventId, eventId, event, user, source, severity, status, simulated: true, timestamp: new Date().toISOString() };
  securityEvents.unshift(record);
  if (isDatabaseConnected()) {
    await SecurityEvent.create({ eventId: record.eventId, event, user, source, severity, status, simulated: true });
  }
  return record;
}

export async function createTransaction(data) {
  const record = { id: `TX-${randomUUID().slice(0, 8).toUpperCase()}`, reference: `TX-${randomUUID().slice(0, 8).toUpperCase()}`, ...data, simulated: true, createdAt: new Date().toISOString() };
  transactions.unshift(record);
  if (isDatabaseConnected()) {
    await TransactionModel.create({
      reference: record.reference,
      customerId: record.customerId,
      beneficiary: record.beneficiary,
      amount: record.amount,
      purpose: record.purpose,
      riskScore: record.riskScore,
      riskLevel: record.riskLevel,
      status: record.status,
      simulated: true,
    });
  }
  return record;
}

export async function createApproval(data) {
  const record = { id: `APR-${randomUUID().slice(0, 8).toUpperCase()}`, ...data, status: 'PENDING', simulated: true, createdAt: new Date().toISOString() };
  approvals.unshift(record);
  if (isDatabaseConnected()) {
    await ApprovalRequestModel.create({
      reference: record.reference,
      maker: record.maker,
      beneficiary: record.beneficiary,
      amount: record.amount,
      riskScore: record.riskScore,
      riskLevel: record.riskLevel,
      status: record.status,
      simulated: true,
    });
  }
  return record;
}

export async function seedAccountsIfEmpty() {
  if (!isDatabaseConnected() || await Account.exists()) return;
  await Account.insertMany(accounts.map(({ customerId, accountNumberMasked, accountType, balance, currency }) => ({ customerId, accountNumberMasked, accountType, balance, currency })));
}

export async function seedBeneficiariesIfEmpty() {
  if (!isDatabaseConnected() || await BeneficiaryModel.exists()) return;
  await BeneficiaryModel.insertMany(beneficiaries.map(({ customerId, name, accountNumberMasked }) => ({ customerId, name, accountNumberMasked, isDemo: true })));
}

export async function loadPersistentDemoData() {
  if (!isDatabaseConnected()) return;
  const [storedAccounts, storedBeneficiaries, storedTransactions, storedApprovals, storedEvents, storedAudit] = await Promise.all([
    Account.find().lean(),
    BeneficiaryModel.find().lean(),
    TransactionModel.find().sort({ createdAt: -1 }).lean(),
    ApprovalRequestModel.find().sort({ createdAt: -1 }).lean(),
    SecurityEvent.find().sort({ createdAt: -1 }).lean(),
    AuditLog.find().sort({ createdAt: -1 }).lean(),
  ]);
  accounts.splice(0, accounts.length, ...storedAccounts.map((item) => ({
    id: item._id.toString(), customerId: item.customerId, accountNumberMasked: item.accountNumberMasked,
    accountType: item.accountType, balance: item.balance, currency: item.currency, simulated: true,
  })));
  beneficiaries.splice(0, beneficiaries.length, ...storedBeneficiaries.map((item) => ({
    id: item._id.toString(), customerId: item.customerId, name: item.name,
    accountNumberMasked: item.accountNumberMasked, simulated: true,
  })));
  transactions.splice(0, transactions.length, ...storedTransactions.map((item) => ({
    id: item._id.toString(), reference: item.reference, customerId: item.customerId,
    beneficiary: item.beneficiary, amount: item.amount, purpose: item.purpose,
    riskScore: item.riskScore, riskLevel: item.riskLevel, status: item.status,
    simulated: true, createdAt: item.createdAt.toISOString(),
  })));
  approvals.splice(0, approvals.length, ...storedApprovals.map((item) => ({
    id: item._id.toString(), reference: item.reference, maker: item.maker, checker: item.checker,
    beneficiary: item.beneficiary, amount: item.amount, riskScore: item.riskScore,
    riskLevel: item.riskLevel, status: item.status, simulated: true,
    createdAt: item.createdAt.toISOString(),
  })));
  securityEvents.splice(0, securityEvents.length, ...storedEvents.map((item) => ({
    id: item.eventId, eventId: item.eventId, event: item.event, user: item.user,
    source: item.source, severity: item.severity, status: item.status,
    simulated: true, timestamp: item.createdAt.toISOString(),
  })));
  auditLogs.splice(0, auditLogs.length, ...storedAudit.map((item) => ({
    id: item.eventId, eventId: item.eventId, user: item.user, action: item.action,
    device: item.device, resource: item.resource, status: item.status, risk: item.risk,
    simulated: true, timestamp: item.createdAt.toISOString(),
  })));
}

export async function persistBeneficiary(beneficiary) {
  if (!isDatabaseConnected()) return;
  await BeneficiaryModel.create({
    customerId: beneficiary.customerId,
    name: beneficiary.name,
    accountNumberMasked: beneficiary.accountNumberMasked,
    isDemo: true,
  });
}
