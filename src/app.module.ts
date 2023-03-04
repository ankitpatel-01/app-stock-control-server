import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data-source';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { MasterModule } from './master/master.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    MasterModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
