import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../services/strategy.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
