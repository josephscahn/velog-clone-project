import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  thumbnail: string;

  @IsString({ each: true })
  readonly tags: string[];

  @IsNumber()
  @Min(1)
  @Max(3)
  @Type(() => Number)
  status: number;

  @IsOptional()
  @IsNumber()
  series_id: number;

  @IsOptional()
  @IsString()
  post_url: string;

  @IsOptional()
  @IsString()
  description: string;
}
