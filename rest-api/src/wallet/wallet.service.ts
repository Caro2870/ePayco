import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientCredentialsDto, RegisterClientDto, RechargeWalletDto, InitiatePaymentDto, PaymentSessionDto } from './dto/client.dto';
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
   * Procesa la respuesta SOAP y maneja errores de forma consistente
   */
  private processSoapResponse(result) {
    // La respuesta SOAP normalmente está en el primer elemento del array
    const response = result[0];
    
    if (!response.success) {
      throw new HttpException(
        {
          success: false,
          cod_error: response.cod_error || '99',
          message_error: response.message_error || 'Operation failed',
          data: {},
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      success: true,
      cod_error: response.cod_error || '00',
      message_error: response.message_error || '',
      data: response.data || {},
    };
  }

  /**
   * Manejador de errores SOAP común
   */
  private handleSoapError(error, operationName): never {
    console.error(`Error in ${operationName}:`, error);
    
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      {
        success: false,
        cod_error: '99',
        message_error: `Error processing ${operationName}`,
        data: {},
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  /**
   * Register a new client
   */
  async registerClient(registerClientDto: RegisterClientDto) {
    try {
      const client = await this.getSoapClient();
      const result = await client.RegisterClientAsync(registerClientDto);
      return this.processSoapResponse(result);
    } catch (error) {
      this.handleSoapError(error, 'registerClient');
    }
  }

  /**
   * Recharge wallet
   */
  async rechargeWallet(rechargeWalletDto: RechargeWalletDto) {
    try {
      const client = await this.getSoapClient();
      
      // Asegurar que amount sea un número
      if (typeof rechargeWalletDto.amount === 'string') {
        rechargeWalletDto.amount = Number(rechargeWalletDto.amount);
      }
      
      const result = await client.RechargeWalletAsync(rechargeWalletDto);
      return this.processSoapResponse(result);
    } catch (error) {
      this.handleSoapError(error, 'rechargeWallet');
    }
  }

  /**
   * Initiate payment
   */
  async initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    try {
      const client = await this.getSoapClient();
      
      // Asegurar que amount sea un número
      if (typeof initiatePaymentDto.amount === 'string') {
        initiatePaymentDto.amount = Number(initiatePaymentDto.amount);
      }
      
      const result = await client.InitiatePaymentAsync(initiatePaymentDto);
      return this.processSoapResponse(result);
    } catch (error) {
      this.handleSoapError(error, 'initiatePayment');
    }
  }

  /**
   * Confirm payment
   */
  async confirmPayment(confirmPaymentDto: PaymentSessionDto) {
    try {
      const client = await this.getSoapClient();
      const result = await client.ConfirmPaymentAsync(confirmPaymentDto);
      return this.processSoapResponse(result);
    } catch (error) {
      this.handleSoapError(error, 'confirmPayment');
    }
  }

  /**
   * Check wallet balance
   */
  async checkBalance(clientCredentialsDto: ClientCredentialsDto) {
    try {
      const client = await this.getSoapClient();
      const result = await client.CheckBalanceAsync(clientCredentialsDto);
      return this.processSoapResponse(result);
    } catch (error) {
      this.handleSoapError(error, 'checkBalance');
    }
  }
}