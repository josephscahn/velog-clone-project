import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { User } from 'src/entity/user.entity';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async mainSearch(
    @Query('keyword') keyword: string,
    @Query('userId') user_id: number,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @ValidateToken() user: User,
  ) {
    const pagination: PaginationDto = {
      offset: offset,
      limit: limit,
      tag_id: null,
    };
    const data = await this.searchService.mainSearch(
      keyword,
      user_id,
      user,
      pagination,
    );
    return data;
  }
}
