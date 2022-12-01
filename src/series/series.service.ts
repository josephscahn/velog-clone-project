import { Injectable } from '@nestjs/common';
import { SelectSereisPostsDto } from 'src/dto/series/select-series-posts.dto';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { SeriesRepository } from 'src/repository/series.repository';

@Injectable()
export class SeriesService {
  constructor(
    private seriesRepository: SeriesRepository,
    private postSeriesRepository: PostSeriesRepository,
  ) {}

  async selectSeriesList(user_id: number) {
    const series = await this.seriesRepository.selectSeriesList(user_id);

    return series;
  }

  async createSeries(user_id: number, series_name: string) {
    const result = await this.seriesRepository.createSeries(
      user_id,
      series_name,
    );

    if (result == 0) return 0;

    return this.selectSeriesList(user_id);
  }

  async SelectSereisPosts(
    user_id: number,
    series_id: number,
    sort: SelectSereisPostsDto,
  ) {
    const seires_posts = await this.seriesRepository.SelectSereisPosts(
      user_id,
      series_id,
      sort.sort,
    );

    if (seires_posts[0].user_id == user_id) {
      seires_posts.push({ is_owner: 1 });
    } else {
      seires_posts.push({ is_owner: 0 });
    }

    return seires_posts;
  }

  async updatePostSeriesSort(series_id: number, sort) {
    for (let i = 0; i < sort.length; i++) {
      await this.postSeriesRepository.updatePostSeriesSort(
        series_id,
        sort[i].post_id,
        sort[i].sort,
      );
    }
  }

  // 게시글 리팩토링 할 때 해당 메서드 삭제할 예정
  async deletePostSeries(post_id: number, seires_id: number) {
    await this.postSeriesRepository.deletePostSeries(post_id, seires_id);
  }

  async deleteSeries(seires_id: number) {
    await this.postSeriesRepository.deletePostSeries(null, seires_id);
    await this.seriesRepository.deleteSeries(seires_id);
  }

  async createPostSeries(post_id: number, series_id: number, user_id: number) {
    // const get_sort = await this.postSeriesRepository.selectPostSeriesSort(
    //   series_id,
    // );

    // let sort = 1;

    // if (get_sort[0].sort != 0) {
    //   sort = get_sort[0].sort + 1;
    // }

    await this.postSeriesRepository.createPostSeries(post_id, series_id);
  }

  async selectPostSeriesList(post_id: number) {
    const post_series = await this.postSeriesRepository.selectPostSeriesList(
      post_id,
    );

    return post_series;
  }
}
