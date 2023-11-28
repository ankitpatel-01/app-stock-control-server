/*
https://docs.nestjs.com/openapi/decorators#decorators
*/
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCompanyId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      return request.user['cmpdbId'];
    } else {
      throw new BadRequestException(`company branch id not found`);
    }
  },
);
