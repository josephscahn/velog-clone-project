import { PostSeries } from 'src/entity/post-series.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostSeries)
export class PostSeriesRepository extends Repository<PostSeries> {
  async selectPostSeriesSort(series_id: number) {
    const sort = await this.findOne(series_id);

    return sort;
  }

  async createPostSeries(post_id: number, series_id: number, sort: number) {
    const post_series = this.create({
      post: post_id,
      series: series_id,
      sort: sort,
    });

    try {
      await this.save(post_series);
      return 1;
    } catch (error) {
      return 0;
    }
  }

  async deletePostSeries(post_id: number, series_id: number) {
    const post_series = this.createQueryBuilder().delete().from(PostSeries);

    if (post_id > 0) {
      post_series.where(`post_id = :post_id`, { post_id: post_id });
    }

    if (series_id > 0) {
      post_series.where('series_id = :series_id', { series_id: series_id });
    }

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
}
