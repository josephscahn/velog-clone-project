import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostReadLogRepository, PostLikeRepository]),
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
