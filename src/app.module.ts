import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data-source';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { MasterModule } from './master/master.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards';
import { CompanyModule } from './company/company.module';
import { MiscModule } from './misc/misc.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    MasterModule,
    UserModule,
    AuthModule,
    CompanyModule,
    MiscModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }
