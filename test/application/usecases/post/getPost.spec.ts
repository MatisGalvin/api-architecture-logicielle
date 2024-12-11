import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { GetPost } from 'src/application/usecases/post/getPost';
import { NotFoundException } from '@nestjs/common';

describe('Get a post by id', () => {
  let getPost: GetPost;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      post: {
        findUnique: vi.fn(),
      },
    } as unknown as PrismaService;
    getPost = new GetPost(prismaService);
  });

  it('should return one post', async () => {
    const mockPost = [{ id: 2, title: 'Post 2' }];

    (prismaService.post.findUnique as Mock).mockResolvedValue(mockPost);

    const result = await getPost.get(2);

    expect(result).toEqual(mockPost);

    expect(prismaService.post.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if post not found', async () => {
    (prismaService.post.findUnique as Mock).mockRejectedValue(
      NotFoundException,
    );

    await expect(getPost.get(999)).rejects.toThrowError(NotFoundException);

    expect(prismaService.post.findUnique).toHaveBeenCalledTimes(1);
  });
});
