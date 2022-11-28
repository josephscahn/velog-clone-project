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
  async mainSearch(@Query('keyword') keyword: string) {
    const data = await this.searchService.mainSearch(keyword);
    return data;
  }
}
