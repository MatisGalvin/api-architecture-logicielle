import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Request } from 'express';
import { CreatePostDto } from 'src/application/dtos/post/CreatePostDto';

@Injectable()
export class CreatePost {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto, request: Request) {
    const userId = request.user['userId'];
    const { body, title, image } = createPostDto;
    const post = await this.prismaService.post.create({
      data: {
        body: body,
        title: title,
        userId: userId,
        image: image,
      },
    });

    try {
      const user = await this.prismaService.user.findUnique({
        where: { userId },
        select: {
          userId: true,
          email: true,
          username: true,
        },
      });

      return { ...post, user };
    } catch (err) {
      throw new BadRequestException('User not found');
    }
  }
}
