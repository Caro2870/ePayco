import mongoose, { Document, Schema } from 'mongoose';

// Interface for Client document
export interface IClient extends Document {
  document: string; // ID document
  names: string;
  email: string;
  phone: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const ClientSchema: Schema = new Schema({
  document: { 
    type: String, 
    required: true, 
    unique: true 
  },
  names: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Create and export the model
export default mongoose.model<IClient>('Client', ClientSchema);