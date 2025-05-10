import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Usar la variable proporcionada por Railway o la variable local como respaldo
const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet_db';

// Connect to MongoDB
export const connectToDatabase = async (): Promise<mongoose.Connection> => {
  try {
    // Imprimir la URL para depuración (omitiendo detalles sensibles)
    const sanitizedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to MongoDB at: ${sanitizedUri}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};