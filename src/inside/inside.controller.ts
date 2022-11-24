import { Controller, Get, Param, Query } from '@nestjs/common';
import { InsideService } from './inside.service';

@Controller('inside')
export class InsideController {
  constructor(private readonly insideService: InsideService) {}

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
  ) {
    const result = await this.insideService.getPostDetail(user_id, post_id);

    return {
      statusCode: 200,
      series: result.series,
      post: result.post.post,
      next_post: result.post.next_post,
      pre_post: result.post.pre_post,
      comments: result.comments,
    };
  }

  @Get('/:user_id/series')
  async getSeries(@Param('user_id') user_id: number) {}

  @Get('/:user_id/about')
  async getAbout(@Param('user_id') user_id: number) {}
}
