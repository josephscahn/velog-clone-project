import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { PostService } from './post.service';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * @todo 게시글 작성, 수정, 삭제 시에 썸네일, 시리즈 기능 추가 구현 필요
   * @todo 게시글 읽기(readPost) 기능은 velogController(이름은 임시)에 옮길 예정 -> /velog/${user_id}/${post_id}
   */

  @Post('')
  async createPost(
    @GetUser() user: User,
    @Body() data: CreatePostDto,
    @Query('status') status: number,
  ) {
    const result = await this.postService.createPost(user, data, status);

    if (result.create_post == 0)
      throw new BadRequestException(`post create failed`);

    if (result.post == 0) {
      throw new NotFoundException(`해당 게시글을 찾을 수 없습니다.`);
    }

    return {
      statusCode: 201,
      message: 'post create success',
      result: result.post,
    };
  }

  // @Get('/:id')
  // async readPost(@GetUser() user: User, @Param('id') post_id: number,) {
  //   const result = await this.postService.readPost(user, post_id);

  //   return { statusCode: 200, message: 'read post', result: result };
  // }

  @Patch('/:id')
  async updatePost(
    @GetUser() user: User,
    @Body() data: UpdatePostDto,
    @Param('id') post_id: number,
    @Query('status') status: number,
  ) {
    const result = await this.postService.updatePost(
      user,
      data,
      post_id,
      status,
    );

    if (result.update_post == 0)
      throw new BadRequestException(`post update failed`);

    if (result.post == 0) {
      throw new NotFoundException(`해당 게시글을 찾을 수 없습니다.`);
    }

    return {
      statusCode: 200,
      message: 'post update success',
      result: result.post,
    };
  }

  @Delete('/:id')
  async deletePost(@GetUser() user: User, @Param('id') post_id: number) {
    const result = await this.postService.deletePost(user, post_id);

    if (result.delete_post == 0)
      throw new BadRequestException(`post update failed`);

    if (result.post == 0) {
      throw new NotFoundException(`해당 게시글을 찾을 수 없습니다.`);
    }

    return { statusCode: 200, message: 'post delete success' };
  }
}
