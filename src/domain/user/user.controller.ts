import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { LocalServiceAuthGuard } from '../../auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.findUserByEmail(createUserDto.email);

    createUserDto.password = await this.userService.hashPassword(
      createUserDto.password,
    );
    return this.userService.saveUser(createUserDto);
  }

  //유저 로그인
  @Post('/login')
  @UseGuards(LocalServiceAuthGuard)
  async login(@Req() req) {
    return req.user;
  }

  @Put('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }
}
