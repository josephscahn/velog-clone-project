import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString({ each: true })
  readonly tags: string[];

  @IsOptional()
  @IsNumber()
  series_id: number;
}
