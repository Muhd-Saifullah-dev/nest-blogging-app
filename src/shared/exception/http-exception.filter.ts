import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = this.preparedValidationError(exception);

    this.logger.error(
      `[${request.method}] ${request.url} - Error: ${JSON.stringify(message)}`,
      (exception as Error).stack,
    );
    response.status(status).json({
      code: status,
      message: message,
      timestamp: new Date(),
      path: request.url,
      data: null,
    });
  }

  private preparedValidationError(exception: HttpException) {
    const exceptionResponse = exception.getResponse();
    if (
      exception instanceof BadRequestException &&
      typeof exceptionResponse === 'object'
    ) {
      const errorData = (exceptionResponse as any).message;

      const firstError = Array.isArray(errorData) ? errorData[0] : errorData;

      if (
        firstError &&
        typeof firstError === 'object' &&
        firstError.constraints
      ) {
        return Object.values(firstError.constraints)[0] as string;
      }

      return Array.isArray(errorData) ? errorData[0] : errorData;
    }
    // Fallback for all other HttpExceptions
    return typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as any).message || 'Internal Server Error';
  }
}
