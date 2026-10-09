import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/crypto.js';
import { AppError } from '../utils/errors.js';
import { parseBody } from '../utils/validation.js';
import { z } from 'zod';
import { writeAudit, writeSecurityEvent } from '../services/demoStore.js';
import { isDatabaseConnected } from '../config/database.js';
import User from '../models/User.js';

const userSeeds = [
  { customerId: 'CUST1001', name: 'Kailash Sharma', role: 'customer', password: 'Shield@2026' },
  { customerId: 'ADMIN1001', name: 'Security Administrator', role: 'admin', password: 'Shield@2026' },
  { customerId: 'CHECK1001', name: 'Maitri Sharma', role: 'checker', password: 'Shield@2026' },
];
let usersPromise;

function getUsers() {
  usersPromise ??= Promise.all(userSeeds.map(async (user) => ({ ...user, ...await hashPassword(user.password) })));
  return usersPromise;
}

export async function seedDemoUsers() {
  if (!isDatabaseConnected()) return;
  for (const user of await getUsers()) {
    await User.updateOne(
      { customerId: user.customerId },
      { $set: { name: user.name, role: user.role, active: true }, $setOnInsert: { customerId: user.customerId, passwordHash: user.hash, passwordSalt: user.salt } },
      { upsert: true },
    );
  }
}

const pendingMfa = new Map();
const loginSchema = z.object({
  customerId: z.string().trim().min(5).max(20).regex(/^[A-Za-z0-9_-]+$/, 'Customer ID format is invalid.'),
  password: z.string().min(1).max(128),
});
const otpSchema = z.object({
  customerId: z.string().trim().min(5).max(20),
  challengeId: z.string().uuid(),
  otp: z.string().length(6).regex(/^\d{6}$/, 'Enter a valid six-digit demo OTP.'),
});

export async function login(req, res) {
  const input = parseBody(loginSchema, req.body);
  const users = await getUsers();
  const user = users.find((candidate) => candidate.customerId === input.customerId.toUpperCase());
  const valid = user && await verifyPassword(input.password, user.salt, user.hash);
  if (!valid) {
    await writeSecurityEvent({ event: 'LOGIN_FAILED', user: input.customerId.toUpperCase(), source: 'Demo sign-in', severity: 'Medium' });
    await writeAudit({ user: input.customerId.toUpperCase(), action: 'LOGIN_FAILED', resource: 'Authentication', status: 'DENIED', risk: 'Medium' });
    throw new AppError(401, 'Customer ID or password is incorrect.');
  }
  const challengeId = randomUUID();
  pendingMfa.set(challengeId, { user, expiresAt: Date.now() + 5 * 60 * 1000 });
  res.json({ challengeId, customerId: user.customerId, demoOtp: '246810', expiresInSeconds: 300, message: 'Demo OTP generated. No message was sent.' });
}

export async function verifyMfa(req, res) {
  const input = parseBody(otpSchema, req.body);
  const customerId = input.customerId.toUpperCase();
  const pending = pendingMfa.get(input.challengeId);
  if (!pending || pending.user.customerId !== customerId || pending.expiresAt < Date.now() || input.otp !== '246810') {
    pendingMfa.delete(input.challengeId);
    await writeSecurityEvent({ event: 'MFA_FAILED', user: customerId, source: 'Demo MFA challenge', severity: 'Medium' });
    throw new AppError(401, 'Demo OTP is invalid or expired. Request a new sign-in challenge.');
  }
  pendingMfa.delete(input.challengeId);
  const user = pending.user;
  const token = jwt.sign({ sub: user.customerId, customerId: user.customerId, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m', issuer: 'cybershield-demo' });
  await writeSecurityEvent({ event: 'MFA_VERIFIED', user: user.customerId, source: 'Demo session', severity: 'Low', status: 'Reviewed' });
  await writeAudit({ user: user.customerId, action: 'LOGIN', resource: 'Authentication', status: 'SUCCESS', risk: 'Low' });
  res.json({ token, user: { customerId: user.customerId, name: user.name, role: user.role } });
}
