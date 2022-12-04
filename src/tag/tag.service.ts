import { Injectable } from '@nestjs/common';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { TagRepository } from 'src/repository/tag.repository';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private postTagRepository: PostTagRepository,
  ) {}

  async selectTagListByUserId(user_id: number) {
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    return tags;
  }
}
