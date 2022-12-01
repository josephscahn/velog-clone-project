import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { PostService } from './post.service';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/saves')
  @UseGuards(JwtAuthGuard)
  async selectSaves(@GetUser() user: User) {
    const result = await this.postService.selectSaves(user.id);

    return {
      statusCode: 200,
      saves: result,
    };
  }

  @Get('/:id')
  async selectPostOne(
    @Param('id') post_id: number,
    @ValidateToken() user?: User,
  ) {
    const result = await this.postService.selectPostOne(post_id, user);

    return {
      statusCode: 200,
      series: result.series,
      post: result.post[0],
      next_post: result.next_post[0],
      pre_post: result.pre_post[0],
      comments: result.comments,
      interested: result.interested_posts,
    };
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createPost(@GetUser() user: User, @Body() data: CreatePostDto) {
    const result = await this.postService.createPost(user, data);
    if (result == 0) throw new BadRequestException(`post create failed`);
    return {
      statusCode: 201,
      message: 'post create success',
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

    // if (result.update_post == 0)
    //   throw new BadRequestException(`post update failed`);

    // if (result.post == 0) {
    //   throw new NotFoundException(`해당 게시글을 찾을 수 없습니다.`);
    // }

    return {
      statusCode: 200,
      message: 'post update success',
      post_id: result,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@GetUser() user: User, @Param('id') post_id: number) {
    await this.postService.deletePost(user, post_id);

    return { statusCode: 200, message: 'post delete success' };
  }
}
