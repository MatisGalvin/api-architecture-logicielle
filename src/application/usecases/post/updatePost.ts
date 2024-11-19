import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma.service';
import { Request } from 'express';
import { UpdatePostDto } from 'src/infrastructure/http/dtos/post/UpdatePostDto';

@Injectable()
export class UpdatePost {
  constructor(private readonly prismaService: PrismaService) {}

  async update(postId: number, request: Request, updatePostDto: UpdatePostDto) {
    try {
      const userId = request.user['userId'];
      await this.prismaService.post.update({
        where: { postId, userId },
        data: { ...updatePostDto },
      });
      return { data: 'Post updated !' };
    } catch (err) {
      throw new UnauthorizedException('Unauthorized action !');
    }
  }
}
