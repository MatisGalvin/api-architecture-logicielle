import { Module } from '@nestjs/common';
import { PostController } from '../controllers/post.controller';
import { CreatePost } from 'src/application/usecases/post/createPost';
import { DeletePost } from 'src/application/usecases/post/deletePost';
import { GetPost } from 'src/application/usecases/post/getPost';
import { GetAllPost } from 'src/application/usecases/post/getAllPost';
import { UpdatePost } from 'src/application/usecases/post/updatePost';

@Module({
  controllers: [PostController],
  providers: [CreatePost, DeletePost, GetPost, GetAllPost, UpdatePost],
})
export class PostModule {}
