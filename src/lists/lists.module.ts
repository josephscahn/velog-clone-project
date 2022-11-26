import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostReadLogRepository])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
