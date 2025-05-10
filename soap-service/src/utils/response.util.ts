// Standard response format for all SOAP operations as required by the project specs
export interface ServiceResponse {
  success: boolean;
  cod_error: string;
  message_error: string;
  data: any;
}

// Success response creator
export const createSuccessResponse = (data: any = {}): ServiceResponse => {
  return {
    success: true,
    cod_error: '00',
    message_error: '',
    data
  };
};

// Error response creator
export const createErrorResponse = (cod_error: string, message: string): ServiceResponse => {
  return {
    success: false,
    cod_error,
    message_error: message,
    data: {}
  };
};

// Standard error codes
export const ERROR_CODES = {
  DATABASE_ERROR: '01',
  VALIDATION_ERROR: '02',
  NOT_FOUND: '03',
  AUTHENTICATION_ERROR: '04',
  INSUFFICIENT_FUNDS: '05',
  TOKEN_EXPIRED: '06',
  TOKEN_INVALID: '07',
  EMAIL_ERROR: '08',
  GENERAL_ERROR: '99'
};

/**
 * Interface for standard API response
 */
export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  message_error?: string;
  cod_error?: string;
}

/**
 * Creates a success response
 * @param data Data to include in the response
 * @param message Optional success message
 * @returns Standardized success response object
 */
export const successResponse = (data: any = null, message: string = ''): ApiResponse => {
  return {
    success: true,
    data,
    message
  };
};

/**
 * Creates an error response
 * @param message Error message
 * @param errorCode Error code for client identification
 * @returns Standardized error response object
 */
export const errorResponse = (message: string, errorCode: string = 'ERR_UNKNOWN'): ApiResponse => {
  return {
    success: false,
    message_error: message,
    cod_error: errorCode
  };
};

/**
 * Error codes for common scenarios
 */
export const ErrorCodes = {
  CLIENT_NOT_FOUND: 'ERR_CLIENT_NOT_FOUND',
  DUPLICATE_CLIENT: 'ERR_DUPLICATE_CLIENT',
  INVALID_CREDENTIALS: 'ERR_INVALID_CREDENTIALS',
  INSUFFICIENT_FUNDS: 'ERR_INSUFFICIENT_FUNDS',
  INVALID_TOKEN: 'ERR_INVALID_TOKEN',
  TOKEN_EXPIRED: 'ERR_TOKEN_EXPIRED',
  SESSION_NOT_FOUND: 'ERR_SESSION_NOT_FOUND',
  SESSION_ALREADY_USED: 'ERR_SESSION_ALREADY_USED',
  EMAIL_SEND_FAILED: 'ERR_EMAIL_SEND_FAILED',
  INVALID_AMOUNT: 'ERR_INVALID_AMOUNT',
  DATABASE_ERROR: 'ERR_DATABASE',
  UNKNOWN_ERROR: 'ERR_UNKNOWN'
};