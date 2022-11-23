import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { CommentRepository } from 'src/repository/comment.repository';
import { PostRepository } from 'src/repository/post.repository';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository, PostRepository]),
    PostModule,
  ],
  exports: [TypeOrmModule, CommentService],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
