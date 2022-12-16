import { Controller, Get, Query } from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { SelectMainPostsDto } from 'src/dto/main/select-main-posts.dto';
import { User } from 'src/entity/user.entity';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('')
  async getMainPosts(@Query() query: SelectMainPostsDto, @ValidateToken() user: User) {
    const result = await this.mainService.getMainPosts(query, user);

    return {
      statusCode: 200,
      post: result,
    };
  }
}
