import mongoose from 'mongoose';

function buildMongoUri(): string {
  const uri = process.env.MONGO_URI;
  if (uri) return uri;

  const user = process.env.MONGO_USER;
  const pass = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST ?? 'pact-db';
  const port = process.env.MONGO_PORT ?? '27017';
  const db   = process.env.MONGO_DATABASE;

  if (!user || !pass || !db) throw new Error('Missing MongoDB env vars (MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE)');

  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}?authSource=${db}`;
}

export async function connectDB(): Promise<void> {
  const uri = buildMongoUri();

  await mongoose.connect(uri);
  console.log('MongoDB connected →', mongoose.connection.host);

  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
}
