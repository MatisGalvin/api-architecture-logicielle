import { DeletePost } from 'src/application/usecases/post/deletePost';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { describe, vi, expect, it } from 'vitest';
import { Request } from 'express';

describe('DeletePost', () => {
  let prismaService: PrismaService;
  let deletePost: DeletePost;

  beforeEach(() => {
    prismaService = {
      post: {
        delete: vi.fn(),
      },
    } as unknown as PrismaService;

    deletePost = new DeletePost(prismaService);
  });

  it('should delete a post', async () => {
    const request = { user: { userId: '123' } } as unknown as Request;
    const postId = 2;

    const result = await deletePost.delete(postId, request);

    expect(result).toEqual({ data: 'Post deleted !' });
  });
});
