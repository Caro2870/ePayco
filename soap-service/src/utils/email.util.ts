import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Obtener la API key de SendGrid de las variables de entorno
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@sendgrid.net';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Virtual Wallet';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Inicializar SendGrid con la API key
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SendGrid API key not configured. Email notifications will be logged instead.');
}

// Asegurar que existe la carpeta emails para el modo dev
if (NODE_ENV === 'development') {
  const emailDir = path.join(process.cwd(), 'emails');
  if (!fs.existsSync(emailDir)) {
    try {
      fs.mkdirSync(emailDir);
    } catch (err) {
      console.warn('Could not create emails directory for development mode');
    }
  }
}

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
  // Crear contenido del email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Payment Confirmation</h2>
      <p>Hello ${userName},</p>
      <p>You have initiated a payment from your wallet. To confirm this transaction, please use the token below:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0; color: #333; font-size: 24px;">${token}</h3>
      </div>
      <p><strong>Session ID:</strong> ${sessionId}</p>
      <p>This token will expire in 5 minutes. If you did not request this payment, please ignore this email.</p>
      <p>Thank you,</p>
      <p>Virtual Wallet Team</p>
    </div>
  `;

  try {
    // Modo desarrollo: guardar emails como archivos
    if (!SENDGRID_API_KEY) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `email-${timestamp}-${to.replace('@', '-at-')}.html`;
      const filePath = path.join(process.cwd(), 'emails', filename);
      
      try {
        fs.writeFileSync(filePath, htmlContent);
        console.log(`[DEV MODE] Email saved to file: ${filePath}`);
        console.log(`[DEV MODE] Email would be sent to ${to} with token: ${token}`);
        return true;
      } catch (err) {
        console.error('Error saving email to file:', err);
        console.log(`[DEV MODE] Token for ${to}: ${token}, Session ID: ${sessionId}`);
        return true;  // Consideramos exitoso en modo desarrollo
      }
    }

    // Modo producción: enviar email real con SendGrid
    const msg = {
      to,
      from: {
        email: EMAIL_FROM,
        name: EMAIL_FROM_NAME
      },
      subject: 'Payment Confirmation Token',
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log(`Token email sent to ${to}`);
    return true;
  } catch (error: any) {
    // Tipando error como 'any' para acceder a sus propiedades
    if (error && error.response) {
      console.error('SendGrid API Error:', error.response.body);
    } else {
      console.error('Error sending email:', error);
    }
    return false;
  }
};