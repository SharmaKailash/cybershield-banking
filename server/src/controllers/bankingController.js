import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { accounts, approvals, beneficiaries, createApproval, createTransaction, persistBeneficiary, transactions, writeAudit, writeSecurityEvent } from '../services/demoStore.js';
import { assessRisk } from '../services/fraudService.js';
import { AppError } from '../utils/errors.js';
import { parseBody } from '../utils/validation.js';
import ApprovalRequest from '../models/ApprovalRequest.js';
import Transaction from '../models/Transaction.js';
import { isDatabaseConnected } from '../config/database.js';

const transferSchema = z.object({
  beneficiary: z.string().trim().min(3).max(100).regex(/^[\p{L}\p{N}\s\p{P}\p{S}]+$/u, 'Beneficiary contains unsupported characters.'),
  amount: z.number().finite().min(1).max(100000),
  purpose: z.string().trim().min(3).max(60),
});
const decisionSchema = z.object({ decision: z.enum(['APPROVE', 'REJECT']) });

export function listAccounts(req, res) {
  const owned = accounts.filter((account) => req.user.role === 'admin' || account.customerId === req.user.customerId);
  res.json({ items: owned, simulated: true });
}

export function listBeneficiaries(req, res) {
  const owned = beneficiaries.filter((beneficiary) => req.user.role === 'admin' || beneficiary.customerId === req.user.customerId);
  res.json({ items: owned, simulated: true });
}

export function listTransactions(req, res) {
  const owned = transactions.filter((transaction) => req.user.role === 'admin' || transaction.customerId === req.user.customerId);
  res.json({ items: owned, simulated: true });
}

export async function submitTransfer(req, res) {
  const input = parseBody(transferSchema, req.body);
  if (req.user.role !== 'customer') throw new AppError(403, 'Only the customer demo role can submit a simulated transfer.');
  const isNewBeneficiary = !beneficiaries.some((item) => `${item.name} · ${item.accountNumberMasked}` === input.beneficiary);
  const recentTransfers = transactions.filter((item) => item.customerId === req.user.customerId && Date.now() - Date.parse(item.createdAt) < 5 * 60 * 1000).length;
  const risk = assessRisk({ amount: input.amount, newBeneficiary: isNewBeneficiary, recentTransfers });
  const status = input.amount >= 25000 ? 'APPROVAL_REQUIRED' : risk.score >= 80 ? 'BLOCKED' : risk.score >= 55 ? 'REVIEW' : 'NORMAL';
  const transaction = await createTransaction({
    customerId: req.user.customerId,
    beneficiary: input.beneficiary,
    amount: input.amount,
    purpose: input.purpose,
    riskScore: risk.score,
    riskLevel: risk.level,
    status,
  });
  let approval = null;
  if (status === 'APPROVAL_REQUIRED') {
    approval = await createApproval({
      reference: transaction.reference,
      maker: req.user.customerId,
      beneficiary: input.beneficiary,
      amount: input.amount,
      riskScore: risk.score,
      riskLevel: risk.level,
    });
  }
  const event = await writeSecurityEvent({ event: 'SUSPICIOUS_TRANSACTION', user: req.user.customerId, source: transaction.reference, severity: risk.level });
  await writeAudit({ user: req.user.customerId, action: 'FUND_TRANSFER', device: 'Demo-Session', resource: transaction.reference, status, risk: risk.level });
  res.status(201).json({
    reference: transaction.reference,
    eventId: event.id,
    status,
    riskScore: risk.score,
    riskLevel: risk.level,
    triggeredRules: risk.factors,
    recommendedAction: status === 'APPROVAL_REQUIRED' ? 'Independent checker review required.' : status === 'BLOCKED' ? 'Keep this request blocked for review.' : status === 'REVIEW' ? 'Review the elevated demo risk signals.' : 'Continue through the simulated security pipeline.',
    approval,
    simulated: true,
  });
}

export function listApprovals(req, res) {
  const visible = approvals.filter((item) => req.user.role === 'admin' || item.maker === req.user.customerId || req.user.role === 'checker');
  res.json({ items: visible, simulated: true });
}

export async function decideApproval(req, res) {
  const input = parseBody(decisionSchema, req.body);
  if (req.user.role !== 'checker') throw new AppError(403, 'Only the checker role can decide a maker-checker request.');
  const request = approvals.find((item) => item.id === req.params.id);
  if (!request) throw new AppError(404, 'Approval request was not found.');
  if (request.maker === req.user.customerId) throw new AppError(403, 'A maker cannot approve their own request.');
  if (request.status !== 'PENDING') throw new AppError(409, 'This approval request has already been decided.');
  request.status = input.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  request.checker = req.user.customerId;
  request.decidedAt = new Date().toISOString();
  const transaction = transactions.find((item) => item.reference === request.reference);
  if (transaction) transaction.status = request.status;
  if (isDatabaseConnected()) {
    await ApprovalRequest.updateOne({ reference: request.reference, status: 'PENDING' }, { $set: { status: request.status, checker: request.checker } });
    await Transaction.updateOne({ reference: request.reference }, { $set: { status: request.status } });
  }
  await writeSecurityEvent({ event: input.decision === 'APPROVE' ? 'TRANSACTION_APPROVED' : 'TRANSACTION_REJECTED', user: req.user.customerId, source: request.reference, severity: 'Low', status: 'Reviewed' });
  await writeAudit({ user: req.user.customerId, action: input.decision === 'APPROVE' ? 'TRANSACTION_APPROVED' : 'TRANSACTION_REJECTED', resource: request.reference, status: request.status, risk: request.riskLevel });
  res.json({ approval: request, simulated: true });
}

export async function addBeneficiary(req, res) {
  const schema = z.object({
    name: z.string().trim().min(2).max(60).regex(/^[\p{L}\s.'-]+$/u),
    accountNumberMasked: z.string().trim().min(4).max(40).regex(/^[Xx\d\s-]+$/),
  });
  const input = parseBody(schema, req.body);
  if (req.user.role !== 'customer') throw new AppError(403, 'Only the customer demo role can add a beneficiary.');
  const record = { id: `BEN-${randomUUID().slice(0, 8).toUpperCase()}`, customerId: req.user.customerId, ...input, simulated: true };
  await persistBeneficiary(record);
  beneficiaries.push(record);
  await writeAudit({ user: req.user.customerId, action: 'BENEFICIARY_ADDED', resource: record.id, status: 'SUCCESS' });
  res.status(201).json({ beneficiary: record });
}

export function assessFraudRequest(req, res, next) {
  const schema = z.object({
    amount: z.number().finite().min(1).max(100000),
    newBeneficiary: z.boolean().default(false),
    recentTransfers: z.number().int().min(0).max(20).default(0),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    next(new AppError(400, parsed.error.issues.map((issue) => issue.message).join('; ')));
    return;
  }
  const result = assessRisk(parsed.data);
  res.json({ score: result.score, level: result.level, triggeredRules: result.factors, simulated: true });
}
