import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class GetUser {
  constructor(private readonly prismaService: PrismaService) {}

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
}
