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

export class CommentsDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parent_id: number;
}
