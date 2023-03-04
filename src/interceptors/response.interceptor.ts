import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        let respone = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message ? data.message : 'Success',
          data: data.hasOwnProperty("response") ? data.response : data,
          ...(data.hasOwnProperty("meta") && { meta: data.meta })
        }
        return respone;
      }),
    );
  }
}
