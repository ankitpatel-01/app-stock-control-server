import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorator';
import { Tokens } from 'src/common/types';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RtGuard } from './guards/rt.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth Controller')
@ApiSecurity('access-key')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this._authService.login(loginDto);
  }

  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
    return this._authService.register(createUserDto);
  }

  @Post('/logout')
  async logout(@GetCurrentUserId() userId: number) {
    return await this._authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
  ): Promise<Tokens> {
    return await this._authService.refreshTokens(userId, refreshToken);
  }
}
