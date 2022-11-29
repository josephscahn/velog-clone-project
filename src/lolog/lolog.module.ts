import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from 'src/comment/comment.module';
import { PostModule } from 'src/post/post.module';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { SeriesModule } from 'src/series/series.module';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { LologController } from './lolog.controller';
import { LologService } from './lolog.service';

@Module({
  imports: [
    PostModule,
    CommentModule,
    TagModule,
    SeriesModule,
    UserModule,
    TypeOrmModule.forFeature([PostReadLogRepository, PostLikeRepository]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [LologController],
  providers: [LologService],
})
export class LologModule {}