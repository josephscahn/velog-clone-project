import { Series } from 'src/entity/series.entity';
import { SeriesSort } from 'src/series/series.model';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Series)
export class SeriesRepository extends Repository<Series> {
  async selectSeriesList(user_id: number) {
    const series = this.createQueryBuilder('series')
      .leftJoin('series.post_series', 'post_series')
      .leftJoin('post', 'post', 'post_series.post_id = post.id')
      .where('series.user_id = :user_id', { user_id: user_id })
      .select([
        'series.id AS series_id',
        'series.thumbnail',
        'series.series_name',
        'series.post_count',
        'series.update_at',
      ])
      .groupBy('series.id')
      .orderBy('series.create_at', 'ASC');

    return await series.getRawMany();
  }

  async createSeries(user_id: number, series_name: string) {
    const series = this.create({
      series_name: series_name,
      user: user_id,
    });

    await this.save(series);
  }

  async SelectSereisPosts(series_id: number, sort: SeriesSort, login_user_id: number) {
    const series_posts = this.createQueryBuilder('series')
      .leftJoin('series.post_series', 'post_series')
      .leftJoin('post', 'post', 'post_series.post_id = post.id')
      .where('series.id = :series_id', { series_id: series_id })
      .select([
        'series.id AS series_id',
        'series.user_id AS user_id',
        'post.id AS post_id',
        'post_series.sort',
        'series.thumbnail',
        'post.title',
        'post.content',
        'post.create_at',
        'IF(series.user_id = :user_id, 1, 0) as is_owner',
      ])
      .setParameter('user_id', login_user_id);

    switch (sort) {
      case SeriesSort.ASC:
        series_posts.orderBy('post_series.sort', 'ASC');
        break;
      case SeriesSort.DESC:
        series_posts.orderBy('post_series.sort', 'DESC');
        break;
    }

    return await series_posts.getRawMany();
  }

  async deleteSeries(series_id: number) {
    await this.createQueryBuilder()
      .delete()
      .from(Series)
      .where('id = :series_id', { series_id: series_id })
      .execute();
  }
}
