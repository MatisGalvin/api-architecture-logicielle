import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SigninDto } from 'src/application/dtos/user/SigninDto';

@Injectable()
export class LoginUser {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(signinDto: SigninDto) {
    const { password, email } = signinDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Credentials are not good');

    const userToken = {
      userId: user.userId,
      username: user.username,
      email: user.email,
    };

    const userStorage = { ...userToken, avatar: user.avatar };

    const token = this.jwtService.sign(userToken, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });

    return {
      token,
      userStorage,
    };
  }
}
