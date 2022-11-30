import { IsEnum } from 'class-validator';
import { SeriesSort } from 'src/series/series.model';

export class SelectSereisPostsDto {
  @IsEnum(SeriesSort)
  sort: SeriesSort;
}
