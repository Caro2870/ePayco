import mongoose, { Document, Schema } from 'mongoose';
import { randomUUID } from 'crypto';
import { generateToken } from '../utils/token.util';

export interface IPaymentSession extends Document {
  sessionId: string;
  clientId: mongoose.Types.ObjectId;
  amount: number;
  token: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSessionSchema: Schema = new Schema({
  sessionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  clientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  isUsed: { 
    type: Boolean, 
    default: false 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    default: () => new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
  }
}, {
  timestamps: true
});

// Index to automatically expire sessions
PaymentSessionSchema.index(
  { expiresAt: 1 }, 
  { expireAfterSeconds: 0 }
);

export default mongoose.model<IPaymentSession>('PaymentSession', PaymentSessionSchema);

export class PaymentSession {
  id: string;
  document: string;
  phone: string;
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'expired';

  constructor(document: string, phone: string, amount: number) {
    this.id = randomUUID();
    this.document = document;
    this.phone = phone;
    this.amount = amount;
    this.token = generateToken();
    this.timestamp = new Date();
    this.status = 'pending';
  }

  isExpired(): boolean {
    const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const currentTime = new Date().getTime();
    return (currentTime - this.timestamp.getTime()) > expirationTime;
  }
}

// In-memory store for payment sessions
export const paymentSessions = new Map<string, PaymentSession>();