import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { SeriesRepository } from 'src/repository/series.repository';

@Injectable()
export class SeriesService {
  constructor(
    private seriesRepository: SeriesRepository,
    private postSeriesRepository: PostSeriesRepository,
  ) {}

  async createPostSeries(post_id: number, series_id: number, user_id: number) {
    const get_sort = await this.postSeriesRepository.selectPostSeriesSort(
      series_id,
    );

    let sort = 1;
    if (get_sort) {
      sort = get_sort.sort + 1;
    }

    await this.postSeriesRepository.createPostSeries(post_id, series_id, sort);

    await this.seriesRepository.updateSeriesPostCount(user_id);
  }

  async deletePostSeries(post_id: number, user_id: number, seires_id: number) {
    await this.postSeriesRepository.deletePostSeries(post_id, 0);

    await this.seriesRepository.updateSeriesPostCount(user_id);
  }

  async createSeries(user_id: number, series_name: string) {
    await this.seriesRepository.createSeries(user_id, series_name);

    return this.selectSeriesList(user_id);
  }

  async selectSeriesList(user_id: number) {
    const series = await this.seriesRepository.selectSeriesList(user_id);

    return series;
  }

  async selectPostSeriesList(post_id: number) {
    const post_series = await this.postSeriesRepository.selectPostSeriesList(
      post_id,
    );

    return post_series;
  }

  async selectSeriesDetail(
    user_id: number,
    series_id: number,
    sort: string,
    pagination: PaginationDto,
  ) {
    const series = await this.seriesRepository.selectSeriesDetail(
      user_id,
      series_id,
      sort,
      pagination.offset,
      pagination.limit,
    );

    return series;
  }

  async updatePostSeriesSort(series_id: number, sort) {
    for (let i = 0; i < sort.length; i++) {
      await this.postSeriesRepository.updatePostSeriesSort(
        series_id,
        Number.parseInt(sort[i].post_id),
        sort[i].sort,
      );
    }
  }

  async deleteSeries(seires_id: number) {
    await this.postSeriesRepository.deletePostSeries(0, seires_id);
    await this.seriesRepository.deleteSeries(seires_id);
  }
}
