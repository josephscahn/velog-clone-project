import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tag_id: number;
}
