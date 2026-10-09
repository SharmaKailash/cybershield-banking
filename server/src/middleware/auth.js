import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors.js';

export function authenticate(req, _res, next) {
  const authorization = req.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return next(new AppError(401, 'Sign in to access this demo API.'));
  try {
    req.user = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    next(new AppError(401, 'Your demo session is invalid or has expired. Sign in again.'));
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(new AppError(403, 'Your demo role is not permitted to perform this action.'));
    next();
  };
}
