import { Controller, Get, Query } from '@nestjs/common';
import { SelectMainPostsDto } from 'src/dto/main/select-main-posts.dto';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('')
  async getMainPosts(@Query() query: SelectMainPostsDto) {
    const result = await this.mainService.getMainPosts(query);

    return {
      statusCode: 200,
      post: result,
    };
  }
}
