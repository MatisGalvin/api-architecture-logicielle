import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/http/modules/auth.module';
import { PrismaModule } from './domain/prisma.module';
import { PostModule } from './infrastructure/http/modules/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PostModule,
  ],
})
export class AppModule {}
