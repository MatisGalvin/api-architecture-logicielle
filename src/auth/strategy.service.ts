import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

type User = {
  userId: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(user: User) {
    const { email } = user;
    const userData = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!userData) throw new UnauthorizedException('Unauthorized');
    return userData;
  }
}
