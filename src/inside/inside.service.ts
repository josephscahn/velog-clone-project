import { Injectable } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { PostService } from 'src/post/post.service';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { SeriesService } from 'src/series/series.service';
import { TagService } from 'src/tag/tag.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InsideService {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private tagService: TagService,
    private seriesService: SeriesService,
    private postReadLogRepository: PostReadLogRepository,
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async getInsidePage(user_id: number, tag_id: number) {
    const posts = await this.postService.selectPostList(user_id, tag_id);
    const tags = await this.tagService.selectTagListByUserId(user_id);

    return { posts, tags };
  }

  async getPostDetail(user_id: number, post_id: number, user?: User) {
    const post = await this.postService.selectPostOne(user_id, post_id);
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

      if (exist[0].exist === '0' && post.post.user_id !== user['sub']) {
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
    return;
  }

  async getAboutBlog(user_id: number) {
    return await this.userService.selectAboutBlog(user_id);
  }

  async editAboutBlog(user_id: number, about_blog: string) {
    await this.userService.updateAboutBlog(user_id, about_blog);

    return await this.userService.selectAboutBlog(user_id);
  }
}
