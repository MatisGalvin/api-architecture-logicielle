import { describe, it, expect, vi, Mock } from 'vitest';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { CreatePost } from 'src/application/usecases/post/createPost';
import { Request } from 'express';

describe('CreatePost', () => {
  let createPost: CreatePost;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      post: {
        create: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
    } as unknown as PrismaService;

    createPost = new CreatePost(prismaService);
  });

  it('Should create a post and return it with user info', async () => {
    const createPostDto = {
      body: 'Post body',
      title: 'Post title',
      image: 'image.png',
    };
    const request = { user: { userId: '123' } } as unknown as Request;
    const mockPost = { id: '1', ...createPostDto, userId: '123' };
    const mockUser = {
      userId: '123',
      email: 'user@example.com',
      username: 'user123',
    };

    (prismaService.post.create as Mock).mockResolvedValue(mockPost);
    (prismaService.user.findUnique as Mock).mockResolvedValue(mockUser);

    const result = await createPost.create(createPostDto, request);

    expect(result).toEqual({ ...mockPost, user: mockUser });
    expect(prismaService.post.create).toHaveBeenCalledWith({
      data: { ...createPostDto, userId: '123' },
    });
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { userId: '123' },
      select: { userId: true, email: true, username: true },
    });
  });

  it('Should throw BadRequestException if user not found', async () => {
    const createPostDto = {
      body: 'Post body',
      title: 'Post title',
      image: 'image.png',
    };
    const request = { user: { userId: '123' } } as unknown as Request;
    const mockPost = { id: '1', ...createPostDto, userId: '123' };

    (prismaService.post.create as Mock).mockResolvedValue(mockPost);
    (prismaService.user.findUnique as Mock).mockRejectedValue(
      BadRequestException,
    );

    await expect(
      createPost.create(createPostDto, request),
    ).rejects.toThrowError(BadRequestException);
  });
});
