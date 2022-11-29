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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { PostService } from './post.service';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { CreateSeriesDto } from 'src/dto/series/create-series.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/lib/multerOptions';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:user_id')
  async savesPostList(
    @GetUser() user: User,
    @Param('user_id') user_id: number,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this.postService.selectPostList(
      user_id,
      null,
      true,
      pagination,
    );

    return {
      statusCode: 200,
      post: result,
    };
  }

  @Post('')
  async createPost(
    @GetUser() user: User,
    @Body() data: CreatePostDto,
    @Query('status') status: number,
  ) {
    const result = await this.postService.createPost(user, data, status);

    if (result.create_post == 0)
      throw new BadRequestException(`post create failed`);

    return {
      statusCode: 201,
      message: 'post create success',
      series: result.series[0],
      post: result.post.post[0],
      next_post: result.post.next_post[0],
      pre_post: result.post.pre_post[0],
      interested: result.post.interested_posts[0],
    };
  }

  @UseInterceptors(FilesInterceptor('image', 1, multerOptions))
  @Post('/thumbnail')
  async thumbnailUpload(
    @UploadedFiles() files: File[],
    @Body('file_name') file_name: string,
  ) {
    const result = await this.postService.thumbnailUpload(files, file_name);

    return {
      statusCode: 200,
      message: 'thumbnail upload success',
      imageUrl: result,
    };
  }

  @Delete('/thumbnail')
  thumbnailDelete(@Body('file_name') file_name: string) {
    this.postService.thumbnailDelete(file_name);

    return {
      statusCode: 200,
      message: 'thumbnail delete success',
    };
  }

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
      series: result.series[0],
      post: result.post.post[0],
      next_post: result.post.next_post[0],
      pre_post: result.post.pre_post[0],
      interested: result.post.interested_posts[0],
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

  @Post('/series')
  async createSeries(@GetUser() user: User, @Body() data: CreateSeriesDto) {
    const result = await this.postService.createSeries(
      user.id,
      data.series_name,
    );

    return { statusCode: 200, series: result };
  }

  @Get('/series')
  async getSeriesList(@GetUser() user: User) {
    const result = await this.postService.getSeriesList(user.id);

    return { statusCode: 200, series: result };
  }
}
