import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { TagRepository } from 'src/repository/tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagRepository, PostTagRepository])],
  exports: [TypeOrmModule, TagService],
  providers: [TagService],
})
export class TagModule {}
