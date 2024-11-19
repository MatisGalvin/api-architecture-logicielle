import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/http/modules/user.module';
import { PrismaModule } from 'src/domain/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './infrastructure/http/modules/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    PostModule,
  ],
})
export class AppModule {}
