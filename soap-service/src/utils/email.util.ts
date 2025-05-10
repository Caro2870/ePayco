import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Get email configuration from environment variables
// En Railway, añade estas variables de entorno
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

// Mensaje si las credenciales no están configuradas
if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('Email credentials not configured. Email notifications will not be sent.');
}

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Sends a token via email for payment confirmation
 * 
 * @param to - Recipient email address
 * @param token - Token for payment validation
 * @param sessionId - Payment session ID
 * @param userName - Name of the user
 * @returns Promise resolving to a boolean indicating success/failure
 */
export const sendTokenEmail = async (
  to: string, 
  token: string, 
  sessionId: string, 
  userName: string
): Promise<boolean> => {
  try {
    // Email content
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject: 'Payment Confirmation Token',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a4a4a;">Payment Confirmation</h2>
          <p>Hello ${userName},</p>
          <p>You have initiated a payment from your wallet. To confirm this transaction, please use the token below:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0; color: #333; font-size: 24px;">${token}</h3>
          </div>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p>This token will expire in 30 minutes. If you did not request this payment, please ignore this email.</p>
          <p>Thank you,</p>
          <p>Virtual Wallet Team</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Token email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};