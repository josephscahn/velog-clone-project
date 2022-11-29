import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/main')
  @UsePipes(ValidationPipe)
  async mainSearch(
    @Query('keyword') keyword: string,
    @Query('userId') user_id: number,
  ) {
    const data = await this.searchService.mainSearch(keyword, user_id);

    return data;
  }
}
