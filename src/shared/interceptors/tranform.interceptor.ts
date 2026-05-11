import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';
@Injectable()
export class TranformInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TranformInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((response_data) => {
        const statusCode = response.statusCode;
        this.logger.log(
          `[ ${request.url}]  ${request.method} -- ${statusCode} --[${JSON.stringify(request.body)}]`,
        );

        let data = response_data.data || response_data;
        if (data.user?.password) {
          const { password, ...rest } = data.user;
          data = {
            ...data,
            rest,
          };
        }

        return {
          code: statusCode,
          message: response_data.message ?? 'success',
          data,
        };
      }),
    );
  }
}
