import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/post/CreatePostDto';
import { UpdatePostDto } from '../dtos/post/UpdatePostDto';
import { CreatePost } from 'src/application/usecases/post/createPost';
import { GetPost } from 'src/application/usecases/post/getPost';
import { GetAllPost } from 'src/application/usecases/post/getAllPost';
import { UpdatePost } from 'src/application/usecases/post/updatePost';
import { DeletePost } from 'src/application/usecases/post/deletePost';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(
    private readonly createPost: CreatePost,
    private readonly getAllPost: GetAllPost,
    private readonly getPost: GetPost,
    private readonly updateUser: UpdatePost,
    private readonly deletePost: DeletePost,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    return this.createPost.create(createPostDto, request);
  }

  @Get('get')
  getAll() {
    return this.getAllPost.getAll();
  }

  @Get('get/:id')
  get(@Param('id', ParseIntPipe) userId: number) {
    return this.getPost.get(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) postId: number, @Req() request: Request) {
    return this.deletePost.delete(postId, request);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('put/:id')
  update(
    @Param('id', ParseIntPipe) postId: number,
    @Req() request: Request,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.updateUser.update(postId, request, updatePostDto);
  }
}
