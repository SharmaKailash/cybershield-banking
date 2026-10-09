import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { seedDemoUsers } from './controllers/authController.js';
import { loadPersistentDemoData, seedAccountsIfEmpty, seedBeneficiariesIfEmpty } from './services/demoStore.js';
import mongoose from 'mongoose';

const port = Number(process.env.PORT) || 4000;

function listen(port) {
  const server = app.listen(port);
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve(server);
    };
    server.once('error', onError);
    server.once('listening', onListening);
  });
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to at least 32 characters in server/.env.');
  process.exit(1);
}

try {
  await connectDatabase(process.env.MONGODB_URI);
  await seedDemoUsers();
  await seedAccountsIfEmpty();
  await seedBeneficiariesIfEmpty();
  await loadPersistentDemoData();
  await listen(port);
  console.info(`CyberShield demo API listening on http://localhost:${port}`);
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other API process, or set a different PORT in server/.env.`);
  } else {
    console.error('Could not start the API.', error.message);
  }
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    console.error('Could not close the database connection after startup failed.', disconnectError.message);
  }
  process.exit(1);
}
