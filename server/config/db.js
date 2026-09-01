import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing');
  await mongoose.connect(uri);
  const expectedDatabase = String(process.env.MONGO_DB_NAME || '').trim();
  const connectedDatabase = String(mongoose.connection.name || '').trim();
  if (process.env.NODE_ENV === 'production' && !expectedDatabase) {
    await mongoose.disconnect();
    throw new Error('MONGO_DB_NAME is required in production');
  }
  if (expectedDatabase && connectedDatabase !== expectedDatabase) {
    await mongoose.disconnect();
    throw new Error(`MongoDB database mismatch: expected ${expectedDatabase}, connected ${connectedDatabase || '<none>'}`);
  }
  console.log(`MongoDB connected (${connectedDatabase})`);
};
