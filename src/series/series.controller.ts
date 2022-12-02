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

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createSeries(@GetUser() user: User, @Body() data: CreateSeriesDto) {
    const result = await this.seriesService.createSeries(
      user.id,
      data.series_name,
    );

    return { statusCode: 200, series: result };
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async selectSeriesList(@GetUser() user: User) {
    const result = await this.seriesService.selectSeriesList(user.id);

    return { statusCode: 200, series: result };
  }

  @Get('/:id')
  async SelectSereisPosts(
    @Param('id') series_id: number,
    @Query() sort: SelectSereisPostsDto,
    @ValidateToken() user?: User,
  ) {
    const result = await this.seriesService.SelectSereisPosts(
      series_id,
      sort,
      user,
    );

    return { statusCode: 200, series: result };
  }

  @Patch('/:id')
  async updatePostSeriesSort(
    @Param('id') series_id: number,
    @Body('sort') sort,
  ) {
    await this.seriesService.updatePostSeriesSort(series_id, sort);

    return { statusCode: 200, message: 'seires update success' };
  }

  @Delete('/:id')
  async deleteSeries(@Param('id') series_id: number) {
    await this.seriesService.deleteSeries(series_id);

    return { statusCode: 200, message: 'seires delete success' };
  }
}
