import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async selectPostOne(user_id: number, post_id: number) {
    const post = await this.query(
      `WITH tags AS (
        SELECT 
        post.id AS post_id,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'tag_id', tag.id,
            'tag_name', tag.name
          )
        ) AS tags
        FROM post
        LEFT JOIN post_tag pt ON pt.post_id = post.id
        LEFT JOIN tag ON tag.id = pt.tag_id
        GROUP BY post.id
        )
        
        SELECT
        user.id AS user_id,
        user.login_id,
        user.name,
        user.profile_image,
        user.about_me,
        post.id,
        post.title,
        post.status,
        post.content,
        IF(INSTR(tags.tags,'"tag_id": null'), null, tags.tags) AS  tags,
        post.comment_count,
        IF(user_id = ?, 1, 0) AS is_writer
        FROM post
        LEFT JOIN user ON user.id = post.user_id
        LEFT JOIN tags ON tags.post_id = post.id
        WHERE user.id = ? AND post.id = ?`,
      [user_id, user_id, post_id],
    );

    if (post.length <= 0) return 0;

    return post;
  }

  async createPost(user: User, data: CreatePostDto, status: number) {
    const post = this.create({
      title: data.title,
      content: data.content,
      status: status,
      thumbnail: data.thumbnail,
      user: user,
    });

    try {
      await this.save(post);

      return post.id;
    } catch (err) {
      return 0;
    }
  }

  async updatePost(
    user: User,
    data: UpdatePostDto,
    post_id: number,
    status: number,
  ) {
    const post = this.createQueryBuilder()
      .update(Post)
      .set({
        title: data.title,
        content: data.content,
        status: status,
        thumbnail: data.thumbnail,
      })
      .where(`id = :post_id AND user_id = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    try {
      await post.execute();
      return 1;
    } catch (err) {
      return 0;
    }
  }

  async deletePost(user: User, post_id: number) {
    const post = this.createQueryBuilder()
      .delete()
      .from(Post)
      .where(`id = :post_id AND user_id = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    try {
      await post.execute();
      return 1;
    } catch (err) {
      return 0;
    }
  }

  async selectPostList(user_id: number, is_writer: boolean, tag_id: number) {
    let posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .leftJoin('post.post_tag', 'post_tag')
      .where(`post.user_id = :user_id`, { user_id: user_id })
      .select([
        'user.id as user_id',
        'post.id as post_id',
        'post.thumbnail',
        'post.title',
        'post.content',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
        'post.create_at',
        'post.comment_count',
        'post.likes',
        'post.status',
      ])
      .groupBy('post.id')
      .orderBy('post.id', 'DESC');

    if (is_writer == true) {
      posts.andWhere("post.status REGEXP '1|2'");
    } else {
      posts.andWhere('post.status = 1');
    }

    if (tag_id) {
      posts.andWhere('post_tag.tag_id = :tag_id', { tag_id: tag_id });
    }

    return await posts.getRawMany();
  }

  async selectNextPost(post_id: number, user_id: number) {
    const next_post = await this.query(
      `SELECT 
    post.id AS post_id,
    post.title
    FROM post
    WHERE id = (SELECT id FROM post WHERE id > ? ORDER BY id LIMIT 1)
    AND post.user_id = ?`,
      [post_id, user_id],
    );

    return next_post;
  }

  async selectPrePost(post_id: number, user_id: number) {
    const pre_post = await this.query(
      `SELECT 
    post.id AS post_id,
    post.title
    FROM post
    WHERE id = (SELECT id FROM post WHERE id < ? ORDER BY id DESC LIMIT 1)
    AND post.user_id = ?`,
      [post_id, user_id],
    );

    return pre_post;
  }

  async updateCommentCount(post_id: number) {
    await this.query(
      `UPDATE post SET comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = ?) WHERE id = ?`,
      [post_id, post_id],
    );
  }

  async updateLikeCount(post_id: number) {
    await this.query(
      `UPDATE post SET likes = (SELECT COUNT(*) FROM post_like WHERE post_id = ?) WHERE id = ?`,
      [post_id, post_id],
    );
  }

  async selectPostListForMain(type: string, period: string) {
    let main_posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
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
        'post.likes',
        'post.views',
      ]);

    switch (period) {
      case 'TODAY':
        main_posts.where('DAYOFMONTH(post.create_at) = DAYOFMONTH(CURDATE())');
        break;
      case 'WEEK':
        main_posts.where(
          "post.create_at BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE())-1) DAY), '%Y/%m/%d')" +
            "AND DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE())-7) DAY), '%Y/%m/%d')",
        );
        break;
      case 'MONTH':
        main_posts.where('MONTH(post.create_at) = MONTH(NOW())');
        break;
      case 'YEAR':
        main_posts.where('WHERE YEAR(post.create_at) = YEAR(NOW())');
        break;
    }

    switch (type) {
      case 'NEW':
        main_posts.orderBy('post.create_at', 'DESC');
        break;
      case 'TREND':
        main_posts.andWhere('post.likes > 0 AND post.views > 0');
        main_posts.groupBy('post.id');
        main_posts.orderBy('SUM(post.likes + post.views)', 'DESC');
        break;
    }

    return await main_posts.getRawMany();
  }

  async interestedPostList(tag_ids: string) {}
}
