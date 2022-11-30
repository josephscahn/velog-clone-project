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
import { LologService } from './lolog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('lolog')
export class LologController {
  constructor(private readonly lologService: LologService) {}

  @Get('/:user_id/series')
  async getSeries(@Param('user_id') user_id: number) {
    const result = await this.lologService.getSeries(user_id);

    return { statusCode: 200, series: result };
  }

  @Get('/:user_id/about')
  async getAbout(@Param('user_id') user_id: number) {
    const result = await this.lologService.getAboutBlog(user_id);

    return { statusCode: 200, about: result };
  }

  @Get('/:user_id')
  async getInsidePage(
    @Param('user_id') user_id: number,
    @Query('tag_id') tag_id: number,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this.lologService.getInsidePage(
      user_id,
      tag_id,
      pagination,
    );

    return { statusCode: 200, posts: result.posts, tags: result.tags };
  }

  @Get('/:user_id/:post_id')
  async getPostDetail(
    @Param('user_id') user_id: number,
    @Param('post_id') post_id: number,
    @ValidateToken() user?: User,
  ) {
    const result = await this.lologService.getPostDetail(
      user_id,
      post_id,
      user,
    );

    return {
      statusCode: 200,
      series: result.series[0],
      post: result.post.post[0],
      next_post: result.post.next_post[0],
      pre_post: result.post.pre_post[0],
      comments: result.comments[0],
      interested: result.post.interested_posts[0],
    };
  }

  @Patch('/:user_id/about')
  async editAboutBlog(
    @Param('user_id') user_id: number,
    @Body() data: AboutBlogDto,
  ) {
    const result = await this.lologService.editAboutBlog(
      user_id,
      data.about_blog,
    );

    return { statusCode: 200, about: result };
  }

  @Post('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.lologService.likePost(user.id, post_id);
    return { statusCode: 200 };
  }

  @Delete('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.lologService.unlikePost(user.id, post_id);
    return { statusCode: 204 };
  }
}
