import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { PostModule } from 'src/post/post.module';
import { SeriesModule } from 'src/series/series.module';
import { TagModule } from 'src/tag/tag.module';
import { InsideController } from './inside.controller';
import { InsideService } from './inside.service';

@Module({
  imports: [PostModule, CommentModule, TagModule, SeriesModule],
  controllers: [InsideController],
  providers: [InsideService],
})
export class InsideModule {}
