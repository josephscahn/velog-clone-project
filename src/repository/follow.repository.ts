import { Follow } from 'src/entity/follow.entity';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
  async checkFollow(followerId: number, followeeId: number) {
    const data = await this.findOne({
      follower: followerId,
      followee: followeeId,
    });
    return data;
  }

  async follow(followerId: number, followeeId: number) {
    const follow = this.create({ follower: followerId, followee: followeeId });
    await this.save(follow);
  }

  async unfollow(followerId: number, followeeId: number) {
    await this.createQueryBuilder()
      .delete()
      .where({ follower: followerId, followee: followeeId })
      .execute();
  }

  async getMyFollow(id: number) {
    return await this.query(
      `
      SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "followee_id", user.id, 
            "name", user.name, 
            "title", user.title, 
            "about_me", user.about_me, 
            "profile_image", user.profile_image
          )
        ) AS follow
        FROM follow
        LEFT JOIN user ON user.id = follow.followee_id
        WHERE follow.follower_id = ?
        GROUP BY follow.follower_id;
      `,
      [id],
    );
  }

  async getFolloweePosts(id: number) {
    return await this.createQueryBuilder('follow')
      .leftJoin('user', 'user', 'follow.followee_id = user.id')
      .leftJoin('post', 'post', 'follow.followee_id = post.user_id')
      .leftJoin('post.tags', 'tags')
      .select([
        'user.id AS user_id',
        'user.profile_image',
        'user.login_id',
        'post.id AS post_id',
        'post.thumbnail',
        'post.title',
        'post.content',
        'post.create_at',
        'post.comment_count',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
      ])
      .where('follow.follower_id = :id', { id: id })
      .getRawMany();
  }
}
