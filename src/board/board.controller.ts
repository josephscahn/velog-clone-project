import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { CreateBoard } from 'src/dto/board/create-board.dto';
import { BoardService } from './board.service';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateBoard } from 'src/dto/board/update-board.dto';

@Controller('board')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('')
  async createBoard(@GetUser() user: User, @Body() data: CreateBoard) {
    const result = await this.boardService.createBoard(user, data);

    // 에러 관련해선 임의로 작성. 추후 리팩토링 할 때 error & 성공 response 보낼 때 통일 된 형식으로 보낼 수 있도록 논의 필요
    return { statusCode: 201, message: 'posting success', result: result };
  }

  @Get('/:id')
  async readBoard(@GetUser() user: User, @Param() params: any) {
    const result = await this.boardService.readBoard(user, params.id);

    return { statusCode: 200, message: 'read post', result: result };
  }

  @Patch('/:id')
  async updateBoard(
    @GetUser() user: User,
    @Body() data: UpdateBoard,
    @Param() params: any,
  ) {
    const result = await this.boardService.updateBoard(user, data, params.id);

    return { statusCode: 200, message: 'update post', result: result };
  }

  @Delete('/:id')
  async deleteBoard(@GetUser() user: User, @Param() params: any) {
    const reuslt = await this.boardService.deleteBoard(user, params.id);

    return { statusCode: 200, message: 'delete post', result: reuslt};
  }
}
