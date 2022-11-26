import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('')
  async getMainPosts(
    @Query('type') type: string,
    @Query('period') period: string,
  ) {
    const result = await this.mainService.getMainPosts(type, period);

    if (result == 0)
      throw new BadRequestException(
        `트랜딩을 조회할 땐 period이 필수 값 입니다.`,
      );

    return {
      statusCode: 200,
      post: result,
    };
  }
}
