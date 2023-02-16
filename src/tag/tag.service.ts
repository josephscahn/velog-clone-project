import { Injectable } from '@nestjs/common';
import { PostTagRepository } from 'src/repository/post-tag.repository';

@Injectable()
export class TagService {
  constructor(private postTagRepository: PostTagRepository) {}

  async selectTagListByUserId(user_id: number) {
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    return tags;
  }
}
