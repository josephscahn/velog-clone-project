import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  depth: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parent_id: number;
}
