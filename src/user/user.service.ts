import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ER_DUP_ENTRY, ER_DUP_ENTRY_NO } from 'src/shared/constant/error.const';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private _usersRepository: Repository<User>,
    ) { }

    async createNewUser(createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
        const hashPassword = await this.hashPassword(createUserDto.password);
        try {
            const newUser: User = await this._usersRepository.create({
                name: createUserDto.name,
                full_name: createUserDto?.full_name ? createUserDto?.full_name : null,
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

    async updateUser(updateUserDto: UpdateUserDto): Promise<ResponseDto<null>> {
        const user: User = await this.findUserById(updateUserDto.id);
        user.name = updateUserDto?.name ? updateUserDto?.name : user.name;
        user.full_name = updateUserDto?.full_name ? updateUserDto?.full_name : user.full_name;
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
        return this._usersRepository.findOneBy({ username: username, isActive: 1 });
    }

    async findUserById(id: number): Promise<User | undefined> {
        return await this._usersRepository.findOneBy({ id: id });
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }
}
