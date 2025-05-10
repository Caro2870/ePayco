import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientCredentialsDto, RegisterClientDto, RechargeWalletDto, InitiatePaymentDto, ConfirmPaymentDto } from './dto/client.dto';
import { createClientAsync } from 'soap';

@Injectable()
export class WalletService {
  private soapUrl: string;

  constructor(private configService: ConfigService) {
    // Get the SOAP service URL from config
    this.soapUrl = this.configService.get<string>('SOAP_SERVICE_URL', 'http://localhost:8000/wallet-service?wsdl');
  }

  /**
   * Creates a SOAP client and returns it
   */
  private async getSoapClient() {
    try {
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