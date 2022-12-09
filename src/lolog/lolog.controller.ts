import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { User } from 'src/entity/user.entity';
import { LologService } from './lolog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('lolog')
export class LologController {
  constructor(private readonly lologService: LologService) {}

  @Get('/:user_id')
  async getLolog(
    @Param('user_id') user_id: number,
    @Query() pagination: PaginationDto,
    @ValidateToken() user?: User,
  ) {
    const result = await this.lologService.getLolog(user_id, pagination, user);

    return { statusCode: 200, user: result.user, posts: result.posts, tags: result.tags };
  }

  @Post('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.lologService.likePost(user.id, post_id);
    return { statusCode: 201 };
  }

  @Delete('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.lologService.unlikePost(user.id, post_id);
    return { statusCode: 204 };
  }
}
