import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentsParamDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  post_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  comment_id: number;
}
