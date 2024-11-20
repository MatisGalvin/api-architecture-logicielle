import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { CreateUser } from 'src/application/usecases/user/createUser';
import { GetUser } from 'src/application/usecases/user/getUser';
import { LoginUser } from 'src/application/usecases/user/loginUser';
import { UpdateUser } from 'src/application/usecases/user/updateUser';
import { JwtStrategy } from 'src/application/usecases/user/jwtStrategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [CreateUser, JwtStrategy, GetUser, LoginUser, UpdateUser],
})
export class UserModule {}
