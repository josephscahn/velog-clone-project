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

  async selectPostSeriesSort(series_id: number) {
    const sort = await this.createQueryBuilder('post_series')
      .where('series_id = :series_id', { series_id: series_id })
      .select(['sort'])
      .orderBy('sort', 'DESC')
      .limit(1);

    try {
      return await sort.getRawMany();
    } catch (error) {
      return 0;
    }
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

    if (series_id)
      post_series.where('series_id = :series_id', { series_id: series_id });

    await post_series.execute();
  }

  async selectPostSeriesList(post_id: number) {
    const post_series = this.query(
      `SELECT 
    post_series.sort,
    post.id,
    post.title
    FROM post_series
    LEFT JOIN post ON post.id = post_series.post_id
    WHERE post_series.series_id = (SELECT series_id FROM post_series WHERE post_id = ?)
    ORDER BY post_series.sort`,
      [post_id],
    );

    return post_series;
  }
}
