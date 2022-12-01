import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from 'src/comment/comment.module';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { PostRepository } from 'src/repository/post.repository';
import { SeriesModule } from 'src/series/series.module';
import { TagModule } from 'src/tag/tag.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      PostSeriesRepository,
      PostReadLogRepository,
    ]),
    TagModule,
    CommentModule,
    SeriesModule,
  ],
  exports: [TypeOrmModule, PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
