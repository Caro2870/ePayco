import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientCredentialsDto, RegisterClientDto, RechargeWalletDto, InitiatePaymentDto, ConfirmPaymentDto } from './dto/client.dto';
import { createClientAsync } from 'soap';

@Injectable()
export class WalletService {
  private soapUrl: string;

  constructor(private configService: ConfigService) {
    // Depurar la carga de configuración
    const config = this.configService.get('soapService');
    console.log('Config loaded:', config);
    
    // Intentar todas las formas posibles de obtener la URL
    let soapUrl = process.env.SOAP_SERVICE_URL;
    console.log('Direct from env:', soapUrl);
    
    if (!soapUrl) {
      soapUrl = this.configService.get<string>('soapService.url');
      console.log('From config nested:', soapUrl);
    }
    
    // Asegurar que la URL termine con ?wsdl para el cliente SOAP
    this.soapUrl = soapUrl || 'http://localhost:8000/wallet-service?wsdl';
    if (!this.soapUrl.includes('?wsdl')) {
      this.soapUrl += '?wsdl';
    }
    
    console.log('Final SOAP URL:', this.soapUrl);
  }

  /**
   * Creates a SOAP client and returns it
   */
  private async getSoapClient() {
    try {
      console.log('Creating SOAP client with URL:', this.soapUrl);
      return await createClientAsync(this.soapUrl);
    } catch (error) {
      console.error('Error creating SOAP client:', error);
      throw new HttpException(
        'Failed to connect to wallet service',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  /**
   * Register a new client
   */
  async registerClient(registerClientDto: RegisterClientDto) {
    try {
      const client = await this.getSoapClient();
      
      // Call the SOAP service using promisify to handle the callback
      const result = await client.RegisterClientAsync(registerClientDto);
      
      // The SOAP response is typically nested in the first element of the array
      const response = result[0];

      if (!response.success) {
        throw new HttpException(
          {
            success: false,
            cod_error: response.cod_error,
            message_error: response.message_error,
            data: {},
          },
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        cod_error: response.cod_error,
        message_error: response.message_error,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error registering client:', error);
      throw new HttpException(
        {
          success: false,
          cod_error: '99',
          message_error: 'Internal server error',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Recharge wallet
   */
  async rechargeWallet(rechargeWalletDto: RechargeWalletDto) {
    try {
      const client = await this.getSoapClient();
      
      const result = await client.RechargeWalletAsync(rechargeWalletDto);
      const response = result[0];

      if (!response.success) {
        throw new HttpException(
          {
            success: false,
            cod_error: response.cod_error,
            message_error: response.message_error,
            data: {},
          },
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        cod_error: response.cod_error,
        message_error: response.message_error,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error recharging wallet:', error);
      throw new HttpException(
        {
          success: false,
          cod_error: '99',
          message_error: 'Internal server error',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Initiate payment
   */
  async initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    try {
      const client = await this.getSoapClient();
      
      const result = await client.InitiatePaymentAsync(initiatePaymentDto);
      const response = result[0];

      if (!response.success) {
        throw new HttpException(
          {
            success: false,
            cod_error: response.cod_error,
            message_error: response.message_error,
            data: {},
          },
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        cod_error: response.cod_error,
        message_error: response.message_error,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error initiating payment:', error);
      throw new HttpException(
        {
          success: false,
          cod_error: '99',
          message_error: 'Internal server error',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Confirm payment
   */
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const client = await this.getSoapClient();
      
      const result = await client.ConfirmPaymentAsync(confirmPaymentDto);
      const response = result[0];

      if (!response.success) {
        throw new HttpException(
          {
            success: false,
            cod_error: response.cod_error,
            message_error: response.message_error,
            data: {},
          },
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        cod_error: response.cod_error,
        message_error: response.message_error,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error confirming payment:', error);
      throw new HttpException(
        {
          success: false,
          cod_error: '99',
          message_error: 'Internal server error',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Check wallet balance
   */
  async checkBalance(clientCredentialsDto: ClientCredentialsDto) {
    try {
      const client = await this.getSoapClient();
      
      const result = await client.CheckBalanceAsync(clientCredentialsDto);
      const response = result[0];

      if (!response.success) {
        throw new HttpException(
          {
            success: false,
            cod_error: response.cod_error,
            message_error: response.message_error,
            data: {},
          },
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        cod_error: response.cod_error,
        message_error: response.message_error,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error checking balance:', error);
      throw new HttpException(
        {
          success: false,
          cod_error: '99',
          message_error: 'Internal server error',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}