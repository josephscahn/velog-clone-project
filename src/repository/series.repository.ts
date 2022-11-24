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
    const series = await this.query(
      `SELECT
    id,
    series_name
    FROM series
    WHERE user_id = ?
    ORDER BY create_at`,
      [user_id],
    );

    return series;
  }
}
