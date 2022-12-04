import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { MainPostsType, PeriodType } from 'src/main/main.model';
import { Type } from 'class-transformer';

export class SelectMainPostsDto {
  @IsEnum(MainPostsType)
  type: MainPostsType;

  @IsOptional()
  @IsEnum(PeriodType)
  period: PeriodType;

  @IsNumber()
  @Type(() => Number)
  offset: number;

  @IsNumber()
  @Type(() => Number)
  limit: number;
}
