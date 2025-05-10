import express from 'express';
import * as soap from 'soap';
import * as http from 'http';
import { connectToDatabase } from './config/db.config';
import { WalletService } from './services/wallet.service';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// WSDL definition for the SOAP service
const walletServiceWsdl = fs.readFileSync('src/wallet-service.wsdl', 'utf8');

// Initialize service
const walletService = new WalletService();

// Service implementation
const serviceObject = {
  WalletService: {
    WalletServiceSoap: {
      RegisterClient: async (args: { document: string; names: string; email: string; phone: string }) => {
        console.log('SOAP RegisterClient called with:', args);
        return await walletService.registerClient(args);
      },
      
      RechargeWallet: async (args: { document: string; phone: string; amount: number }) => {
        console.log('SOAP RechargeWallet called with:', args);
        // Aseguramos que amount sea de tipo number
        args.amount = Number(args.amount);
        return await walletService.rechargeWallet(args);
      },
      
      InitiatePayment: async (args: { document: string; phone: string; amount: number }) => {
        console.log('SOAP InitiatePayment called with:', args);
        // Aseguramos que amount sea de tipo number
        args.amount = Number(args.amount);
        return await walletService.initiatePayment(args);
      },
      
      ConfirmPayment: async (args: { sessionId: string; token: string }) => {
        console.log('SOAP ConfirmPayment called with:', args);
        return await walletService.confirmPayment(args);
      },
      
      CheckBalance: async (args: { document: string; phone: string }) => {
        console.log('SOAP CheckBalance called with:', args);
        return await walletService.checkBalance(args);
      }
    }
  }
};

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Create HTTP server
    const server = http.createServer(app);
    
    // Create and listen for SOAP requests
    soap.listen(server, '/wallet-service', serviceObject, walletServiceWsdl);
    
    // Start server
    server.listen(PORT, () => {
      console.log(`SOAP Server running at http://localhost:${PORT}/wallet-service?wsdl`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();