/*
https://docs.nestjs.com/openapi/decorators#decorators
*/
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCompanyId = createParamDecorator(
    (data: undefined, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest();
        return request.user['cmpdbId'];
    },
);
