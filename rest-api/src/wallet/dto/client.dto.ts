import { IsNotEmpty, IsEmail, IsString, IsNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientDto {
  @ApiProperty({
    description: 'Client document or ID number',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Client full name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  names: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;
}

export class ClientCredentialsDto {
  @ApiProperty({
    description: 'Client document or ID number',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}

export { ClientCredentialsDto as ClientIdentityDto };

export class RechargeWalletDto extends ClientCredentialsDto {
  @ApiProperty({
    description: 'Amount to recharge or pay',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class InitiatePaymentDto extends ClientCredentialsDto {
  @ApiProperty({
    description: 'Amount to initiate payment',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'Payment session ID received after initiating payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Token received in email for payment confirmation',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export { ConfirmPaymentDto as PaymentSessionDto };