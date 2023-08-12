import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, SignUpUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { Company } from 'src/company/entities/company-master.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileDTO } from './dto/create-user-profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private _usersRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private _userProfileRepository: Repository<UserProfile>,
        @InjectRepository(Company)
        private _comMasterRepository: Repository<Company>,
    ) { }

    async createNewUser(createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
        const hashPassword = await this.hashPassword(createUserDto.password);
        try {
            const newUser: User = await this._usersRepository.create({
                name: createUserDto.name,
                username: createUserDto.username,
                password: hashPassword,
            });
            const respone = await this._usersRepository.save(newUser);

            if (respone) {
                return {
                    message: "User create sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry username already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async signUpNewUser(signUpUserDto: SignUpUserDto): Promise<ResponseDto<null>> {
        const hashPassword = await this.hashPassword(signUpUserDto.password);
        const company: Company = await this.findCompanyId(signUpUserDto.companyId)
        const UserProfile: UserProfile = await this.initNewUserProfile(signUpUserDto, company)
        const fullName = this.generateFullName(signUpUserDto.first_name, signUpUserDto.last_name, signUpUserDto?.middle_name);
        try {
            const newUser: User = await this._usersRepository.create({
                name: fullName,
                username: signUpUserDto.username,
                password: hashPassword,
                company,
                profile: UserProfile,
            });
            const respone = await this._usersRepository.save(newUser);

            if (respone) {
                return {
                    message: "User create sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry username already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async initNewUserProfile(signUpUserDto: SignUpUserDto, company: Company): Promise<UserProfile> {
        try {
            const newProfile: UserProfile = await this._userProfileRepository.create({
                first_name: signUpUserDto?.first_name,
                middle_name: signUpUserDto?.middle_name,
                last_name: signUpUserDto?.last_name,
                address1: company?.address1,
                mobile1: company?.mobile1,
                mobile2: company?.mobile1,
                country_id: company?.country_id,
                state_id: company?.state_id,
                city: company?.city,
                pinCode: company?.pinCode,
            });
            return await this._userProfileRepository.save(newProfile);
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry username already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async createNewUserProfile(createUserProfileDto: UserProfileDTO): Promise<ResponseDto<null>> {
        try {
            const newProfile: UserProfile = await this._userProfileRepository.create({
                first_name: createUserProfileDto?.first_name,
                middle_name: createUserProfileDto?.middle_name,
                last_name: createUserProfileDto?.last_name,
                avatar: createUserProfileDto?.avatar,
                address1: createUserProfileDto?.address1,
                mobile1: createUserProfileDto?.mobile1,
                mobile2: createUserProfileDto?.mobile2,
                country_id: createUserProfileDto?.country_id,
                state_id: createUserProfileDto?.state_id,
                city: createUserProfileDto?.city,
                pinCode: createUserProfileDto?.pinCode,
            });
            const respone = await this._userProfileRepository.save(newProfile);

            if (respone) {
                return {
                    message: "User profile create sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry username already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<ResponseDto<null>> {
        const user: User = await this.findUserById(updateUserDto.id);
        user.name = updateUserDto?.name ? updateUserDto?.name : user.name;
        user.username = updateUserDto?.username ? updateUserDto?.username : user.username;
        user.password = updateUserDto?.password ? updateUserDto?.password : user.password;
        user.hashdRt = updateUserDto?.hashdRt ? updateUserDto?.hashdRt : user.hashdRt;
        user.isActive = 1;
        try {
            const respone = await this._usersRepository.save(user);
            if (respone) {
                return {
                    message: "User updated sucessfully",
                    response: null
                }
            }
        } catch (err) {
            if (err.code === ER_DUP_ENTRY && err.errno === ER_DUP_ENTRY_NO) {
                throw new ConflictException("Duplicate entry username already exists")
            }
            throw new InternalServerErrorException(err)
        }
    }

    async updateRt(id: number, hashdRt: { hashdRt: string }) {
        return await this._usersRepository.update(id, hashdRt);
    }


    async removeUser(id: number): Promise<ResponseDto<null>> {
        const user: User = await this.findUserById(id);

        if (user) {
            const result = await this._usersRepository.save({
                id,
                isActive: 0
            })

            if (result) {
                return {
                    message: "user removed sucessfully",
                    response: null,
                }
            }
        } else {
            throw new NotFoundException("user dosn't exist");
        }
    }

    async findUserByUserName(username: string): Promise<User | undefined> {
        return this._usersRepository.findOne({
            where: { username, isActive: 1 },
            relations: ['company', 'profile'],
        });
    }

    async findUserById(id: number): Promise<User | undefined> {
        return await this._usersRepository.findOne({
            where: { id, isActive: 1 },
            relations: ['company', 'profile'],
        });
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }

    async findCompanyId(id: number) {
        const company: Company = await this._comMasterRepository.findOne({
            where: {
                company_id: id,
                isActive: 1
            }
        })

        if (company) {
            return company;
        }

        throw new NotFoundException(`company with id ${id} not found`);
    }

    generateFullName(firstName: string, lastName: string, middleName?: string,): string {
        let fullName = firstName;
        if (middleName) {
            fullName += ` ${middleName}`;
        }
        fullName += ` ${lastName}`;
        return fullName;
    }

    async getProfileDetails(userId: number): Promise<ResponseDto<UserProfile>> {
        const user: User = await this.findUserById(userId)
        if (user) {
            return {
                message: "Profile details",
                response: user.profile
            };
        }
    }

}
