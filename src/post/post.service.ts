import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { User } from 'src/entity/user.entity';
import { PostRepository } from 'src/repository/post.repository';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { CommentService } from 'src/comment/comment.service';
import { TagRepository } from 'src/repository/tag.repository';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { PostLikeRepository } from 'src/repository/post-like.repository';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private postSeriesRepository: PostSeriesRepository,
    private postReadLogRepository: PostReadLogRepository,
    private tagRepository: TagRepository,
    private postTagRepository: PostTagRepository,
    private commentService: CommentService,
    private postLikeRepository: PostLikeRepository,
  ) {}

  async selectPostOne(post_id: number, user?: User) {
    let login_user_id = -1;
    let owner_user_id = -1;

    if (user != null) {
      login_user_id = user.id;
    }
    let post = await this.postRepository.selectPostOne(login_user_id, post_id);

    if (post) {
      owner_user_id = post[0].user_id;
      if (post[0].tags) {
        post[0].tags = JSON.parse(post[0].tags);
      }

      post[0].is_writer = Number.parseInt(post[0].is_writer);

      if (login_user_id > -1) {
        post[0].is_follower = Number.parseInt(post[0].is_follower);
        post[0].is_liked = Number.parseInt(post[0].is_liked);
      }
    } else {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    const next_post = await this.postRepository.selectNextPost(post_id, owner_user_id);
    const pre_post = await this.postRepository.selectPrePost(post_id, owner_user_id);

    const interested_posts = await this.postRepository.interestedPostList(post_id);

    if (owner_user_id !== login_user_id && user) {
      const exist = await this.postReadLogRepository.getReadLogBypostId(login_user_id, post_id);

      if (exist[0].exist === '0' && owner_user_id !== login_user_id) {
        await this.postReadLogRepository.createReadLog(login_user_id, post_id);
      }
    }

    const comments = await this.commentService.selectCommentList(post_id, login_user_id);

    const series = await this.postSeriesRepository.selectPostSeriesList(post_id);

    await this.postRepository.updateViews(post_id);

    return { post, next_post, pre_post, interested_posts, comments, series };
  }

  async createPost(user: User, data: CreatePostDto) {
    const post_id = await this.postRepository.createPost(user, data);

    if (data.tags.length > 0) {
      await this.createTag(data.tags, post_id);
    }

    if (data.series_id && data.status != 3) {
      await this.postSeriesRepository.createPostSeries(post_id, data.series_id);
    }

    return post_id;
  }

  async updatePost(user: User, data: UpdatePostDto, post_id: number) {
    await this.postRepository.updatePost(user, data, post_id);

    if (data.tags.length > 0) {
      await this.postTagRepository.deletePostTag(post_id);
      await this.createTag(data.tags, post_id);
    }

    const series_id = await this.postSeriesRepository.getPostSeries(post_id);

    if (!series_id && data.series_id) {
      await this.postSeriesRepository.createPostSeries(post_id, data.series_id);
    }

    if (series_id && data.series_id == null) {
      await this.postSeriesRepository.deletePostSeries(post_id, null);

      const post_series_id = await this.postSeriesRepository.getPostSeriesId(series_id.series_id);

      for (let i = 0; i < post_series_id.length; i++) {
        await this.postSeriesRepository.updateSort(i + 1, post_series_id[i].id);
      }
    }

    return post_id;
  }

  async deletePost(user: User, post_id: number) {
    await this.postRepository.deletePost(user, post_id);
  }

  async selectSaves(user_id: number) {
    const saves = await this.postRepository.selectSaves(user_id);

    if (saves.length == 0) return null;
    return saves;
  }

  async createTag(tags: string[], post_id: number) {
    let insert_post_tag = [];
    for (let i = 0; i < tags.length; i++) {
      await this.tagRepository.insertTag(tags[i], '');
      const tag_id = await this.tagRepository.findOne({ name: tags[i] });

      insert_post_tag.push({ tag: tag_id.id, post: post_id });
    }

    await this.postTagRepository.insertPostTag(insert_post_tag);
  }

  async likePost(user_id: number, post_id: number) {
    const data = await this.postLikeRepository.getLikedPostOne(user_id, post_id);
    if (data) {
      throw new ConflictException('이미 좋아요 한 게시글 입니다');
    }
    await this.postLikeRepository.likePost(user_id, post_id);
  }

  async unlikePost(user_id: number, post_id: number) {
    const data = await this.postLikeRepository.getLikedPostOne(user_id, post_id);
    if (!data) {
      throw new NotFoundException('좋아요를 하지 않은 게시글입니다');
    }
    await this.postLikeRepository.unlikePost(user_id, post_id);
  }

  async selectSaveOne(post_id: number, user_id: number) {
    let save_one = await this.postRepository.selectSaveOne(post_id, user_id);

    if (save_one[0].tags) save_one[0].tags = JSON.parse(save_one[0].tags);

    return save_one[0];
  }
}
