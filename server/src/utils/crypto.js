import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const deriveKey = promisify(pbkdf2);
const ITERATIONS = 120000;

export async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = await deriveKey(password, salt, ITERATIONS, 32, 'sha256');
  return { salt, hash: hash.toString('hex'), iterations: ITERATIONS };
}

export async function verifyPassword(password, salt, expectedHash) {
  const { hash } = await hashPassword(password, salt);
  const supplied = Buffer.from(hash, 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
