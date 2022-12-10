import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from 'src/comment/comment.module';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { PostViewRepository } from 'src/repository/post-view.repository';
import { PostRepository } from 'src/repository/post.repository';
import { TagRepository } from 'src/repository/tag.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      PostSeriesRepository,
      PostReadLogRepository,
      TagRepository,
      PostTagRepository,
      PostViewRepository,
      PostLikeRepository,
    ]),
    CommentModule,
  ],
  exports: [TypeOrmModule, PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
