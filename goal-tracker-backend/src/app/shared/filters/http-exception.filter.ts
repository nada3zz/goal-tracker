import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: Record<string, any> = {
      statusCode: status,
    };

    if (this.isDevelopment) {
      errorResponse.type = exception.name;
      errorResponse.message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any)?.message || 'An error occurred';
      errorResponse.stack = exception.stack;
    } else {
      errorResponse.message =
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any)?.message || 'An error occurred';
    }

    response.status(status).json(errorResponse);
  }
}
