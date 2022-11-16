import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common/exceptions";
import { CreateBoard } from "src/dto/board/create-board.dto";
import { UpdateBoard } from "src/dto/board/update-board.dto";
import { Board } from "src/entity/board.entity";
import { User } from "src/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {

  async selectOneBoard(post_id: number) {

      const board = await this.query(
        `SELECT id, status, views, likes, create_at, update_at, userid, title, content, thumbnail 
         FROM board
         WHERE id = ?`
        , [post_id]);

      if(board.length <= 0)
        throw new NotFoundException(`해당 게시글을 찾을 수 없습니다.`);
      
      return board;
  }
  
  async createBaord(user:User, data: CreateBoard) {
    const board = this.create({
      title: data.title,
      content: data.content,
      status: data.status,
      thumbnail: data.thumbnail,
      user: user
    });

    try {
      await this.save(board);

      const result = await this.selectOneBoard(board.id);

      return result;
    } catch(err) {
      if(err.errno)
        throw new BadRequestException(`posting create failed`);
      
      throw new InternalServerErrorException();
    }
  }

  async updateBoard(user: User, data: UpdateBoard, post_id: number) {

    await this.selectOneBoard(post_id);

    const board = this.createQueryBuilder()
    .update(Board)
    .set({
      title: data.title,
      content: data.content,
      status: data.status,
      thumbnail: data.thumbnail,
    })
    .where(`id = :post_id AND userid = :user_id`, { post_id: post_id, user_id: user.id});

    try {
      await board.execute();

      return await this.selectOneBoard(post_id);

    } catch (err) {
      if(err.errno)
        throw new BadRequestException(`posting update failed`);  
      
        throw new InternalServerErrorException();
    }

  }

  async deleteBoard(user: User, post_id: number) {

    await this.selectOneBoard(post_id);

    const board = this.createQueryBuilder()
    .delete()
    .from(Board)
    .where(`id = :post_id AND userid = :user_id`, { post_id: post_id, user_id: user.id });

    try {
      return await board.execute();
    } catch (err) {
      if(err.errno)
        throw new BadRequestException(`posting update failed`);

      throw new InternalServerErrorException();
    }
  }
  
}
