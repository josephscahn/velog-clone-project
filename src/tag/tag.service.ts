import { Injectable } from '@nestjs/common';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { TagRepository } from 'src/repository/tag.repository';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private postTagRepository: PostTagRepository,
  ) {}

  async tagAction(tags: string[], post_id: number, user_id: number) {
    let insert_tag_arr: string[] = [];
    let tag_id_arr: number[] = [];

    //1. 받아온 tag들이 tag 테이블에 있는지 확인하여 구분.
    for (let i = 0; i < tags.length; i++) {
      const tag = await this.tagRepository.findOne({ name: tags[i] });

      if (!tag) insert_tag_arr.push(tags[i]);
      else tag_id_arr.push(tag.id);
    }

    // 2. tag 테이블에 없을 경우 insert 한 뒤 tag_id 반환
    if (insert_tag_arr.length > 0) {
      for (let i = 0; i < insert_tag_arr.length; i++) {
        const tag_id = await this.tagRepository.insertTag(
          insert_tag_arr[i],
          '',
        );
        tag_id_arr.push(tag_id);
      }
    }

    // 3. post_tag 테이블에 insert
    for (let i = 0; i < tag_id_arr.length; i++) {
      await this.postTagRepository.insertPostTag(tag_id_arr[i], post_id);
    }

    // 4. 최종적으로 tag_id로 count 해서 update
    if (tag_id_arr.length > 0) {
      for (let i = 0; i < tag_id_arr.length; i++) {
        await this.tagRepository.updateTagPostCount(tag_id_arr[i]);
      }
    }
  }

  async deletePostTag(post_id: number) {
    await this.postTagRepository.deletePostTag(post_id);
  }

  async selectTagListByUserId(user_id: number) {
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    return tags;
  }
}
