import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Put } from '@nestjs/common/decorators';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('create')
    createNewUser(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
        return this.userService.createNewUser(createUserDto);
    }

    @Put('update')
    updateUser(@Body() updateUserDto: UpdateUserDto): Promise<ResponseDto<null>> {
        return this.userService.updateUser(updateUserDto);
    }

    @Delete(':id')
    removeUser(@Param('id') id: number): Promise<ResponseDto<null>> {
        return this.userService.removeUser(id);
    }
}
