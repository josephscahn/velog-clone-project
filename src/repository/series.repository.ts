import { Series } from 'src/entity/series.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Series)
export class SeriesRepository extends Repository<Series> {
  async createSeries(user_id: number, series_name: string) {
    const series = this.create({
      series_name: series_name,
      user: user_id,
    });

    try {
      await this.save(series);
      return series.id;
    } catch (error) {
      return 0;
    }
  }

  async updateSeriesPostCount(user_id: number) {
    await this.query(
      `UPDATE series SET post_count = (SELECT COUNT(*) FROM post_series WHERE series_id = series.id)
      WHERE user_id = ?`,
      [user_id],
    );
  }

  async selectSeriesList(user_id: number) {
    const series = this.createQueryBuilder('series')
      .leftJoin('series.post_series', 'post_series')
      .leftJoin('post', 'post', 'post_series.post_id = post.id')
      .where('series.user_id = :user_id', { user_id: user_id })
      .andWhere('post_series.sort = 1')
      .select([
        'series.id AS series_id',
        'post.thumbnail',
        'series.series_name',
        'series.post_count',
        'series.create_at',
      ])
      .groupBy('series.id')
      .orderBy('series.create_at', 'ASC');

    return await series.getRawMany();
  }

  async selectSeriesDetail(user_id: number, series_id: number, type: string) {
    const series = this.createQueryBuilder('series')
      .leftJoin('series.post_series', 'post_series')
      .leftJoin('post', 'post', 'post_series.post_id = post.id')
      .where('series.user_id = :user_id', { user_id: user_id })
      .andWhere('series.id = :series_id', { series_id: series_id })
      .select([
        'series.id AS series_id',
        'series.user_id AS user_id',
        'post.id AS post_id',
        'post_series.sort',
        'post.thumbnail',
        'post.title',
        'post.content',
        'post.create_at',
      ]);

    switch (type) {
      case 'asc':
        series.orderBy('post_series.sort', 'ASC');
        break;
      case 'desc':
        series.orderBy('post_series.sort', 'DESC');
        break;
    }

    return await series.getRawMany();
  }

  async deleteSeries(seires_id: number) {
    await this.createQueryBuilder()
      .delete()
      .from(Series)
      .where('id = :seires_id', { seires_id: seires_id })
      .execute();
  }
}
