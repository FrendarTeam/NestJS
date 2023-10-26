import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

export class LoggerAndResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method = req.method;
    const url = req.url;
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        Logger.log(
          `${res.statusCode} ${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        );

        const result = {
          status: 'success',
          message: data.message,
        };

        delete data.message;
        if (Object.keys(data).length) {
          result['data'] = data;
        }

        return result;
      }),
      catchError((error) => {
        Logger.log(
          `${error.status} ${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        );

        error.response = {
          status: 'error',
          message:
            error.message === 'Bad Request Exception'
              ? error.response.message
              : error.message,
        };

        console.log(error);
        throw error;
      }),
    );
  }
}
