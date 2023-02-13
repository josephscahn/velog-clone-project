import { Controller, Get, Query } from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { SelectMainPostsDto } from 'src/dto/main/select-main-posts.dto';
import { User } from 'src/entity/user.entity';
import { MainService } from './main.service';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('')
  async getMainPosts(@Query() query: SelectMainPostsDto, @ValidateToken() user: User) {
    const result = await this.mainService.getMainPosts(query, user);

    const response = SetResponse('메인 게시글', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      post: result,
    };
  }
}
