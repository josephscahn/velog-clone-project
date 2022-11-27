import { Injectable } from '@nestjs/common';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostReadLogRepository } from 'src/repository/post-read-log.repository';

@Injectable()
export class ListsService {
  constructor(
    private postReadLogRepository: PostReadLogRepository,
    private postLikeRepository: PostLikeRepository,
  ) {}
  async getReadLog(user_id: number) {
    const data = await this.postReadLogRepository.getReadLog(user_id);
    for (let i = 0; i < data.length; i++) {
      data[i].ReadLog = JSON.parse(data[i].ReadLog);
    }
    return data[0];
  }

  async deleteReadList(user_id: number, post_id: number) {
    await this.postReadLogRepository.deleteReadList(user_id, post_id);
    return await this.getReadLog(user_id);
  }

  async getLikedList(user_id: number) {
    const data = await this.postLikeRepository.getLikedList(user_id);
    for (let i = 0; i < data.length; i++) {
      data[i].LIKED_POST = JSON.parse(data[i].LIKED_POST);
    }
    return data[0];
  }
}
