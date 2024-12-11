import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { GetAllPost } from 'src/application/usecases/post/getAllPost';

describe('GetAllPost', () => {
  let getAllPost: GetAllPost;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      post: {
        findMany: vi.fn(),
      },
    } as unknown as PrismaService;
    getAllPost = new GetAllPost(prismaService);
  });

  it('should return posts', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
    ];

    (prismaService.post.findMany as Mock).mockResolvedValue(mockPosts);

    const result = await getAllPost.getAll();

    expect(result).toEqual(mockPosts);

    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });
});
