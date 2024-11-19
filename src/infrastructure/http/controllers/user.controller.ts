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
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateDto } from '../dtos/user/UpdateDto';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get('get')
  getAll() {
    return this.authService.getAll();
  }

  @Get('get/:id')
  get(@Param('id', ParseIntPipe) postId: number) {
    return this.authService.get(postId);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @ApiBearerAuth()
  @Patch('patch/:id')
  patchUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateDto: UpdateDto,
  ) {
    return this.authService.patchUser(userId, updateDto);
  }
}
