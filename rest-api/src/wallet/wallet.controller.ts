import { 
  Controller, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus, 
  Logger 
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { 
  RegisterClientDto, 
  ClientIdentityDto, 
  RechargeWalletDto, 
  InitiatePaymentDto, 
  PaymentSessionDto 
} from './dto/client.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new client' })
  @ApiResponse({ 
    status: 201, 
    description: 'Client registered successfully',
    schema: {
      example: {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          message: 'Client registered successfully',
          client: {
            document: '1234567890',
            names: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request',
    schema: {
      example: {
        success: false,
        cod_error: '02',
        message_error: 'A client with this document or email already exists',
        data: {}
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: RegisterClientDto })
  async registerClient(@Body() registerClientDto: RegisterClientDto) {
    try {
      const response = await this.walletService.registerClient(registerClientDto);
      
      if (!response.success) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: response.message_error,
          code: response.cod_error,
        }, HttpStatus.BAD_REQUEST);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Error in registerClient: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error processing request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('recharge')
  @ApiOperation({ summary: 'Recharge wallet' })
  @ApiResponse({ 
    status: 200, 
    description: 'Wallet recharged successfully',
    schema: {
      example: {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          message: 'Wallet recharged successfully',
          currentBalance: 150,
          transactionId: '60d21b4667d0d8992e610c85'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or client not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: RechargeWalletDto })
  async rechargeWallet(@Body() rechargeWalletDto: RechargeWalletDto) {
    try {
      const response = await this.walletService.rechargeWallet(rechargeWalletDto);
      
      if (!response.success) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: response.message_error,
          code: response.cod_error,
        }, HttpStatus.BAD_REQUEST);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Error in rechargeWallet: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error processing request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('payment/initiate')
  @ApiOperation({ summary: 'Initiate payment' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment initiated successfully',
    schema: {
      example: {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          message: 'Payment initiated successfully. Please check your email for the confirmation token.',
          sessionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data, insufficient funds, or client not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: InitiatePaymentDto })
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    try {
      const response = await this.walletService.initiatePayment(initiatePaymentDto);
      
      if (!response.success) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: response.message_error,
          code: response.cod_error,
        }, HttpStatus.BAD_REQUEST);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Error in initiatePayment: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error processing request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('payment/confirm')
  @ApiOperation({ summary: 'Confirm payment with token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment confirmed successfully',
    schema: {
      example: {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          message: 'Payment completed successfully',
          amount: 50,
          currentBalance: 100,
          transactionId: '60d21b4667d0d8992e610c86'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid token, expired token, or session not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: PaymentSessionDto })
  async confirmPayment(@Body() sessionDto: PaymentSessionDto) {
    try {
      const response = await this.walletService.confirmPayment(sessionDto);
      
      if (!response.success) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: response.message_error,
          code: response.cod_error,
        }, HttpStatus.BAD_REQUEST);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Error in confirmPayment: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error processing request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('balance')
  @ApiOperation({ summary: 'Check wallet balance' })
  @ApiResponse({ 
    status: 200, 
    description: 'Balance retrieved successfully',
    schema: {
      example: {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          document: '1234567890',
          names: 'John Doe',
          balance: 100
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or client not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: ClientIdentityDto })
  async checkBalance(@Body() clientIdentityDto: ClientIdentityDto) {
    try {
      const response = await this.walletService.checkBalance(clientIdentityDto);
      
      if (!response.success) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: response.message_error,
          code: response.cod_error,
        }, HttpStatus.BAD_REQUEST);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Error in checkBalance: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error processing request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}