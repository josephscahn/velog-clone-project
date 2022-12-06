import { PostView } from 'src/entity/post-view.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostView)
export class PostViewRepository extends Repository<PostView> {
  async insertPostView(post_id: number) {
    const post_view = this.create({
      post: post_id,
    });
    await this.save(post_view);
  }

  async selectPostViewDate(post_id: number, date: string) {
    const post_view = await this.createQueryBuilder('post_view')
      .where('post_id = :post_id AND DATE(view_date) = :date', { post_id: post_id, date: date })
      .getRawOne();

    return post_view;
  }

  async updatePostView(post_id: number, date: string) {
    await this.query(
      `UPDATE post_view SET view_count = view_count+1 WHERE post_id = ? AND DATE(view_date) = ?`,
      [post_id, date],
    );
  }
}
