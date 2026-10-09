import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) {
    console.info('MONGODB_URI is not set; using fictional in-memory demo data.');
    return false;
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.info('Connected to the configured MongoDB database.');
  return true;
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
