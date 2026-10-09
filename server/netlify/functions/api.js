import serverless from 'serverless-http';
import app from '../../src/app.js';
import { connectDatabase } from '../../src/config/database.js';
import { seedDemoUsers } from '../../src/controllers/authController.js';
import {
  loadPersistentDemoData,
  seedAccountsIfEmpty,
  seedBeneficiariesIfEmpty,
} from '../../src/services/demoStore.js';

const functionPath = '/.netlify/functions/api';
const proxy = serverless(app);
let initialization;

async function initialize() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }

  if (!initialization) {
    initialization = (async () => {
      await connectDatabase(process.env.MONGODB_URI);
      await seedDemoUsers();
      await seedAccountsIfEmpty();
      await seedBeneficiariesIfEmpty();
      await loadPersistentDemoData();
    })();
  }

  return initialization;
}

function normalizePath(event) {
  const path = event.path || new URL(event.rawUrl).pathname;
  const forwardedPath = path === functionPath
    ? ''
    : path.startsWith(`${functionPath}/`)
      ? path.slice(functionPath.length)
      : null;
  const normalizedEvent = {
    ...event,
    requestContext: {
      ...event.requestContext,
      identity: {
        ...event.requestContext?.identity,
        sourceIp: Object.entries(event.headers || {}).find(([name]) => name.toLowerCase() === 'x-nf-client-connection-ip')?.[1]
          || event.requestContext?.identity?.sourceIp
          || 'netlify-unknown',
      },
    },
  };

  if (forwardedPath === null) return normalizedEvent;
  return {
    ...normalizedEvent,
    path: forwardedPath === '' ? '/api' : forwardedPath.startsWith('/api/') ? forwardedPath : `/api${forwardedPath}`,
  };
}

export async function handler(event, context) {
  await initialize();
  context.callbackWaitsForEmptyEventLoop = false;
  return proxy(normalizePath(event), context);
}
