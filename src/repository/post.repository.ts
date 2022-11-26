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
    let parameter = [];

    let query = `WITH tags AS (
      SELECT 
      post.id AS post_id,
      post.user_id,
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
      post.id AS post_id,
      post.thumbnail,
      post.title,
      post.content,
      IF(INSTR(tags.tags,'"tag_id": null'), null, tags.tags) AS  tags,
      post.create_at,
      post.comment_count,
      post.likes,
      post.status
      FROM post 
      LEFT JOIN user ON user.id = post.user_id
      LEFT JOIN tags ON tags.post_id = post.id
      LEFT JOIN post_tag pt ON pt.post_id = post.id
      WHERE user.id = ?`;

    parameter.push(user_id);

    let and_status = ` AND post.status = 1`;

    if (is_writer == true) and_status = ` AND post.status REGEXP '1|2'`; // 게시글 작성자 id랑 일치하면 비공개 목록까지 보여주도록

    let and_tag = ``;

    if (tag_id) {
      and_tag = ` AND pt.tag_id = ?`;
      parameter.push(tag_id);
    }

    let order_by = ` ORDER BY post.id DESC`;

    query = query + and_status + and_tag + order_by;

    const posts = await this.query(query, parameter);

    return posts;
  }

  async selectNextPost(post_id: number) {
    const next_post = await this.query(
      `SELECT 
    post.id AS post_id,
    post.title
    FROM post
    WHERE id = (SELECT id FROM post WHERE id > ? ORDER BY id LIMIT 1)`,
      [post_id],
    );

    return next_post;
  }

  async selectPrePost(post_id: number) {
    const pre_post = await this.query(
      `SELECT 
    post.id AS post_id,
    post.title
    FROM post
    WHERE id = (SELECT id FROM post WHERE id < ? ORDER BY id DESC LIMIT 1)`,
      [post_id],
    );

    return pre_post;
  }

  async updateCommentCount(post_id: number) {
    await this.query(
      `UPDATE post SET comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = ?) WHERE id = ?`,
      [post_id, post_id],
    );
  }

  async selectPostListForMain(type: string, period: string) {
    let query = `SELECT 
   user.id AS user_id,
   user.profile_image,
   user.login_id,
   post.id AS post_id,
   post.thumbnail, 
   post.title,
   post.content,
   post.create_at,
   post.comment_count,
   post.likes,
   post.views
   FROM post
   LEFT JOIN user ON user.id = post.user_id`;

    let period_condition = ``;
    let type_condition = ``;

    switch (period) {
      case 'TODAY':
        period_condition = ` WHERE DAYOFMONTH(post.create_at) = DAYOFMONTH(CURDATE()) `;
        break;
      case 'WEEK':
        period_condition = ` WHERE post.create_at BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE())-1) DAY), '%Y/%m/%d') AND
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE())-7) DAY), '%Y/%m/%d') `;
        break;
      case 'MONTH':
        period_condition = ` WHERE MONTH(post.create_at) = MONTH(NOW()) `;
        break;
      case 'YEAR':
        period_condition = ` WHERE YEAR(post.create_at) = YEAR(NOW()) `;
        break;
    }

    switch (type) {
      case 'NEW':
        type_condition = ` ORDER BY post.create_at DESC;`;
        break;
      case 'TREND':
        type_condition = ` AND post.likes > 0 AND post.views > 0 GROUP BY post.id ORDER BY SUM(post.likes + post.views) DESC`;
        //조회 수 + 좋아요 를 더하여 정렬. 조회수와 좋아요는 최소 1 이상 일 때
        break;
    }

    query = query + period_condition + type_condition;

    const main_posts = await this.query(query);

    return main_posts;
  }
}
