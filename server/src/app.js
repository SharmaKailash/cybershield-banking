import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiLimiter } from './middleware/rateLimiters.js';
import { authenticate, authorize } from './middleware/auth.js';
import { assessFraudRequest } from './controllers/bankingController.js';
import { getArchitecture, getAudit, getControls, getEvents, getRisk, getThreats } from './controllers/securityController.js';
import accountRoutes from './routes/accountRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import { errorHandler, notFound } from './utils/errors.js';

const app = express();
const routeMiddleware = (module) => {
  if (typeof module === 'function') return module;
  if (typeof module?.default === 'function') return module.default;
  throw new TypeError('A route module did not export an Express middleware function.');
};
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
);

function isLocalDevelopmentOrigin(origin) {
  let url;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) return false;
  const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();

  if (hostname === 'localhost' || hostname === '::1' || /^127(?:\.\d{1,3}){3}$/.test(hostname) || hostname.endsWith('.localhost')) {
    return true;
  }

  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return hostname.endsWith('.local');
  }

  return octets[0] === 10
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168);
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowLocalDevelopmentOrigin = process.env.NODE_ENV !== 'production' && isLocalDevelopmentOrigin(origin);
    return callback(null, allowedOrigins.has(origin) || allowLocalDevelopmentOrigin);
  },
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '20kb' }));
app.use(morgan('tiny'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', simulated: true }));
app.use('/api', apiLimiter);
app.use('/api/auth', routeMiddleware(authRoutes));
app.use('/api', routeMiddleware(accountRoutes));
app.use('/api/approvals', routeMiddleware(approvalRoutes));
app.use('/api/dashboard', routeMiddleware(dashboardRoutes));
app.use('/api/security', routeMiddleware(securityRoutes));
app.post('/api/fraud/assess', authenticate, assessFraudRequest);
app.get('/api/security-events', authenticate, authorize('admin', 'checker'), getEvents);
app.get('/api/threats', authenticate, getThreats);
app.get('/api/risk', authenticate, getRisk);
app.get('/api/audit', authenticate, authorize('admin', 'checker'), getAudit);
app.get('/api/security-controls', authenticate, getControls);
app.get('/api/architecture', authenticate, getArchitecture);
app.use(notFound);
app.use(errorHandler);

export default app;
