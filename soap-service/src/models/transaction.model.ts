import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PURCHASE = 'PURCHASE'
}

export interface ITransaction extends Document {
  clientId: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  reference: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  clientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: Object.values(TransactionType),
    required: true 
  },
  reference: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED' 
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);