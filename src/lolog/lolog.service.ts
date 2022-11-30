import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { PostService } from 'src/post/post.service';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { SeriesService } from 'src/series/series.service';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostRepository } from 'src/repository/post.repository';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class LologService {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private tagService: TagService,
    private seriesService: SeriesService,
    private postReadLogRepository: PostReadLogRepository,
    private userService: UserService,
    private postLikeRepository: PostLikeRepository,
    private postRepository: PostRepository,
  ) {}

  async getInsidePage(
    user_id: number,
    tag_id: number,
    pagination: PaginationDto,
  ) {
    const posts = await this.postService.selectPostList(
      user_id,
      tag_id,
      false,
      pagination,
    );
    const tags = await this.tagService.selectTagListByUserId(user_id);

    return { posts, tags };
  }

  async getPostDetail(user_id: number, post_id: number, user?: User) {
    const post = await this.postService.selectPostOne(user_id, post_id, user);
    const comments = await this.commentService.selectCommentList(
      post_id,
      user_id,
    );
    const series = await this.seriesService.selectPostSeriesList(post_id);

    if (user && user_id !== user['sub']) {
      const exist = await this.postReadLogRepository.getReadLogBypostId(
        user['sub'],
        post_id,
      );

      if (exist[0].exist === '0' && post.post['user_id'] !== user['sub']) {
        await this.postReadLogRepository.createReadLog(user['sub'], post_id);
      }
    }

    return {
      post,
      comments,
      series,
    };
  }

  async getSeries(user_id: number) {
    const series = await this.seriesService.selectSeriesList(user_id);
    return series;
  }

  async getAboutBlog(user_id: number) {
    return await this.userService.selectAboutBlog(user_id);
  }

  async editAboutBlog(user_id: number, about_blog: string) {
    await this.userService.updateAboutBlog(user_id, about_blog);

    return await this.userService.selectAboutBlog(user_id);
  }

  async likePost(user_id: number, post_id: number) {
    const data = await this.postLikeRepository.getLikedPostOne(
      user_id,
      post_id,
    );
    if (data) {
      return new NotFoundException('이미 좋아요 한 게시글 입니다');
    }
    await this.postLikeRepository.likePost(user_id, post_id);
    await this.postRepository.updateLikeCount(post_id);
  }

  async unlikePost(user_id: number, post_id: number) {
    const data = await this.postLikeRepository.getLikedPostOne(
      user_id,
      post_id,
    );
    if (!data) {
      return new NotFoundException('좋아요를 하지 않은 게시글입니다');
    }
    await this.postLikeRepository.unlikePost(user_id, post_id);
    await this.postRepository.updateLikeCount(post_id);
  }
}
