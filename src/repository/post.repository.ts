import { PaginationDto } from 'src/dto/pagination.dto';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { MainPostsType, PeriodType } from 'src/main/main.model';
import { Brackets, EntityRepository, Repository } from 'typeorm';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(user: User, data: CreatePostDto) {
    const post = this.create({
      title: data.title,
      content: data.content,
      status: data.status,
      thumbnail: data.thumbnail,
      description: data.description,
      user: user,
    });

    await this.save(post);

    return post.id;
  }

  async selectPostOne(login_user_id: number, post_id: number) {
    let query = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .select([
        'user.id AS user_id',
        'user.login_id AS login_id',
        'user.title as lolog_title',
        'user.name AS name',
        'IF(user.profile_image=null, null, CONCAT(:server_url, user.profile_image)) AS profile_image',
        'user.about_me AS about_me',
        'post.id AS post_id',
        'post.title AS title',
        'post.status AS status',
        'post.content AS content',
        'IF(post.thumbnail=null, null, CONCAT(:server_url, post.thumbnail)) AS thumbnail',
        'post.create_at AS create_at',
        'post.likes AS likes',
        'IF(post.user_id = :userId, 1, 0) AS is_writer',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
        'post.description as description',
      ])
      .setParameter('server_url', process.env.IMAGE_URL)
      .setParameter('userId', login_user_id)
      .where('post.id = :post_id', { post_id: post_id })
      .andWhere('post.status <> 3');

    if (login_user_id > -1) {
      query
        .leftJoin('follow', 'follow', 'follow.followee_id = post.user_id AND follower_id = :userId')
        .leftJoin(
          'post_like',
          'post_like',
          'post_like.post_id = :post_id AND post_like.user_id = :userId',
        )
        .addSelect([
          'IF(follow.follower_id = :userId, 1, 0) AS is_follower',
          'IF(post_like.user_id = :userId, 1, 0) AS is_liked',
        ])
        .setParameter('post_id', post_id);
    }

    const post = await query.getRawMany();

    if (post.length <= 0) return 0;

    return post;
  }

  async updatePost(user: User, data: UpdatePostDto, post_id: number) {
    const post = this.createQueryBuilder()
      .update(Post)
      .set({
        title: data.title,
        content: data.content,
        status: data.status,
        thumbnail: data.thumbnail,
        description: data.description,
      })
      .where(`id = :post_id AND user_id = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    await post.execute();
  }

  async deletePost(user: User, post_id: number) {
    const post = this.createQueryBuilder()
      .delete()
      .from(Post)
      .where(`id = :post_id AND user_id = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    await post.execute();
  }

  async selectPostList(user_id: number, login_user_id: number, pagination: PaginationDto) {
    const { tag_id, offset, limit } = pagination;
    let posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .leftJoin('post.post_tag', 'post_tag')
      .leftJoin('comments', 'comments', 'comments.post_id = post.id')
      .where(`post.user_id = :user_id`, { user_id: user_id })
      .select([
        'user.id as user_id',
        'post.id as post_id',
        'IF(post.thumbnail=null, null, CONCAT(:server_url, post.thumbnail)) as post_thumbnail',
        'post.title',
        'post.description',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
        'post.create_at AS create_at',
        'COUNT(comments.id) AS post_comment_count',
        'post.likes',
        'post.status',
        'IF(post.user_id = :login_user_id, 1, 0) AS is_owner',
      ])
      .setParameter('server_url', process.env.IMAGE_URL)
      .setParameter('login_user_id', login_user_id)
      .groupBy('post.id')
      .orderBy('post.create_at', 'DESC');

    if (user_id === login_user_id) {
      posts.andWhere("post.status REGEXP '1|2'");
    } else {
      posts.andWhere('post.status = 1');
    }

    if (tag_id) posts.andWhere('post_tag.tag_id = :tag_id', { tag_id: tag_id });

    posts.offset(offset * limit - limit);
    posts.limit(limit);

    return await posts.getRawMany();
  }

  async selectSaves(user_id: number) {
    const saves = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .select([
        'post.id AS post_id',
        'user.id AS user_id',
        'post.title AS title',
        'post.content AS content',
        'post.create_at AS create_at',
      ])
      .where('user.id = :user_id', { user_id: user_id })
      .andWhere('post.status = 3')
      .orderBy('post.create_at', 'DESC');

    return await saves.getRawMany();
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

  async selectPostListForMain(
    type: MainPostsType,
    period: PeriodType,
    offset: number,
    limit: number,
    user: User,
  ) {
    let main_posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('comments', 'comments', 'comments.post_id = post.id')
      .select([
        'user.id AS user_id',
        'IF(user.profile_image=null, null, CONCAT(:server_url, user.profile_image)) as user_profile_image',
        'user.login_id',
        'post.id AS post_id',
        'IF(post.thumbnail=null, null, CONCAT(:server_url, post.thumbnail)) as post_thumbnail',
        'post.title',
        'post.description',
        'post.create_at AS create_at',
        'post.likes',
        'post.views',
        'COUNT(comments.id) AS post_comment_count',
      ])
      .setParameter('server_url', process.env.IMAGE_URL)
      .where('post.status = 1');

    switch (period) {
      case PeriodType.TODAY:
        main_posts.andWhere('DAYOFMONTH(post.create_at) = DAYOFMONTH(CURDATE())');
        break;
      case PeriodType.WEEK:
        main_posts.andWhere(
          'DATE(post.create_at) BETWEEN DATE_ADD(CURDATE(), INTERVAL -7 DAY) AND CURDATE()',
        );
        break;
      case PeriodType.MONTH:
        main_posts.andWhere(
          'DATE(post.create_at) BETWEEN DATE_ADD(CURDATE(), INTERVAL -30 DAY) AND CURDATE()',
        );
        break;
      case PeriodType.YEAR:
        main_posts.andWhere(
          'DATE(post.create_at) BETWEEN DATE_ADD(CURDATE(), INTERVAL -365 DAY) AND CURDATE()',
        );
        break;
    }

    switch (type) {
      case MainPostsType.RECENT:
        main_posts.orderBy('post.create_at', 'DESC');
        main_posts.groupBy('post.id');
        break;
      case MainPostsType.TREND:
        main_posts.andWhere('post.likes > 0 AND post.views > 0');
        main_posts.groupBy('post.id');
        main_posts.orderBy('SUM(post.likes + post.views)', 'DESC');
        break;
      case MainPostsType.FOLLOW:
        main_posts.leftJoin('follow', 'follow', 'post.user_id = follow.followee_id');
        main_posts.andWhere('follow.follower_id = :user_id', { user_id: user.id });
        main_posts.orderBy('post.create_at', 'DESC');
        main_posts.groupBy('post.id');
    }

    main_posts.offset(offset * limit - limit);
    main_posts.limit(limit);

    return await main_posts.getRawMany();
  }

  async interestedPostList(post_id: number) {
    const posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.post_tag', 'post_tag')
      .leftJoin('tag', 'tag', 'post_tag.tag_id = tag.id')
      .leftJoin('comments', 'comments', 'comments.post_id = post.id')
      .select([
        'post.id AS post_id',
        'user.id AS user_id',
        'IF(user.profile_image=null, null, CONCAT(:server_url, user.profile_image)) as user_profile_image',
        'user.login_id',
        'IF(post.thumbnail=null, null, CONCAT(:server_url, post.thumbnail)) as post_thumbnail',
        'post.title',
        'post.description',
        'post.create_at AS create_at',
        'COUNT(comments.id) AS post_comment_count',
        'post.likes',
        'post.views',
      ])
      .distinct(true)
      .setParameter('server_url', process.env.IMAGE_URL)
      .where('post.id <> :post_id', { post_id: post_id })
      .groupBy('post.id')
      .orderBy('RAND()')
      .limit(12);
    return await posts.getRawMany();
  }

  async mainSearch(keywords: string, userId: number, user: User, offset: number, limit: number) {
    let main_search = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .leftJoin('post_tag', 'post_tag', 'post.id = post_tag.post_id')
      .leftJoin('tag', 'tag', 'post_tag.tag_id = tag.id')
      .leftJoin('comments', 'comments', 'comments.post_id = post.id')
      .select([
        'user.id AS user_id',
        'IF(user.profile_image=null, null, CONCAT(:server_url, user.profile_image)) as user_profile_image',
        'user.login_id',
        'post.id AS post_id',
        'IF(post.thumbnail=null, null, CONCAT(:server_url, post.thumbnail)) as post_thumbnail',
        'post.title',
        'post.description',
        'post.create_at AS create_at',
        'COUNT(comments.id) AS post_comment_count',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
      ])
      .setParameter('server_url', process.env.IMAGE_URL)
      .andWhere(
        new Brackets(qb => {
          qb.orWhere('post.title REGEXP :keywords', { keywords: keywords })
            .orWhere('post.content REGEXP :keywords', { keywords: keywords })
            .orWhere('tag.name REGEXP :keywords', { keywords: keywords });
        }),
      )
      .groupBy('post.id')
      .orderBy('post.id', 'DESC');

    if (userId) {
      main_search.andWhere('post.user_id = :userId', { userId: userId });
    }

    if (user) {
      main_search
        .leftJoin('follow', 'follow', 'follow.followee_id = user.id')
        .addSelect(['IF(follow.follower_id = :user_id, 1, 0) AS is_follower'])
        .setParameter('user_id', user.id);
    }

    main_search.offset(offset * limit - limit);
    main_search.limit(limit);

    return await main_search.getRawMany();
  }

  async selectSaveOne(post_id: number, user_id: number) {
    let save_one = this.createQueryBuilder('post')
      .leftJoin('post.tags', 'tags')
      .select([
        'post.id AS post_id',
        'post.user_id AS user_id',
        'post.title AS title',
        'post.content AS content',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
      ])
      .where('post.user_id = :user_id', { user_id: user_id })
      .andWhere('post.id = :post_id', { post_id: post_id })
      .orderBy('post.create_at', 'DESC');

    return await save_one.getRawMany();
  }

  async updateViews(post_id: number) {
    await this.query(`UPDATE post SET views = views+1 WHERE id = ?`, [post_id]);
  }
}
