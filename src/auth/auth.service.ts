import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { Tokens } from 'src/common/types';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userService: UsersService,
        private _jwtService: JwtService,
    ) { }

    async login(dto: LoginDto): Promise<Tokens> {
        const user = await this._userService.findUserByUserName(dto.username);
        if (!user) throw new UnauthorizedException('username or password is incorrect.');

        const passwordMatches = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatches) throw new UnauthorizedException('username or password is incorrect.');

        const tokens = await this.getTokens(user.id, user.username);

        const rtHash = await this.hashRefreshToken(tokens.refresh_token);

        await this._userService.updateRt(user.id, { hashdRt: rtHash });

        return tokens;
    }

    async logout(userId: number) {
        await this._userService.updateRt(userId, { hashdRt: null });
    }

    async refreshTokens(userId: number, rt: string): Promise<Tokens> {
        const user = await this._userService.findUserById(userId);

        if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');

        const rtMatches = await bcrypt.compare(rt, user.hashdRt);

        if (!rtMatches) throw new ForbiddenException('Access Denied.');

        const tokens = await this.getTokens(user.id, user.username);

        const rtHash = await this.hashRefreshToken(tokens.refresh_token);

        await this._userService.updateRt(user.id, { hashdRt: rtHash });

        return tokens;
    }

    async register(createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
        return this._userService.createNewUser(createUserDto);
    }

    async getTokens(userId: number, username: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this._jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: 'at-secret',
                    expiresIn: '20m',
                },
            ),
            this._jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async hashRefreshToken(data: string) {
        return bcrypt.hash(data, 10);
    }
}
