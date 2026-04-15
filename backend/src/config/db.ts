import mongoose from 'mongoose';

const connectDB = async (uri?: string) => {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI not set in environment');
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

export default connectDB;
