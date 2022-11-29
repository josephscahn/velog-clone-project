import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/main')
  @UsePipes(ValidationPipe)
  async mainSearch(
    @Query('keyword') keyword: string,
    @Query('userId') user_id: number,
    @Query() pagination: PaginationDto,
  ) {
    const data = await this.searchService.mainSearch(
      keyword,
      user_id,
      pagination,
    );
    return data;
  }
}
