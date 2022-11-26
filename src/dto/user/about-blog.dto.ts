import { IsString, IsOptional } from 'class-validator';
export class AboutBlogDto {
  @IsOptional()
  @IsString()
  about_blog: string;
}
