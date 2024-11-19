import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SignupDto } from '../dtos/user/SignupDto';
import { SigninDto } from '../dtos/user/SigninDto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateDto } from '../dtos/user/UpdateDto';
import { CreateUser } from 'src/application/usecases/user/createUser';
import { GetUser } from 'src/application/usecases/user/getUser';
import { LoginUser } from 'src/application/usecases/user/loginUser';
import { UpdateUser } from 'src/application/usecases/user/updateUser';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly getUser: GetUser,
    private readonly loginUser: LoginUser,
    private readonly updateUser: UpdateUser,
  ) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.createUser.create(signupDto);
  }

  @Get('get/:id')
  get(@Param('id', ParseIntPipe) postId: number) {
    return this.getUser.get(postId);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.loginUser.login(signinDto);
  }

  @ApiBearerAuth()
  @Patch('patch/:id')
  patchUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateDto: UpdateDto,
  ) {
    return this.updateUser.update(userId, updateDto);
  }
}
