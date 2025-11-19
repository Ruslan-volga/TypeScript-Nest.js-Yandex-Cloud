import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        data: data,
      })),
      catchError((error) => {
        // Если ошибка уже является HttpException, пропускаем ее как есть
        if (error instanceof HttpException) {
          return throwError(() => error);
        }
        
        // Для других ошибок создаем форматированную ошибку
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
          status: 'fail',
          data: error.message || 'Внутренняя ошибка сервера',
        };
        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
}