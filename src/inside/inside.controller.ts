import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { User } from 'src/entity/user.entity';
import { AboutBlogDto } from 'src/dto/user/about-blog.dto';
import { InsideService } from './inside.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';

@Controller('inside')
export class InsideController {
  constructor(private readonly insideService: InsideService) {}

  @Get('/:user_id/series')
  async getSeries(@Param('user_id') user_id: number) {}

  @Get('/:user_id/about')
  async getAbout(@Param('user_id') user_id: number) {
    const result = await this.insideService.getAboutBlog(user_id);

    return { statusCode: 200, about: result };
  }

  @Get('/:user_id')
  async getInsidePage(
    @Param('user_id') user_id: number,
    @Query('tag_id') tag_id: number,
  ) {
    const result = await this.insideService.getInsidePage(user_id, tag_id);

    return { statusCode: 200, posts: result.posts, tags: result.tags };
  }

  @Get('/:user_id/:post_id')
  async getPostDetail(
    @Param('user_id') user_id: number,
    @Param('post_id') post_id: number,
    @ValidateToken() user?: User,
  ) {
    const result = await this.insideService.getPostDetail(
      user_id,
      post_id,
      user,
    );

    return {
      statusCode: 200,
      series: result.series,
      post: result.post.post,
      next_post: result.post.next_post,
      pre_post: result.post.pre_post,
      comments: result.comments,
    };
  }

  @Patch('/:user_id/about')
  async editAboutBlog(
    @Param('user_id') user_id: number,
    @Body() data: AboutBlogDto,
  ) {
    const result = await this.insideService.editAboutBlog(
      user_id,
      data.about_blog,
    );

    return { statusCode: 200, about: result };
  }

  @Post('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.insideService.likePost(user.id, post_id);
    return { statusCode: 200 };
  }

  @Delete('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.insideService.unlikePost(user.id, post_id);
    return { statusCode: 204 };
  }
}
