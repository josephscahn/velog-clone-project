import { Controller, Get, Param, Query } from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { User } from 'src/entity/user.entity';
import { LologService } from './lolog.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('lolog')
export class LologController {
  constructor(private readonly lologService: LologService) {}

  @Get('/:user_id')
  async getLolog(
    @Param('user_id') user_id: number,
    @Query() pagination: PaginationDto,
    @ValidateToken() user?: User,
  ) {
    const result = await this.lologService.getLolog(user_id, pagination, user);

    const response = SetResponse('롤로그', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      user: result.user,
      posts: result.posts,
      tags: result.tags,
    };
  }
}
