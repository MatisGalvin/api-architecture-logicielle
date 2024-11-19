import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma.service';
import { Request } from 'express';

const PRISMA_CLIENT_KNOWN_REQUEST_ERROR = 'PrismaClientKnownRequestError';

@Injectable()
export class DeletePost {
  constructor(private readonly prismaService: PrismaService) {}

  async delete(postId: number, request: Request) {
    try {
      const userId = request.user['userId'];
      await this.prismaService.post.delete({ where: { postId, userId } });
      return { data: 'Post deleted !' };
    } catch (err) {
      if (err.name === PRISMA_CLIENT_KNOWN_REQUEST_ERROR) {
        throw new NotFoundException('Post or User Not found !');
      }
    }
  }
}
