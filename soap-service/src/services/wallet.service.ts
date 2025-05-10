import { connectToDatabase } from '../config/db.config';
import Client, { IClient } from '../models/client.model';
import Transaction, { ITransaction } from '../models/transaction.model';
import { PaymentSession, paymentSessions } from '../models/payment-session.model';
import { sendTokenEmail } from '../utils/email.util';
import { createSuccessResponse, createErrorResponse } from '../utils/response.util';
import { toObjectIdString } from '../utils/mongoose.util';

// Connect to database
connectToDatabase();

export class WalletService {
  /**
   * Registers a new client with the wallet service
   */
  async registerClient(args: { document: string; names: string; email: string; phone: string }) {
    try {
      const { document, names, email, phone } = args;
      
      // Check if client already exists
      const existingClient = await Client.findOne({ document });
      if (existingClient) {
        return createErrorResponse('001', 'Client already exists');
      }

      // Create new client
      const client = new Client({
        document,
        names,
        email,
        phone,
        balance: 0
      }) as IClient;

      await client.save();
      
      // Convertir el ObjectId a string para evitar problemas de serialización XML
      return createSuccessResponse({ clientId: toObjectIdString(client._id) });
    } catch (error) {
      console.error('Error in registerClient:', error);
      return createErrorResponse('500', 'Error registering client');
    }
  }

  /**
   * Recharges a client's wallet with the specified amount
   */
  async rechargeWallet(args: { document: string; phone: string; amount: number }) {
    try {
      const { document, phone, amount } = args;
      
      if (amount <= 0) {
        return createErrorResponse('002', 'Amount must be greater than 0');
      }

      // Find client
      const client = await Client.findOne({ document, phone }) as IClient;
      if (!client) {
        return createErrorResponse('003', 'Client not found');
      }

      // Update client balance
      client.balance += amount;
      await client.save();

      // Record transaction
      const transaction = new Transaction({
        clientId: client._id,
        type: 'DEPOSIT',
        amount,
        reference: `Wallet recharge for ${amount}`,
        status: 'COMPLETED'
      }) as ITransaction;
      await transaction.save();

      return createSuccessResponse({ 
        newBalance: client.balance,
        transactionId: toObjectIdString(transaction._id)
      });
    } catch (error) {
      console.error('Error in rechargeWallet:', error);
      return createErrorResponse('500', 'Error processing recharge');
    }
  }

  /**
   * Initiates a payment from the client's wallet
   */
  async initiatePayment(args: { document: string; phone: string; amount: number }) {
    try {
      const { document, phone, amount } = args;
      
      if (amount <= 0) {
        return createErrorResponse('002', 'Amount must be greater than 0');
      }

      // Find client
      const client = await Client.findOne({ document, phone }) as IClient;
      if (!client) {
        return createErrorResponse('003', 'Client not found');
      }

      // Check balance
      if (client.balance < amount) {
        return createErrorResponse('004', 'Insufficient balance');
      }

      // Create payment session
      const session = new PaymentSession(document, phone, amount);
      paymentSessions.set(session.id, session);

      // Send token to client's email
      await sendTokenEmail(client.email, session.token, session.id, client.names);

      return createSuccessResponse({
        sessionId: session.id,
        expiresIn: '5 minutes'
      });
    } catch (error) {
      console.error('Error in initiatePayment:', error);
      return createErrorResponse('500', 'Error initiating payment');
    }
  }

  /**
   * Confirms a payment using the session ID and token
   */
  async confirmPayment(args: { sessionId: string; token: string }) {
    try {
      const { sessionId, token } = args;
      
      // Get payment session
      const session = paymentSessions.get(sessionId);
      if (!session) {
        return createErrorResponse('005', 'Payment session not found');
      }

      // Check if session is expired
      if (session.isExpired()) {
        paymentSessions.delete(sessionId);
        return createErrorResponse('006', 'Payment session expired');
      }

      // Verify token
      if (session.token !== token) {
        return createErrorResponse('007', 'Invalid token');
      }

      // Find client
      const client = await Client.findOne({ document: session.document, phone: session.phone }) as IClient;
      if (!client) {
        paymentSessions.delete(sessionId);
        return createErrorResponse('003', 'Client not found');
      }

      // Check balance again (in case it changed since initiation)
      if (client.balance < session.amount) {
        paymentSessions.delete(sessionId);
        return createErrorResponse('004', 'Insufficient balance');
      }

      // Update client balance
      client.balance -= session.amount;
      await client.save();

      // Record transaction
      const transaction = new Transaction({
        clientId: client._id,
        type: 'PURCHASE',
        amount: session.amount,
        reference: `Payment of ${session.amount}`,
        status: 'COMPLETED'
      }) as ITransaction;
      await transaction.save();

      // Update session status and clean up
      session.status = 'completed';
      paymentSessions.delete(sessionId);

      return createSuccessResponse({
        transactionId: toObjectIdString(transaction._id),
        newBalance: client.balance
      });
    } catch (error) {
      console.error('Error in confirmPayment:', error);
      return createErrorResponse('500', 'Error confirming payment');
    }
  }

  /**
   * Checks the balance of a client's wallet
   */
  async checkBalance(args: { document: string; phone: string }) {
    try {
      const { document, phone } = args;

      // Find client
      const client = await Client.findOne({ document, phone }) as IClient;
      if (!client) {
        return createErrorResponse('003', 'Client not found');
      }

      // Get recent transactions
      const transactions = await Transaction.find({ clientId: client._id })
        .sort({ createdAt: -1 })
        .limit(5) as ITransaction[];

      // Verificar y depurar datos de transacciones
      console.log('Transacciones encontradas:', JSON.stringify(transactions, null, 2));

      return createSuccessResponse({
        balance: client.balance,
        client: {
          clientId: toObjectIdString(client._id),
          document: client.document,
          names: client.names,
          email: client.email,
          phone: client.phone
        },
        recentTransactions: transactions.map(t => ({
          id: toObjectIdString(t._id),
          type: t.type,
          amount: t.amount,
          reference: t.reference,
          date: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt
        }))
      });
    } catch (error) {
      console.error('Error in checkBalance:', error);
      return createErrorResponse('500', 'Error checking balance');
    }
  }
}