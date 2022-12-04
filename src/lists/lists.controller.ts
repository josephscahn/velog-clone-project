import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('/read')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async getReadList(@GetUser() user: User) {
    return await this.listsService.getReadLog(user.id);
  }

  @Patch('/read/:post_id')
  @UseGuards(JwtAuthGuard)
  async deleteReadList(
    @GetUser() user: User,
    @Param('post_id') post_id: number,
  ) {
    return await this.listsService.deleteReadList(user.id, post_id);
  }

  @Get('/like')
  @UseGuards(JwtAuthGuard)
  async getLikedList(@GetUser() user: User) {
    return await this.listsService.getLikedList(user.id);
  }
}
