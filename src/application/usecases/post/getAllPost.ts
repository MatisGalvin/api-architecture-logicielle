import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma.service';

@Injectable()
export class GetAllPost {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    try {
      const userInclude = {
        user: {
          select: {
            username: true,
            email: true,
            password: false,
            userId: true,
          },
        },
      };

      return await this.prismaService.post.findMany({
        include: {
          ...userInclude,
          comments: {
            include: userInclude,
          },
        },
      });
    } catch (err) {
      throw new NotFoundException('Posts not found');
    }
  }
}
