import { PostTag } from 'src/entity/post-tag.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostTag)
export class PostTagRepository extends Repository<PostTag> {
  async insertPostTag(insert_post_tag: any[]) {
    const post_tag = this.create(insert_post_tag);

    await this.save(post_tag);
  }

  async deletePostTag(post_id: number) {
    const post_tag = this.createQueryBuilder()
      .delete()
      .from(PostTag)
      .where(`post_id = :post_id`, { post_id: post_id });

    await post_tag.execute();
  }

  async selectTagListByUserId(user_id: number) {
    const tags = await this.query(
      `(SELECT
        COUNT(id) AS post_count,
        0 AS tag_id,
        '전체보기' AS name
        FROM post 
        WHERE user_id = ?)
        UNION
        (SELECT
        COUNT(post_tag.tag_id) AS post_count,
        tag.id AS tag_id,
        tag.name
        FROM post_tag
        LEFT JOIN tag ON tag.id = post_tag.tag_id
        LEFT JOIN post ON post.id = post_tag.post_id
        WHERE post.user_id = ?
        GROUP BY post_tag.tag_id);`,
      [user_id, user_id],
    );

    return tags;
  }
}
