import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { PostRepository } from 'src/repository/post.repository';
import { UserRepository } from 'src/repository/user.repository';
import { LologController } from './lolog.controller';
import { LologService } from './lolog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      PostLikeRepository,
      PostTagRepository,
      UserRepository,
    ]),
  ],
  controllers: [LologController],
  providers: [LologService],
})
export class LologModule {}
