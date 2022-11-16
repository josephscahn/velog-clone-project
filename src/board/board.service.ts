import { Injectable } from '@nestjs/common';
import { CreateBoard } from 'src/dto/board/create-board.dto';
import { UpdateBoard } from 'src/dto/board/update-board.dto';
import { User } from 'src/entity/user.entity';
import { BoardRepository } from 'src/repository/board.repository';

@Injectable()
export class BoardService {
  constructor(private boardRepository: BoardRepository) {}

  async createBoard(user:User, data: CreateBoard, ) {

    const board = await this.boardRepository.createBaord(user, data);

    return { board, is_writer: true }
  }

  async readBoard(user:User, post_id: number) {
    const board = await this.boardRepository.selectOneBoard(post_id);

    let is_writer: boolean = false;

    if(user.id == board[0].userid)
      is_writer = true;
      
    return { board, is_writer }
  }

  async updateBoard(user: User, data: UpdateBoard, post_id: number) {

    const board = await this.boardRepository.updateBoard(user, data, post_id);

    return { board, is_writer: true }
  }

  async deleteBoard(user: User, post_id: number) {

    return await this.boardRepository.deleteBoard(user, post_id);
  }
}
