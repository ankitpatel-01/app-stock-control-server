import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly excludedPaths: string[] = [
    '/api/auth/logout',
    '/api/auth/login',
    '/api/auth/refresh',
    '/ping',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    console.log(httpContext.getRequest().url);
    if (this.isExcludedPath(httpContext.getRequest().url)) {
      // check if the request path is excluded
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        let respone = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data?.message ? data.message : 'Success',
          data: data.hasOwnProperty('response') ? data.response : data,
          ...(data.hasOwnProperty('meta') && { meta: data.meta }),
        };
        return respone;
      }),
    );
  }

  private isExcludedPath(path: string): boolean {
    return this.excludedPaths.includes(path);
  }
}
