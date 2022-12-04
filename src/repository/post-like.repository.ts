import { PostLike } from 'src/entity/post-like.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostLike)
export class PostLikeRepository extends Repository<PostLike> {
  async likePost(user_id: number, post_id: number) {
    const likePost = this.create({ user: user_id, post: post_id });
    await this.save(likePost);
  }

  async unlikePost(user_id: number, post_id: number) {
    await this.createQueryBuilder()
      .delete()
      .where(`user = :user_id AND post_id = :post_id`, { user_id, post_id })
      .execute();
  }

  async getLikedPostOne(user_id: number, post_id: number) {
    return await this.findOne({ user: user_id, post: post_id });
  }

  async getLikedList(user_id: number) {
    return await this.createQueryBuilder('post_like')
      .leftJoin('post', 'post', 'post_like.post_id = post.id')
      .leftJoin('user', 'user', 'post.user = user.id')
      .select([
        'post.id AS post_id',
        'post.likes',
        'post.title',
        'post.thumbnail',
        'post.content',
        'post.comment_count',
        'post.create_at AS create_at',
        'user.id AS user_id',
        'user.name',
        'user.profile_image',
      ])
      .where('post_like.user_id = :user_id', { user_id })
      .groupBy('post.id')
      .getRawMany();
  }
}
