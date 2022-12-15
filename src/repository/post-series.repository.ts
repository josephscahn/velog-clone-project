import { PostSeries } from 'src/entity/post-series.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostSeries)
export class PostSeriesRepository extends Repository<PostSeries> {
  async updatePostSeriesSort(series_id: number, post_id: number, sort: number) {
    await this.createQueryBuilder()
      .update(PostSeries)
      .set({
        sort: sort,
      })
      .where('series_id = :series_id', { series_id: series_id })
      .andWhere('post_id = :post_id', { post_id: post_id })
      .execute();
  }

  async getPostSeriesId(post_id: number) {
    return await this.query(
      `SELECT id FROM post_series
       WHERE series_id = (SELECT series_id FROM post_series WHERE post_id = ? LIMIT 1)
       AND post_id <> ?
       ORDER BY sort ASC`,
      [post_id, post_id],
    );
  }

  async updateSort(sort: number, id: number) {
    await this.createQueryBuilder()
      .update(PostSeries)
      .set({ sort: sort })
      .where('id = :id', { id: id })
      .execute();
  }

  async createPostSeries(post_id: number, series_id: number) {
    this.query(
      `INSERT INTO post_series(sort, series_id, post_id) VALUES (get_post_series_sort(?), ?, ?);`,
      [series_id, series_id, post_id],
    );
  }

  async deletePostSeries(post_id: number, series_id: number) {
    const post_series = this.createQueryBuilder().delete().from(PostSeries);

    if (post_id) post_series.where(`post_id = :post_id`, { post_id: post_id });

    if (series_id) post_series.where('series_id = :series_id', { series_id: series_id });

    await post_series.execute();
  }

  async selectPostSeriesList(post_id: number) {
    const post_series = await this.createQueryBuilder('post_series')
      .leftJoin('post', 'post', 'post_series.post_id = post.id')
      .leftJoin('series', 'series', 'post_series.series_id = series.id')
      .select([
        'series.id AS series_id',
        'series.series_name AS series_name',
        'post_series.sort AS sort',
        'post.id AS post_id',
        'post.title AS title',
      ])
      .where('series.id = (SELECT series_id FROM post_series WHERE post_id = :post_id LIMIT 1)', {
        post_id: post_id,
      })
      .orderBy('post_series.sort', 'ASC')
      .getRawMany();

    if (post_series.length === 0) return null;

    return post_series;
  }
}
