import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from 'src/comment/comment.module';
import { PostModule } from 'src/post/post.module';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { SeriesModule } from 'src/series/series.module';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { InsideController } from './inside.controller';
import { InsideService } from './inside.service';

@Module({
  imports: [
    PostModule,
    CommentModule,
    TagModule,
    SeriesModule,
    UserModule,
    TypeOrmModule.forFeature([PostReadLogRepository]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [InsideController],
  providers: [InsideService],
})
export class InsideModule {}
