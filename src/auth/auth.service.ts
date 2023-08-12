import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { Tokens } from 'src/common/types';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';

/**
 * Service responsible for authentication related operations.
 */
@Injectable()
export class AuthService {
    /**
     * Constructor for AuthService.
     *
     * @param _userService The UsersService instance to use.
     * @param _jwtService The JwtService instance to use.
     */
    constructor(
        private readonly _userService: UsersService,
        private _jwtService: JwtService,
    ) { }

    /**
     * Authenticates a user and returns access and refresh tokens.
     *
     * @param dto The LoginDto containing user credentials.
     * @returns The access and refresh tokens.
     * @throws UnauthorizedException if the user credentials are incorrect.
     */
    async login(dto: LoginDto): Promise<Tokens> {
        const user = await this._userService.findUserByUserName(dto.username);
        if (!user) throw new UnauthorizedException('User not found. Please check the provided information and try again.');

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) throw new UnauthorizedException('Invalid credentials. Please verify your login details and try again.');

        const tokens = await this.getTokens(user.id, user.company.company_id, user.profile.id, user.username);
        const rtHash = await this.hashRefreshToken(tokens.refresh_token);

        await this._userService.updateRt(user.id, { hashdRt: rtHash });

        return tokens;
    }

    /**
     * Logs out the user by deleting their refresh token hash from the database.
     *
     * @param userId The ID of the user to log out.
     */
    async logout(userId: number) {
        await this._userService.updateRt(userId, { hashdRt: null });
    }

    /**
     * Refreshes the access and refresh tokens.
     *
     * @param userId The ID of the user to refresh the tokens for.
     * @param rt The refresh token.
     * @returns The new access and refresh tokens.
     * @throws ForbiddenException if the refresh token is invalid.
     */
    async refreshTokens(userId: number, rt: string): Promise<Tokens> {
        const user = await this._userService.findUserById(userId);

        if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');

        const rtMatches = await bcrypt.compare(rt, user.hashdRt);

        if (!rtMatches) throw new ForbiddenException('Access Denied.');

        const tokens = await this.getTokens(user.id, user.company.company_id, user.profile.id, user.username,);
        const rtHash = await this.hashRefreshToken(tokens.refresh_token);

        await this._userService.updateRt(user.id, { hashdRt: rtHash });

        return tokens;
    }

    /**
     * Registers a new user.
     *
     * @param createUserDto The CreateUserDto containing the new user's details.
     * @returns A ResponseDto with null response and success message.
     */
    async register(createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
        return this._userService.createNewUser(createUserDto);
    }

    /**
     * Generates access and refresh tokens for a user.
     *
     * @param userId The ID of the user.
     * @param companyId The ID of the company the user belongs to.
     * @param username The username of the user.
     * @returns The access and refresh tokens.
     */
    async getTokens(userId: number, companyId: number, profileId: number, username: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this._jwtService.signAsync(
                {
                    sub: userId,
                    cmpdbId: companyId,
                    updbId: profileId,
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
                    cmpdbId: companyId,
                    updbId: profileId,
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

    /**
    * Hashes the provided data using bcrypt with a salt factor of 10.
    *
    * @param {string} data - The data to hash.
    * @returns {Promise<string>} - A promise that resolves to the hashed data.
    */
    async hashRefreshToken(data: string): Promise<string> {
        // Uses bcrypt to hash the provided data with a salt factor of 10.
        // The salt factor determines the complexity of the hashing algorithm.
        // A higher factor value means the hashing algorithm is more complex and harder to break,
        // but also takes longer to compute.
        return bcrypt.hash(data, 10);
    }

}
