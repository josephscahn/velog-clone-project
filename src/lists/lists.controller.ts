import {
  Controller,
  Delete,
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
    const data = await this.listsService.getReadLog(user.id);
    return data;
  }

  @Patch('/read/:post_id')
  @UseGuards(JwtAuthGuard)
  async deleteReadList(
    @GetUser() user: User,
    @Param('post_id') post_id: number,
  ) {
    const data = await this.listsService.deleteReadList(user.id, post_id);
    return data;
  }
}
