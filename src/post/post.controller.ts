import { Controller, UseGuards, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { PostService } from './post.service';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/saves/:id')
  @UseGuards(JwtAuthGuard)
  async selectSaveOne(@GetUser() user: User, @Param('id') post_id: number) {
    const result = await this.postService.selectSaveOne(post_id, user.id);

    const response = SetResponse(post_id + '번 임시글', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      post: result,
    };
  }

  @Get('/saves')
  @UseGuards(JwtAuthGuard)
  async selectSaves(@GetUser() user: User) {
    const result = await this.postService.selectSaves(user.id);

    const response = SetResponse('임시글', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      saves: result,
    };
  }

  @Get('/:id')
  async selectPostOne(@Param('id') post_id: number, @ValidateToken() user?: User) {
    const result = await this.postService.selectPostOne(post_id, user);

    const response = SetResponse(post_id + '번 게시글', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      series: result.series,
      post: result.post[0],
      next_post: result.next_post[0],
      pre_post: result.pre_post[0],
      comments: result.comments.comments,
      comment_count: result.comments.comment_count,
      interested: result.interested_posts,
    };
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createPost(@GetUser() user: User, @Body() data: CreatePostDto) {
    const result = await this.postService.createPost(user, data);

    const response = SetResponse('게시글', ResponseMessage.CREATE_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      post_id: result,
    };
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @GetUser() user: User,
    @Body() data: UpdatePostDto,
    @Param('id') post_id: number,
  ) {
    const result = await this.postService.updatePost(user, data, post_id);

    const response = SetResponse('게시글', ResponseMessage.UPDATE_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      post_id: result,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@GetUser() user: User, @Param('id') post_id: number) {
    await this.postService.deletePost(user, post_id);

    const response = SetResponse('게시글', ResponseMessage.DELETE_SUCCESS);

    return { statusCode: response[0], message: response[1] };
  }

  @Post('/:id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('id') post_id: number, @GetUser() user: User) {
    await this.postService.likePost(user.id, post_id);

    const response = SetResponse(String(post_id), ResponseMessage.POST_LIKE_SUCCESS);

    return { statusCode: response[0], message: response[1] };
  }

  @Delete('/:id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('id') post_id: number, @GetUser() user: User) {
    await this.postService.unlikePost(user.id, post_id);

    const response = SetResponse(String(post_id), ResponseMessage.POST_UNLIKE_SUCCESS);

    return { statusCode: response[0], message: response[1] };
  }
}
