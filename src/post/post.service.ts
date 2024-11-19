import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { UpdatePostDto } from './dto/UpdatePostDto';

const PRISMA_CLIENT_KNOWN_REQUEST_ERROR = 'PrismaClientKnownRequestError';

@Injectable()
export class PostService {
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
