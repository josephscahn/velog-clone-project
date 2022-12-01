import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { User } from 'src/entity/user.entity';
import { PostRepository } from 'src/repository/post.repository';
import { TagService } from 'src/tag/tag.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { CommentService } from 'src/comment/comment.service';
import { SeriesService } from 'src/series/series.service';

/**
 * @todo 게시글 삭제 시에 tag 테이블의 post_count 관련 기능은 추후 구현할 예정..
 * -> 현재는 post_tag 테이블 삭제까지만 구현되어 있음
 */

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private postSeriesRepository: PostSeriesRepository,
    private postReadLogRepository: PostReadLogRepository,
    private tagService: TagService,
    private commentService: CommentService,
    private seriesService: SeriesService,
  ) {}

  async createPost(user: User, data: CreatePostDto) {
    let post_url = data.title;
    if (data.post_url) post_url = data.post_url;

    const post_id = await this.postRepository.createPost(
      user,
      data.title,
      data.content,
      data.status,
      data.thumbnail,
      post_url,
    );

    if (data.tags.length > 0)
      // 게시글 태그 관련
      await this.tagService.tagAction(data.tags, post_id, user.id);

    if (data.series_id) {
      // 게시글 시리즈 관련
      await this.postSeriesRepository.createPostSeries(post_id, data.series_id);
    }

    return post_id;
  }

  async selectPostOne(post_id: number, user?: User) {
    let login_user_id = -1;

    if (user != null) {
      login_user_id = user['sub'];
    }

    const post = await this.postRepository.selectPostOne(
      login_user_id,
      post_id,
    );

    const owner_user_id = post[0].user_id;

    if (post[0].tags) {
      post[0].tags = JSON.parse(post[0].tags);
    }

    const next_post = await this.postRepository.selectNextPost(
      post_id,
      owner_user_id,
    );
    const pre_post = await this.postRepository.selectPrePost(
      post_id,
      owner_user_id,
    );

    const interested_posts = await this.postRepository.interestedPostList();

    if (owner_user_id !== login_user_id) {
      const exist = await this.postReadLogRepository.getReadLogBypostId(
        user['sub'],
        post_id,
      );

      if (exist[0].exist === '0' && owner_user_id !== login_user_id) {
        await this.postReadLogRepository.createReadLog(login_user_id, post_id);
      }
    }

    const comments = await this.commentService.selectCommentList(
      post_id,
      login_user_id,
    );
    const series = await this.seriesService.selectPostSeriesList(post_id);

    return { post, next_post, pre_post, interested_posts, comments, series };
  }

  async updatePost(user: User, data: UpdatePostDto, post_id: number) {
    await this.postRepository.updatePost(user, data, post_id);

    if (data.tags.length > 0) {
      await this.tagService.deletePostTag(post_id);
      await this.tagService.tagAction(data.tags, post_id, user.id);
    }

    if (!data.series_id) {
      // 시리즈에서 제외 시켰을 경우 post_series 테이블에 삭제되어야 함.
      await this.postSeriesRepository.deletePostSeries(post_id, null);
    } else {
      await this.postSeriesRepository.createPostSeries(post_id, data.series_id);
    }

    return post_id;
  }

  async deletePost(user: User, post_id: number) {
    await this.tagService.deletePostTag(post_id);
    const delete_post = await this.postRepository.deletePost(user, post_id);
    return delete_post;
  }

  async selectPostList(
    user_id: number,
    pagination: PaginationDto,
    user?: User,
  ) {
    let login_user_id = -1;

    if (user != null) {
      login_user_id = user['sub'];
    }

    let is_owner = false;

    if (user_id === login_user_id) {
      is_owner = true;
    }

    const posts = await this.postRepository.selectPostList(
      user_id,
      is_owner,
      pagination.tag_id,
      pagination.offset,
      pagination.limit,
    );

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].tags) {
        const to_json = JSON.parse(posts[i].tags);

        posts[i].tags = to_json;
      }
    }

    return posts;
  }

  async selectSaves(user_id: number) {
    return await this.postRepository.selectSaves(user_id);
  }

  async selectPostListForMain(type: string, period: string) {
    if (type == 'TREND' && !period) return 0;

    const posts = await this.postRepository.selectPostListForMain(type, period);

    return posts;
  }
}
