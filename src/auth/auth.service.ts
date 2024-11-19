import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/SignupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/SigninDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from './dto/ResetPasswordDemandeDto';
import * as speakeasy from 'speakeasy';
import { ResetPasswordConfirmationDto } from './dto/ResetPasswordConfirmationDto';
import { DeleteAccountDto } from './dto/DeleteAccountDto';
import { UpdateDto } from './dto/UpdateDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAll() {
    return await this.prismaService.user.findMany();
  }

  async get(userId: number) {
    return await this.prismaService.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        email: true,
        username: true,
      },
    });
  }

  async signup(signupDto: SignupDto) {
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

    await this.mailerService.sendSignupConfirmation(email);

    return { data: 'User successfully created' };
  }

  async signin(signinDto: SigninDto) {
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

  async resetPasswordDemand(resetpasswordDemandDto: ResetPasswordDemandDto) {
    const { email } = resetpasswordDemandDto;
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });

    if (!user) throw new NotFoundException('User not found');

    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });

    //todo: make a front url to modify the code
    const url = 'http://app:3000/auth/reset-password-confirmation';

    await this.mailerService.sendResetPassword(email, url, code);

    return { data: 'Reset password mail has been sent' };
  }

  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { code, email, password } = resetPasswordConfirmationDto;

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    const match = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });

    if (!match) throw new UnauthorizedException('Invalid/expired token');

    const hash = await bcrypt.hash(password, 10);

    await this.prismaService.user.update({
      where: { email },
      data: { password: hash },
    });

    this.mailerService.sendConfirmation(email);

    return { data: 'Password updated !' };
  }

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(
      deleteAccountDto.password,
      user.password,
    );
    if (!match) throw new UnauthorizedException('Credentials are not good');

    await this.prismaService.user.delete({ where: { userId } });

    return { data: 'User successfully deleted !' };
  }

  async patchUser(userId: number, updateDto: UpdateDto) {
    const { username, email, avatar } = updateDto;

    try {
      const user = await this.prismaService.user.update({
        where: { userId },
        data: { username, email, avatar },
      });

      const userReturned = {
        username: user.username,
        userId: user.userId,
        email: user.email,
        avatar: user.avatar,
      };

      return userReturned;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
