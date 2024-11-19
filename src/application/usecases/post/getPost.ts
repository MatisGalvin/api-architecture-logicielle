import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma.service';

@Injectable()
export class GetPost {
  constructor(private readonly prismaService: PrismaService) {}

  async get(postId: number) {
    try {
      return await this.prismaService.post.findUnique({
        where: { postId },
        include: {
          user: {
            select: {
              username: true,
              email: true,
              password: false,
              userId: true,
            },
          },
        },
      });
    } catch (err) {
      throw new NotFoundException('Post not found !');
    }
  }
}
