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

  @Get('/:user_id/series/:series_id')
  async getSeriesDetail(
    @Param('user_id') user_id: number,
    @Param('series_id') series_id: number,
    @Query('type') type: string,
  ) {
    const result = await this.lologService.getSeriesDetail(
      user_id,
      series_id,
      type,
    );

    return { statusCode: 200, series: result };
  }

  @Patch('/:user_id/series/:series_id')
  async editSeries(
    @Param('user_id') user_id: number,
    @Param('series_id') series_id: number,
    @Body('sort') sort,
  ) {
    await this.lologService.editSeries(series_id, sort);

    return { statusCode: 200, message: 'update seires success' };
  }

  @Delete('/:user_id/series/:series_id')
  async deleteSeries(
    @Param('user_id') user_id: number,
    @Param('series_id') series_id: number,
  ) {
    await this.lologService.deleteSeries(series_id, user_id);

    return { statusCode: 200, message: 'delete seires success' };
  }

  @Get('/:user_id')
  async getInsidePage(
    @Param('user_id') user_id: number,
    @Query('tag_id') tag_id: number,
  ) {
    const result = await this.lologService.getInsidePage(user_id, tag_id);

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
