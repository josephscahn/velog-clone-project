import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSeriesDto {
  @IsOptional()
  sort: any[];

  @IsOptional()
  @IsString()
  series_name: string;
}
