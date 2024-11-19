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
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/CreatePostDto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from './dto/UpdatePostDto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    return this.postService.create(createPostDto, request);
  }

  @Get('get')
  getAll() {
    return this.postService.getAll();
  }

  @Get('get/:id')
  get(@Param('id', ParseIntPipe) userId: number) {
    return this.postService.get(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) postId: number, @Req() request: Request) {
    return this.postService.delete(postId, request);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('put/:id')
  update(
    @Param('id', ParseIntPipe) postId: number,
    @Req() request: Request,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(postId, request, updatePostDto);
  }
}
