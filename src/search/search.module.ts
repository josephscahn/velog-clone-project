import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/post.repository';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
