import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { CreateSeriesDto } from 'src/dto/series/create-series.dto';
import { SelectSereisPostsDto } from 'src/dto/series/select-series-posts.dto';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { UpdateSeriesDto } from 'src/dto/series/update-series.dto';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createSeries(@GetUser() user: User, @Body() data: CreateSeriesDto) {
    const result = await this.seriesService.createSeries(user.id, data.series_name);

    const response = SetResponse('시리즈', ResponseMessage.ADD_SUCCESS1);

    return { statusCode: response[0], message: response[1], series: result };
  }

  @Get('')
  @UseGuards(JwtAuthGuard) // 게시글 작성 시의 시리즈 목록 조회
  async selectSeriesList(@GetUser() user: User) {
    const result = await this.seriesService.selectSeriesList(user.id);

    const response = SetResponse('시리즈 목록', ResponseMessage.READ_SUCCESS);

    return { statusCode: response[0], message: response[1], series: result };
  }

  @Get('/posts/:id')
  async SelectSereisPosts(
    @Param('id') series_id: number,
    @Query() sort: SelectSereisPostsDto,
    @ValidateToken() user?: User,
  ) {
    const result = await this.seriesService.SelectSereisPosts(series_id, sort, user);

    const response = SetResponse('시리즈 게시글', ResponseMessage.READ_SUCCESS);

    return { statusCode: response[0], message: response[1], series: result };
  }

  @Get('/:user_id')
  async getSeries(@Param('user_id') user_id: number) {
    const result = await this.seriesService.selectSeriesList(user_id);

    const response = SetResponse('시리즈 목록', ResponseMessage.READ_SUCCESS);

    return { statusCode: response[0], message: response[1], series: result };
  }

  @Patch('/:id')
  async updateSeries(@Param('id') series_id: number, @Body() data: UpdateSeriesDto) {
    await this.seriesService.updateSeries(series_id, data);

    const response = SetResponse('시리즈', ResponseMessage.UPDATE_SUCCESS);

    return { statusCode: response[0], message: response[1] };
  }

  @Delete('/:id')
  async deleteSeries(@Param('id') series_id: number) {
    await this.seriesService.deleteSeries(series_id);

    const response = SetResponse('시리즈', ResponseMessage.DELETE_SUCCESS);

    return { statusCode: response[0], message: response[1] };
  }
}
