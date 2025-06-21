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
  private readonly env: string;

  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get<string>('NODE_ENV') || 'production';
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const isDevelopment = this.env === 'development';
    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : 'An error occurred';
    const devMessage= exception.getResponse()
    response.status(status).json({
      statusCode: status,
      type: isDevelopment ? exception.name : undefined,
      ...( isDevelopment ? { devMessage, stack: exception.stack } : { message: message})
    });
  }
}
