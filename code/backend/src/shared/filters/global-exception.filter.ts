import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let errorResponse: any = {
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Handle Too Many Requests
    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      errorResponse = {
        ...errorResponse,
        error: {
          message: 'Too Many Requests',
          retryAfter: `${response.getHeader('Retry-After-Otp')} seconds`,
        },
      };
    } 
    // Handle Validation Errors (BadRequestException from ValidationPipe)
    else if (exception instanceof BadRequestException) {
      const validationResponse = exception.getResponse() as any;
      errorResponse.error = {
        message: 'Validation Failed',
        details: Array.isArray(validationResponse.message)
          ? validationResponse.message
          : [validationResponse.message],
      };
    } 
    // Default Error Handling
    else {
      errorResponse.error = exception.getResponse();
    }

    console.error('Exception:', exception.message); // Log the exception for debugging

    response.status(status).json(errorResponse);
  }
}
