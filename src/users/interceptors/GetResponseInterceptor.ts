import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isArray } from 'class-validator';

@Injectable()
export class GetResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object' && !isArray(data)) {
          return {
            id: data.id,
            email: data.email,
            consents: [],
          };
        }
      }),
    );
  }
}
