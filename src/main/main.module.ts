import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRepository } from 'src/repository/follow.repository';
import { PostRepository } from 'src/repository/post.repository';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, FollowRepository])],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
