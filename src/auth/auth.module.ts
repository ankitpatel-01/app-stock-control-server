import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant/constant';
import { AtStrategiest } from './strategies/at.strategies';
import { RtStrategiest } from './strategies/rt.strategies';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    CompanyModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AtStrategiest, RtStrategiest],
  exports: [AuthService],
})
export class AuthModule {}
