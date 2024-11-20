import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/application/dtos/user/SignupDto';

@Injectable()
export class CreateUser {
  constructor(private readonly prismaService: PrismaService) {}

  async create(signupDto: SignupDto) {
    const { email, password, passwordConfirmation, username, avatar } =
      signupDto;

    if (password !== passwordConfirmation)
      throw new ConflictException('password is not the same');

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user) throw new ConflictException('User already exists !');

    const hash = await bcrypt.hash(password, 10);

    await this.prismaService.user.create({
      data: { email, username, password: hash, avatar },
    });

    return { data: 'User successfully created' };
  }
}
