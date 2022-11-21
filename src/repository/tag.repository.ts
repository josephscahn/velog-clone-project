import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { Tag } from 'src/entity/tag.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async insertTag(tag_name: string, description: string) {
    const tag = this.create({
      name: tag_name,
      description: description,
    });

    try {
      await this.save(tag);

      return tag.id;
    } catch (err) {
      if (err.errno) throw new BadRequestException(`tag insert failed`);

      throw new InternalServerErrorException();
    }
  }

  async updateTagPostCount(tag_id: number) {
    try {
      await this.query(
        `UPDATE tag SET post_count = (SELECT COUNT(tag_id) FROM post_tag
      WHERE tag_id = ?) WHERE id = ?`,
        [tag_id, tag_id],
      );
    } catch (err) {
      if (err.errno)
        throw new BadRequestException(`tag post_count update failed`);

      throw new InternalServerErrorException();
    }
  }
}
