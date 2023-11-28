import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Put } from '@nestjs/common/decorators';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { GetCurrentUserId } from 'src/common/decorator';
import { UserProfile } from './entities/user-profile.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User Master')
@ApiSecurity('access-key')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  getUserProfile(
    @GetCurrentUserId() userId: number,
  ): Promise<ResponseDto<UserProfile>> {
    return this.userService.getProfileDetails(userId);
  }

  @Post('create')
  createNewUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<null>> {
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
