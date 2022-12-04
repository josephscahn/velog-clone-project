import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { Tag } from 'src/entity/tag.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async insertTag(tag_name: string, description: string) {
    await this.query(
      `INSERT ignore INTO tag (name, description) VALUES (?, ?)`,
      [tag_name, description],
    );
  }
}
