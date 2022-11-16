import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from 'src/repository/board.repository';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardRepository])],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
